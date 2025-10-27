'use client'

import React, { useState, useCallback, useEffect, memo } from 'react';
import { geocodeLocations, getStaticMapUrl } from '@/actions/test-map-action';
import Image from 'next/image';
import { Loader2, MapPin, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';

interface Marker {
  name: string;
  lat: number;
  lon: number;
  displayName?: string;
}

interface MapViewerProps {
  stops: string[];
  isOpen?: boolean;
}

const MapViewer = memo(({ stops, isOpen = true }: MapViewerProps) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 11.4102, lon: 76.6950 });
  const [zoom, setZoom] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate optimal center and zoom from markers
  const calculateMapBounds = useCallback((markerData: Marker[]) => {
    if (markerData.length === 0) return null;

    if (markerData.length === 1) {
      return {
        center: { lat: markerData[0].lat, lon: markerData[0].lon },
        zoom: 12
      };
    }

    const lats = markerData.map(m => m.lat);
    const lons = markerData.map(m => m.lon);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // Calculate appropriate zoom based on bounds
    const latDiff = maxLat - minLat;
    const lonDiff = maxLon - minLon;
    const maxDiff = Math.max(latDiff, lonDiff);

    let calculatedZoom = 12;
    if (maxDiff > 10) calculatedZoom = 5;
    else if (maxDiff > 5) calculatedZoom = 6;
    else if (maxDiff > 2) calculatedZoom = 8;
    else if (maxDiff > 1) calculatedZoom = 9;
    else if (maxDiff > 0.5) calculatedZoom = 10;

    return {
      center: { lat: centerLat, lon: centerLon },
      zoom: calculatedZoom
    };
  }, []);

  // Update map URL
  const updateMapUrl = useCallback(async (
    markerData: Marker[], 
    center: { lat: number; lon: number }, 
    zoomLevel: number
  ) => {
    try {
      const markers = markerData.map(m => ({ lat: m.lat, lon: m.lon }));
      const url = await getStaticMapUrl(markers, center, zoomLevel);
      setMapUrl(url);
      setImageLoaded(false);
    } catch (err) {
      setError('Failed to generate map URL');
    }
  }, []);

  // Handle zoom changes
  const handleZoom = useCallback(async (direction: 'in' | 'out') => {
    if (markers.length === 0) return;
    
    const newZoom = direction === 'in' 
      ? Math.min(zoom + 1, 18) 
      : Math.max(zoom - 1, 1);
    
    if (newZoom === zoom) return;
    
    setZoom(newZoom);
    await updateMapUrl(markers, mapCenter, newZoom);
  }, [zoom, markers, mapCenter, updateMapUrl]);

  // Main geocoding effect
  useEffect(() => {
    if (!isOpen || stops.length === 0) return;

    let isMounted = true;

    const handleGeocoding = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await geocodeLocations(stops);

        if (!isMounted) return;

        if (!result.success || !result.data) {
          setError(result.error || 'Failed to geocode locations');
          setIsLoading(false);
          return;
        }

        setMarkers(result.data);

        // Calculate optimal bounds
        const bounds = calculateMapBounds(result.data);
        
        if (bounds) {
          setMapCenter(bounds.center);
          setZoom(bounds.zoom);
          await updateMapUrl(result.data, bounds.center, bounds.zoom);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    handleGeocoding();

    return () => {
      isMounted = false;
    };
  }, [isOpen, stops, calculateMapBounds, updateMapUrl]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-auto">
      <div className="max-w-6xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="font-semibold">Error:</strong>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="mt-4 text-gray-600 font-medium">Loading map...</p>
            </div>
          )}

          {/* Zoom Controls */}
          {mapUrl && !isLoading && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg z-20">
              <button
                onClick={() => handleZoom('in')}
                disabled={zoom >= 18}
                className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors border-b"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-600 border-b">
                {zoom}
              </div>
              
              <button
                onClick={() => handleZoom('out')}
                disabled={zoom <= 1}
                className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Marker Count Badge */}
          {markers.length > 0 && !isLoading && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 z-20">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                {markers.length} {markers.length === 1 ? 'location' : 'locations'}
              </span>
            </div>
          )}

          {/* Map Image */}
          {mapUrl && (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}
              <Image
                src={mapUrl}
                alt={`Map showing ${markers.length} locations`}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                unoptimized
                onLoad={() => setImageLoaded(true)}
                onError={() => setError('Failed to load map image')}
                priority
              />
            </>
          )}

          {/* Empty State */}
          {!mapUrl && !isLoading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <MapPin className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No locations to display</p>
            </div>
          )}
        </div>

        {/* Marker List */}
        {markers.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {markers.map((marker, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{marker.name}</p>
                    {marker.displayName && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {marker.displayName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {marker.lat.toFixed(4)}, {marker.lon.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

MapViewer.displayName = 'MapViewer';

export default MapViewer;
'use client';

import React, { useState, useCallback, useEffect, memo, useRef } from 'react';
import { geocodeLocations } from '@/actions/test-map-action';
import { Loader2, MapPin, ZoomIn, ZoomOut, AlertCircle, Maximize2 } from 'lucide-react';

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

// Leaflet types
interface LeafletMap {
  remove: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getZoom: () => number;
  on: (event: string, handler: () => void) => void;
  flyTo: (latlng: [number, number], zoom: number, options?: { duration: number }) => void;
  fitBounds: (bounds: unknown, options?: { padding: [number, number] }) => void;
}

interface LeafletMarker {
  openPopup: () => void;
  bindPopup: (content: string) => LeafletMarker;
}

const MapViewer = memo(({ stops, isOpen = true }: MapViewerProps) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(8);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  // Calculate optimal map bounds
  const calculateMapBounds = useCallback((markerData: Marker[]) => {
    if (markerData.length === 0) return null;

    if (markerData.length === 1) {
      return {
        center: { lat: markerData[0].lat, lng: markerData[0].lon },
        zoom: 12,
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
      center: { lat: centerLat, lng: centerLon },
      zoom: calculatedZoom,
    };
  }, []);

  // Initialize Leaflet Map with Ola Maps Tiles
  const initializeMap = useCallback(
    (markerData: Marker[]) => {
      if (!mapContainerRef.current || !window.L) return;

      const bounds = calculateMapBounds(markerData);
      if (!bounds) return;

      try {
        // Create Leaflet map
        const map = window.L.map(mapContainerRef.current, {
          center: [bounds.center.lat, bounds.center.lng],
          zoom: bounds.zoom,
          zoomControl: false,
        }) as LeafletMap;

        const apiKey = process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY;

        if (apiKey) {
          window.L.tileLayer(
            `https://api.olamaps.io/tiles/v1/styles/default/{z}/{x}/{y}.png?api_key=${apiKey}`,
            {
              attribution: '© Ola Maps',
              maxZoom: 19,
            }
          ).addTo(map);
        } else {
          // Fallback to OpenStreetMap
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);
        }

        // Draw route line connecting markers
        if (markerData.length > 1) {
          const routeCoordinates = markerData.map(m => [m.lat, m.lon] as [number, number]);

          // Create polyline (route)
          window.L.polyline(routeCoordinates, {
            color: '#4f46e5',
            weight: 3,
            opacity: 0.7,
            smoothFactor: 1,
            dashArray: '10, 10', // Dashed line
          }).addTo(map);

          // Add arrows to show direction
          for (let i = 0; i < markerData.length - 1; i++) {
            const start = markerData[i];
            const end = markerData[i + 1];
            const midLat = (start.lat + end.lat) / 2;
            const midLon = (start.lon + end.lon) / 2;

            // Calculate arrow rotation
            const angle = (Math.atan2(end.lon - start.lon, end.lat - start.lat) * 180) / Math.PI;

            const arrowIcon = window.L.divIcon({
              html: `
              <div style="transform: rotate(${angle}deg);">
                ▼
              </div>
            `,
              className: 'arrow-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            window.L.marker([midLat, midLon], {
              icon: arrowIcon,
              interactive: false,
            }).addTo(map);
          }
        }

        // Add custom markers
        markersRef.current = markerData.map((marker, idx) => {
          // Create custom icon - all same size with day numbers
          const isStart = idx === 0;
          const isEnd = idx === markerData.length - 1;
          const dayNumber = idx + 1;

          const customIcon = window.L.divIcon({
            html: `
            <div style="
              width: 36px;
              height: 36px;
              background-color: ${isStart ? '#10b981' : isEnd ? '#ef4444' : '#4f46e5'};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: bold;
              color: white;
            ">
              ${dayNumber}
            </div>
          `,
            className: 'custom-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          // Create marker
          const leafletMarker = window.L.marker([marker.lat, marker.lon], {
            icon: customIcon,
          }).addTo(map) as LeafletMarker;

          // Add popup
          const label = isStart
            ? 'Day 1 - Start'
            : isEnd
              ? `Day ${dayNumber} - End`
              : `Day ${dayNumber}`;
          const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <div style="display: inline-block; background: ${isStart ? '#10b981' : isEnd ? '#ef4444' : '#4f46e5'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-bottom: 6px;">
              ${label}
            </div>
            <strong style="font-size: 14px; color: #1f2937; display: block;">${marker.name}</strong>
            ${marker.displayName ? `<p style="font-size: 12px; color: #6b7280; margin-top: 4px;">${marker.displayName}</p>` : ''}
            <p style="font-size: 11px; color: #9ca3af; margin-top: 4px;">
              ${marker.lat.toFixed(4)}, ${marker.lon.toFixed(4)}
            </p>
          </div>
        `;
          leafletMarker.bindPopup(popupContent);

          return leafletMarker;
        });

        // Fit bounds to show all markers
        if (markerData.length > 1) {
          const latLngs = markerData.map(m => [m.lat, m.lon] as [number, number]);
          const bounds = window.L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        // Update zoom on map zoom
        map.on('zoomend', () => {
          setZoom(map.getZoom());
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to initialize map');
      }
    },
    [calculateMapBounds]
  );

  // Load Leaflet library
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.L) return;

    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Add Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;

    script.onload = () => {
      console.log('Leaflet loaded successfully');
    };

    script.onerror = () => {
      setError('Failed to load map library');
    };

    document.head.appendChild(script);
  }, []);

  // Handle zoom controls
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    if (!mapInstanceRef.current) return;

    if (direction === 'in') {
      mapInstanceRef.current.zoomIn();
    } else {
      mapInstanceRef.current.zoomOut();
    }
  }, []);

  // Handle fullscreen
  const handleFullscreen = useCallback(() => {
    if (!mapContainerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      mapContainerRef.current.requestFullscreen();
    }
  }, []);

  // Main geocoding effect
  useEffect(() => {
    if (!isOpen || stops.length === 0) return;

    let isMounted = true;

    const handleGeocoding = async () => {
      setIsLoading(true);
      setError(null);
      setMapLoaded(false);

      try {
        const result = await geocodeLocations(stops);

        if (!isMounted) return;

        if (!result.success || !result.data) {
          setError(result.error || 'Failed to geocode locations');
          setIsLoading(false);
          return;
        }

        setMarkers(result.data);

        // Wait for Leaflet to be ready
        const checkLeaflet = setInterval(() => {
          if (window.L) {
            clearInterval(checkLeaflet);

            // Destroy previous map
            if (mapInstanceRef.current) {
              mapInstanceRef.current.remove();
              markersRef.current = [];
            }

            // Small delay to ensure DOM is ready
            setTimeout(() => {
              initializeMap(result.data);
              setIsLoading(false);
            }, 100);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLeaflet);
          if (!window.L && isMounted) {
            setError('Map library failed to load. Please refresh the page.');
            setIsLoading(false);
          }
        }, 10000);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setIsLoading(false);
        }
      }
    };

    handleGeocoding();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, stops, initializeMap]);

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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-[1000]">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="mt-4 text-gray-600 font-medium">Loading map...</p>
            </div>
          )}

          {/* Map Controls */}
          {mapLoaded && !isLoading && (
            <>
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg z-[1000]">
                <button
                  onClick={() => handleZoom('in')}
                  className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 transition-colors border-b"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-600 border-b">
                  {zoom}
                </div>

                <button
                  onClick={() => handleZoom('out')}
                  className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 transition-colors border-b"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>

                <button
                  onClick={handleFullscreen}
                  className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              {/* Marker Count Badge */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 z-[1000]">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">
                  {markers.length} {markers.length === 1 ? 'location' : 'locations'}
                </span>
              </div>
            </>
          )}

          {/* Map Element */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Empty State */}
          {!isLoading && markers.length === 0 && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <MapPin className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No locations to display</p>
            </div>
          )}
        </div>

        {/* Marker List */}
        {markers.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {markers.map((marker, idx) => {
              // const isStart = idx === 0;
              // const isEnd = idx === markers.length - 1;
              const bgColor = 'bg-purple-600';
              const dayNumber = idx + 1;

              return (
                <div
                  key={idx}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    if (mapInstanceRef.current && markersRef.current[idx]) {
                      // Open popup
                      markersRef.current[idx].openPopup();

                      // Fly to marker
                      mapInstanceRef.current.flyTo([marker.lat, marker.lon], 14, {
                        duration: 1,
                      });
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${bgColor} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
                    >
                      {dayNumber}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">{marker.name}</p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          Day {dayNumber}
                        </span>
                      </div>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

MapViewer.displayName = 'MapViewer';

export default MapViewer;

// Leaflet type declarations
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

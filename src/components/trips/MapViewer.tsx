'use client'

import React, { useState, useTransition, useEffect } from 'react';
import { geocodeLocations, getStaticMapUrl } from '@/actions/test-map-action';
import Image from 'next/image';

interface Marker {
  name: string;
  lat: number;
  lon: number;
  displayName?: string;
}

export default function MapViewer({stops, isOpen}: {stops:string[], isOpen?:boolean}) {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 11.4102, lon: 76.6950 });
  const [zoom, setZoom] = useState(8);
  const [isPending, startTransition] = useTransition();

  
  const handleZoomChange = async (newZoom: number) => {
    setZoom(newZoom);
    if (markers.length > 0) {
      const markerData = markers.map(m => ({ lat: m.lat, lon: m.lon }));
      const url = await getStaticMapUrl(markerData, mapCenter, newZoom);
      setMapUrl(url);
    }
  };

  useEffect(() => {

    const handleGeocoding = async () => {
    if (!isOpen) return;
    
    setError(null);
    startTransition(async () => {
      const result = await geocodeLocations(stops);
      
      if (!result.success || !result.data) {
        setError(result.error || 'Failed to geocode locations');
        return;
      }
      
      setMarkers(result.data);
      
      if (result.data.length > 0) {
        const newCenter = {
          lat: result.data[0].lat,
          lon: result.data[0].lon
        };
        setMapCenter(newCenter);
        
        const markerData = result.data.map(m => ({ lat: m.lat, lon: m.lon }));
        const url = await getStaticMapUrl(markerData, newCenter, zoom);
        setMapUrl(url);
      }
    });
  };

    if (isOpen) {
      handleGeocoding();
    }
  }, [isOpen, stops,zoom]);

  return (
    <div className="h-auto -mb-5 ">
      <div className="max-w-6xl mx-auto">
       
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
       
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          {mapUrl && (
            <>
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
                <button
                  onClick={() => handleZoomChange(Math.min(zoom + 1, 18))}
                  disabled={isPending}
                  className="block w-10 h-10 bg-indigo-600 text-white text-xl font-bold rounded hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                >
                  +
                </button>
                <div className="text-center text-sm font-medium text-gray-600">
                  {zoom}
                </div>
                <button
                  onClick={() => handleZoomChange(Math.max(zoom - 1, 1))}
                  disabled={isPending}
                  className="block w-10 h-10 bg-indigo-600 text-white text-xl font-bold rounded hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                >
                  −
                </button>
              </div>
              <Image
                  src={mapUrl}
                  alt="Map with markers"
                  fill
                  className="object-cover"
                  unoptimized 
                  onError={() => {
                    setError('Failed to load map image');
                  }}
                  priority 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}



'use server'

const LOCATIONIQ_API_KEY = 'pk.9ce3b9941516974807b79b5b9f408f8c';

export async function geocodeLocations(locations: string[]) {
  try {
    const geocodedMarkers = [];
    
    for (const location of locations) {
      const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(location)}&format=json`;
      
      const response = await fetch(url, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Geocoding failed with status ${response.status}`
        };
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        geocodedMarkers.push({
          name: location,
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name
        });
      }
    }
    
    if (geocodedMarkers.length === 0) {
      return {
        success: false,
        error: 'No locations could be geocoded. Please check your location names.'
      };
    }
    
    return {
      success: true,
      data: geocodedMarkers
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

export async function getStaticMapUrl(markers: Array<{lat: number, lon: number}>, center: {lat: number, lon: number}, zoom: number) {
  const markerString = markers.map(m => `${m.lat},${m.lon}`).join('|');
  return `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${center.lat},${center.lon}&zoom=${zoom}&size=1200x600&format=png&markers=${markerString}`;
}
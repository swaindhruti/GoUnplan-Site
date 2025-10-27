'use server'

export async function geocodeLocations(locations: string[]) {
  try {
    const geocodedMarkers = [];
    
    for (const location of locations) {
      const url = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(location)}&api_key=${process.env.OLA_MAPS_API_KEY}`;
      
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
      if (data && data.geocodingResults && data.geocodingResults.length > 0) {
        const result = data.geocodingResults[0];
        geocodedMarkers.push({
          name: location,
          lat: result.geometry.location.lat,
          lon: result.geometry.location.lng,
          displayName: result.formatted_address
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

export async function getStaticMapUrl(
  markers: Array<{lat: number, lon: number}>, 
  center: {lat: number, lon: number}, 
  zoom: number
) {
  // Ola Maps static map API format
  const markerParams = markers.map((m) => 
    `markers=${m.lat},${m.lon}`
  ).join('&');
  
  return `https://api.olamaps.io/tiles/v1/styles/default/static/${center.lon},${center.lat},${zoom}/1200x600?${markerParams}&api_key=${process.env.OLA_MAPS_API_KEY}`;
}
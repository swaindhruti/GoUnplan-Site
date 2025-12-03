// app/api/search-locations/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface OlaAutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface OlaAutocompleteResponse {
  predictions: OlaAutocompletePrediction[];
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ locations: [], count: 0 }, { status: 200 });
    }

    const apiKey = process.env.OLA_MAPS_API_KEY;
    if (!apiKey) {
      console.error('OLA_MAPS_API_KEY is not configured');
      return NextResponse.json({ locations: [], count: 0 }, { status: 200 });
    }

    // Use Ola Maps Autocomplete API for better suggestions
    const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
      query
    )}&api_key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ola Maps Autocomplete API error:', response.status, errorData);

      // Return empty results instead of error for better UX
      return NextResponse.json({
        locations: [],
        count: 0,
      });
    }

    const data: OlaAutocompleteResponse = await response.json();

    // Check if API returned valid results
    if (data.status !== 'ok' || !data.predictions || data.predictions.length === 0) {
      return NextResponse.json({
        locations: [],
        count: 0,
      });
    }

    // Transform predictions to our format
    const locations = data.predictions.map(prediction => ({
      place_id: prediction.place_id,
      name: prediction.structured_formatting.main_text,
      formatted_address: prediction.structured_formatting.secondary_text || prediction.description,
      full_description: prediction.description,
      lat: prediction.geometry?.location.lat,
      lng: prediction.geometry?.location.lng,
    }));

    return NextResponse.json({
      success: true,
      locations,
      count: locations.length,
    });
  } catch (error) {
    console.error('Error in search-locations API:', error);

    // Return empty results instead of error for better UX
    return NextResponse.json({
      locations: [],
      count: 0,
    });
  }
}

import { getHostTripsServer } from '@/actions/trips/getHostTripsServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    console.log('Searching trips with query:', query);
    const result = await getHostTripsServer(query);
    console.log('Search result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching trips:', error);
    return NextResponse.json({ error: 'Failed to search trips' }, { status: 500 });
  }
}

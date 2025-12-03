import { getAllActiveTrips } from './getAllActiveTrips';

export type Stop = {
  id: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
};

export type Trip = {
  id?: string;
  travelPlanId?: string;
  destination?: string | null;
  stops?: string[];
  [key: string]: any;
};

let cachedTrips: Trip[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Optimized function to get and filter host trips
 * @param searchQuery - Optional search string to filter trips
 * @returns Object containing filtered trips and their stops
 */
export async function getHostTripsServer(
  searchQuery?: string
): Promise<{ trips: Trip[]; stops: Stop[] }> {
  try {
    const now = Date.now();
    let trips: Trip[];

    if (cachedTrips && now - cacheTimestamp < CACHE_DURATION) {
      trips = cachedTrips;
    } else {
      const result = await getAllActiveTrips();

      if (result?.error) {
        throw new Error(result.error);
      }

      trips = Array.isArray(result?.trips) ? result.trips : [];

      cachedTrips = trips;
      cacheTimestamp = now;
    }

    if (!searchQuery?.trim()) {
      const stops = convertTripsToStops(trips);
      return { trips, stops };
    }

    const filteredTrips = filterTripsByQuery(trips, searchQuery);
    const stops = convertTripsToStops(filteredTrips);

    return { trips: filteredTrips, stops };
  } catch (error) {
    console.error('Error in getHostTripsServer:', error);
    throw error;
  }
}

function filterTripsByQuery(trips: Trip[], query: string): Trip[] {
  const normalizedQuery = query.toLowerCase().trim();

  return trips.filter(trip => {
    if (trip.destination?.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    if (trip.stops?.some(stop => stop.toLowerCase().includes(normalizedQuery))) {
      return true;
    }

    return false;
  });
}

function convertTripsToStops(trips: Trip[]): Stop[] {
  const stops: Stop[] = [];

  for (let tripIndex = 0; tripIndex < trips.length; tripIndex++) {
    const trip = trips[tripIndex];
    const rawStops = trip.stops || [];
    const idBase = trip.travelPlanId ?? trip.id ?? `trip-${tripIndex}`;

    for (let stopIndex = 0; stopIndex < rawStops.length; stopIndex++) {
      stops.push({
        id: `${idBase}-stop-${stopIndex}`,
        name: rawStops[stopIndex],
      });
    }
  }

  return stops;
}

export function clearTripsCache(): void {
  cachedTrips = null;
  cacheTimestamp = 0;
}

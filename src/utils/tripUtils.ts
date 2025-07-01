import { RawTrip, Trip } from "@/types/trips";

export const normalizeTrip = (trip: RawTrip): Trip => {
  const safeFilters = Array.isArray(trip.filters) ? trip.filters : [];
  return {
    ...trip,
    createdAt: new Date(trip.createdAt).toISOString(),
    languages: Array.isArray(trip.languages) ? trip.languages : [],
    filters: safeFilters,
    vibes: safeFilters,
  };
};

export const parseTrips = (rawTrips: RawTrip[]): Trip[] =>
  rawTrips.map(normalizeTrip);

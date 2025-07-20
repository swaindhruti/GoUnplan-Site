import { RawTrip, Trip } from "@/types/trips";

// Default vibes to use when no filters are provided
const DEFAULT_VIBES = ["Adventure", "Cultural", "Nature", "Relaxation"];

export const normalizeTrip = (trip: RawTrip): Trip => {
  const safeFilters = Array.isArray(trip.filters) ? trip.filters : [];

  // Generate vibes based on trip content if no filters are provided
  const generateVibes = (): string[] => {
    if (safeFilters.length > 0) {
      return safeFilters;
    }

    const content = `${trip.title} ${trip.description}`.toLowerCase();
    const generatedVibes: string[] = [];

    if (
      content.includes("adventure") ||
      content.includes("trek") ||
      content.includes("hike")
    ) {
      generatedVibes.push("Adventure");
    }
    if (
      content.includes("culture") ||
      content.includes("temple") ||
      content.includes("museum")
    ) {
      generatedVibes.push("Cultural");
    }
    if (
      content.includes("nature") ||
      content.includes("forest") ||
      content.includes("mountain")
    ) {
      generatedVibes.push("Nature");
    }
    if (
      content.includes("beach") ||
      content.includes("relax") ||
      content.includes("spa")
    ) {
      generatedVibes.push("Relaxation");
    }

    // If still no vibes, add a default one
    if (generatedVibes.length === 0) {
      generatedVibes.push(
        DEFAULT_VIBES[Math.floor(Math.random() * DEFAULT_VIBES.length)]
      );
    }

    return generatedVibes;
  };

  return {
    ...trip,
    createdAt: new Date(trip.createdAt).toISOString(),
    languages: Array.isArray(trip.languages) ? trip.languages : [],
    filters: safeFilters,
    vibes: generateVibes(),
  };
};

export const parseTrips = (rawTrips: RawTrip[]): Trip[] =>
  rawTrips.map(normalizeTrip);

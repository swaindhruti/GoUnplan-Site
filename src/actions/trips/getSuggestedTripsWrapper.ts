"use server";

import { getSuggestedTrips } from "./getSuggestedTrips";

interface SearchContext {
  searchTerm?: string;
  vibeFilter?: string[];
  travellerFilter?: string[];
  priceRange?: [number, number];
  selectedCountries?: string[];
  selectedStates?: string[];
  selectedCities?: string[];
  languageFilter?: string[];
}

export async function getSuggestedTripsWrapper(context: SearchContext, limit: number = 6) {
  return await getSuggestedTrips(context, limit);
}
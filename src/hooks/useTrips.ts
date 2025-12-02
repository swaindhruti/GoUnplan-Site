import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllActiveTrips } from '@/actions/user/action';
import { Trip, RawTrip, FilterState, INITIAL_FILTERS } from '@/types/trips';
import { parseTrips } from '@/utils/tripUtils';

export const useTripsData = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTrips = async () => {
      try {
        const result = await getAllActiveTrips();

        if (!isMounted) return;

        if (result.error) {
          setError(result.error);
        } else if (result.trips) {
          const formattedTrips = parseTrips(result.trips as RawTrip[]);
          setTrips(formattedTrips);
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load travel plans');
        console.error(err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  return { trips, isLoading, error };
};

export const useFilters = (trips: Trip[]) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filterOptions = useMemo(
    () => ({
      countries: Array.from(new Set(trips.map(t => t.country))).sort(),
      languages: Array.from(new Set(trips.flatMap(t => t.languages))).sort(),
      vibes: Array.from(new Set(trips.flatMap(t => t.vibes))).sort(),
      travellers: [
        'Solo',
        'Couple',
        'With Baby',
        'Friends',
        'Family',
        'Group',
        'Pet Friendly',
        'Senior',
        'Business',
        'Backpackers',
      ],
      genderPreferences: ['MALE', 'FEMALE', 'MIX', 'OTHER'],
    }),
    [trips]
  );

  const filteredTrips = useMemo(() => {
    if (trips.length === 0) return [];

    return trips.filter(trip => {
      if (filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = [trip.title, trip.description, trip.city, trip.state, trip.country]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(searchLower)) return false;
      }

      if (trip.price < filters.priceRange[0] || trip.price > filters.priceRange[1]) {
        return false;
      }
      if (filters.daysFilter !== 'all') {
        const [min, max] = filters.daysFilter.split('-').map(Number);
        if (trip.noOfDays < min || (max && trip.noOfDays > max)) {
          return false;
        }
      }
      if (
        filters.countryFilter !== 'all' &&
        trip.country.toLowerCase() !== filters.countryFilter.toLowerCase()
      ) {
        return false;
      }
      if (
        filters.languageFilter.length > 0 &&
        !filters.languageFilter.some(lang => trip.languages.includes(lang))
      ) {
        return false;
      }
      if (
        filters.vibeFilter.length > 0 &&
        !filters.vibeFilter.some(vibe => trip.vibes.includes(vibe))
      ) {
        return false;
      }
      if (
        filters.genderPreferenceFilter.length > 0 &&
        trip.genderPreference &&
        !filters.genderPreferenceFilter.includes(trip.genderPreference)
      ) {
        return false;
      }

      return true;
    });
  }, [trips, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm.trim()) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity) count++;
    if (filters.daysFilter !== 'all') count++;
    if (filters.countryFilter !== 'all') count++;
    if (filters.languageFilter.length > 0) count++;
    if (filters.vibeFilter.length > 0) count++;
    if (filters.genderPreferenceFilter.length > 0) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearAllFilters,
    filteredTrips,
    activeFiltersCount,
    filterOptions,
  };
};

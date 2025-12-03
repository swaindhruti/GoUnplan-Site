'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { PrimaryButton } from './common';
import { handleScroll } from '../global/Handlescroll';
import type { Trip } from '@/actions/trips/getHostTripsServer';
import Image from 'next/image';

// Constants
const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const MAX_DROPDOWN_RESULTS = 10;
const MAX_OLA_RESULTS = 5;

// Types
interface OlaLocation {
  place_id: string;
  name: string;
  formatted_address: string;
  full_description: string;
  lat?: number;
  lng?: number;
}

interface SearchState {
  tripResults: Trip[];
  olaResults: OlaLocation[];
  isLoadingTrips: boolean;
  isLoadingOla: boolean;
  showDropdown: boolean;
}

export const FilterAndTrip = () => {
  const [destination, setDestination] = useState('');
  const [travelerType] = useState('Solo'); // kept (used in search params)
  const [vibe] = useState(''); // kept (used in search params)
  const [startDate] = useState<Date | undefined>(undefined); // kept

  const [searchState, setSearchState] = useState<SearchState>({
    tripResults: [],
    olaResults: [],
    isLoadingTrips: false,
    isLoadingOla: false,
    showDropdown: false,
  });

  const router = useRouter();
  const tripAbortControllerRef = useRef<AbortController | null>(null);
  const olaAbortControllerRef = useRef<AbortController | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tripAbortControllerRef.current?.abort();
      olaAbortControllerRef.current?.abort();
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Search trips in your database
  const searchTrips = useCallback(async (query: string) => {
    tripAbortControllerRef.current?.abort();

    if (query.trim().length < MIN_SEARCH_LENGTH) {
      setSearchState(prev => ({ ...prev, tripResults: [], isLoadingTrips: false }));
      return;
    }

    setSearchState(prev => ({ ...prev, isLoadingTrips: true }));

    const controller = new AbortController();
    tripAbortControllerRef.current = controller;

    try {
      const response = await fetch(`/api/search-trips?query=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('Search failed');

      const { trips } = await response.json();
      const limitedResults = trips.slice(0, MAX_DROPDOWN_RESULTS);

      setSearchState(prev => ({
        ...prev,
        tripResults: limitedResults,
        isLoadingTrips: false,
        showDropdown: true,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Error searching trips:', error);
      setSearchState(prev => ({ ...prev, tripResults: [], isLoadingTrips: false }));
    }
  }, []);

  // Search locations via Ola Maps
  const searchOlaLocations = useCallback(async (query: string) => {
    olaAbortControllerRef.current?.abort();

    if (query.trim().length < MIN_SEARCH_LENGTH) {
      setSearchState(prev => ({ ...prev, olaResults: [], isLoadingOla: false }));
      return;
    }

    setSearchState(prev => ({ ...prev, isLoadingOla: true }));

    const controller = new AbortController();
    olaAbortControllerRef.current = controller;

    try {
      const response = await fetch(`/api/search-locations?query=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('Location search failed');

      const { locations } = await response.json();
      const limitedResults = locations.slice(0, MAX_OLA_RESULTS);

      setSearchState(prev => ({
        ...prev,
        olaResults: limitedResults,
        isLoadingOla: false,
        showDropdown: true,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Error searching locations:', error);
      setSearchState(prev => ({ ...prev, olaResults: [], isLoadingOla: false }));
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destination.trim().length >= MIN_SEARCH_LENGTH) {
        searchTrips(destination);
        searchOlaLocations(destination);
      } else {
        setSearchState({
          tripResults: [],
          olaResults: [],
          isLoadingTrips: false,
          isLoadingOla: false,
          showDropdown: false,
        });
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [destination, searchTrips, searchOlaLocations]);

  const updateDropdownRect = useCallback(() => {
    if (!inputWrapperRef.current) return setDropdownRect(null);
    setDropdownRect(inputWrapperRef.current.getBoundingClientRect());
  }, []);

  useEffect(() => {
    if (searchState.showDropdown) updateDropdownRect();
  }, [searchState.showDropdown, updateDropdownRect]);

  useEffect(() => {
    const onScroll = () => searchState.showDropdown && updateDropdownRect();
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [searchState.showDropdown, updateDropdownRect]);

  // Optimized handlers
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const params = new URLSearchParams();
      if (destination) params.append('destination', destination);
      if (vibe) params.append('vibe', vibe);
      if (travelerType) params.append('travelerType', travelerType);
      if (startDate) params.append('startDate', startDate.toISOString());

      router.push(`/trips?${params.toString()}`);
    },
    [destination, vibe, travelerType, startDate, router]
  );

  const handleSelectTrip = useCallback((trip: Trip) => {
    setDestination(trip.destination || '');
    setSearchState(prev => ({ ...prev, showDropdown: false }));
  }, []);

  const handleSelectOlaLocation = useCallback((location: OlaLocation) => {
    setDestination(location.name);
    setSearchState(prev => ({ ...prev, showDropdown: false }));
  }, []);

  const handleDestinationFocus = useCallback(() => {
    if (searchState.tripResults.length > 0 || searchState.olaResults.length > 0) {
      setSearchState(prev => ({ ...prev, showDropdown: true }));
    }
  }, [searchState.tripResults.length, searchState.olaResults.length]);

  const handleDestinationBlur = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setSearchState(prev => ({ ...prev, showDropdown: false }));
    }, 200);
  }, []);

  // const handleBrowseVibeClick = useCallback(() => {
  //   handleScroll({ location: '#find-my-vibe' });
  // }, []);

  // const hasResults = searchState.tripResults.length > 0 || searchState.olaResults.length > 0;
  const isLoading = searchState.isLoadingTrips || searchState.isLoadingOla;

  return (
    <div
      id="filtertrip"
      className="min-h-screen relative flex flex-col items-center px-6 md:px-20 py-10  bg-purple-100"
    >
      <div className="mb-4 flex justify-center">
        <div className={`font-instrument inline-flex items-center px-8 py-2 bg-white rounded-full`}>
          <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase">
            DISCOVER TRIPS
          </span>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            {/* <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="hidden sm:block"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </motion.div> */}

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bricolage font-semibold text-black leading-[1.05] tracking-tighter lowercase">
                Find Your Next
                <span className="block text-purple-700 mt-1 sm:mt-2 lowercase">Story</span>
              </h1>
            </div>

            {/* <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                delay: 0.8,
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="hidden sm:block"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </motion.div> */}
          </div>
        </div>

        {/* Form */}
        <div className="backdrop-blur-xl z-40 bg-white/10 border border-white/20 rounded-xl p-5 shadow-2xl mx-1 sm:mx-0">
          <form onSubmit={handleSearch} className="flex flex-col items-center justify-center gap-4">
            <div ref={inputWrapperRef} className="w-full flex items-center gap-3 relative">
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={e => {
                  setDestination(e.target.value);
                  // open dropdown if there are results already
                  if (searchState.tripResults.length > 0 || searchState.olaResults.length > 0) {
                    setSearchState(prev => ({ ...prev, showDropdown: true }));
                  }
                }}
                onFocus={handleDestinationFocus}
                onBlur={handleDestinationBlur}
                className="w-full rounded-xl px-4 py-6 text-sm font-instrument
                  border-purple-300 shadow-md focus:border-purple-400
                  focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                aria-autocomplete="list"
                aria-expanded={searchState.showDropdown}
                aria-controls="destination-dropdown"
              />
              <PrimaryButton label="Search" type="submit" />

              {/* Dropdown rendered into a portal so it always appears above images/stacks */}
              {searchState.showDropdown &&
                dropdownRect &&
                createPortal(
                  <div
                    id="destination-dropdown"
                    role="listbox"
                    style={{
                      position: 'absolute',
                      top: dropdownRect.bottom + window.scrollY + 8,
                      left: dropdownRect.left + window.scrollX,
                      width: dropdownRect.width,
                      maxHeight: 320,
                      overflow: 'auto',
                      zIndex: 2147483647,
                    }}
                    className="bg-white rounded-md shadow-lg border pointer-events-auto"
                  >
                    {isLoading ? (
                      <div className="p-3 text-sm text-gray-600">Searching...</div>
                    ) : null}

                    {searchState.tripResults.length > 0 && (
                      <div className="divide-y">
                        <div className="px-3 py-2 text-xs text-gray-500">Trips</div>
                        {searchState.tripResults.map((t, i) => (
                          <button
                            key={`trip-${t.travelPlanId ?? i}`}
                            type="button"
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => handleSelectTrip(t)}
                            className="w-full text-left px-4 py-3 flex flex-col gap-0.5
                              hover:bg-purple-50 hover:text-purple-800 focus:bg-purple-50
                              transition-colors duration-150"
                          >
                            <div className="text-sm font-medium">
                              {t.destination ?? t.title ?? 'Unknown'}
                            </div>
                            {t.title && <div className="text-xs text-gray-500">{t.title}</div>}
                          </button>
                        ))}
                      </div>
                    )}

                    {searchState.olaResults.length > 0 && (
                      <div className="divide-y">
                        <div className="px-3 py-2 text-xs text-gray-500">Locations</div>
                        {searchState.olaResults.map((loc, i) => (
                          <button
                            key={`loc-${loc.place_id ?? i}`}
                            type="button"
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => handleSelectOlaLocation(loc)}
                            className="w-full text-left px-4 py-3 flex flex-col gap-0.5
                              hover:bg-purple-50 hover:text-purple-800 focus:bg-purple-50
                              transition-colors duration-150"
                          >
                            <div className="text-sm font-medium">{loc.name}</div>
                            <div className="text-xs text-gray-500">{loc.formatted_address}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!isLoading &&
                      searchState.tripResults.length === 0 &&
                      searchState.olaResults.length === 0 && (
                        <div className="p-3 text-sm text-gray-600">No suggestions</div>
                      )}
                  </div>,
                  document.body
                )}
            </div>
          </form>
        </div>
        <div
          onClick={() => router.push('/trips')}
          className="mt-8 grid grid-cols-1 -z-30 sm:grid-cols-3 gap-4"
        >
          <motion.div className="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-[3/4] cursor-pointer">
            <Image
              layout="fill"
              src="https://ik.imagekit.io/bkt3emitco/cfdf573caa7ec74c5dadf6b37b8249ac.jpg"
              alt="Bali, Indonesia"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bricolage font-semibold text-lg mb-1">Taj Mahal</h3>
              <p className="text-white/90 text-xs font-instrument">Monumental paradise & culture</p>
            </div>
          </motion.div>

          <motion.div className="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-[3/4] cursor-pointer">
            <Image
              layout="fill"
              src="https://ik.imagekit.io/bkt3emitco/a8e560fd2c92c35a887aa0141d5647c8.jpg"
              alt="Paris, France"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bricolage font-semibold text-lg mb-1">Bali</h3>
              <p className="text-white/90 text-xs font-instrument">Romance & art</p>
            </div>
          </motion.div>

          <motion.div className="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-[3/4] cursor-pointer">
            <Image
              layout="fill"
              src="https://ik.imagekit.io/bkt3emitco/f94c5898fcc5227a6b969b303bf8a1b6.jpg"
              alt="Swiss Alps"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bricolage font-semibold text-lg mb-1">Manali</h3>
              <p className="text-white/90 text-xs font-instrument">Mountains, ice & adventure</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

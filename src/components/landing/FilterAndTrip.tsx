'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { PrimaryButton } from './common';
import type { Trip } from '@/actions/trips/getHostTripsServer';
import Image from 'next/image';
import { Calendar, ChevronDown } from 'lucide-react';

// Constants
const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const MAX_DROPDOWN_RESULTS = 10;
const MAX_OLA_RESULTS = 5;

// Vibe options
const VIBE_OPTIONS = [
  { value: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { value: 'romantic', label: 'Romantic', emoji: '💕' },
  { value: 'party', label: 'Party', emoji: '🎉' },
  { value: 'wildlife', label: 'Wildlife', emoji: '🦁' },
  { value: 'beach', label: 'Beach', emoji: '🏖️' },
  { value: 'spiritual', label: 'Spiritual', emoji: '🕉️' },
  { value: 'foodie', label: 'Foodie', emoji: '🍜' },
  { value: 'luxury', label: 'Luxury', emoji: '✨' },
];

// Travel type options
const TRAVEL_TYPE_OPTIONS = [
  { value: 'solo', label: 'Solo', emoji: '🎒' },
  { value: 'couple', label: 'Couple', emoji: '👫' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'friends', label: 'Friends', emoji: '👥' },
  { value: 'group', label: 'Group', emoji: '🚌' },
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'backpacking', label: 'Backpacking', emoji: '🎯' },
];

const FEATURED_DESTINATIONS = [
  {
    title: 'Taj Mahal',
    subtitle: 'Monumental paradise & culture',
    img: 'https://ik.imagekit.io/bkt3emitco/cfdf573caa7ec74c5dadf6b37b8249ac.jpg',
  },
  {
    title: 'Bali',
    subtitle: 'Romance & art',
    img: 'https://ik.imagekit.io/bkt3emitco/a8e560fd2c92c35a887aa0141d5647c8.jpg',
  },
  {
    title: 'Manali',
    subtitle: 'Mountains, ice & adventure',
    img: 'https://ik.imagekit.io/bkt3emitco/f94c5898fcc5227a6b969b303bf8a1b6.jpg',
  },
] as const;

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
interface tripDestinationWithInfoProps {
  tripDestinationWithInfo: {
    travelPlanId: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
  }[];
}

export const FilterAndTrip = ({ tripDestinationWithInfo }: tripDestinationWithInfoProps) => {
  const [destination, setDestination] = useState('');
  const [travelerType, setTravelerType] = useState('');
  const [vibe, setVibe] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const [showVibeDropdown, setShowVibeDropdown] = useState(false);
  const [showTravelTypeDropdown, setShowTravelTypeDropdown] = useState(false);

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
  const vibeDropdownRef = useRef<HTMLDivElement | null>(null);
  const travelTypeDropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vibeDropdownRef.current && !vibeDropdownRef.current.contains(event.target as Node)) {
        setShowVibeDropdown(false);
      }
      if (
        travelTypeDropdownRef.current &&
        !travelTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTravelTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (vibe) params.append('vibe', vibe);
    if (travelerType) params.append('travelerType', travelerType);
    if (startDate) params.append('startDate', startDate.toISOString());

    router.push(`/trips?${params.toString()}`);
  }, [destination, vibe, travelerType, startDate, router]);

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

  const isLoading = searchState.isLoadingTrips || searchState.isLoadingOla;

  return (
    <div
      id="filtertrip"
      className="min-h-screen relative flex flex-col items-center px-6 md:px-20 py-10 bg-purple-100"
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
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bricolage font-semibold text-black leading-[1.05] tracking-tighter lowercase">
                Find Your Next
                <span className="block text-purple-700 mt-1 sm:mt-2 lowercase">Story</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="backdrop-blur-xl z-40 bg-white/10 border border-white/20 rounded-xl p-5 shadow-2xl mx-1 sm:mx-0">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Destination Input */}
            <div ref={inputWrapperRef} className="w-full relative">
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={e => {
                  setDestination(e.target.value);
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

              {/* Destination Dropdown Portal */}
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

            {/* Filter Row */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Date Picker */}
              <div className="relative">
                <input
                  type="date"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={e =>
                    setStartDate(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  className="w-full rounded-xl px-4 py-3 text-sm font-instrument
                    border-purple-300 border shadow-md focus:border-purple-400
                    focus:ring-2 focus:ring-purple-100 transition-all duration-200
                    appearance-none cursor-pointer"
                  placeholder="Start Date"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600 pointer-events-none" />
              </div>

              {/* Vibe Dropdown */}
              <div ref={vibeDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowVibeDropdown(!showVibeDropdown)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-instrument
                    border border-purple-300 shadow-md hover:border-purple-400
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-100 
                    transition-all duration-200 bg-transparent text-left flex items-center justify-between"
                >
                  <span className={vibe ? 'text-gray-900' : 'text-gray-500'}>
                    {vibe ? VIBE_OPTIONS.find(v => v.value === vibe)?.label : 'Select Vibe'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-600 transition-transform ${showVibeDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {showVibeDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-purple-200 z-50 max-h-64 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setVibe('');
                        setShowVibeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors border-b"
                    >
                      <span className="text-gray-500">Any Vibe</span>
                    </button>
                    {VIBE_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setVibe(option.value);
                          setShowVibeDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors
                          ${vibe === option.value ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                      >
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Travel Type Dropdown */}
              <div ref={travelTypeDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowTravelTypeDropdown(!showTravelTypeDropdown)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-instrument
                    border border-purple-300 shadow-md hover:border-purple-400
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-100 
                    transition-all duration-200 bg-transparent text-left flex items-center justify-between"
                >
                  <span className={travelerType ? 'text-gray-900' : 'text-gray-500'}>
                    {travelerType
                      ? TRAVEL_TYPE_OPTIONS.find(t => t.value === travelerType)?.label
                      : 'Travel Type'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-600 transition-transform ${showTravelTypeDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {showTravelTypeDropdown && (
                  <div className="absolute z-50  top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-purple-200 max-h-64 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setTravelerType('');
                        setShowTravelTypeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors border-b"
                    >
                      <span className="text-gray-500">Any Type</span>
                    </button>
                    {TRAVEL_TYPE_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setTravelerType(option.value);
                          setShowTravelTypeDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors
                          ${travelerType === option.value ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                      >
                        <span className="mr-2">{option.emoji}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button onClick={handleSearch} type="button">
              <PrimaryButton label="Search Trips" />
            </button>
          </div>
        </div>

        {/* Featured Destinations */}
        <div
          onClick={() => router.push('/trips')}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {tripDestinationWithInfo.slice(0, 3).map((dest, idx) => (
            <motion.div
              key={idx}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-[3/4] cursor-pointer"
            >
              <Image
                layout="fill"
                src={dest.image || ''}
                alt={dest.title || ''}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bricolage font-semibold text-lg mb-1">
                  {dest.title}
                </h3>
                <p className="text-white/90 text-xs font-instrument">{dest.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

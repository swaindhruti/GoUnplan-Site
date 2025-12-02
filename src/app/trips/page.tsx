'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTripsData, useFilters } from '@/hooks/useTrips';
import { MultiValue } from 'react-select';
import { SelectOption } from '@/types/trips';
import { FilterPanel } from '@/components/trips/FilterPanel';
import { TripCard } from '@/components/trips/TripCard';
import { LoadingSkeleton, EmptyState, ErrorDisplay } from '@/components/trips/LoadingStates';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, X } from 'lucide-react';

// Floating Action Button
const FloatingActionButton = ({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center ${className}`}
  >
    {children}
  </button>
);

export default function TripsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [mounted, status, router]);

  const { trips, isLoading, error } = useTripsData();

  const {
    filters,
    updateFilter,
    clearAllFilters,
    filteredTrips,
    activeFiltersCount,
    filterOptions,
  } = useFilters(trips);

  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Typing animation for search
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsTyping(true);
      updateFilter('searchTerm', e.target.value);

      // Clear typing indicator after delay
      setTimeout(() => setIsTyping(false), 1000);
    },
    [updateFilter]
  );

  const selectStyles = useMemo(
    () => ({
      control: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: '1px',
        borderColor: 'rgba(147, 51, 234, 0.3)',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '6px',
        fontSize: '0.95rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(147, 51, 234, 0.5)',
          boxShadow: '0 6px 25px rgba(147, 51, 234, 0.15)',
        },
        '&:focus-within': {
          borderColor: 'rgb(147, 51, 234)',
          boxShadow: '0 0 0 3px rgba(147, 51, 234, 0.1)',
        },
      }),
      option: (
        baseStyles: Record<string, unknown>,
        state: { isSelected: boolean; isFocused: boolean }
      ) => ({
        ...baseStyles,
        backgroundColor: state.isSelected
          ? 'rgb(147, 51, 234)'
          : state.isFocused
            ? 'rgba(147, 51, 234, 0.1)'
            : 'white',
        color: state.isSelected ? 'white' : 'rgb(55, 65, 81)',
        fontWeight: state.isSelected ? '600' : '500',
        padding: '10px 14px',
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
      }),
      multiValue: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        border: '1px solid rgba(147, 51, 234, 0.3)',
        borderRadius: '0.5rem',
        padding: '2px 6px',
        margin: '2px 4px 2px 0',
      }),
      multiValueLabel: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: 'rgb(147, 51, 234)',
        fontWeight: '500',
        fontSize: '0.875rem',
      }),
      multiValueRemove: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: 'rgb(147, 51, 234)',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgb(147, 51, 234)',
          color: 'white',
        },
      }),
      placeholder: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: 'rgb(107, 114, 128)',
        fontWeight: '400',
      }),
      input: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: 'rgb(55, 65, 81)',
        fontWeight: '500',
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
      dropdownIndicator: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: 'rgb(147, 51, 234)',
        '&:hover': {
          color: 'rgb(126, 34, 206)',
        },
      }),
      menu: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: 'white',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }),
      menuList: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: '6px',
      }),
      valueContainer: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: '4px 8px',
      }),
    }),
    []
  );

  // Handler functions for filter changes
  const handlePriceMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter('priceRange', [+e.target.value || 0, filters.priceRange[1]]);
    },
    [updateFilter, filters.priceRange]
  );

  const handlePriceMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter('priceRange', [filters.priceRange[0], +e.target.value || Infinity]);
    },
    [updateFilter, filters.priceRange]
  );

  const handleLanguageChange = useCallback(
    (selected: MultiValue<SelectOption>) => {
      updateFilter(
        'languageFilter',
        selected.map(opt => opt.value)
      );
    },
    [updateFilter]
  );

  const handleVibeChange = useCallback(
    (selected: MultiValue<SelectOption>) => {
      updateFilter(
        'vibeFilter',
        selected.map(opt => opt.value)
      );
    },
    [updateFilter]
  );

  const handleTravellerChange = useCallback(
    (selected: MultiValue<SelectOption>) => {
      updateFilter(
        'travellerFilter',
        selected.map(opt => opt.value)
      );
    },
    [updateFilter]
  );

  const handleGenderPreferenceChange = useCallback(
    (selected: MultiValue<SelectOption>) => {
      updateFilter(
        'genderPreferenceFilter',
        selected.map(opt => opt.value)
      );
    },
    [updateFilter]
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    // Map query params to filter keys
    const travelerType = searchParams.get('travelerType');
    const startDate = searchParams.get('startDate');
    const destination = searchParams.get('destination');
    const vibe = searchParams.get('vibe');
    // Add more params as needed (e.g., language, priceRange, etc.)

    if (travelerType) {
      updateFilter('travellerFilter', [travelerType]);
    }
    if (vibe) {
      updateFilter('vibeFilter', [vibe]);
    }
    if (destination) {
      updateFilter('searchTerm', destination);
    }
    if (startDate) {
      // If you want to filter by date, add a date filter to your FilterState and handle it here
      // updateFilter("startDate", startDate);
    }
    // Add more param handling as needed
  }, [searchParams, updateFilter]);

  // Handle trip card click - scroll to card
  const handleTripClick = useCallback((tripId: string) => {
    const element = document.getElementById(`trip-${tripId}`);
    if (element) {
      // Calculate offset to position the card nicely in the viewport
      const yOffset = -100; // Adjust this value as needed
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  }, []);

  // Show unauthorized page if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to view trips.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full mb-4">
                <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                  Travel Discovery
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
                Discover Your Perfect
                <span className="block text-purple-300 mt-2">Adventure</span>
              </h1>
              <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
                Explore unique travel experiences tailored to your preferences
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
          >
            {/* Search Bar */}
            <div className="mb-2">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex-1 min-w-[320px] relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <input
                    type="text"
                    placeholder="Search destinations, activities, or experiences..."
                    className="relative w-full bg-white/90 border-2 border-purple-200/50 text-gray-800 placeholder:text-gray-500 rounded-2xl h-16 pl-6 pr-14 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 font-instrument text-lg shadow-lg hover:shadow-xl hover:border-purple-300"
                    value={filters.searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {isTyping && (
                    <div className="absolute top-full left-6 mt-2 flex items-center gap-2 text-purple-600 text-sm font-medium">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                      <span>Searching...</span>
                    </div>
                  )}
                </div>

                {/* Filter Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 font-semibold text-sm rounded-2xl transition-all duration-300 flex items-center gap-3 font-instrument relative overflow-hidden ${
                    showFilters
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-2xl shadow-purple-500/30'
                      : 'bg-white/90 text-gray-700 hover:bg-white border-2 border-purple-200/50 hover:border-purple-300 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <motion.div
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Filter className="w-5 h-5" />
                  </motion.div>
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/20 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold backdrop-blur-sm"
                    >
                      {activeFiltersCount}
                    </motion.div>
                  )}
                </motion.button>

                {activeFiltersCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-4 font-semibold text-sm rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 font-instrument shadow-lg hover:shadow-xl"
                    onClick={clearAllFilters}
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filter Panel */}
            <motion.div
              initial={false}
              animate={{
                height: showFilters ? 'auto' : 0,
                opacity: showFilters ? 1 : 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
                opacity: { duration: 0.3 },
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: showFilters ? 0 : -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="border-t border-gradient-to-r from-purple-200 via-pink-200 to-purple-200 pt-8"
              >
                <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl p-6 backdrop-blur-sm">
                  <FilterPanel
                    filters={filters}
                    updateFilter={updateFilter}
                    filterOptions={filterOptions}
                    selectStyles={selectStyles}
                    handlePriceMinChange={handlePriceMinChange}
                    handlePriceMaxChange={handlePriceMaxChange}
                    handleLanguageChange={handleLanguageChange}
                    handleVibeChange={handleVibeChange}
                    handleTravellerChange={handleTravellerChange}
                    handleGenderPreferenceChange={handleGenderPreferenceChange}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading state */}
        {isLoading && <LoadingSkeleton />}

        {/* Error state */}
        {error && <ErrorDisplay error={error} />}

        {/* Empty state */}
        {!isLoading && !error && filteredTrips.length === 0 && (
          <EmptyState
            onClearFilters={clearAllFilters}
            searchContext={{
              searchTerm: filters.searchTerm,
              vibeFilter: filters.vibeFilter,
              travellerFilter: filters.travellerFilter,
              priceRange: filters.priceRange,
              languageFilter: filters.languageFilter,
            }}
          />
        )}

        {/* Results */}
        {!isLoading && !error && filteredTrips.length > 0 && (
          <div className="space-y-8">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 font-bricolage">
                  {filteredTrips.length} Trip
                  {filteredTrips.length !== 1 ? 's' : ''} Found
                </h2>
                {isTyping && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Trip grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map(trip => (
                <motion.div
                  key={trip.travelPlanId}
                  id={`trip-${trip.travelPlanId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <TripCard trip={trip} onClick={() => handleTripClick(trip.travelPlanId)} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <FloatingActionButton onClick={scrollToTop}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </FloatingActionButton>
      )}
    </div>
  );
}

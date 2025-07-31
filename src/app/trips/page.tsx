"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTripsData, useFilters } from "@/hooks/useTrips";
import { MultiValue } from "react-select";
import { SelectOption } from "@/types/trips";
import { FilterPanel } from "@/components/trips/FilterPanel";
import { TripCard } from "@/components/trips/TripCard";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorDisplay
} from "@/components/trips/LoadingStates";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, Sparkles, X } from "lucide-react";

// Floating Action Button
const FloatingActionButton = ({
  onClick,
  children,
  className = ""
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
    if (mounted && status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [mounted, status, router]);

  const { trips, isLoading, error } = useTripsData();
  const {
    filters,
    updateFilter,
    clearAllFilters,
    filteredTrips,
    activeFiltersCount,
    filterOptions
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Typing animation for search
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsTyping(true);
      updateFilter("searchTerm", e.target.value);

      // Clear typing indicator after delay
      setTimeout(() => setIsTyping(false), 1000);
    },
    [updateFilter]
  );

  const selectStyles = useMemo(
    () => ({
      control: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderWidth: "1px",
        borderColor: "rgba(147, 51, 234, 0.3)",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "6px",
        fontSize: "0.95rem",
        fontWeight: "500",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "rgba(147, 51, 234, 0.5)",
          boxShadow: "0 6px 25px rgba(147, 51, 234, 0.15)"
        },
        "&:focus-within": {
          borderColor: "rgb(147, 51, 234)",
          boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.1)"
        }
      }),
      option: (
        baseStyles: Record<string, unknown>,
        state: { isSelected: boolean; isFocused: boolean }
      ) => ({
        ...baseStyles,
        backgroundColor: state.isSelected
          ? "rgb(147, 51, 234)"
          : state.isFocused
          ? "rgba(147, 51, 234, 0.1)"
          : "white",
        color: state.isSelected ? "white" : "rgb(55, 65, 81)",
        fontWeight: state.isSelected ? "600" : "500",
        padding: "10px 14px",
        fontSize: "0.875rem",
        transition: "all 0.2s ease"
      }),
      multiValue: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        border: "1px solid rgba(147, 51, 234, 0.3)",
        borderRadius: "0.5rem",
        padding: "2px 6px",
        margin: "2px 4px 2px 0"
      }),
      multiValueLabel: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(147, 51, 234)",
        fontWeight: "500",
        fontSize: "0.875rem"
      }),
      multiValueRemove: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(147, 51, 234)",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgb(147, 51, 234)",
          color: "white"
        }
      }),
      placeholder: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(107, 114, 128)",
        fontWeight: "400"
      }),
      input: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(55, 65, 81)",
        fontWeight: "500"
      }),
      indicatorSeparator: () => ({
        display: "none"
      }),
      dropdownIndicator: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(147, 51, 234)",
        "&:hover": {
          color: "rgb(126, 34, 206)"
        }
      }),
      menu: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "white",
        border: "1px solid rgba(147, 51, 234, 0.2)",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        overflow: "hidden"
      }),
      menuList: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: "6px"
      }),
      valueContainer: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: "4px 8px"
      })
    }),
    []
  );

  // Handler functions for filter changes
  const handlePriceMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter("priceRange", [+e.target.value || 0, filters.priceRange[1]]);
    },
    [updateFilter, filters.priceRange]
  );

  const handlePriceMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter("priceRange", [
        filters.priceRange[0],
        +e.target.value || Infinity
      ]);
    },
    [updateFilter, filters.priceRange]
  );

  const handleLanguageChange = useCallback(
    (selected: MultiValue<SelectOption>) => {
      updateFilter(
        "languageFilter",
        selected.map((opt) => opt.value)
      );
    },
    [updateFilter]
  );

  const handleVibeChange = useCallback(
    (selected: MultiValue<SelectOption>) => {
      updateFilter(
        "vibeFilter",
        selected.map((opt) => opt.value)
      );
    },
    [updateFilter]
  );

  const handleTravellerChange = useCallback(
    (selected: MultiValue<SelectOption>) => {
      updateFilter(
        "travellerFilter",
        selected.map((opt) => opt.value)
      );
    },
    [updateFilter]
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    // Map query params to filter keys
    const travelerType = searchParams.get("travelerType");
    const startDate = searchParams.get("startDate");
    const destination = searchParams.get("destination");
    const vibe = searchParams.get("vibe");
    // Add more params as needed (e.g., language, priceRange, etc.)

    if (travelerType) {
      updateFilter("travellerFilter", [travelerType]);
    }
    if (vibe) {
      updateFilter("vibeFilter", [vibe]);
    }
    if (destination) {
      updateFilter("searchTerm", destination);
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
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  }, []);

  // Show unauthorized page if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">Please sign in to view trips.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with background image */}
      <div
        className="relative min-h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752778285/1432000_1_byxulb.jpg')`
        }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40" />
        {/*         <BackButton isWhite={true} route="/" /> */}
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold font-bricolage text-white mb-6 drop-shadow-lg">
                Discover Your Perfect
                <span className="block text-purple-300 mt-2">Adventure</span>
              </h1>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  delay: 0.8,
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md font-normal font-instrument leading-relaxed"
            >
              Explore unique travel experiences tailored to your preferences.
              From hidden gems to popular destinations.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Sleek Search and Filter Section */}
      <div className="relative -mt-8 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[280px] relative">
                  <input
                    type="text"
                    placeholder="Search destinations, activities, or experiences..."
                    className="w-full bg-white/90 border border-white/30 text-gray-800 placeholder:text-gray-500 rounded-xl h-14 pl-4 pr-12 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    value={filters.searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {/* Filter Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 font-medium text-sm rounded-xl transition-all duration-200 flex items-center gap-2 border ${
                    showFilters
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                      : "bg-white/90 text-gray-700 border-white/30 hover:bg-white hover:shadow-md"
                  }`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <div className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                      {activeFiltersCount}
                    </div>
                  )}
                </motion.button>

                {activeFiltersCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 font-medium text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
                    onClick={clearAllFilters}
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filter Panel */}
            <motion.div
              initial={false}
              animate={{
                height: showFilters ? "auto" : 0,
                opacity: showFilters ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/20 pt-6">
                <FilterPanel
                  filters={filters}
                  updateFilter={updateFilter}
                  filterOptions={filterOptions}
                  selectStyles={selectStyles}
                  handlePriceMinChange={handlePriceMinChange}
                  handlePriceMaxChange={handlePriceMaxChange}
                  handleLanguageChange={handleLanguageChange}
                  handleVibeChange={handleVibeChange}
                  handleTravellerChange={handleTravellerChange} // <-- add this
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 pt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Loading state */}
          {isLoading && <LoadingSkeleton />}

          {/* Error state */}
          {error && <ErrorDisplay error={error} />}

          {/* Empty state */}
          {!isLoading && !error && filteredTrips.length === 0 && (
            <EmptyState onClearFilters={clearAllFilters} />
          )}

          {/* Results */}
          {!isLoading && !error && filteredTrips.length > 0 && (
            <div className="space-y-6">
              {/* Results header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredTrips.length} Trip
                    {filteredTrips.length !== 1 ? "s" : ""} Found
                  </h2>
                  {isTyping && (
                    <div className="flex items-center gap-2 text-purple-600">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Trip grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => (
                  <motion.div
                    key={trip.travelPlanId}
                    id={`trip-${trip.travelPlanId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <TripCard
                      trip={trip}
                      onClick={() => handleTripClick(trip.travelPlanId)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <FloatingActionButton onClick={scrollToTop}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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

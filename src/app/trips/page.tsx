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
  ErrorDisplay,
} from "@/components/trips/LoadingStates";

// Animated Counter Component
const AnimatedCounter = ({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className="text-purple-600 font-bold">{count}</span>;
};

// Floating Action Button
const FloatingActionButton = ({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center ${className}`}
  >
    {children}
  </button>
);

export default function TripsPage() {
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
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        borderWidth: "2px",
        borderColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: "1rem",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
        padding: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        backdropFilter: "blur(20px)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "rgba(147, 51, 234, 0.6)",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxShadow: "0 16px 50px rgba(147, 51, 234, 0.2)",
          transform: "translateY(-2px)",
        },
        "&:focus-within": {
          borderColor: "rgb(147, 51, 234)",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxShadow: "0 20px 60px rgba(147, 51, 234, 0.3)",
          transform: "translateY(-2px)",
        },
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
          : "rgba(255, 255, 255, 0.95)",
        color: state.isSelected ? "white" : "rgb(55, 65, 81)",
        fontWeight: state.isSelected ? "700" : "500",
        padding: "12px 16px",
        borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
        fontSize: "0.875rem",
        backdropFilter: "blur(20px)",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgb(147, 51, 234)",
          color: "white",
          transform: "translateX(4px)",
        },
      }),
      multiValue: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "rgba(147, 51, 234, 0.15)",
        border: "1px solid rgba(147, 51, 234, 0.4)",
        borderRadius: "0.75rem",
        padding: "4px 8px",
        margin: "4px 6px 4px 0",
        boxShadow: "0 2px 8px rgba(147, 51, 234, 0.1)",
        animation: "pulse 2s infinite",
      }),
      multiValueLabel: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(147, 51, 234)",
        fontWeight: "600",
        padding: "2px 4px",
        fontSize: "0.875rem",
      }),
      multiValueRemove: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(147, 51, 234)",
        borderLeft: "1px solid rgba(147, 51, 234, 0.4)",
        paddingLeft: "6px",
        paddingRight: "6px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgb(147, 51, 234)",
          color: "white",
          transform: "scale(1.1)",
        },
      }),
      placeholder: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(107, 114, 128)",
        fontWeight: "500",
      }),
      input: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(55, 65, 81)",
        fontWeight: "500",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "rgb(147, 51, 234)",
        transition: "all 0.2s ease",
        "&:hover": {
          color: "rgb(126, 34, 206)",
          transform: "scale(1.1)",
        },
      }),
      menu: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        borderRadius: "1rem",
        boxShadow: "0 25px 80px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        backdropFilter: "blur(30px)",
        animation: "slideDown 0.3s ease-out",
      }),
      menuList: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: "8px",
      }),
      valueContainer: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: "6px 8px",
      }),
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
        +e.target.value || Infinity,
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

  // Interactive trip selection
  const handleTripSelect = useCallback((tripId: string) => {
    setSelectedTripId(tripId);
    // Scroll to the selected trip with smooth animation
    setTimeout(() => {
      const element = document.getElementById(`trip-${tripId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero section with premium gradient background */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-20 overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-playfair md:text-6xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                Adventure
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow-lg font-medium leading-relaxed animate-fade-in-up">
              Explore unique travel experiences tailored to your vibe. From
              hidden gems to popular destinations, find the journey that speaks
              to your soul.
            </p>
          </div>

          {/* Premium Search and Filter Container */}
          <div className="backdrop-blur-3xl bg-white/15 border border-white/25 rounded-3xl p-8 max-w-5xl mx-auto shadow-2xl shadow-purple-900/20 animate-fade-in-up">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search destinations, activities, or experiences..."
                    className={`w-full bg-white/95 backdrop-blur-xl border border-white/60 text-gray-900 placeholder:text-gray-600 rounded-2xl h-14 pl-6 pr-12 focus:bg-white focus:border-purple-400 focus:shadow-2xl focus:shadow-purple-500/20 transition-all duration-300 font-medium shadow-xl ${
                      isTyping ? "animate-pulse" : ""
                    }`}
                    value={filters.searchTerm}
                    onChange={handleSearchChange}
                  />
                  <svg
                    className={`absolute right-4 top-4 w-6 h-6 text-gray-600 transition-all duration-300 ${
                      isTyping ? "animate-spin" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Premium Filter Toggle Button */}
                <button
                  className={`
                    px-8 py-4 font-semibold text-sm tracking-wide rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:scale-105
                    ${
                      showFilters
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30 scale-105"
                        : "bg-white/95 backdrop-blur-xl border border-white/60 text-gray-800 hover:bg-white hover:shadow-2xl hover:shadow-purple-500/20"
                    }
                  `}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <div className="bg-white/90 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
                      {activeFiltersCount}
                    </div>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    className="px-8 py-4 font-semibold text-sm tracking-wide rounded-2xl bg-red-500/95 backdrop-blur-xl border border-red-400/60 text-white hover:bg-red-500 hover:shadow-2xl hover:shadow-red-500/20 hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-xl"
                    onClick={clearAllFilters}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Panel with smooth animation */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showFilters ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-white/30 pt-8">
                <FilterPanel
                  filters={filters}
                  updateFilter={updateFilter}
                  filterOptions={filterOptions}
                  selectStyles={selectStyles}
                  handlePriceMinChange={handlePriceMinChange}
                  handlePriceMaxChange={handlePriceMaxChange}
                  handleLanguageChange={handleLanguageChange}
                  handleVibeChange={handleVibeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Results Section */}
      <div className="relative bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Loading state */}
          {isLoading && (
            <div className="min-h-[60vh] flex items-center justify-center">
              <LoadingSkeleton />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="min-h-[60vh] flex items-center justify-center">
              <ErrorDisplay error={error} />
            </div>
          )}

          {/* Results section */}
          {!isLoading && !error && filteredTrips.length > 0 && (
            <div className="space-y-12">
              {/* Premium Section header */}
              <div className="text-center">
                <div className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 shadow-lg animate-fade-in">
                  <span className="text-purple-700 text-sm font-semibold tracking-wide uppercase">
                    Available Trips
                  </span>
                </div>
                <h2 className="text-3xl font-playfair md:text-5xl font-semibold text-gray-800 mb-6 animate-fade-in-up">
                  <AnimatedCounter value={filteredTrips.length} /> Amazing
                  Adventures Found
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
                  Each trip is carefully curated to provide you with
                  unforgettable experiences and memories.
                </p>
              </div>

              {/* Interactive Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      <AnimatedCounter value={filteredTrips.length} />
                    </div>
                    <div className="text-gray-600 font-medium">Total Trips</div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-2">
                      <AnimatedCounter
                        value={Math.floor(filteredTrips.length * 0.8)}
                      />
                    </div>
                    <div className="text-gray-600 font-medium">
                      Available Now
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      <AnimatedCounter
                        value={Math.floor(filteredTrips.length * 0.6)}
                      />
                    </div>
                    <div className="text-gray-600 font-medium">
                      Popular Destinations
                    </div>
                  </div>
                </div>
              </div>

              {/* Results grid with staggered animation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredTrips.map((trip, index) => (
                  <div
                    key={trip.travelPlanId}
                    id={`trip-${trip.travelPlanId}`}
                    className={`transform transition-all duration-500 ${
                      selectedTripId === trip.travelPlanId
                        ? "scale-105 ring-4 ring-purple-400 ring-opacity-50"
                        : "hover:scale-102"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    <TripCard
                      trip={trip}
                      onClick={() => handleTripSelect(trip.travelPlanId)}
                      isSelected={selectedTripId === trip.travelPlanId}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredTrips.length === 0 && (
            <div className="min-h-[60vh] flex items-center justify-center">
              <EmptyState onClearFilters={clearAllFilters} />
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

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
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/global/buttons";

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

  // Handle authentication and mounting
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
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  console.log(isTyping);

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

  // Show loading while checking authentication or not mounted

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
        <BackButton isWhite={true} route="/" />
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Discover Your Perfect
              <span className="block text-purple-300 mt-2">Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md font-normal font-roboto leading-relaxed">
              Explore unique travel experiences tailored to your preferences.
              From hidden gems to popular destinations.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search destinations, activities, or experiences..."
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-lg h-12 pl-4 pr-12 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 font-medium"
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
                <svg
                  className="absolute right-4 top-3 w-6 h-6 text-gray-400"
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

              {/* Filter Toggle Button */}
              <button
                className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 border ${
                  showFilters
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg
                  className="w-4 h-4"
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
                  <div className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                    {activeFiltersCount}
                  </div>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  className="px-6 py-3 font-medium text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
                  onClick={clearAllFilters}
                >
                  <svg
                    className="w-4 h-4"
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

          {/* Filter Panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showFilters ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-200 pt-6">
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

      {/* Results Section */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
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
          {!isLoading && !error && filteredTrips.length > 0 ? (
            <div className="space-y-8">
              {/* Results grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.travelPlanId}
                    id={`trip-${trip.travelPlanId}`}
                    className={`transform transition-all duration-300 ${
                      selectedTripId === trip.travelPlanId
                        ? "scale-105 ring-2 ring-purple-400 rounded-xl"
                        : "hover:scale-101"
                    }`}
                  >
                    <TripCard
                      trip={trip}
                      onClick={() => handleTripSelect(trip.travelPlanId)}
                      isSelected={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-gray-50  ">
              <LoadingSkeleton />
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

      {/* Floating Action Button */}
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

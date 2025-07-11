/* "use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTripsData, useFilters } from "@/hooks/useTrips";
import { MultiValue } from "react-select";
import { SelectOption } from "@/types/trips";
import { HeroSection } from "@/components/trips/HeroSection";
import { FilterControls } from "@/components/trips/FilterControls";
import { FilterPanel } from "@/components/trips/FilterPanel";
import { TripCard } from "@/components/trips/TripCard";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorDisplay
} from "@/components/trips/LoadingStates";

export default function TripsPage() {
  const { trips, isLoading, error } = useTripsData();
  const {
    filters,
    updateFilter,
    clearAllFilters,
    filteredTrips,
    activeFiltersCount,
    filterOptions
  } = useFilters(trips);

  const searchParams = useSearchParams();
  const vibeParam = searchParams.get("vibe");
  const travelersParam = searchParams.get("travelers");
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const daysParam = searchParams.get("days");

  useEffect(() => {
    if (vibeParam) updateFilter("vibeFilter", [vibeParam]);
    if (travelersParam) updateFilter("travelersFilter", [travelersParam]);
    if (checkInParam) updateFilter("checkInFilter", [checkInParam]);
    if (checkOutParam) updateFilter("checkOutFilter", [checkOutParam]);
    if (daysParam) updateFilter("daysFilter", [daysParam]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibeParam, travelersParam, checkInParam, checkOutParam, daysParam]);

  const [showFilters, setShowFilters] = useState(false);

  const selectStyles = useMemo(
    () => ({
      control: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "white",
        borderWidth: "3px",
        borderColor: "black",
        borderRadius: "0.5rem",
        boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
        padding: "4px",
        fontSize: "1rem",
        fontWeight: "bold",
        "&:hover": {
          borderColor: "black"
        }
      }),
      option: (
        baseStyles: Record<string, unknown>,
        state: { isSelected: boolean; isFocused: boolean }
      ) => ({
        ...baseStyles,
        backgroundColor: state.isSelected
          ? "#22c55e"
          : state.isFocused
          ? "#f0f9ff"
          : "white",
        color: "black",
        fontWeight: state.isSelected ? "bold" : "normal",
        padding: "8px 12px",
        borderBottom: "1px solid #e5e7eb",
        textTransform: "uppercase" as const,
        fontSize: "0.875rem",
        "&:hover": {
          backgroundColor: "#22c55e"
        }
      }),
      multiValue: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "#fde047",
        borderWidth: "2px",
        borderColor: "black",
        borderRadius: "4px",
        padding: "0px 2px",
        margin: "2px 4px 2px 0"
      }),
      multiValueLabel: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "black",
        fontWeight: "bold",
        padding: "2px 4px",
        fontSize: "0.875rem"
      }),
      multiValueRemove: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "black",
        borderLeft: "1px solid black",
        paddingLeft: "4px",
        paddingRight: "4px",
        "&:hover": {
          backgroundColor: "#f59e0b",
          color: "black"
        }
      }),
      placeholder: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "#6b7280",
        fontWeight: "bold"
      }),
      input: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "black",
        fontWeight: "bold"
      }),
      indicatorSeparator: () => ({
        display: "none"
      }),
      dropdownIndicator: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        color: "black",
        "&:hover": {
          color: "black"
        }
      }),
      menu: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        backgroundColor: "white",
        border: "3px solid black",
        borderRadius: "0.5rem",
        boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)",
        overflow: "hidden"
      }),
      menuList: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: "0"
      }),
      valueContainer: (baseStyles: Record<string, unknown>) => ({
        ...baseStyles,
        padding: "4px 6px"
      })
    }),
    []
  );

  // Handler functions for filter changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter("searchTerm", e.target.value);
    },
    [updateFilter]
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero section with search 
      <HeroSection
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter controls section 
        <div className="mb-8">
          <FilterControls
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFiltersCount={activeFiltersCount}
            filteredTripsCount={filteredTrips.length}
            clearAllFilters={clearAllFilters}
          />

          {showFilters && (
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
          )}
        </div>

        {/* Loading state 
        {isLoading && <LoadingSkeleton />}

        {/* Error state 
        {error && <ErrorDisplay error={error} />}

        {/* Results grid 
        {!isLoading && !error && filteredTrips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.travelPlanId} trip={trip} />
            ))}
          </div>
        )}

        {/* Empty state 
        {!isLoading && !error && filteredTrips.length === 0 && (
          <EmptyState onClearFilters={clearAllFilters} />
        )}
      </div>
    </div>
  );
}
 */

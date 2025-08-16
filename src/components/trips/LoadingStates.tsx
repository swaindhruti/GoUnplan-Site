import { Search, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TripCard } from "./TripCard";
import { useState, useEffect } from "react";
import { Trip } from "@/types/trips";

export const LoadingSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-full h-[540px] flex flex-col justify-between rounded-2xl border border-gray-200 bg-white shadow-sm p-4"
        >
          {/* Image */}
          <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
            <Skeleton className="absolute inset-0 w-full h-full" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between flex-1 py-4 space-y-4">
            {/* Title + Price */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>

            {/* Icons */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>

          {/* Button */}
          <Skeleton className="w-full h-12 rounded-full mt-2" />
        </div>
      ))}
    </div>
  </div>
);

interface EmptyStateProps {
  onClearFilters: () => void;
  searchContext?: {
    searchTerm?: string;
    vibeFilter?: string[];
    travellerFilter?: string[];
    priceRange?: [number, number];
    selectedCountries?: string[];
    selectedStates?: string[];
    selectedCities?: string[];
    languageFilter?: string[];
  };
}

export const EmptyState = ({
  onClearFilters,
  searchContext,
}: EmptyStateProps) => {
  const [suggestedTrips, setSuggestedTrips] = useState<Trip[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchContext) return;

      setIsLoadingSuggestions(true);
      try {
        const response = await fetch("/api/trips/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchContext,
            limit: 6,
          }),
        });

        const result = await response.json();
        if (result.success && result.trips) {
          setSuggestedTrips(result.trips);
        }
      } catch (error) {
        console.error("Error fetching suggested trips:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [searchContext]);

  return (
    <div className="space-y-8">
      {/* Original Empty State */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            {/* Icon container */}
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-purple-600" />
            </div>

            {/* Header */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bricolage font-bold text-gray-900">
                No Adventures Found
              </h3>
              <p className="text-gray-600 font-instrument leading-relaxed">
                We couldn&apos;t find any trips matching your current
                preferences.
                {suggestedTrips.length > 0
                  ? " But don't worry - we have some similar adventures you might love!"
                  : " Try adjusting your filters or explore our other amazing destinations!"}
              </p>
            </div>

            {/* Button */}
            <Button
              onClick={onClearFilters}
              className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold px-8 py-3 rounded-full transition-colors duration-200"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Trips Section */}
      {(isLoadingSuggestions || suggestedTrips.length > 0) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bricolage font-bold text-gray-900">
                  Similar Adventures You Might Love
                </h3>
                <p className="text-gray-600 font-instrument text-sm">
                  Based on your search, we found these amazing trips
                </p>
              </div>
            </div>
          </div>

          {isLoadingSuggestions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-4"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl mb-4">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedTrips.map((trip) => (
                <div key={trip.travelPlanId} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      Suggested
                    </div>
                  </div>
                  <TripCard trip={trip} onClick={() => {}} />
                </div>
              ))}
            </div>
          )}

          {suggestedTrips.length > 0 && (
            <div className="text-center mt-8">
              <Button
                onClick={() => (window.location.href = "/trips")}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 font-instrument font-semibold px-8 py-3 rounded-full"
              >
                Explore All Trips
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon container */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        {/* Header */}
        <div className="mb-8 space-y-4">
          <h3 className="text-2xl font-bricolage font-bold text-gray-900">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 font-instrument leading-relaxed">
            {error}
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-instrument font-semibold px-8 py-3 rounded-full transition-colors duration-200"
        >
          Try Again
        </Button>
      </div>
    </div>
  </div>
);

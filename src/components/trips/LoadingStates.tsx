import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="w-full h-[540px] flex flex-col justify-between rounded-3xl border border-white/40 bg-white/60  p-4"
      >
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl">
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
        <Skeleton className="w-full h-12 rounded-2xl mt-2" />
      </div>
    ))}
  </div>
);

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      {/* Icon container */}
      <div className="inline-block p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl mb-8 shadow-lg">
        <Search className="h-16 w-16 text-purple-600" />
      </div>

      {/* Header */}
      <div className="mb-8 space-y-4">
        <h3 className="text-3xl font-playfair font-bold text-gray-800">
          No Adventures Found
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          We couldn&apos;t find any trips matching your current preferences. Try
          adjusting your filters or explore our other amazing destinations!
        </p>
      </div>

      {/* Button */}
      <Button
        onClick={onClearFilters}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Clear All Filters
      </Button>
    </div>
  </div>
);

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      {/* Icon container */}
      <div className="inline-block p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl mb-8 shadow-lg">
        <AlertCircle className="h-16 w-16 text-red-600" />
      </div>

      {/* Header */}
      <div className="mb-8 space-y-4">
        <h3 className="text-3xl font-playfair font-bold text-gray-800">
          Oops! Something went wrong
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed">{error}</p>
      </div>

      {/* Button */}
      <Button
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Try Again
      </Button>
    </div>
  </div>
);

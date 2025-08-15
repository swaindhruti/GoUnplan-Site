import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

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
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <div className="text-center py-16">
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
            We couldn&apos;t find any trips matching your current preferences. Try
            adjusting your filters or explore our other amazing destinations!
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
);

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
          <p className="text-gray-600 font-instrument leading-relaxed">{error}</p>
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

import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        className="group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl animate-pulse"
      >
        {/* Image skeleton */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-purple-200 p-2 rounded-xl w-10 h-10"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-pink-200 p-2 rounded-xl w-10 h-10"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-blue-200 px-3 py-1.5 rounded-full w-20 h-8"></div>
            <div className="bg-green-200 px-3 py-1.5 rounded-full w-16 h-8"></div>
            <div className="bg-orange-200 px-3 py-1.5 rounded-full w-18 h-8"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="p-6 pt-0">
          <div className="w-full h-14 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl"></div>
        </div>
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

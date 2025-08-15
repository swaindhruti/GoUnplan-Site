import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-white/20 rounded-full mb-4"></div>
            <div className="h-12 w-96 bg-white/20 rounded-lg mb-4"></div>
            <div className="h-6 w-80 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 font-bricolage">
                  Loading Your Trips
                </h2>
                <p className="text-gray-600 font-instrument">
                  Please wait while we fetch your travel history...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          {/* Filter Section Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

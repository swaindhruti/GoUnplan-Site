import {
  TravelLoader,
  CompassLoader,
  MapLoader,
  MountainLoader,
  BeachLoader,
  SuitcaseLoader,
} from "@/components/ui/travel-loader";

export default function TripsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <TravelLoader size="xl" className="text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-playfair">
              Discover Amazing Trips
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Loading incredible travel experiences...
            </p>
            <div className="flex justify-center gap-4">
              <CompassLoader size="lg" className="text-white" />
              <MapLoader size="lg" className="text-white" />
              <MountainLoader size="lg" className="text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <MapLoader size="lg" />
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                Finding Your Perfect Trip
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-slate-200 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-slate-200 animate-pulse relative">
                <div className="absolute top-4 right-4">
                  <BeachLoader size="sm" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MountainLoader size="sm" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                </div>

                <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse mb-4"></div>

                <div className="space-y-3 mb-6">
                  <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-4/6 animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SuitcaseLoader size="sm" />
                    <div className="h-5 bg-slate-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <TravelLoader size="lg" />
            <span className="text-lg font-semibold text-gray-700">
              Loading more amazing trips...
            </span>
          </div>
          <div className="flex justify-center gap-2">
            <CompassLoader size="md" />
            <MapLoader size="md" />
            <MountainLoader size="md" />
            <BeachLoader size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  TravelLoader,
  CompassLoader,
  MapLoader,
  MountainLoader,
  BeachLoader,
} from "@/components/ui/travel-loader";

export default function TripDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mt-8">
            <div className="flex justify-center mb-8">
              <TravelLoader size="xl" className="text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 font-playfair">
              Loading Trip Details
            </h1>
            <p className="text-2xl md:text-3xl text-white font-roboto mb-12">
              Preparing your adventure...
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-16">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl px-8 py-4 text-white font-semibold shadow-2xl"
                >
                  <div className="flex items-center gap-2">
                    <CompassLoader size="sm" className="text-white" />
                    <span>Loading...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Highlights Section */}
        <section className="mb-20">
          <div className="flex items-center gap-6 mb-16">
            <MountainLoader size="lg" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-playfair">
              Trip Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl"
              >
                <div className="space-y-8">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-start gap-6">
                      <BeachLoader size="md" />
                      <div className="h-6 bg-slate-200 rounded w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs Section */}
        <div className="mb-20">
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl overflow-hidden">
            {/* Tab Headers */}
            <div className="w-full grid grid-cols-3 bg-gradient-to-r from-slate-100/90 to-slate-200/90 border-b border-slate-200/60 p-0 h-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="py-8 px-6 font-semibold text-gray-700 font-roboto flex items-center gap-3 text-lg"
                >
                  <MapLoader size="md" />
                  <span>Loading...</span>
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-12">
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg"
                  >
                    <div className="flex gap-8">
                      <TravelLoader size="lg" />
                      <div className="flex-1">
                        <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse mb-6"></div>
                        <div className="h-4 bg-slate-200 rounded w-full animate-pulse mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="h-20 bg-slate-200 rounded-2xl animate-pulse"></div>
                          <div className="h-20 bg-slate-200 rounded-2xl animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Booking Card */}
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl">
            <div className="flex items-center gap-8 mb-10">
              <CompassLoader size="lg" />
              <div>
                <div className="h-12 bg-slate-200 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-8 mb-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-6">
                  <MountainLoader size="md" />
                  <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
          </div>

          {/* Host Card */}
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl">
            <div className="flex items-center gap-6 border-b border-slate-200/60 pb-8 mb-10">
              <BeachLoader size="lg" />
              <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                About Your Host
              </h3>
            </div>

            <div className="flex gap-8 items-center mb-10">
              <TravelLoader size="xl" />
              <div>
                <div className="h-8 bg-slate-200 rounded w-32 animate-pulse mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-20 animate-pulse mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-28 animate-pulse"></div>
              </div>
            </div>

            <div className="h-20 bg-slate-200 rounded-2xl animate-pulse mb-10"></div>

            <div className="h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

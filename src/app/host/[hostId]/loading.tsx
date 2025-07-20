import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  TravelLoader,
  CompassLoader,
  MapLoader,
  SuitcaseLoader,
  MountainLoader,
  BeachLoader,
} from "@/components/ui/travel-loader";

export default function HostProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mt-8">
            <div className="flex justify-center mb-8">
              <TravelLoader size="xl" className="text-white" />
            </div>

            <div className="flex items-center justify-center gap-6 mb-8">
              <CompassLoader size="lg" className="text-white" />
              <MapLoader size="lg" className="text-white" />
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white"
                >
                  <div className="flex items-center gap-2">
                    <SuitcaseLoader size="sm" className="text-white" />
                    <span className="font-semibold">Loading...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Host Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <CompassLoader size="md" />
                  <span className="text-2xl font-bold text-gray-900 font-playfair">
                    About the Host
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapLoader size="sm" />
                      <span className="font-semibold text-gray-900">
                        Loading...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Trips and Reviews */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Trips */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <TravelLoader size="lg" />
                <span className="text-3xl font-bold text-gray-900 font-playfair">
                  Active Trips
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MountainLoader size="sm" />
                            <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                          </div>
                          <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                        <div className="h-6 w-16 bg-green-200 rounded animate-pulse"></div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <SuitcaseLoader size="sm" />
                          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CompassLoader size="sm" />
                          <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapLoader size="sm" />
                          <div className="h-6 bg-slate-200 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                      </div>

                      <div className="h-10 bg-slate-200 rounded-xl animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <BeachLoader size="lg" />
                <span className="text-3xl font-bold text-gray-900 font-playfair">
                  Recent Reviews
                </span>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <TravelLoader size="md" />

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="h-5 bg-slate-200 rounded w-32 animate-pulse"></div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, j) => (
                                <div
                                  key={j}
                                  className="h-4 w-4 bg-slate-200 rounded animate-pulse"
                                ></div>
                              ))}
                            </div>
                          </div>

                          <div className="h-4 bg-slate-200 rounded w-48 animate-pulse mb-3"></div>

                          <div className="h-16 bg-slate-200 rounded-xl animate-pulse"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

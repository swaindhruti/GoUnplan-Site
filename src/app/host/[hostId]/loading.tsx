import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HostProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mt-8">
            <div className="flex justify-center mb-8">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>

            <Skeleton className="h-12 w-64 mx-auto mb-4" />

            <div className="flex items-center justify-center gap-6 mb-8">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-32 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Host Details Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl">
              <CardHeader className="pb-6">
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-6 w-32 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Trips and Reviews Skeleton */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Trips Skeleton */}
            <div>
              <Skeleton className="h-10 w-64 mb-8" />

              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-3" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>

                      <Skeleton className="h-10 w-full rounded-xl" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Reviews Skeleton */}
            <div>
              <Skeleton className="h-10 w-64 mb-8" />

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>

                          <Skeleton className="h-4 w-48 mb-3" />

                          <Skeleton className="h-16 w-full rounded-xl" />
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

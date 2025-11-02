import { TravelLoader, CompassLoader, MapLoader } from '@/components/ui/travel-loader';

export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <TravelLoader size="xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-playfair">
            Loading Chat
          </h1>
          <p className="text-xl text-gray-600 mb-8">Connecting you with amazing hosts...</p>
          <div className="flex justify-center gap-4 mb-12">
            <CompassLoader size="lg" />
            <MapLoader size="lg" />
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg">
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/60 rounded-xl">
                    <TravelLoader size="md" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

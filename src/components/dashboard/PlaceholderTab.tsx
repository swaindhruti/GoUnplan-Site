import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export function PlaceholderTab() {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 border-b border-gray-200 flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            Explore More Trips
          </h3>
          <p className="text-purple-100 font-medium">
            Discover new adventures and book your next journey
          </p>
        </div>
      </div>
      {/* CTA Content */}
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-2xl mb-6 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Ready to Explore?
        </h3>
        <p className="text-gray-600 font-medium text-center max-w-md mb-8">
          Browse our curated selection of trips and find your perfect getaway.
          New destinations and experiences await!
        </p>
        <Button
          onClick={() => router.push("/trips")}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-3 shadow-lg rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all text-lg"
          size="lg"
        >
          Explore Trips
        </Button>
      </div>
    </div>
  );
}

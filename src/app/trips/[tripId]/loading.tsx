import { Map } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

export default function TripPageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] py-16">
      <div className="animate-bounce bg-yellow-300 border-4 border-black rounded-lg h-20 w-20 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-6">
        <Map className="h-10 w-10 text-black" />
      </div>
      <span className="text-2xl font-bold text-black ">
        Loading your trip details...
      </span>
    </div>
  );
}

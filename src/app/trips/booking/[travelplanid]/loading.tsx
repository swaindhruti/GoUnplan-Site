// import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function BookingPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="animate-spin bg-green-500 border-4 border-black rounded-full h-20 w-20 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-6">
          <Loader2 className="h-10 w-10 text-black" />
        </div>
        <p className="text-2xl font-bold text-black ">
          Redirecting to booking page...
        </p>
      </div>
    </div>
  );
}

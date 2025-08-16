import { Loader2 } from "lucide-react";

export default function TripDetailLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader2
        className="h-12 w-12 text-purple-600 animate-spin"
        aria-label="Loading"
      />
    </div>
  );
}

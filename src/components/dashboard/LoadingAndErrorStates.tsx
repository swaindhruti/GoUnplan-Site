import { User, AlertCircle } from "lucide-react";

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
}

export function LoadingAndErrorStates({ loading, error }: LoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-bounce bg-yellow-300 border-3 border-black rounded-lg h-16 w-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
          <User className="h-8 w-8 text-black" />
        </div>
        <span className="ml-3 text-xl font-black">
          Loading your dashboard...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-red-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <AlertCircle className="h-10 w-10 text-black" />
          </div>
          <p className="mt-2 text-xl font-black text-black">Error: {error}</p>
        </div>
      </div>
    );
  }

  return null;
}

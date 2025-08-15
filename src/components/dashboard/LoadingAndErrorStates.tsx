import { AlertCircle } from "lucide-react";

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
}

export function LoadingAndErrorStates({ loading, error }: LoadingStateProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-instrument">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-instrument">Error: {error}</p>
        </div>
      </div>
    );
  }

  return null;
}

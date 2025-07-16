import { User, AlertCircle } from "lucide-react";

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
}

export function LoadingAndErrorStates({ loading, error }: LoadingStateProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
            <User className="h-12 w-12 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            Loading your dashboard...
          </p>
          <div className="w-32 h-2 bg-slate-200 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            Error: {error}
          </p>
          <p className="text-gray-600 font-medium">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

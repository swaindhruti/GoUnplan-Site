import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
    {Array.from({ length: 6 }, (_, i) => (
      <Card
        key={i}
        className="overflow-hidden border border-purple-300 bg-white shadow-md animate-pulse"
      >
        {/* Image skeleton */}
        <div className="h-40 bg-purple-100 border-b border-purple-200"></div>

        <CardHeader className="p-3">
          <div className="space-y-2">
            <div className="h-4 bg-purple-200 rounded-sm"></div>
            <div className="h-3 w-3/4 bg-purple-100 rounded-sm"></div>
          </div>
        </CardHeader>

        <CardContent className="p-3 space-y-2">
          <div className="h-3 bg-purple-100 rounded-sm"></div>
          <div className="h-3 w-5/6 bg-purple-100 rounded-sm"></div>
          <div className="h-3 w-2/3 bg-purple-100 rounded-sm"></div>

          {/* Price skeleton */}
          <div className="flex items-center gap-2 pt-2">
            <div className="h-5 w-14 bg-purple-200 rounded-sm"></div>
            <div className="h-3 w-10 bg-purple-100 rounded-sm"></div>
          </div>
        </CardContent>

        <CardFooter className="p-3 border-t border-purple-100">
          <div className="w-full h-8 bg-purple-200 rounded-md"></div>
        </CardFooter>
      </Card>
    ))}
  </div>
);

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => (
  <div className="text-center py-12 bg-white border border-purple-300 shadow-md px-6">
    {/* Icon container */}
    <div className="inline-block p-4 bg-purple-100 rounded-full mb-6">
      <Compass className="h-10 w-10 text-purple-600" strokeWidth={2} />
    </div>

    {/* Header */}
    <div className="mb-6 space-y-3">
      <h3 className="text-xl font-bold text-purple-800">No Trips Found</h3>
      <div className="max-w-md mx-auto">
        <p className="text-sm text-purple-700">
          We couldn&apos;t find any trips matching your current filter settings.
          Try adjusting your criteria or check back soon for new adventures!
        </p>
      </div>
    </div>

    {/* Button */}
    <Button
      onClick={onClearFilters}
      className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2"
    >
      Clear All Filters
    </Button>
  </div>
);

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
  <div className="mb-6">
    <Alert className="bg-white border border-purple-300 shadow-md p-3">
      <div className="flex items-start gap-3">
        <div className="bg-purple-100 p-1 rounded-full">
          <AlertCircle className="h-5 w-5 text-purple-600" strokeWidth={2} />
        </div>

        <div className="flex-1">
          <AlertDescription className="text-purple-800 text-sm">
            {error}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  </div>
);

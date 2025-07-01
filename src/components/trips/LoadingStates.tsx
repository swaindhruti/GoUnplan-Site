import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
    {Array.from({ length: 6 }, (_, i) => (
      <Card
        key={i}
        className="overflow-hidden border border-purple-100 animate-pulse"
      >
        <div className="h-48 bg-purple-100" />
        <CardHeader>
          <Skeleton className="h-4 w-3/4 bg-purple-200 rounded" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-3 w-full bg-purple-100 rounded" />
          <Skeleton className="h-3 w-5/6 bg-purple-100 rounded" />
          <Skeleton className="h-3 w-2/3 bg-purple-100 rounded" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full bg-purple-200 rounded-md" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => (
  <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-purple-100 px-4">
    <Compass className="h-16 w-16 text-purple-300 mx-auto mb-4" />
    <h3 className="text-xl font-medium text-purple-900 mb-2">
      No travel plans match your filters
    </h3>
    <p className="text-purple-600 mb-6 max-w-md mx-auto">
      We couldn&apos;t find any trips with your current filter settings. Try
      adjusting your criteria or check back soon for new adventures!
    </p>
    <Button
      onClick={onClearFilters}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      Clear All Filters
    </Button>
  </div>
);

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
  <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
);

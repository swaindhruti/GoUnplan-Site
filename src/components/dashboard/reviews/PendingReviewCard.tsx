import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { PendingReview, ReviewFormState } from "@/types/dashboard";
import { formatDateRange } from "@/utils/dateUtils";

interface PendingReviewCardProps {
  booking: PendingReview;
  setReviewForm: React.Dispatch<React.SetStateAction<ReviewFormState>>;
}

export function PendingReviewCard({
  booking,
  setReviewForm,
}: PendingReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 font-bricolage">
          {booking.travelPlan.title}
        </h3>
        <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-instrument">
          {formatDateRange(booking.startDate, booking.endDate)}
        </span>
      </div>
      <p className="text-gray-600 font-instrument mb-4">
        {booking.travelPlan.destination}
      </p>
      <p className="text-sm text-gray-600 font-instrument mb-6">
        Hosted by{" "}
        <span className="font-semibold text-gray-900">
          {booking.travelPlan.host.user.name}
        </span>
      </p>
      <Button
        onClick={() =>
          setReviewForm((prev) => ({
            ...prev,
            bookingId: booking.id,
          }))
        }
        className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
      >
        Write Review <Star className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

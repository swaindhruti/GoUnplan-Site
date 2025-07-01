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
    <div className="border-3 border-black rounded-lg p-5 bg-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-black text-black">
          {booking.travelPlan.title}
        </h3>
        <span className="text-sm font-bold bg-white border-2 border-black px-2 py-1 rounded-md text-black">
          {formatDateRange(booking.startDate, booking.endDate)}
        </span>
      </div>
      <p className="text-black font-bold mb-4">
        {booking.travelPlan.destination}
      </p>
      <p className="text-sm font-bold text-black mb-4">
        Hosted by{" "}
        <span className="font-extrabold">
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
        className="bg-yellow-300 text-black hover:bg-yellow-400 border-3 border-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        Write Review <Star className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

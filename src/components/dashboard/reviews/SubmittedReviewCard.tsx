import { Star } from "lucide-react";
import { Review } from "@/types/dashboard";
import { formatDateRange } from "@/utils/dateUtils";

interface SubmittedReviewCardProps {
  review: Review;
}

export function SubmittedReviewCard({ review }: SubmittedReviewCardProps) {
  return (
    <div className="border-3 border-black rounded-lg p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-black text-black">
          {review.travelPlan.title}
        </h3>
        <span className="text-sm bg-gray-100 border-2 border-black px-2 py-1 rounded-md text-black font-bold">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm font-bold text-gray-700 mb-2">
        {review.travelPlan.destination}
      </p>

      <div className="flex items-center mb-3">
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= review.rating
                  ? "text-yellow-300 fill-yellow-300 stroke-black"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-extrabold bg-yellow-300 border-2 border-black px-2 py-0.5 rounded-md">
          {review.rating}/5
        </span>
      </div>

      {review.comment && (
        <div className="bg-blue-400 rounded-md border-2 border-black p-3 mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-black font-bold italic">
            &quot;{review.comment}&quot;
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-700 font-bold">
        <div className="flex items-center">
          <p>
            Host:{" "}
            <span className="font-extrabold">
              {review.travelPlan.host.user.name}
            </span>
          </p>
        </div>
        <span>
          Trip date:{" "}
          {formatDateRange(review.booking.startDate, review.booking.endDate)}
        </span>
      </div>
    </div>
  );
}

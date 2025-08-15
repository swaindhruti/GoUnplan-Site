import { Star } from "lucide-react";
import { Review } from "@/types/dashboard";
import { formatDateRange } from "@/utils/dateUtils";

interface SubmittedReviewCardProps {
  review: Review;
}

export function SubmittedReviewCard({ review }: SubmittedReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 font-bricolage">
          {review.travelPlan.title}
        </h3>
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-instrument font-semibold">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-gray-600 font-instrument mb-4">
        {review.travelPlan.destination}
      </p>

      <div className="flex items-center mb-4">
        <div className="flex mr-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-900 font-instrument">
          {review.rating}/5
        </span>
      </div>

      {review.comment && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <p className="text-gray-700 font-instrument italic">
            &quot;{review.comment}&quot;
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600 font-instrument">
        <div className="flex items-center">
          <p>
            Host:{" "}
            <span className="font-semibold text-gray-900">
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

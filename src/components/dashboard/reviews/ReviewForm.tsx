import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, AlertCircle } from "lucide-react";
import { ReviewFormState } from "@/types/dashboard";

interface ReviewFormProps {
  reviewForm: ReviewFormState;
  setReviewForm: React.Dispatch<React.SetStateAction<ReviewFormState>>;
  handleSubmitReview: (e: React.FormEvent) => void;
}

export function ReviewForm({
  reviewForm,
  setReviewForm,
  handleSubmitReview,
}: ReviewFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 font-bricolage">Write Your Review</h3>
        <Button
          variant="outline"
          size="sm"
          className="font-instrument font-semibold border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-full"
          onClick={() => setReviewForm((prev) => ({ ...prev, bookingId: "" }))}
        >
          Cancel
        </Button>
      </div>

      {reviewForm.success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center mb-4 border border-green-200 font-instrument">
          <ThumbsUp className="h-4 w-4 mr-2" />
          <span>{reviewForm.success}</span>
        </div>
      )}

      {reviewForm.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center mb-4 border border-red-200 font-instrument">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{reviewForm.error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitReview}>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 font-instrument">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setReviewForm((prev) => ({
                    ...prev,
                    rating: star,
                  }))
                }
                className="focus:outline-none transition-colors duration-200 hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= reviewForm.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-gray-700 mb-2 font-instrument"
          >
            Your Review
          </label>
          <Textarea
            id="comment"
            placeholder="Share your experience with this trip..."
            rows={4}
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
            required
            className="w-full font-instrument"
          />
        </div>

        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white w-full font-instrument font-semibold py-3 rounded-full transition-colors duration-200"
          disabled={reviewForm.isSubmitting}
        >
          {reviewForm.isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}

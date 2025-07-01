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
    <div className="bg-white border-3 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-black text-black">Write Your Review</h3>
        <Button
          variant="ghost"
          size="sm"
          className="font-bold bg-gray-200 border-2 border-black text-black hover:bg-gray-300"
          onClick={() => setReviewForm((prev) => ({ ...prev, bookingId: "" }))}
        >
          Cancel
        </Button>
      </div>

      {reviewForm.success && (
        <div className="bg-green-500 text-black p-3 rounded-md flex items-center mb-4 border-2 border-black font-extrabold">
          <ThumbsUp className="h-5 w-5 mr-2" />
          <span>{reviewForm.success}</span>
        </div>
      )}

      {reviewForm.error && (
        <div className="bg-red-400 text-black p-3 rounded-md flex items-center mb-4 border-2 border-black font-extrabold">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{reviewForm.error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitReview}>
        <div className="mb-4">
          <label className="block text-sm font-extrabold text-black mb-1 uppercase">
            Rating
          </label>
          <div className="flex space-x-2">
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
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= reviewForm.rating
                      ? "text-yellow-300 fill-yellow-300 stroke-black"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-extrabold text-black mb-1 uppercase"
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
            className="w-full border-3 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gray-100"
          />
        </div>

        <Button
          type="submit"
          className="bg-green-500 text-black hover:bg-green-400 w-full border-3 border-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          disabled={reviewForm.isSubmitting}
        >
          {reviewForm.isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { PendingReviewCard } from "./PendingReviewCard";
import { SubmittedReviewCard } from "./SubmittedReviewCard";
import {
  PendingReview,
  Review,
  ReviewFormState,
  ReviewStats,
} from "@/types/dashboard";

interface ReviewsTabProps {
  pendingReviews: PendingReview[];
  userReviews: Review[];
  reviewStats: ReviewStats;
  reviewForm: ReviewFormState;
  setReviewForm: React.Dispatch<React.SetStateAction<ReviewFormState>>;
  handleSubmitReview: (e: React.FormEvent) => void;
}

export function ReviewsTab({
  pendingReviews,
  userReviews,
  reviewStats,
  reviewForm,
  setReviewForm,
  handleSubmitReview,
}: ReviewsTabProps) {
  return (
    <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
      <div className="border-b-4 border-black bg-pink-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-black uppercase">
              Trip Reviews
            </h3>
            <p className="text-sm font-bold text-black">
              Share your experiences and see your past reviews
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6 bg-yellow-300 p-1 border-3 border-black rounded-lg">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-extrabold"
            >
              Pending Reviews
              {pendingReviews.length > 0 && (
                <span className="ml-2 bg-red-400 text-black border-2 border-black text-xs rounded-full px-2 py-1 font-extrabold">
                  {pendingReviews.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="submitted"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-extrabold"
            >
              My Reviews
              {reviewStats.count > 0 && (
                <span className="ml-2 bg-purple-400 text-black border-2 border-black text-xs rounded-full px-2 py-1 font-extrabold">
                  {reviewStats.count}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Pending Reviews Tab */}
          <TabsContent value="pending">
            {reviewForm.bookingId ? (
              <ReviewForm
                reviewForm={reviewForm}
                setReviewForm={setReviewForm}
                handleSubmitReview={handleSubmitReview}
              />
            ) : pendingReviews.length > 0 ? (
              <div className="grid gap-6">
                {pendingReviews.map((booking) => (
                  <PendingReviewCard
                    key={booking.id}
                    booking={booking}
                    setReviewForm={setReviewForm}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-20 w-20 bg-yellow-300 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <Star className="h-10 w-10 text-black" />
                </div>
                <p className="mt-2 text-xl font-black text-black">
                  You don&apos;t have any trips to review right now.
                </p>
                <p className="text-gray-700 font-bold">
                  Completed trips will appear here for you to review.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Submitted Reviews Tab */}
          <TabsContent value="submitted">
            {userReviews.length > 0 ? (
              <div>
                <div className="bg-purple-400 border-3 border-black rounded-lg p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                  <div>
                    <p className="text-black font-extrabold">
                      Your Review Stats
                    </p>
                    <p className="text-black font-bold text-sm">
                      You&apos;ve reviewed {reviewStats.count} trips with an
                      average rating of{" "}
                      <span className="font-black">
                        {reviewStats.averageRating}
                      </span>
                      /5
                    </p>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(reviewStats.averageRating)
                            ? "text-yellow-300 fill-yellow-300 stroke-black"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid gap-6">
                  {userReviews.map((review) => (
                    <SubmittedReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-20 w-20 bg-purple-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <Star className="h-10 w-10 text-black" />
                </div>
                <p className="mt-2 text-xl font-black text-black">
                  You haven&apos;t submitted any reviews yet.
                </p>
                <p className="text-gray-700 font-bold">
                  After completing a trip, you can share your experience here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

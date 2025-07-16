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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trip Reviews
            </h3>
            <p className="text-gray-600 font-medium">
              Share your experiences and see your past reviews
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-8 bg-gray-100 p-2 rounded-xl">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white font-semibold rounded-lg transition-all duration-300"
            >
              Pending Reviews
              {pendingReviews.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs rounded-full px-3 py-1 font-semibold">
                  {pendingReviews.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="submitted"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white font-semibold rounded-lg transition-all duration-300"
            >
              My Reviews
              {reviewStats.count > 0 && (
                <span className="ml-2 bg-slate-100 text-slate-800 text-xs rounded-full px-3 py-1 font-semibold">
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
              <div className="text-center py-16">
                <div className="mx-auto h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="h-12 w-12 text-slate-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  You don&apos;t have any trips to review right now.
                </p>
                <p className="text-gray-600 font-medium">
                  Completed trips will appear here for you to review.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Submitted Reviews Tab */}
          <TabsContent value="submitted">
            {userReviews.length > 0 ? (
              <div>
                <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg mb-2 text-gray-900">
                        Your Review Stats
                      </p>
                      <p className="text-gray-600 font-medium">
                        You&apos;ve reviewed {reviewStats.count} trips with an
                        average rating of{" "}
                        <span className="font-semibold text-slate-700">
                          {reviewStats.averageRating}
                        </span>
                        /5
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= Math.round(reviewStats.averageRating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {userReviews.map((review) => (
                    <SubmittedReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="h-12 w-12 text-slate-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  You haven&apos;t submitted any reviews yet.
                </p>
                <p className="text-gray-600 font-medium">
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

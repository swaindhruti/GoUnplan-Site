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
    <>
      {/* Flat Header */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Trip Reviews</h3>
        <p className="text-gray-600 font-medium text-lg">
          Share your experiences and see your past reviews
        </p>
      </div>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6 bg-white h-20 rounded-xl flex gap-6 shadow border border-gray-200 items-center px-4">
          <TabsTrigger
            value="pending"
            className="relative text-base font-bold px-8 py-4 rounded-xl transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600
              data-[state=active]:text-white data-[state=active]:shadow-lg
              data-[state=active]:border-2 data-[state=active]:border-purple-400
              data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:left-1/2 data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:bottom-0 data-[state=active]:after:w-2/3 data-[state=active]:after:h-1.5 data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-purple-400 data-[state=active]:after:to-blue-400 data-[state=active]:after:rounded-full data-[state=active]:after:block
              focus:outline-none"
          >
            Pending Reviews
            {pendingReviews.length > 0 && (
              <span className="ml-3 bg-red-100 text-red-800 text-sm rounded-full px-4 py-1 font-bold">
                {pendingReviews.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="submitted"
            className="relative text-base font-bold px-8 py-4 rounded-xl transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600
              data-[state=active]:text-white data-[state=active]:shadow-lg
              data-[state=active]:border-2 data-[state=active]:border-purple-400
              data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:left-1/2 data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:bottom-0 data-[state=active]:after:w-2/3 data-[state=active]:after:h-1.5 data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-purple-400 data-[state=active]:after:to-blue-400 data-[state=active]:after:rounded-full data-[state=active]:after:block
              focus:outline-none"
          >
            My Reviews
            {reviewStats.count > 0 && (
              <span className="ml-3 bg-slate-100 text-slate-800 text-sm rounded-full px-4 py-1 font-bold">
                {reviewStats.count}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        {/* Tab Content Area */}
        <div className="bg-white rounded-2xl shadow p-8 border border-gray-200">
          {/* Pending Reviews Tab */}
          <TabsContent value="pending">
            {reviewForm.bookingId ? (
              <ReviewForm
                reviewForm={reviewForm}
                setReviewForm={setReviewForm}
                handleSubmitReview={handleSubmitReview}
              />
            ) : pendingReviews.length > 0 ? (
              <div className="grid gap-8">
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
                <div className="mx-auto h-24 w-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <Star className="h-12 w-12 text-white" />
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
          {/* My Reviews Tab */}
          <TabsContent value="submitted">
            {userReviews.length > 0 ? (
              <div>
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 mb-8 border border-slate-200/50">
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
                <div className="grid gap-8">
                  {userReviews.map((review) => (
                    <SubmittedReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-24 w-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <Star className="h-12 w-12 text-white" />
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
        </div>
      </Tabs>
    </>
  );
}

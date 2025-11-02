import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { PendingReviewCard } from './PendingReviewCard';
import { SubmittedReviewCard } from './SubmittedReviewCard';
import { PendingReview, Review, ReviewFormState, ReviewStats } from '@/types/dashboard';

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
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1 font-bricolage">Trip Reviews</h3>
        <p className="text-gray-600 font-instrument mt-1">
          Share your experiences and see your past reviews
        </p>
      </div>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6 bg-gray-50 h-14 rounded-full flex gap-2 border border-gray-200 p-2">
          <TabsTrigger
            value="pending"
            className="px-6 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200
              data-[state=active]:bg-purple-600 data-[state=active]:text-white
              data-[state=active]:shadow-sm text-gray-600
              focus:outline-none"
          >
            Pending Reviews
            {pendingReviews.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 text-xs rounded-full px-2 py-1 font-semibold">
                {pendingReviews.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="submitted"
            className="px-6 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200
              data-[state=active]:bg-purple-600 data-[state=active]:text-white
              data-[state=active]:shadow-sm text-gray-600
              focus:outline-none"
          >
            My Reviews
            {reviewStats.count > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1 font-semibold">
                {reviewStats.count}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        {/* Tab Content Area */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
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
                {pendingReviews.map(booking => (
                  <PendingReviewCard
                    key={booking.id}
                    booking={booking}
                    setReviewForm={setReviewForm}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Star className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-bricolage">
                  No trips to review
                </h3>
                <p className="text-gray-600 font-instrument">
                  Completed trips will appear here for you to review.
                </p>
              </div>
            )}
          </TabsContent>
          {/* My Reviews Tab */}
          <TabsContent value="submitted">
            {userReviews.length > 0 ? (
              <div>
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg mb-2 text-gray-900 font-bricolage">
                        Your Review Stats
                      </p>
                      <p className="text-gray-600 font-instrument">
                        You&apos;ve reviewed {reviewStats.count} trips with an average rating of{' '}
                        <span className="font-semibold text-gray-900">
                          {reviewStats.averageRating}
                        </span>
                        /5
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= Math.round(reviewStats.averageRating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-8">
                  {userReviews.map(review => (
                    <SubmittedReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Star className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-bricolage">
                  No reviews yet
                </h3>
                <p className="text-gray-600 font-instrument">
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

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserProfile, getUserBookings } from "@/actions/user/action";
import {
  getPendingReviewBookings,
  getUserReviews,
  submitReview,
} from "@/actions/reviews/action";
import {
  UserProfile,
  Booking,
  Review,
  PendingReview,
  ReviewFormState,
  ReviewStats,
} from "@/types/dashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NavigationTabs } from "@/components/dashboard/NavigationTabs";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { BookingsTab } from "@/components/dashboard/BookingsTab";
import { ReviewsTab } from "@/components/dashboard/reviews/ReviewsTab";
import { MessagesTab } from "@/components/dashboard/MessagesTab";
import { LoadingAndErrorStates } from "@/components/dashboard/LoadingAndErrorStates";

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    count: 0,
    averageRating: 0,
  });
  const [reviewForm, setReviewForm] = useState<ReviewFormState>({
    bookingId: "",
    rating: 5,
    comment: "",
    isSubmitting: false,
    success: null,
    error: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [bookingFilter, setBookingFilter] = useState("all");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (session?.user?.email) {
          // Fetch user profile
          const profileResponse = await getUserProfile(session.user.email);
          if (profileResponse.error) {
            setError(profileResponse.error);
            return;
          }

          if (!profileResponse.user) {
            setError("User profile not found");
            return;
          }

          setProfile(profileResponse.user || null);

          // Fetch bookings
          const bookingsResponse = await getUserBookings(
            profileResponse.user.id
          );
          if (bookingsResponse.error) {
            setError(bookingsResponse.error);
            return;
          }
          setBookings(bookingsResponse.bookings || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  // Fetch review data when active tab changes
  useEffect(() => {
    const fetchReviewData = async () => {
      if (activeTab === "reviews" && profile?.id) {
        try {
          // Fetch reviews user has already submitted
          const userReviewsRes = await getUserReviews(profile.id);
          if (userReviewsRes.success && userReviewsRes.reviews) {
            setUserReviews(userReviewsRes.reviews || []);
            setReviewStats({
              count: userReviewsRes.count || 0,
              averageRating: userReviewsRes.averageRating || 0,
            });
          }

          // Fetch trips that need reviewing
          const pendingReviewsRes = await getPendingReviewBookings(profile.id);
          if (pendingReviewsRes.success) {
            setPendingReviews(pendingReviewsRes.bookings || []);
          }
        } catch (err) {
          console.error("Failed to load review data:", err);
        }
      }
    };

    fetchReviewData();
  }, [activeTab, profile?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewForm((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
      success: null,
    }));
    try {
      if (!profile?.id) throw new Error("User not found");
      const res = await submitReview({
        userId: profile.id,
        bookingId: reviewForm.bookingId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      if (res.success) {
        setReviewForm({
          bookingId: "",
          rating: 5,
          comment: "",
          isSubmitting: false,
          success: "Review submitted successfully!",
          error: null,
        });
        // Refresh reviews and pending reviews
        if (profile.id) {
          const userReviewsRes = await getUserReviews(profile.id);
          if (userReviewsRes.success && userReviewsRes.reviews) {
            setUserReviews(userReviewsRes.reviews || []);
            setReviewStats({
              count: userReviewsRes.count || 0,
              averageRating: userReviewsRes.averageRating || 0,
            });
          }
          const pendingReviewsRes = await getPendingReviewBookings(profile.id);
          if (pendingReviewsRes.success) {
            setPendingReviews(pendingReviewsRes.bookings || []);
          }
        }
      } else {
        setReviewForm((prev) => ({
          ...prev,
          isSubmitting: false,
          error: res.message || "Failed to submit review",
        }));
      }
    } catch (err: unknown) {
      let errorMsg = "Failed to submit review";
      if (err && typeof err === "object" && "message" in err) {
        const maybeError = err as { message?: unknown };
        if (typeof maybeError.message === "string") {
          errorMsg = maybeError.message;
        }
      }
      setReviewForm((prev) => ({
        ...prev,
        isSubmitting: false,
        error: errorMsg,
      }));
    }
  };

  // Render loading or error states
  if (loading || error) {
    return <LoadingAndErrorStates loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header */}
      <DashboardHeader profile={profile} />

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <StatsCards profile={profile} bookings={bookings} />

        {/* Tabbed Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {activeTab === "profile" && (
            <ProfileTab
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsTab
              bookings={bookings}
              bookingFilter={bookingFilter}
              setBookingFilter={setBookingFilter}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsTab
              pendingReviews={pendingReviews}
              userReviews={userReviews}
              reviewStats={reviewStats}
              reviewForm={reviewForm}
              setReviewForm={setReviewForm}
              handleSubmitReview={handleSubmitReview}
            />
          )}
          {activeTab === "messages" && profile && (
            <MessagesTab userId={profile.id} />
          )}
        </div>
      </div>
    </div>
  );
}

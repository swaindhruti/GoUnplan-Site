"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserProfile, getUserBookings } from "@/actions/user/action";
import {
  getPendingReviewBookings,
  getUserReviews,
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
import { PlaceholderTab } from "@/components/dashboard/PlaceholderTab";
import { LoadingAndErrorStates } from "@/components/dashboard/LoadingAndErrorStates";

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Review submitted:", reviewForm);
    // Implementation of the review submission logic would go here
  };

  // Render loading or error states
  if (loading || error) {
    return <LoadingAndErrorStates loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader profile={profile} />

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <StatsCards profile={profile} bookings={bookings} />

        {/* Tabbed Content */}
        {activeTab === "profile" && (
          <ProfileTab profile={profile} setActiveTab={setActiveTab} />
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

        {(activeTab === "explore" ||
          activeTab === "messages" ||
          activeTab === "settings") && (
          <PlaceholderTab setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}

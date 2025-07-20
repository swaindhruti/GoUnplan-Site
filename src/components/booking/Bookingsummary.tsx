"use client";
import React, { useCallback } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  User,
  MapPin,
  FileText,
  ArrowRight,
  Edit2,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { BookingData, TravelPlan } from "@/types/booking";
import { editBookingAction } from "@/actions/booking/actions";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/global/buttons";

export interface BookingSummaryProps {
  booking: BookingData | null;
  travelPlan: Partial<TravelPlan> | null;
  onEditDetails?: () => void;
  onContinueToPayment?: () => void;
  loading?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = React.memo(
  ({ booking, travelPlan, loading = false }) => {
    const router = useRouter();

    const formatDate = useCallback(
      (dateString: Date | string | undefined | null): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      []
    );

    const formatCurrency = useCallback(
      (amount: number | undefined | null): string => {
        if (!amount) return "₹0";
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);
      },
      []
    );

    const handleEditDetails = useCallback(async () => {
      if (!booking?.id) return;

      try {
        // Use the new edit action
        const response = await editBookingAction(booking.id);
        if (response.success) {
          // Navigate to the booking page using the returned travel plan ID
          router.push(`/trips/booking/${response.travelPlanId}`);
        } else {
          console.error("Failed to update booking:", response.error);
        }
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    }, [booking?.id, router]);

    const getDuration = useCallback((): string => {
      if (!booking?.startDate || !booking?.endDate) return "N/A";
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays}`;
    }, [booking?.startDate, booking?.endDate]);

    const getStatusColor = useCallback((status: string | undefined): string => {
      switch (status) {
        case "CONFIRMED":
          return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
        case "PENDING":
          return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
        case "CANCELLED":
          return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300";
        case "REFUNDED":
          return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300";
        default:
          return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
      }
    }, []);

    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl">
              <div className="animate-pulse space-y-8">
                <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto"></div>
                <div className="space-y-8 mt-12">
                  <div className="h-48 bg-slate-200 rounded-2xl"></div>
                  <div className="h-40 bg-slate-200 rounded-2xl"></div>
                  <div className="h-64 bg-slate-200 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Error state
    if (!booking) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-playfair">
                Booking Not Found
              </h2>
              <p className="text-gray-600 font-roboto text-lg">
                Unable to load booking details.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <BackButton isWhite={true} route="/trips" />
            <div className="text-center mt-8">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl font-playfair">
                Booking Summary
              </h1>
              <p className="text-xl text-white/90 mb-8 font-roboto max-w-3xl mx-auto">
                Please review your booking details before proceeding to payment
              </p>
              <div className="flex justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 text-white font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Booking ID: {booking.id?.slice(0, 8)}...</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 text-white font-semibold">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>{formatCurrency(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trip Header Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-2xl">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-2">
                      {travelPlan?.title || "Travel Package"}
                    </h2>
                    <p className="text-xl text-purple-600 font-semibold font-roboto">
                      {travelPlan?.destination || "Destination"}
                    </p>
                  </div>
                </div>
                {travelPlan?.description && (
                  <p className="text-gray-700 font-roboto leading-relaxed text-lg">
                    {travelPlan.description}
                  </p>
                )}
              </div>

              {/* Trip Details & Pricing Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Trip Details Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                      Trip Details
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                      <span className="text-gray-600 font-medium font-roboto">
                        Check-in:
                      </span>
                      <span className="font-bold text-gray-900 font-roboto text-lg">
                        {formatDate(booking.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                      <span className="text-gray-600 font-medium font-roboto">
                        Check-out:
                      </span>
                      <span className="font-bold text-gray-900 font-roboto text-lg">
                        {formatDate(booking.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                      <span className="text-gray-600 font-medium font-roboto">
                        Duration:
                      </span>
                      <span className="font-bold text-gray-900 font-roboto text-lg">
                        {getDuration()} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                      <span className="text-gray-600 font-medium font-roboto">
                        Participants:
                      </span>
                      <span className="font-bold text-gray-900 font-roboto text-lg">
                        {booking.participants || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <span className="text-gray-600 font-medium font-roboto">
                        Status:
                      </span>
                      <span
                        className={`px-4 py-2 text-sm rounded-full border font-bold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status || "PENDING"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                      Pricing
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                      <span className="text-gray-600 font-medium font-roboto">
                        Price per person:
                      </span>
                      <span className="font-bold text-gray-900 font-roboto text-lg">
                        {formatCurrency(booking.pricePerPerson)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                      <span className="text-gray-600 font-medium font-roboto">
                        Total participants:
                      </span>
                      <span className="font-bold text-gray-900 font-roboto text-lg">
                        {booking.participants || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl px-6">
                      <span className="text-gray-900 font-bold font-roboto text-lg">
                        Total amount:
                      </span>
                      <span className="text-2xl font-bold text-purple-600 font-roboto">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Card */}
              {booking.guests && booking.guests.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                      Team Members ({booking.guests.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {booking.guests.map((member, index) => (
                      <div
                        key={member.memberEmail + index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50/60 rounded-2xl border border-slate-200/60"
                      >
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 font-roboto text-lg">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-gray-600 font-roboto">
                              {member.memberEmail}
                            </p>
                          </div>
                        </div>
                        {member.isteamLead && (
                          <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-bold border border-purple-300">
                            Team Lead
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requirements */}
              {booking.specialRequirements && (
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                      Special Requirements
                    </h3>
                  </div>
                  <p className="text-gray-700 font-roboto leading-relaxed bg-slate-50/60 p-6 rounded-2xl border border-slate-200/60 text-lg">
                    {booking.specialRequirements}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <button
                    onClick={handleEditDetails}
                    className="flex-1 bg-white text-gray-700 font-bold text-lg
                             border border-slate-300 rounded-2xl py-4 px-8
                             hover:bg-slate-50 hover:border-slate-400
                             transition-all duration-300 shadow-lg hover:shadow-xl
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-3 font-montserrat"
                    disabled={loading}
                    type="button"
                  >
                    <Edit2 className="w-6 h-6" />
                    Edit Details
                  </button>

                  <button
                    onClick={() => {
                      router.push(
                        `/trips/booking/${booking.travelPlanId}/payment-form`
                      );
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg
                             border border-purple-600 rounded-2xl py-4 px-8
                             hover:from-purple-700 hover:to-purple-800 hover:border-purple-700
                             transition-all duration-300 shadow-lg hover:shadow-xl
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-3 font-montserrat"
                    disabled={loading || booking.status === "CONFIRMED"}
                    type="button"
                  >
                    {booking.status === "CONFIRMED" ? (
                      "Payment Completed"
                    ) : (
                      <>
                        Continue to Payment
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </div>

                {/* Terms and Conditions */}
                <div className="text-center mt-8 pt-8 border-t border-slate-200">
                  <p className="text-gray-600 font-roboto text-lg">
                    By proceeding, you agree to our{" "}
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-700 underline font-bold transition-colors"
                    >
                      Terms & Conditions
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Booking Info Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
                  Booking Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60">
                    <span className="text-sm text-gray-600 font-roboto">
                      Booking ID:{" "}
                    </span>
                    <span className="font-mono font-bold text-gray-900 text-lg">
                      {booking.id}
                    </span>
                  </div>
                  <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60">
                    <span className="text-sm text-gray-600 font-roboto">
                      Booked on:{" "}
                    </span>
                    <span className="font-bold text-gray-900 font-roboto text-lg">
                      {formatDate(booking.createdAt)}
                    </span>
                    {booking.updatedAt &&
                      booking.updatedAt !== booking.createdAt && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600 font-roboto">
                            Last updated:{" "}
                          </span>
                          <span className="font-bold text-gray-900 font-roboto">
                            {formatDate(booking.updatedAt)}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
                  Quick Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium font-roboto">
                      Duration:
                    </span>
                    <span className="font-bold text-gray-900 font-roboto">
                      {getDuration()} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium font-roboto">
                      Guests:
                    </span>
                    <span className="font-bold text-gray-900 font-roboto">
                      {booking.participants || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium font-roboto">
                      Total:
                    </span>
                    <span className="font-bold text-purple-600 font-roboto text-xl">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BookingSummary.displayName = "BookingSummary";

export default BookingSummary;

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
} from "lucide-react";
import { BookingData, TravelPlan } from "@/types/booking";
import { updateFormSubmittedStatus } from "@/actions/booking/actions";
import { useRouter } from "next/navigation";

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
        const response = await updateFormSubmittedStatus(booking.id);
        if (response.success) {
          router.push(`/trips/booking/${booking.travelPlanId}`);
        }
      } catch {}
    }, [booking?.id, booking?.travelPlanId, router]);

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
          return "bg-green-100 text-green-800 border-green-200";
        case "PENDING":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "CANCELLED":
          return "bg-red-100 text-red-800 border-red-200";
        case "REFUNDED":
          return "bg-blue-100 text-blue-800 border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }, []);

    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="space-y-6 mt-8">
                  <div className="h-40 bg-gray-200 rounded-xl"></div>
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                  <div className="h-56 bg-gray-200 rounded-xl"></div>
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
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">
                Booking Not Found
              </h2>
              <p className="text-gray-600 font-roboto">
                Unable to load booking details.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-playfair">
              Booking Summary
            </h1>
            <p className="text-gray-600 font-roboto max-w-2xl mx-auto">
              Please review your booking details before proceeding to payment
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Trip Header */}
            <div className="bg-purple-50 border-b border-purple-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                    {travelPlan?.title || "Travel Package"}
                  </h2>
                  <p className="text-purple-600 font-medium font-roboto">
                    {travelPlan?.destination || "Destination"}
                  </p>
                </div>
              </div>
              {travelPlan?.description && (
                <p className="text-gray-700 font-roboto leading-relaxed">
                  {travelPlan.description}
                </p>
              )}
            </div>

            <div className="p-6 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Trip Details Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2.5 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 font-playfair">
                      Trip Details
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-roboto">
                        Check-in:
                      </span>
                      <span className="font-semibold text-gray-900 font-roboto">
                        {formatDate(booking.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-roboto">
                        Check-out:
                      </span>
                      <span className="font-semibold text-gray-900 font-roboto">
                        {formatDate(booking.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-roboto">
                        Duration:
                      </span>
                      <span className="font-semibold text-gray-900 font-roboto">
                        {getDuration()} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-roboto">
                        Participants:
                      </span>
                      <span className="font-semibold text-gray-900 font-roboto">
                        {booking.participants || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-roboto">Status:</span>
                      <span
                        className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(
                          booking.status
                        )} font-medium`}
                      >
                        {booking.status || "PENDING"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2.5 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 font-playfair">
                      Pricing
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-roboto">
                        Price per person:
                      </span>
                      <span className="font-semibold text-gray-900 font-roboto">
                        {formatCurrency(booking.pricePerPerson)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-roboto">
                        Total participants:
                      </span>
                      <span className="font-semibold text-gray-900 font-roboto">
                        {booking.participants || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-4 bg-purple-50 rounded-lg px-4">
                      <span className="text-gray-900 font-semibold font-roboto">
                        Total amount:
                      </span>
                      <span className="text-xl font-bold text-purple-600 font-roboto">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Card */}
              {booking.guests && booking.guests.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2.5 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 font-playfair">
                      Team Members ({booking.guests.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {booking.guests.map((member, index) => (
                      <div
                        key={member.memberEmail + index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 font-roboto">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-sm text-gray-600 font-roboto">
                              {member.memberEmail}
                            </p>
                          </div>
                        </div>
                        {member.isteamLead && (
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
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
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2.5 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 font-playfair">
                      Special Requirements
                    </h3>
                  </div>
                  <p className="text-gray-700 font-roboto leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {booking.specialRequirements}
                  </p>
                </div>
              )}

              {/* Booking Info */}
              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-600 font-roboto">
                    Booking ID:{" "}
                  </span>
                  <span className="font-mono font-semibold text-gray-900">
                    {booking.id}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-600 font-roboto">
                    Booked on:{" "}
                  </span>
                  <span className="font-semibold text-gray-900 font-roboto">
                    {formatDate(booking.createdAt)}
                  </span>
                  {booking.updatedAt &&
                    booking.updatedAt !== booking.createdAt && (
                      <div className="mt-1">
                        <span className="text-sm text-gray-600 font-roboto">
                          Last updated:{" "}
                        </span>
                        <span className="font-semibold text-gray-900 font-roboto">
                          {formatDate(booking.updatedAt)}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={handleEditDetails}
                  className="flex-1 bg-white text-gray-700 font-semibold text-base
                           border border-gray-300 rounded-xl py-3 px-6
                           hover:bg-gray-50 hover:border-gray-400
                           transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 font-montserrat"
                  disabled={loading}
                  type="button"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Details
                </button>

                <button
                  onClick={() => {
                    router.push(
                      `/trips/booking/${booking.travelPlanId}/payment-form`
                    );
                  }}
                  className="flex-1 bg-purple-600 text-white font-semibold text-base
                           border border-purple-600 rounded-xl py-3 px-6
                           hover:bg-purple-700 hover:border-purple-700
                           transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 font-montserrat"
                  disabled={loading || booking.status === "CONFIRMED"}
                  type="button"
                >
                  {booking.status === "CONFIRMED" ? (
                    "Payment Completed"
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Terms and Conditions */}
              <div className="text-center bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-gray-600 font-roboto">
                  By proceeding, you agree to our{" "}
                  <a
                    href="#"
                    className="text-purple-600 hover:text-purple-700 underline font-medium transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </p>
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

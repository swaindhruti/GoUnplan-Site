"use client";
import React from "react";
import {
  Calendar,
  Users,
  DollarSign,
  User,
  MapPin,
  FileText
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

const BookingSummary: React.FC<BookingSummaryProps> = ({
  booking,
  travelPlan,
  loading = false
}) => {
  const router = useRouter();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="space-y-3 mt-8">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600">Unable to load booking details.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: Date | string | undefined | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatCurrency = (amount: number | undefined | null): string => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const handleEditDetails = async () => {
    try {
      const response = await updateFormSubmittedStatus(booking?.id || "");
      if (response.success) {
        router.push(`/trips/booking/${booking.travelPlanId}`);
      }
    } catch {}
  };

  const getDuration = (): string => {
    if (!booking.startDate || !booking.endDate) return "N/A";
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}`;
  };

  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Summary
          </h1>
          <p className="text-gray-600">
            Please review your booking details before proceeding to payment
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className=" text-black border border-b-gray-300 p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5" />
              <h2 className="text-xl font-semibold">
                {travelPlan?.title || "Travel Package"}
              </h2>
            </div>
            <p className="text-gray-800 mb-1">
              {travelPlan?.destination || "Destination"}
            </p>
            {travelPlan?.description && (
              <p className="text-gray-800 text-sm">{travelPlan.description}</p>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Trip Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Check-in:</span>{" "}
                    <span className="font-medium">
                      {formatDate(booking.startDate)}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Check-out:</span>{" "}
                    <span className="font-medium">
                      {formatDate(booking.endDate)}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Duration:</span>{" "}
                    <span className="font-medium">{getDuration()} days</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Participants:</span>{" "}
                    <span className="font-medium">
                      {booking.participants || 0}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status || "PENDING"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Pricing</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Price per person:</span>{" "}
                    <span className="font-medium">
                      {formatCurrency(booking.pricePerPerson)}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Total participants:</span>{" "}
                    <span className="font-medium">
                      {booking.participants || 0}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Total amount:</span>{" "}
                    <span className="font-semibold text-lg">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </p>
                  {booking?.refundAmount && booking.refundAmount > 0 && (
                    <p>
                      <span className="text-gray-600">Refund amount:</span>{" "}
                      <span className="font-medium text-green-600">
                        {formatCurrency(booking.refundAmount)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {booking.guests && booking.guests.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Team Members ({booking.guests.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {booking.guests.map((member, index) => (
                    <div
                      key={member.memberEmail + index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                            {member.isteamLead && (
                              <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                                Lead
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.memberEmail}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {booking.specialRequirements && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Special Requirements
                  </h3>
                </div>
                <p className="text-gray-700 text-sm">
                  {booking.specialRequirements}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 text-center text-sm text-gray-500">
              <div>
                <p>
                  Booking ID: <span className="font-mono">{booking.id}</span>
                </p>
              </div>
              <div>
                <p>Booked on: {formatDate(booking.createdAt)}</p>
                {booking.updatedAt &&
                  booking.updatedAt !== booking.createdAt && (
                    <p>Last updated: {formatDate(booking.updatedAt)}</p>
                  )}
              </div>
            </div>

            {booking.formSubmitted && booking.status !== "CANCELLED" && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleEditDetails();
                  }}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  type="button"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => {
                    router.push(
                      `/trips/booking/${booking.travelPlanId}/payment-form`
                    );
                  }}
                  className="flex-1 bg-gray-900 text-white font-medium py-3 px-6 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || booking.status === "CONFIRMED"}
                  type="button"
                >
                  {booking.status === "CONFIRMED"
                    ? "Payment Completed"
                    : "Continue to Payment"}
                </button>
              </div>
            )}

            <div className="text-center text-xs text-gray-500">
              By proceeding, you agree to our{" "}
              <a href="#" className="text-gray-700 hover:underline">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;

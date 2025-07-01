"use client";
import React from "react";
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

const BookingSummary: React.FC<BookingSummaryProps> = ({
  booking,
  travelPlan,
  loading = false,
}) => {
  const router = useRouter();

  // Function to get random background color for cards
  const getRandomBgColor = () => {
    const colors = [
      "bg-yellow-300",
      "bg-pink-400",
      "bg-blue-400",
      "bg-green-500",
      "bg-orange-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border-3 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 border-2 border-black rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 border-2 border-black rounded w-1/2 mx-auto"></div>
              <div className="space-y-3 mt-8">
                <div className="h-32 bg-gray-200 border-2 border-black rounded"></div>
                <div className="h-24 bg-gray-200 border-2 border-black rounded"></div>
                <div className="h-48 bg-gray-200 border-2 border-black rounded"></div>
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
          <div className="border-3 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-red-400 text-center">
            <h2 className="text-xl font-black text-black mb-2 uppercase">
              Booking Not Found
            </h2>
            <p className="font-bold text-black">
              Unable to load booking details.
            </p>
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
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | undefined | null): string => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
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
        return "bg-green-400 border-black border-2 text-black font-black";
      case "PENDING":
        return "bg-yellow-300 border-black border-2 text-black font-black";
      case "CANCELLED":
        return "bg-red-400 border-black border-2 text-black font-black";
      case "REFUNDED":
        return "bg-blue-400 border-black border-2 text-black font-black";
      default:
        return "bg-gray-300 border-black border-2 text-black font-black";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-500 border-3 border-black rounded-xl px-8 py-4 mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              Booking Summary
            </h1>
          </div>
          <p className="font-bold text-black bg-white inline-block px-4 py-2 border-3 border-black rounded-lg">
            Please review your booking details before proceeding to payment
          </p>
        </div>

        <div className="border-3 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="bg-blue-400 text-black border-b-3 border-black p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-2 rounded-md border-2 border-black">
                <MapPin className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black uppercase">
                {travelPlan?.title || "Travel Package"}
              </h2>
            </div>
            <p className="text-black font-bold mb-1">
              {travelPlan?.destination || "Destination"}
            </p>
            {travelPlan?.description && (
              <p className="bg-white border-2 border-black p-2 rounded-md mt-2 font-bold">
                {travelPlan.description}
              </p>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trip Details Card */}
              <div
                className={`border-3 border-black rounded-xl p-4 ${getRandomBgColor()} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="flex items-center gap-2 mb-3 border-b-2 border-black pb-2">
                  <div className="bg-white p-1.5 rounded-md border-2 border-black">
                    <Calendar
                      className="w-5 h-5 text-black"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="font-black text-black uppercase">
                    Trip Details
                  </h3>
                </div>
                <div className="space-y-2 font-bold">
                  <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                    <span>Check-in:</span>
                    <span className="font-black">
                      {formatDate(booking.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                    <span>Check-out:</span>
                    <span className="font-black">
                      {formatDate(booking.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                    <span>Duration:</span>
                    <span className="font-black">{getDuration()} days</span>
                  </div>
                  <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                    <span>Participants:</span>
                    <span className="font-black">
                      {booking.participants || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white border-2 border-black p-2 rounded-md">
                    <span>Status:</span>
                    <span
                      className={`px-3 py-1 text-sm rounded-md uppercase ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status || "PENDING"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div
                className={`border-3 border-black rounded-xl p-4 ${getRandomBgColor()} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="flex items-center gap-2 mb-3 border-b-2 border-black pb-2">
                  <div className="bg-white p-1.5 rounded-md border-2 border-black">
                    <DollarSign
                      className="w-5 h-5 text-black"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="font-black text-black uppercase">Pricing</h3>
                </div>
                <div className="space-y-2 font-bold">
                  <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                    <span>Price per person:</span>
                    <span className="font-black">
                      {formatCurrency(booking.pricePerPerson)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                    <span>Total participants:</span>
                    <span className="font-black">
                      {booking.participants || 0}
                    </span>
                  </div>
                  <div className="flex justify-between bg-black border-2 border-black p-2 rounded-md text-white">
                    <span>Total amount:</span>
                    <span className="font-black">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>
                  {booking?.refundAmount && booking.refundAmount > 0 && (
                    <div className="flex justify-between bg-green-500 border-2 border-black p-2 rounded-md">
                      <span>Refund amount:</span>
                      <span className="font-black">
                        {formatCurrency(booking.refundAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members Card */}
            {booking.guests && booking.guests.length > 0 && (
              <div className="border-3 border-black rounded-xl p-4 bg-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                  <div className="bg-white p-1.5 rounded-md border-2 border-black">
                    <Users className="w-5 h-5 text-black" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-black uppercase">
                    Team Members ({booking.guests.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {booking.guests.map((member, index) => (
                    <div
                      key={member.memberEmail + index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-md border-2 border-black"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 ${
                            member.isteamLead ? "bg-yellow-300" : "bg-gray-200"
                          } border-2 border-black rounded-md`}
                        >
                          <User
                            className="w-4 h-4 text-black"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div>
                          <p className="font-black text-black">
                            {member.firstName} {member.lastName}
                            {member.isteamLead && (
                              <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs rounded uppercase font-black">
                                Lead
                              </span>
                            )}
                          </p>
                          <p className="font-bold text-gray-700">
                            {member.memberEmail}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 font-bold border-2 border-black rounded px-3 py-1 bg-gray-100">
                        {member.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Requirements Card */}
            {booking.specialRequirements && (
              <div className="border-3 border-black rounded-xl p-4 bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-2">
                  <div className="bg-white p-1.5 rounded-md border-2 border-black">
                    <FileText
                      className="w-5 h-5 text-black"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="font-black text-black uppercase">
                    Special Requirements
                  </h3>
                </div>
                <p className="bg-white border-2 border-black p-3 rounded-md font-bold">
                  {booking.specialRequirements}
                </p>
              </div>
            )}

            {/* Booking Information */}
            <div className="grid md:grid-cols-2 gap-4 bg-yellow-300 p-4 border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-white p-2 border-2 border-black rounded-md font-bold text-center">
                <span className="font-black">Booking ID: </span>
                <span className="font-mono">{booking.id}</span>
              </div>
              <div className="bg-white p-2 border-2 border-black rounded-md font-bold text-center">
                <span className="font-black">Booked on: </span>
                <span>{formatDate(booking.createdAt)}</span>
                {booking.updatedAt &&
                  booking.updatedAt !== booking.createdAt && (
                    <div className="mt-1">
                      <span className="font-black">Last updated: </span>
                      <span>{formatDate(booking.updatedAt)}</span>
                    </div>
                  )}
              </div>
            </div>

            {/* Action Buttons */}
            {booking.formSubmitted && booking.status !== "CANCELLED" && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-3 border-black">
                <button
                  onClick={() => {
                    handleEditDetails();
                  }}
                  className="flex-1 bg-white text-black font-black uppercase 
                           border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                           hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-200 py-3 px-6 rounded-md
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                  disabled={loading}
                  type="button"
                >
                  <Edit2 className="w-5 h-5" strokeWidth={2.5} />
                  Edit Details
                </button>
                <button
                  onClick={() => {
                    router.push(
                      `/trips/booking/${booking.travelPlanId}/payment-form`
                    );
                  }}
                  className="flex-1 bg-purple-600 text-white font-black uppercase 
                           border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                           hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-200 py-3 px-6 rounded-md
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                  disabled={loading || booking.status === "CONFIRMED"}
                  type="button"
                >
                  {booking.status === "CONFIRMED" ? (
                    "Payment Completed"
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="text-center bg-white border-2 border-black rounded-md p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold">
                By proceeding, you agree to our{" "}
                <a
                  href="#"
                  className="underline decoration-2 decoration-black hover:bg-yellow-300 transition-colors"
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
};

export default BookingSummary;

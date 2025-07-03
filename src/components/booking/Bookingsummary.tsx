"use client";
import React, { useMemo, useCallback } from "react";
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

    // Memoized background color assignments for consistent colors between renders
    const cardColors = useMemo(() => {
      return {
        header: "bg-[#a0c4ff]",
        title: "bg-[#e0c6ff]",
        tripDetails: "bg-[#fdffb6]", // pale yellow
        pricing: "bg-[#caffbf]", // light green
        teamMembers: "bg-[#ffd6ff]", // pink lavender
        specialRequirements: "bg-[#bde0fe]", // light blue
        bookingInfo: "bg-[#a0c4ff]", // baby blue
        totalAmount: "bg-[#1e293b]", // dark slate
        leadLabel: "bg-[#8b5cf6]", // purple
      };
    }, []);

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
    }, []);

    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-[#f5f5ff] py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="border-3 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-[#e0c6ff] border-2 border-black rounded w-1/3 mx-auto"></div>
                <div className="h-6 bg-[#a0c4ff] border-2 border-black rounded w-1/2 mx-auto"></div>
                <div className="space-y-4 mt-10">
                  <div className="h-40 bg-[#fdffb6] border-2 border-black rounded"></div>
                  <div className="h-32 bg-[#caffbf] border-2 border-black rounded"></div>
                  <div className="h-56 bg-[#ffd6ff] border-2 border-black rounded"></div>
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
        <div className="min-h-screen bg-[#fff5f5] py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="border-3 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-red-400 text-center">
              <h2 className="text-3xl font-black text-black mb-4 uppercase">
                Booking Not Found
              </h2>
              <p className="text-xl font-bold text-black">
                Unable to load booking details.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f9f9ff] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div
              className={`inline-block ${cardColors.header} border-3 border-black rounded-xl px-8 py-4 mb-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
            >
              <h1 className="text-4xl font-black text-black uppercase tracking-tight">
                Booking Summary
              </h1>
            </div>
            <p className="font-bold text-lg text-black bg-white inline-block px-5 py-3 border-3 border-black rounded-lg">
              Please review your booking details before proceeding to payment
            </p>
          </div>

          <div className="border-3 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div
              className={`${cardColors.title} text-black border-b-3 border-black p-6`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white p-2.5 rounded-md border-2 border-black">
                  <MapPin className="w-7 h-7 text-black" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black uppercase">
                  {travelPlan?.title || "Travel Package"}
                </h2>
              </div>
              <p className="text-xl text-black font-bold mb-2">
                {travelPlan?.destination || "Destination"}
              </p>
              {travelPlan?.description && (
                <p className="bg-white border-2 border-black p-4 rounded-md mt-3 font-bold text-lg">
                  {travelPlan.description}
                </p>
              )}
            </div>

            <div className="p-6 space-y-7">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Trip Details Card */}
                <div
                  className={`border-3 border-black rounded-xl p-5 ${cardColors.tripDetails} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
                    <div className="bg-white p-2.5 rounded-md border-2 border-black">
                      <Calendar
                        className="w-7 h-7 text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h3 className="font-black text-2xl text-black uppercase">
                      Trip Details
                    </h3>
                  </div>
                  <div className="space-y-3 font-bold">
                    <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                      <span>Check-in:</span>
                      <span className="font-black">
                        {formatDate(booking.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                      <span>Check-out:</span>
                      <span className="font-black">
                        {formatDate(booking.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between bg-[#fff8c9] border-2 border-black p-3 rounded-md text-lg">
                      <span>Duration:</span>
                      <span className="font-black">{getDuration()} days</span>
                    </div>
                    <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                      <span>Participants:</span>
                      <span className="font-black">
                        {booking.participants || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white border-2 border-black p-3 rounded-md text-lg">
                      <span>Status:</span>
                      <span
                        className={`px-3 py-1 text-base rounded-md uppercase ${getStatusColor(
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
                  className={`border-3 border-black rounded-xl p-5 ${cardColors.pricing} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
                    <div className="bg-white p-2.5 rounded-md border-2 border-black">
                      <DollarSign
                        className="w-7 h-7 text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h3 className="font-black text-2xl text-black uppercase">
                      Pricing
                    </h3>
                  </div>
                  <div className="space-y-3 font-bold">
                    <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                      <span>Price per person:</span>
                      <span className="font-black">
                        {formatCurrency(booking.pricePerPerson)}
                      </span>
                    </div>
                    <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                      <span>Total participants:</span>
                      <span className="font-black">
                        {booking.participants || 0}
                      </span>
                    </div>
                    <div
                      className={`flex justify-between ${cardColors.totalAmount} border-2 border-black p-4 rounded-md text-white text-lg`}
                    >
                      <span>Total amount:</span>
                      <span className="font-black text-xl">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Card */}
              {booking.guests && booking.guests.length > 0 && (
                <div
                  className={`border-3 border-black rounded-xl p-5 ${cardColors.teamMembers} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
                    <div className="bg-white p-2.5 rounded-md border-2 border-black">
                      <Users className="w-7 h-7 text-black" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-2xl text-black uppercase">
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
                            className={`p-2.5 ${
                              member.isteamLead ? "bg-[#caffbf]" : "bg-white"
                            } border-2 border-black rounded-md`}
                          >
                            <User
                              className="w-6 h-6 text-black"
                              strokeWidth={2.5}
                            />
                          </div>
                          <div>
                            <p className="font-black text-lg text-black">
                              {member.firstName} {member.lastName}
                              {member.isteamLead && (
                                <span
                                  className={`ml-2 px-2 py-0.5 ${cardColors.leadLabel} text-white text-xs rounded uppercase font-black`}
                                >
                                  Lead
                                </span>
                              )}
                            </p>
                            <p className="font-bold text-lg text-gray-700">
                              {member.memberEmail}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 font-bold text-lg border-2 border-black rounded px-3 py-1 bg-white">
                          {member.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requirements Card */}
              {booking.specialRequirements && (
                <div
                  className={`border-3 border-black rounded-xl p-5 ${cardColors.specialRequirements} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className="flex items-center gap-3 mb-3 border-b-2 border-black pb-3">
                    <div className="bg-white p-2.5 rounded-md border-2 border-black">
                      <FileText
                        className="w-7 h-7 text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h3 className="font-black text-2xl text-black uppercase">
                      Special Requirements
                    </h3>
                  </div>
                  <p className="bg-white border-2 border-black p-4 rounded-md font-bold text-lg">
                    {booking.specialRequirements}
                  </p>
                </div>
              )}

              {/* Booking Information */}
              <div
                className={`grid md:grid-cols-2 gap-4 ${cardColors.bookingInfo} p-5 border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="bg-white p-3 border-2 border-black rounded-md font-bold text-center text-lg">
                  <span className="font-black">Booking ID: </span>
                  <span className="font-mono">{booking.id}</span>
                </div>
                <div className="bg-white p-3 border-2 border-black rounded-md font-bold text-center text-lg">
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
                <div className="flex flex-col sm:flex-row gap-4 pt-5 border-t-3 border-black">
                  <button
                    onClick={handleEditDetails}
                    className="flex-1 bg-white text-black font-black text-xl uppercase 
                           border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           hover:bg-[#f0f0ff] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                           hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-200 py-4 px-6 rounded-md
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                    disabled={loading}
                    type="button"
                  >
                    <Edit2 className="w-6 h-6" strokeWidth={2.5} />
                    Edit Details
                  </button>
                  <button
                    onClick={() => {
                      router.push(
                        `/trips/booking/${booking.travelPlanId}/payment-form`
                      );
                    }}
                    className="flex-1 bg-black text-white font-black text-xl uppercase 
                           border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           hover:bg-[#1e293b] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                           hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-200 py-4 px-6 rounded-md
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
                        <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="text-center bg-[#f9f9ff] border-2 border-black rounded-md p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold text-lg">
                  By proceeding, you agree to our{" "}
                  <a
                    href="#"
                    className="underline decoration-2 decoration-black hover:bg-[#e0e0ff] transition-colors"
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

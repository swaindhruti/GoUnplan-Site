"use client";
import React, { useCallback } from "react";
import {
  Calendar,
  MapPin,
  FileText,
  ArrowRight,
  CheckCircle,
  CreditCard,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { BookingData, TravelPlan } from "@/types/booking";
import // editBookingAction,
/*  unCompleteBookingForm */
/*   updateBookingStatus */
"@/actions/booking/actions";
/* import { BookingStatus } from "@prisma/client"; */
import { useRouter } from "next/navigation";
import { TripCard } from "../trips/TripCard";
import { RawTrip } from "@/types/trips";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../ui/carousel";

export interface BookingSummaryProps {
  booking: BookingData | null;
  travelPlan: Partial<TravelPlan> | null;
  onEditDetails?: () => void;
  loading?: boolean;
  allTrips?: RawTrip[];
}

const BookingSummary: React.FC<BookingSummaryProps> = React.memo(
  ({ booking, travelPlan, loading = false, allTrips }) => {
    const router = useRouter();
    const isCancelled = booking?.paymentStatus === "CANCELLED";

    const formatDate = useCallback(
      (dateString: Date | string | undefined | null): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      },
      []
    );

    const formatCurrency = useCallback(
      (amount: number | undefined | null): string => {
        if (!amount) return "₹0";
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR"
        }).format(amount);
      },
      []
    );

    // Calculate tax and totals
    const calculatePaymentBreakdown = useCallback(() => {
      if (!booking) return { subtotal: 0, tax: 0, total: 0 };

      const subtotal =
        (booking.pricePerPerson || 0) * (booking.participants || 0);
      const taxRate = 0.18; // 18% GST
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      return {
        subtotal,
        tax,
        total
      };
    }, [booking]);

    const paymentBreakdown = calculatePaymentBreakdown();

    // const handleEditDetails = useCallback(async () => {
    //   if (!booking?.id) return;

    //   try {
    //     const response = await editBookingAction(booking.id);
    //     if (response.success) {
    //       router.push(`/trips/booking/${response.travelPlanId}/${booking.id}`);
    //     } else {
    //       console.error("Failed to update booking:", response.error);
    //     }
    //   } catch (error) {
    //     console.error("Error updating booking status:", error);
    //   }
    // }, [booking?.id, router]);

    const handleBookAgain = useCallback(async () => {
      if (!booking?.travelPlanId) return;
      router.push(`/trips/${booking.travelPlanId}`);
      /*  try {
        const response = await unCompleteBookingForm(booking.id);
        if (response.success) {
          router.push(`/trips/booking/${booking.travelPlanId}`);
        } else {
          console.error("Failed to enable booking edit:", response.error);
        }
      } catch (error) {
        console.error("Error enabling booking edit:", error);
      } */
    }, [booking?.travelPlanId, router]);

    const getDuration = useCallback((): string => {
      if (!booking?.startDate || !booking?.endDate) return "N/A";
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays}`;
    }, [booking?.startDate, booking?.endDate]);

    const handleContinueToPayment = (isPartialPay?: boolean) => {
      router.push(
        `/trips/booking/${booking?.travelPlanId}/payment-form/${
          booking?.id
        }?payment-type=${
          isPartialPay
            ? "partial-pay"
            : booking?.paymentStatus === "PARTIALLY_PAID"
            ? "remaining-amount"
            : ""
        }`
      );
    };

    if (loading) {
      return (
        <div className="min-h-spurple bg-gray-50 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
              <div className="animate-pulse space-y-8">
                <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="space-y-8 mt-12">
                  <div className="h-48 bg-gray-200 rounded-xl"></div>
                  <div className="h-40 bg-gray-200 rounded-xl"></div>
                  <div className="h-64 bg-gray-200 rounded-xl"></div>
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
        <div className="min-h-spurple bg-gray-50 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-bricolage">
                Booking Not Found
              </h2>
              <p className="text-gray-600 font-instrument text-lg">
                Unable to load booking details.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-spurple bg-gray-50 font-instrument">
        <div
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('${
              travelPlan?.tripImage ||
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
            }')`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="flex items-center justify-between mt-12">
              <div className="space-y-4">
                <div
                  className={`inline-flex items-center px-6 py-2 backdrop-blur-sm rounded-full mb-4 ${
                    isCancelled ? "bg-red-600/80" : "bg-purple-600/80"
                  }`}
                >
                  <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                    {isCancelled ? "Cancelled Booking" : "Booking Summary"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
                  {isCancelled ? "Trip Cancelled" : "Review Your Booking"}
                  <span
                    className={`block mt-2 ${
                      isCancelled ? "text-red-300" : "text-purple-300"
                    }`}
                  >
                    {travelPlan?.title}
                  </span>
                </h1>
                <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
                  {isCancelled
                    ? "Your booking has been cancelled. Refund will be processed soon."
                    : "Verify your trip details and proceed to secure payment"}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium font-instrument flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(booking?.startDate)} -{" "}
                    {formatDate(booking?.endDate)}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium font-instrument flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {formatCurrency(paymentBreakdown.total)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  {isCancelled ? (
                    <XCircle className="h-8 w-8 text-white" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isCancelled && (
          <div className="relative -mt-16 z-30 mb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 font-instrument">
                      Trip Cancelled
                    </h3>
                    <div className="mt-1 text-sm text-red-700 font-instrument">
                      <p>
                        Your booking has been cancelled successfully. The refund
                        will be processed within 5-6 business days and credited
                        to your original payment method.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`relative z-20 ${isCancelled ? "-mt-4" : "-mt-16"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 space-y-8">
                  <>
                    <div className="text-center mb-6">
                      <div className="flex items-center gap-3 justify-center mb-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isCancelled ? "bg-red-100" : "bg-purple-100"
                          }`}
                        >
                          <MapPin
                            className={`w-4 h-4 ${
                              isCancelled ? "text-red-600" : "text-purple-600"
                            }`}
                          />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 font-bricolage">
                          Trip Details
                        </h2>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 font-bricolage mb-1">
                        {travelPlan?.title || "Travel Package"}
                      </h3>
                      <p
                        className={`text-sm font-medium font-instrument ${
                          isCancelled ? "text-red-600" : "text-purple-600"
                        }`}
                      >
                        {travelPlan?.destination || "Destination"}
                        {isCancelled && " (Cancelled)"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between text-base font-semibold text-gray-900 font-instrument">
                            <span>{formatDate(booking.startDate)}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(booking.endDate)}</span>
                            <span
                              className={`text-sm ${
                                isCancelled ? "text-red-600" : "text-purple-600"
                              }`}
                            >
                              ({getDuration()} days)
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider font-instrument">
                            Booking ID:{" "}
                            <span className="text-gray-800 font-medium">
                              {booking.id}
                            </span>
                          </h3>

                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider font-instrument">
                            Guest Details{" "}
                            <span className="ml-1 text-gray-500 font-normal">
                              ({booking.participants || 0} Travelers)
                            </span>
                          </h4>

                          <div className="flex flex-wrap gap-2">
                            {booking.guests && booking.guests.length > 0 ? (
                              booking.guests.map((member, index) => (
                                <span
                                  key={member.memberEmail + index}
                                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-colors duration-200 ${
                                    member.isteamLead
                                      ? isCancelled
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : "bg-purple-50 text-purple-700 border border-purple-200"
                                      : "bg-gray-50 text-gray-700 border border-gray-200"
                                  }`}
                                >
                                  <span className="mr-1.5 font-semibold">
                                    {member.firstName} {member.lastName}
                                  </span>
                                  <span className="text-gray-500">
                                    {member.phone}
                                  </span>
                                  {member.isteamLead && (
                                    <span className="ml-2 text-[10px] uppercase tracking-wide font-bold">
                                      Lead
                                    </span>
                                  )}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-xs font-instrument italic">
                                No guest details available
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          {isCancelled && (
                            <button
                              onClick={handleBookAgain}
                              className="w-full bg-red-600 text-white font-medium text-sm
               border border-red-600 rounded-lg py-2.5 px-4
               hover:bg-red-700 hover:border-red-700
               transition-all duration-200
               disabled:opacity-50 disabled:cursor-not-allowed
               flex items-center justify-center gap-2 font-instrument"
                              disabled={loading}
                              type="button"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              Book Trip Again
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Explore More Trips */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <h4 className="text-base font-semibold text-gray-900 font-bricolage">
                          Explore More Trips
                        </h4>
                      </div>
                      <p className="text-gray-600 font-instrument text-sm mb-4 leading-relaxed">
                        Discover amazing destinations and create unforgettable
                        memories with our curated travel packages.
                      </p>

                      <Carousel>
                        <CarouselContent className="px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allTrips?.map((trip) => (
                            <CarouselItem
                              key={trip.travelPlanId}
                              className=" p-2 overflow-visible"
                            >
                              <TripCard
                                isTripPage={false}
                                trip={{
                                  ...trip,
                                  tripImage: trip.tripImage || "",
                                  reviewCount: trip.reviewCount || 0,
                                  vibes: trip.filters || [],
                                  filters: trip.filters || [],
                                  languages: trip.languages || [],
                                  averageRating: trip.averageRating ?? 0,
                                  bookedSeats: trip.bookedSeats ?? 0
                                }}
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                    {booking.specialRequirements && (
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <FileText className="w-4 h-4 text-orange-600" />
                          </div>
                          <h4 className="text-base font-semibold text-gray-900 font-bricolage">
                            Special Requirements
                          </h4>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-700 font-instrument text-sm leading-relaxed">
                            {booking.specialRequirements}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                </div>
              </div>

              <div>
                <div className="space-y-6 lg:sticky lg:top-10">
                  <div className="bg-white  border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg ${
                          isCancelled ? "bg-red-100" : "bg-purple-100"
                        }`}
                      >
                        <CreditCard
                          className={`w-5 h-5 ${
                            isCancelled ? "text-red-600" : "text-purple-600"
                          }`}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 font-bricolage">
                        {isCancelled ? "Refund Details" : "Payment Details"}
                      </h3>
                    </div>

                    {/* Payment/Refund Information */}
                    {isCancelled ? (
                      <div className="space-y-4 mb-6">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-semibold text-red-800 font-instrument mb-2">
                                Trip Cancelled - Refund Processing
                              </h4>
                              <div className="space-y-2 text-sm text-red-700 font-instrument">
                                <p>
                                  • Your refund of{" "}
                                  <strong>
                                    {formatCurrency(paymentBreakdown.total)}
                                  </strong>{" "}
                                  is being processed
                                </p>
                                <p>
                                  • Amount will be credited to your original
                                  payment method
                                </p>
                                <p>• Processing time: 5-6 business days</p>
                                <p>
                                  • You will receive a confirmation email once
                                  processed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-700 font-instrument text-sm">
                                Original Amount:
                              </span>
                              <span className="font-semibold text-gray-900 font-instrument text-sm">
                                {formatCurrency(paymentBreakdown.total)}
                              </span>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 mt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-900 font-bold font-instrument">
                                  Refund Amount:
                                </span>
                                <span className="text-lg font-bold text-red-600 font-instrument">
                                  {formatCurrency(paymentBreakdown.total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-700 font-instrument text-sm">
                                Cost per person:
                              </span>
                              <span className="font-semibold text-gray-900 font-instrument text-sm">
                                {formatCurrency(booking.pricePerPerson)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-700 font-instrument text-sm">
                                Number of persons:
                              </span>
                              <span className="font-semibold text-gray-900 font-instrument text-sm">
                                {booking.participants || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-700 font-instrument text-sm">
                                Subtotal:
                              </span>
                              <span className="font-semibold text-gray-900 font-instrument text-sm">
                                {formatCurrency(paymentBreakdown.subtotal)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-700 font-instrument text-sm">
                                Tax (GST 18%):
                              </span>
                              <span className="font-semibold text-gray-900 font-instrument text-sm">
                                {formatCurrency(paymentBreakdown.tax)}
                              </span>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3 mt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-900 font-bold font-instrument">
                                  Total Amount:
                                </span>
                                <span className="text-lg font-bold text-purple-600 font-instrument">
                                  {formatCurrency(paymentBreakdown.total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {booking.paymentStatus !== "FULLY_PAID" &&
                          booking.paymentStatus !== "REFUNDED" && (
                            <>
                              {(booking.paymentStatus === "PENDING" ||
                                booking.paymentStatus === "OVERDUE") && (
                                <>
                                  {/* Pay Partial Button */}
                                  <button
                                    onClick={() =>
                                      handleContinueToPayment(true)
                                    }
                                    className="w-full bg-gradient-to-r from-purple-100 to-purple-200 text-black/80 font-semibold
               border border-gray-200 rounded-xl py-4 px-6
               active:scale-[0.98]
               transition-all duration-200
               disabled:opacity-50 disabled:cursor-not-allowed
               flex flex-col items-center justify-center gap-3 font-instrument
               shadow-md"
                                    disabled={loading}
                                    type="button"
                                  >
                                    <div className="flex justify-center text-xl items-center gap-2 font-bold">
                                      <CreditCard className="w-5 h-5" />
                                      Book a Seat (Partial)
                                    </div>
                                    <span
                                      className="bg-white/20 backdrop-blur-sm text-gray-500 text-sm font-medium
                 px-3 py-1 rounded-full border border-white/30
                 shadow-sm"
                                    >
                                      Pay Partial ${booking.minPaymentAmount}
                                    </span>
                                  </button>

                                  {/* Pay Complete Button */}
                                  <button
                                    onClick={() =>
                                      handleContinueToPayment(false)
                                    }
                                    className="w-full bg-gradient-to-r from-green-100 to-green-200 text-black/80 font-semibold
               border border-gray-200 rounded-xl py-4 px-6
               active:scale-[0.98]
               transition-all duration-200
               disabled:opacity-50 disabled:cursor-not-allowed
               flex flex-col items-center justify-center gap-3 font-instrument
               shadow-md mt-3"
                                    disabled={loading}
                                    type="button"
                                  >
                                    <div className="flex justify-center text-xl items-center gap-2 font-bold">
                                      <CreditCard className="w-5 h-5" />
                                      Pay Complete Amount
                                    </div>
                                    <span
                                      className="bg-white/20 backdrop-blur-sm text-gray-500 text-sm font-medium
                 px-3 py-1 rounded-full border border-white/30
                 shadow-sm"
                                    >
                                      Pay Full $
                                      {formatCurrency(paymentBreakdown.total)}
                                    </span>
                                  </button>
                                </>
                              )}

                              {booking.paymentStatus === "PARTIALLY_PAID" && (
                                <button
                                  onClick={() => handleContinueToPayment(false)}
                                  className="w-full bg-gradient-to-r from-purple-100 to-purple-200 text-black/80 font-semibold
             border border-gray-200 rounded-xl py-4 px-6
             active:scale-[0.98]
             transition-all duration-200
             disabled:opacity-50 disabled:cursor-not-allowed
             flex flex-col items-center justify-center gap-3 font-instrument
             shadow-md"
                                  disabled={loading}
                                  type="button"
                                >
                                  <div className="flex justify-center text-xl items-center gap-2 font-bold">
                                    <CreditCard className="w-5 h-5" />
                                    Complete Payment
                                  </div>
                                  <span
                                    className="bg-white/20 backdrop-blur-sm text-gray-500 text-sm font-medium
               px-3 py-1 rounded-full border border-white/30
               shadow-sm"
                                  >
                                    Pay Remaining ${booking.remainingAmount}
                                  </span>
                                </button>
                              )}
                            </>
                          )}
                        <p className="text-xs text-gray-500 font-instrument mt-2 text-center">
                          By proceeding, you agree to our
                          <a
                            href="#"
                            className="text-purple-600 hover:text-purple-700 underline transition-colors"
                          >
                            Terms & Conditions
                          </a>
                          &nbsp;and&nbsp;
                          <a
                            href="#"
                            className="text-purple-600 hover:text-purple-700 underline transition-colors"
                          >
                            Cancellation Policy
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"></div>
      </div>
    );
  }
);

BookingSummary.displayName = "BookingSummary";

export default BookingSummary;

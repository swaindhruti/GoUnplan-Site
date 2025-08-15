"use client";
import React, { useCallback, useState, useEffect } from "react";
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
  CreditCard
} from "lucide-react";
import { BookingData, TravelPlan } from "@/types/booking";
import { editBookingAction, updateBookingStatus } from "@/actions/booking/actions";
import { BookingStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/global/buttons";

export interface BookingSummaryProps {
  booking: BookingData | null;
  travelPlan: Partial<TravelPlan> | null;
  onEditDetails?: () => void;
  loading?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = React.memo(
  ({ booking, travelPlan, loading = false }) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [timer, setTimer] = useState(10);

    const formatDate = useCallback(
      (dateString: Date | string | undefined | null): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
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

    const handleEditDetails = useCallback(async () => {
      if (!booking?.id) return;

      try {
        const response = await editBookingAction(booking.id);
        if (response.success) {
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

    const handleContinueToPayment = useCallback(() => {
      setStep(2);
    }, []);

    const handleConfirmPayment = useCallback(async (confirmed: boolean) => {
      if (confirmed) {
        if (!booking?.id) {
          console.error("No booking ID available");
          return;
        }

        setIsProcessing(true);
        
        try {
          // Update booking status to CONFIRMED
          const response = await updateBookingStatus(booking.id, BookingStatus.CONFIRMED);
          
          if (response.success) {
            // Update local state to reflect the new status
            setTimeout(() => {
              setIsProcessing(false);
              setPaymentCompleted(true);
              
              // Update the booking object with new status
              if (booking) {
                booking.status = "CONFIRMED";
                booking.updatedAt = new Date();
              }
            }, 2000); // Reduced time for better UX
          } else {
            setIsProcessing(false);
            console.error("Failed to update booking status:", response.error);
            alert("Payment failed. Please try again.");
          }
        } catch (error) {
          setIsProcessing(false);
          console.error("Error processing payment:", error);
          alert("Payment failed. Please try again.");
        }
      } else {
        setStep(1);
      }
    }, [booking]);

    const handleGoToTrips = useCallback(() => {
      router.push("/trips");
    }, [router]);

    useEffect(() => {
      if (paymentCompleted && timer > 0) {
        const countdown = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(countdown);
      } else if (paymentCompleted && timer === 0) {
        router.push("/trips");
      }
    }, [paymentCompleted, timer, router]);

    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
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
        <div className="min-h-screen bg-gray-50 py-16 px-6">
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
      <div className="min-h-screen bg-gray-50 font-instrument">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('${travelPlan?.tripImage || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'}')`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <BackButton isWhite={true} route="/trips" />
            
            <div className="flex items-center justify-between mt-12">
              <div className="space-y-4">
                <div className="inline-flex items-center px-6 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full mb-4">
                  <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                    {step === 1
                      ? "Booking Summary"
                      : step === 2 && !paymentCompleted
                      ? "Payment Confirmation"
                      : "Payment Complete"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
                  {step === 1
                    ? "Review Your Booking"
                    : step === 2 && !paymentCompleted
                    ? "Complete Payment"
                    : "Booking Confirmed"}
                  <span className="block text-purple-300 mt-2">{travelPlan?.title}</span>
                </h1>
                <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
                  {step === 1
                    ? "Verify your trip details and proceed to secure payment"
                    : step === 2 && !paymentCompleted
                    ? "Confirm your payment to finalize your booking"
                    : `Redirecting to your trips in ${timer} seconds`}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium font-instrument flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    ID: {booking.id?.slice(-8)}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium font-instrument flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {formatCurrency(booking.totalPrice)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="relative -mt-16 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 space-y-8">
              {step === 1 && (
                <>
                  {/* Trip Header */}
                  <div className="text-center mb-8">
                    <div className="flex items-center gap-3 justify-center mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 font-bricolage">
                        Trip Details
                      </h2>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-bricolage mb-2">
                      {travelPlan?.title || "Travel Package"}
                    </h3>
                    <p className="text-purple-600 font-semibold font-instrument">
                      {travelPlan?.destination || "Destination"}
                    </p>
                    {travelPlan?.description && (
                      <p className="text-gray-600 font-instrument mt-4 leading-relaxed">
                        {travelPlan.description}
                      </p>
                    )}
                  </div>

                  {/* Trip Details & Pricing Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Trip Details Card */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 font-bricolage">
                          Travel Schedule
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 font-instrument">
                            Check-in:
                          </span>
                          <span className="font-semibold text-gray-900 font-instrument">
                            {formatDate(booking.startDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 font-instrument">
                            Check-out:
                          </span>
                          <span className="font-semibold text-gray-900 font-instrument">
                            {formatDate(booking.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 font-instrument">
                            Duration:
                          </span>
                          <span className="font-semibold text-gray-900 font-instrument">
                            {getDuration()} days
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 font-instrument">
                            Travelers:
                          </span>
                          <span className="font-semibold text-gray-900 font-instrument">
                            {booking.participants || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700 font-instrument">
                            Status:
                          </span>
                          <span
                            className={`px-3 py-1 text-sm rounded-md font-semibold ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status || "PENDING"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 font-bricolage">
                          Cost Breakdown
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 font-instrument">
                            Price per person:
                          </span>
                          <span className="font-semibold text-gray-900 font-instrument">
                            {formatCurrency(booking.pricePerPerson)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 font-instrument">
                            Total travelers:
                          </span>
                          <span className="font-semibold text-gray-900 font-instrument">
                            {booking.participants || 0}
                          </span>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-bold font-instrument">
                              Total Amount:
                            </span>
                            <span className="text-xl font-bold text-purple-600 font-instrument">
                              {formatCurrency(booking.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Travelers Card */}
                  {booking.guests && booking.guests.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 font-bricolage">
                          Travelers ({booking.guests.length})
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {booking.guests.map((member, index) => (
                          <div
                            key={member.memberEmail + index}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                              <div className="bg-purple-100 p-2 rounded-lg">
                                <User className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 font-instrument">
                                  {member.firstName} {member.lastName}
                                </p>
                                <p className="text-gray-600 font-instrument text-sm">
                                  {member.memberEmail}
                                </p>
                              </div>
                            </div>
                            {member.isteamLead && (
                              <span className="bg-purple-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                                Primary Contact
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Requirements */}
                  {booking.specialRequirements && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 font-bricolage">
                          Special Requirements
                        </h4>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700 font-instrument leading-relaxed">
                          {booking.specialRequirements}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

                </div>
                
                {/* Action Buttons */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                {step === 1 ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleEditDetails}
                      className="flex-1 bg-gray-100 text-gray-700 font-semibold
                               border border-gray-300 rounded-xl py-3 px-6
                               hover:bg-gray-200 hover:border-gray-400
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2 font-instrument"
                      disabled={loading}
                      type="button"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Details
                    </button>

                    <button
                      onClick={handleContinueToPayment}
                      className="flex-1 bg-purple-600 text-white font-semibold
                               border border-purple-600 rounded-xl py-3 px-6
                               hover:bg-purple-700 hover:border-purple-700
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2 font-instrument"
                      disabled={loading}
                      type="button"
                    >
                      Continue to Payment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : step === 2 && !paymentCompleted ? (
                  isProcessing ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 font-bricolage mb-4">
                        Confirm Payment
                      </h3>
                      <p className="text-gray-600 font-instrument mb-6">
                        Would you like to confirm the payment of {formatCurrency(booking.totalPrice)}?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleConfirmPayment(true)}
                          className="flex-1 bg-purple-600 text-white font-semibold
                                   border border-purple-600 rounded-xl py-3 px-6
                                   hover:bg-purple-700 hover:border-purple-700
                                   transition-all duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-2 font-instrument"
                          disabled={loading}
                          type="button"
                        >
                          Confirm Payment
                        </button>
                        <button
                          onClick={() => handleConfirmPayment(false)}
                          className="flex-1 bg-gray-100 text-gray-700 font-semibold
                                   border border-gray-300 rounded-xl py-3 px-6
                                   hover:bg-gray-200 hover:border-gray-400
                                   transition-all duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-2 font-instrument"
                          disabled={loading}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-bricolage mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-gray-600 font-instrument mb-6">
                      Your booking is confirmed. Redirecting in {timer} seconds...
                    </p>
                    <button
                      onClick={handleGoToTrips}
                      className="bg-purple-600 text-white font-semibold
                               border border-purple-600 rounded-xl py-3 px-6
                               hover:bg-purple-700 hover:border-purple-700
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2 font-instrument mx-auto"
                      disabled={loading}
                      type="button"
                    >
                      View My Trips
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                  {/* Terms and Conditions */}
                  <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 font-instrument text-sm">
                      By proceeding, you agree to our{" "}
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-700 underline font-semibold transition-colors"
                      >
                        Terms & Conditions
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Booking Info Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-bricolage">
                      Booking Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 font-instrument">
                        Booking ID
                      </span>
                      <p className="font-mono font-semibold text-gray-900 text-sm break-all mt-1">
                        {booking.id}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 font-instrument">
                        Booking Date
                      </span>
                      <p className="font-semibold text-gray-900 font-instrument text-sm mt-1">
                        {formatDate(booking.createdAt)}
                      </p>
                      {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-600 font-instrument">
                            Last Updated
                          </span>
                          <p className="font-semibold text-gray-900 font-instrument text-xs mt-1">
                            {formatDate(booking.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Summary Card */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 font-bricolage mb-4">
                    Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-purple-200">
                      <span className="text-gray-700 font-instrument">
                        Duration:
                      </span>
                      <span className="font-semibold text-gray-900 font-instrument">
                        {getDuration()} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-200">
                      <span className="text-gray-700 font-instrument">
                        Travelers:
                      </span>
                      <span className="font-semibold text-gray-900 font-instrument">
                        {booking.participants || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 font-instrument">
                        Total:
                      </span>
                      <span className="font-bold text-purple-600 font-instrument text-lg">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional content sections can be added here */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Footer content if needed */}
        </div>
      </div>
    );
  }
);

BookingSummary.displayName = "BookingSummary";

export default BookingSummary;

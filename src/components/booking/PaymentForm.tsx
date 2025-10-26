"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
  Shield,
  CheckCircle,
  Users,
  AlertCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { BookingData } from "@/types/booking";
import Image from "next/image";
import GreenConfirmationLoader from "../global/Loaders";
import {
  processRazorpayPayment,
  handlePaymentFailure,
} from "@/actions/payment/razorpayActions";
import { toast } from "sonner";
import { initiateRazorpayPayment } from "@/lib/razorpay";

interface PaymentFormProps {
  tripData: {
    title?: string;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    tripImage?: string;
    pricePerPerson: number;
    travelPlanId: string;
    host?: {
      user?: {
        name?: string;
        phone?: string;
      };
      hostEmail?: string;
    };
  };
  booking: Partial<BookingData>;
  bookingId: string;
  paymentType?: string;
  isPartialPayment?: boolean;
  isRemainingPayment?: boolean;
  userDetails?: {
    name: string;
    email: string;
    phone: string;
  };
}

export function PaymentForm({
  tripData,
  bookingId,
  booking,
  isPartialPayment,
  isRemainingPayment,
  userDetails,
}: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [countdown, setCountdown] = useState(10);

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

  const calculatePaymentBreakdown = useCallback(() => {
    if (!booking) return { subtotal: 0, total: 0 };

    let subtotal = 0;

    if (isPartialPayment) {
      subtotal = booking.minPaymentAmount || 0;
    } else if (isRemainingPayment) {
      subtotal = booking.remainingAmount || 0;
    } else {
      subtotal =
        (booking.pricePerPerson || tripData.pricePerPerson || 0) *
        (booking.participants || tripData.numberOfGuests || 0);
    }

    const total = subtotal;

    return {
      subtotal,
      total,
    };
  }, [booking, tripData, isPartialPayment, isRemainingPayment]);

  const paymentBreakdown = useMemo(
    () => calculatePaymentBreakdown(),
    [calculatePaymentBreakdown]
  );

  const total = useMemo(
    () => paymentBreakdown.subtotal,
    [paymentBreakdown.subtotal]
  );

  // Countdown effect for payment completion
  useEffect(() => {
    if (paymentCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (paymentCompleted && countdown === 0) {
      // Auto redirect when countdown reaches 0
      router.push("/my-trips");
    }
  }, [paymentCompleted, countdown, router]);

  const formatDate = useCallback(
    (dateString: Date | string | undefined | null): string => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    []
  );

  const handlePaymentClick = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const paymentUserDetails = userDetails || {
        name: "Guest User",
        email: "",
        phone: "",
      };

      await initiateRazorpayPayment({
        amount: total,
        bookingId,
        userDetails: paymentUserDetails,
        tripTitle: tripData?.title || "Trip Booking",
        onSuccess: async (paymentData) => {
          setShowLoader(true);

          try {
            // Use the new Razorpay-specific payment processing
            const result = await processRazorpayPayment(
              bookingId,
              paymentData,
              total
            );

            if (result.success) {
              toast.success(result.message, {
                style: {
                  background: "rgba(147, 51, 234, 0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196, 181, 253, 0.3)",
                  color: "white",
                  fontFamily: "var(--font-instrument)",
                },
                duration: 3000,
              });
            } else {
              throw new Error(result.error || "Payment processing failed");
            }
          } catch (error) {
            console.error("Payment processing error:", error);
            toast.error(
              "Payment was successful but processing failed. Please contact support.",
              {
                style: {
                  background: "rgba(239, 68, 68, 0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(252, 165, 165, 0.3)",
                  color: "white",
                  fontFamily: "var(--font-instrument)",
                },
                duration: 5000,
              }
            );
          }
        },
        onFailure: async (error) => {
          setIsProcessing(false);

          // Log the failure using our action
          await handlePaymentFailure(bookingId, error);

          toast.error(error, {
            style: {
              background: "rgba(239, 68, 68, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(252, 165, 165, 0.3)",
              color: "white",
              fontFamily: "var(--font-instrument)",
            },
            duration: 3000,
          });
        },
      });
    } catch (error) {
      setIsProcessing(false);
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment. Please try again.", {
        style: {
          background: "rgba(239, 68, 68, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(252, 165, 165, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 3000,
      });
    }
  }, [bookingId, total, isProcessing, tripData, userDetails]);

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
    setIsProcessing(false);
    setPaymentCompleted(true);
  }, []);

  const handleGoToTrips = useCallback(() => {
    router.push("/my-trips");
  }, [router]);

  return (
    <>
      {paymentCompleted ? (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              {/* Success Icon */}
              <div className="bg-green-100 rounded-full p-6 inline-flex mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>

              {/* Success Message */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Payment Completed!
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Thank you for your payment. Your booking for{" "}
                <span className="font-semibold text-gray-800">
                  {tripData?.title}
                </span>{" "}
                has been confirmed successfully!
              </p>

              {/* Trip Details Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Trip Dates</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(tripData?.startDate)} -{" "}
                        {formatDate(tripData?.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium text-gray-900">
                        {tripData.numberOfGuests}{" "}
                        {tripData.numberOfGuests === 1 ? "Person" : "People"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount Paid:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons and Countdown */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
                <Button
                  onClick={handleGoToTrips}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  Go to My Trips
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">You will be redirected in</span>
                  <div className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full min-w-[3rem] text-center">
                    {countdown}
                  </div>
                  <span className="text-sm">seconds</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-blue-800">
                      <strong>What&apos;s next?</strong>
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>
                        • A confirmation email has been sent to your registered
                        email
                      </li>
                      <li>
                        • You can view your booking details in {`"My Trips"`}
                      </li>
                      <li>• Contact support if you have any questions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <GreenConfirmationLoader
            isVisible={showLoader}
            onComplete={handleLoaderComplete}
            loadingDuration={2000}
          />

          <div
            className="relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('${
                tripData?.tripImage ||
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              }')`,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
              <div className="flex items-center justify-between mt-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-6 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full mb-4">
                    <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                      Payment Confirmation
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
                    Confirm Your Payment
                    <span className="block text-purple-300 mt-2">
                      {tripData?.title}
                    </span>
                  </h1>
                  <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
                    Verify your trip details and proceed to secure payment
                  </p>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium font-instrument flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(tripData?.startDate)} -{" "}
                      {formatDate(tripData?.endDate)}
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

          <div className="max-w-7xl -mt-24 relative z-20 mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-xl border p-6 transform translate-y-0 hover:translate-y-[-2px] transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Breakdown
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <span className="text-gray-900 font-medium">
                          Trip Cost
                        </span>
                        <p className="text-sm text-gray-500">
                          ₹
                          {(
                            booking.pricePerPerson || tripData.pricePerPerson
                          ).toLocaleString()}{" "}
                          × {booking.participants || tripData.numberOfGuests}
                          {(booking.participants || tripData.numberOfGuests) ===
                          1
                            ? " person"
                            : " people"}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(paymentBreakdown.subtotal)}
                      </span>
                    </div>

                    {/* <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">
                          Platform Fee
                        </span>
                        <div className="group relative">
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Service and maintenance fee (2.5%)
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">(2.5%)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(platformFee)}
                      </span>
                    </div> */}

                    {/* <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">
                          Service Fee
                        </span>
                        <div className="group relative">
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Processing and support fee (7.5%)
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">(7.5%)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(serviceFee)}
                      </span>
                    </div> */}

                    {/* <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">GST</span>
                        <span className="text-xs text-gray-500">(18%)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(gstAmount)}
                      </span>
                    </div> */}

                    <div className="flex justify-between items-center py-4 bg-gray-50 -mx-6 px-6 rounded-lg mt-4">
                      <span className="text-lg font-bold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white rounded-xl shadow-xl border p-6 transform translate-y-0 hover:translate-y-[-2px] transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">
                          Secure Payment Gateway
                        </p>
                        <p className="text-sm text-blue-700">
                          Your payment is protected by industry-standard
                          encryption
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        VISA
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        MASTERCARD
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        UPI
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        NET BANKING
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePaymentClick}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay {formatCurrency(total)}
                  </Button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-xl transform translate-y-0 hover:translate-y-[-2px] transition-transform duration-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">
                        Important Information
                      </h3>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>
                          • Payment confirmation will be sent to your registered
                          email
                        </li>
                        <li>
                          • Cancellation policy applies as per terms and
                          conditions
                        </li>
                        <li>
                          • Refunds will be processed within 5-7 business days
                        </li>
                        <li>
                          • For support, contact us through the provided
                          channels
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Trip Summary Card */}
                  <div className="bg-white rounded-xl shadow-xl border overflow-hidden transform translate-y-0 hover:translate-y-[-2px] transition-transform duration-300">
                    {/* Trip Image */}
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={
                          tripData?.tripImage ||
                          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                        }
                        fill
                        alt={tripData?.title || "Trip"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg truncate">
                          {tripData?.title || "Amazing Trip"}
                        </h3>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(tripData?.startDate)} -{" "}
                          {formatDate(tripData?.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {tripData.numberOfGuests}{" "}
                          {tripData.numberOfGuests === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>Destination Trip</span>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            Price per person:
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(
                              booking.pricePerPerson || tripData.pricePerPerson
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-xl border p-6 transform translate-y-0 hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Security & Trust
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          256-bit SSL encryption
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          PCI DSS compliant
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          Secure payment gateway
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          24/7 fraud monitoring
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

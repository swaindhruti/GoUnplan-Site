"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  ArrowLeft,
  ChevronDown,
  MapPin,
  CreditCard,
  Shield,
  CheckCircle,
  Users,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { BackButton } from "@/components/global/buttons";
import { completePaymentAction } from "@/actions/booking/actions";

interface PaymentFormProps {
  tripData: {
    title?: string;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
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
}

export function PaymentForm({ tripData }: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed" | null
  >(null);

  const subtotal = useMemo(
    () => tripData.numberOfGuests * tripData.pricePerPerson,
    [tripData.numberOfGuests, tripData.pricePerPerson]
  );
  const serviceFee = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const handlePaymentClick = useCallback(() => {
    setShowPaymentModal(true);
    setPaymentStatus(null);
  }, []);

  const handlePaymentConfirm = useCallback(async () => {
    setIsProcessing(true);
    setPaymentStatus("pending");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call server action to update payment status
      const result = await completePaymentAction(
        tripData.travelPlanId,
        total,
        tripData.numberOfGuests
      );

      if (result.success) {
        setPaymentStatus("success");
        setTimeout(() => {
          setShowPaymentModal(false);
          setIsProcessing(false);
          // Redirect to user dashboard after successful payment
          router.push("/dashboard/user");
        }, 2000);
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      setIsProcessing(false);
    }
  }, [tripData.travelPlanId, total, tripData.numberOfGuests, router]);

  const handlePaymentDecline = useCallback(() => {
    setPaymentStatus("failed");
    setIsProcessing(false);
  }, []);

  const handleRetryPayment = useCallback(() => {
    setPaymentStatus(null);
    setIsProcessing(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (!isProcessing) {
      setShowPaymentModal(false);
      setPaymentStatus(null);
    }
  }, [isProcessing]);

  const handleBack = () => {
    router.push(`/trips/booking/${tripData.travelPlanId}`);
  };

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
                <CreditCard className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl font-playfair">
              Payment Details
            </h1>
            <p className="text-xl text-white/90 mb-8 font-roboto max-w-3xl mx-auto">
              Please review your trip summary and complete your payment
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 text-white font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Secure Payment</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 text-white font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Summary Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl overflow-hidden">
              {/* Trip Header */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-2xl">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-2">
                      {tripData.title || "Trip Summary"}
                    </h2>
                    <p className="text-purple-600 font-semibold font-roboto">
                      Review your booking details
                    </p>
                  </div>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200 hover:bg-white transition-all duration-300 shadow-lg"
                  >
                    <ChevronDown
                      className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                        isExpanded ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Trip Details */}
                    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8">
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
                            Trip Dates:
                          </span>
                          <span className="font-bold text-gray-900 font-roboto text-lg">
                            {tripData.startDate} - {tripData.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                          <span className="text-gray-600 font-medium font-roboto">
                            Participants:
                          </span>
                          <span className="font-bold text-gray-900 font-roboto text-lg">
                            {tripData.numberOfGuests}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8">
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
                            ₹{tripData.pricePerPerson}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-slate-200">
                          <span className="text-gray-600 font-medium font-roboto">
                            Subtotal (₹{tripData.pricePerPerson} ×{" "}
                            {tripData.numberOfGuests}):
                          </span>
                          <span className="font-bold text-gray-900 font-roboto text-lg">
                            ₹{subtotal}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                          <span className="text-gray-600 font-medium font-roboto">
                            Service fee (10%):
                          </span>
                          <span className="font-bold text-gray-900 font-roboto text-lg">
                            ₹{serviceFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 p-8 rounded-2xl">
                    <span className="text-2xl font-bold text-gray-900 font-playfair">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-purple-600 font-roboto">
                      ₹{total}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="bg-white text-gray-700 font-bold text-lg
                           border border-slate-300 rounded-2xl py-4 px-8
                           hover:bg-slate-50 hover:border-slate-400
                           transition-all duration-300 shadow-lg hover:shadow-xl
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-3 font-montserrat"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back to Booking
                </Button>
                <Button
                  onClick={handlePaymentClick}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg
                           border border-purple-600 rounded-2xl py-4 px-8
                           hover:from-purple-700 hover:to-purple-800 hover:border-purple-700
                           transition-all duration-300 shadow-lg hover:shadow-xl
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex-1 flex items-center justify-center gap-3 font-montserrat"
                >
                  <CreditCard className="w-6 h-6" />
                  Complete Payment
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Security Info Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                  Security
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium font-roboto">
                    SSL Encrypted
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium font-roboto">
                    PCI Compliant
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium font-roboto">
                    Secure Payment
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium font-roboto">
                    Data Protection
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 font-playfair mb-6">
                Payment Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium font-roboto">
                    Subtotal:
                  </span>
                  <span className="font-bold text-gray-900 font-roboto">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium font-roboto">
                    Service Fee:
                  </span>
                  <span className="font-bold text-gray-900 font-roboto">
                    ₹{serviceFee}
                  </span>
                </div>
                <div className="border-t border-purple-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold font-roboto text-lg">
                      Total:
                    </span>
                    <span className="font-bold text-purple-600 font-roboto text-xl">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                  Contact Information
                </h3>
              </div>

              <div className="space-y-6">
                {/* Host Contact */}
                {tripData.host && (
                  <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60">
                    <h4 className="font-bold text-gray-900 font-roboto mb-2">
                      Trip Host
                    </h4>
                    <div className="space-y-2">
                      <p className="text-gray-700 font-roboto">
                        <span className="font-semibold">Name:</span>{" "}
                        {tripData.host.user?.name || "Host"}
                      </p>
                      {tripData.host.user?.phone && (
                        <p className="text-gray-700 font-roboto">
                          <span className="font-semibold">Phone:</span>{" "}
                          {tripData.host.user.phone}
                        </p>
                      )}
                      {tripData.host.hostEmail && (
                        <p className="text-gray-700 font-roboto">
                          <span className="font-semibold">Email:</span>{" "}
                          {tripData.host.hostEmail}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Company Contact */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                  <h4 className="font-bold text-gray-900 font-roboto mb-2">
                    Company Support
                  </h4>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-roboto">
                      <span className="font-semibold">WhatsApp:</span> +91 98765
                      43210
                    </p>
                    <p className="text-gray-600 font-roboto text-sm">
                      Available 24/7 for instant support
                    </p>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <button
                  onClick={() => {
                    const message = `Hi! I need help with my booking for "${tripData.title}". Booking ID: ${tripData.travelPlanId}`;
                    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
                      message
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-2xl transition-all duration-300 font-montserrat flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  WhatsApp Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              disabled={isProcessing}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              {paymentStatus === null && (
                <>
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-2xl mb-6">
                    <CreditCard className="w-12 h-12 text-purple-600 mx-auto" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
                    Confirm Payment
                  </h2>
                  <p className="text-gray-600 font-roboto mb-6">
                    You are about to complete your payment of{" "}
                    <span className="font-bold text-purple-600">₹{total}</span>{" "}
                    for <span className="font-semibold">{tripData.title}</span>
                  </p>

                  <div className="space-y-4">
                    <Button
                      onClick={handlePaymentConfirm}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-2xl transition-all duration-300 font-montserrat"
                    >
                      Confirm Payment
                    </Button>
                    <Button
                      onClick={handlePaymentDecline}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 font-bold py-3 rounded-2xl transition-all duration-300 font-montserrat"
                    >
                      Decline Payment
                    </Button>
                  </div>
                </>
              )}

              {paymentStatus === "pending" && (
                <>
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-2xl mb-6">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
                    Processing Payment
                  </h2>
                  <p className="text-gray-600 font-roboto">
                    Please wait while we process your payment...
                  </p>
                </>
              )}

              {paymentStatus === "success" && (
                <>
                  <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-2xl mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
                    Payment Successful!
                  </h2>
                  <p className="text-gray-600 font-roboto mb-4">
                    Your payment has been processed successfully. You will
                    receive a confirmation email shortly.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <p className="text-green-800 font-semibold">
                      Booking Confirmed
                    </p>
                    <p className="text-green-700 text-sm">
                      Your trip is now confirmed and ready to go!
                    </p>
                  </div>
                </>
              )}

              {paymentStatus === "failed" && (
                <>
                  <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-2xl mb-6">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-4">
                    Payment Failed
                  </h2>
                  <p className="text-gray-600 font-roboto mb-6">
                    Your payment could not be processed. Please try again or
                    contact support if the issue persists.
                  </p>

                  <div className="space-y-4">
                    <Button
                      onClick={handleRetryPayment}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 rounded-2xl transition-all duration-300 font-montserrat"
                    >
                      Retry Payment
                    </Button>
                    <Button
                      onClick={handleCloseModal}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 font-bold py-3 rounded-2xl transition-all duration-300 font-montserrat"
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

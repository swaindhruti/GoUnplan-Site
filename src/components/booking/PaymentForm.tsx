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
} from "lucide-react";

interface PaymentFormProps {
  onComplete?: () => void;
  tripData: {
    title?: string;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    pricePerPerson: number;
    travelPlanId: string;
  };
}

export function PaymentForm({ onComplete, tripData }: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const subtotal = useMemo(
    () => tripData.numberOfGuests * tripData.pricePerPerson,
    [tripData.numberOfGuests, tripData.pricePerPerson]
  );
  const serviceFee = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const handlePayment = useCallback(async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate payment
    setIsProcessing(false);
    if (onComplete) onComplete();
  }, [onComplete]);

  const handleBack = () => {
    router.push(`/trips/booking/${tripData.travelPlanId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Payment Details
          </h1>
          <p className="text-gray-600 font-roboto max-w-2xl mx-auto">
            Please review your trip summary before proceeding
          </p>
        </div>

        <div className="space-y-8">
          {/* Trip Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Trip Header */}
            <div className="bg-purple-50 border-b border-purple-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                    {tripData.title || "Trip Summary"}
                  </h2>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      isExpanded ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trip Details */}
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
                          Trip Dates:
                        </span>
                        <span className="font-semibold text-gray-900 font-roboto">
                          {tripData.startDate} - {tripData.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-600 font-roboto">
                          Participants:
                        </span>
                        <span className="font-semibold text-gray-900 font-roboto">
                          {tripData.numberOfGuests}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details */}
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
                          ${tripData.pricePerPerson}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-roboto">
                          Subtotal (${tripData.pricePerPerson} ×{" "}
                          {tripData.numberOfGuests}):
                        </span>
                        <span className="font-semibold text-gray-900 font-roboto">
                          ${subtotal}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-600 font-roboto">
                          Service fee (10%):
                        </span>
                        <span className="font-semibold text-gray-900 font-roboto">
                          ${serviceFee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center bg-purple-50 border border-purple-200 p-6 rounded-xl">
                  <span className="text-xl font-bold text-gray-900 font-playfair">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-purple-600 font-roboto">
                    ${total}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
            <Button
              onClick={handleBack}
              disabled={isProcessing}
              className="bg-white text-gray-700 font-semibold text-base
                       border border-gray-300 rounded-xl py-3 px-6
                       hover:bg-gray-50 hover:border-gray-400
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 font-montserrat"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Booking
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-purple-600 text-white font-semibold text-base
                       border border-purple-600 rounded-xl py-3 px-6
                       hover:bg-purple-700 hover:border-purple-700
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex-1 flex items-center justify-center gap-2 font-montserrat"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Continue to Payment
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

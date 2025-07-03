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

  // Updated color palette to match BookingSummary component
  const cardColors = useMemo(
    () => ({
      header: "bg-[#a0c4ff]",
      title: "bg-[#e0c6ff]",
      tripDetails: "bg-[#fdffb6]", // pale yellow
      pricing: "bg-[#caffbf]", // light green
      teamMembers: "bg-[#ffd6ff]", // pink lavender
      bookingInfo: "bg-[#a0c4ff]", // baby blue
      totalAmount: "bg-[#1e293b]", // dark slate
    }),
    []
  );

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
    <div className="min-h-screen bg-[#f9f9ff] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 flex flex-col">
          <div
            className={`inline-block ${cardColors.header} border-3 border-black rounded-xl px-8 py-4 mb-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mx-auto`}
          >
            <h1 className="text-4xl font-black text-black uppercase tracking-tight">
              Payment Details
            </h1>
          </div>
          <p className="font-bold text-lg text-black bg-white inline-block px-5 py-3 border-3 border-black rounded-lg mx-auto">
            Please review your trip summary before proceeding
          </p>
        </div>

        <div className="space-y-6">
          {/* Trip Summary */}
          <div className="border-3 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div
              className={`${cardColors.title} text-black border-b-3 border-black p-6`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white p-2.5 rounded-md border-2 border-black">
                  <MapPin className="w-7 h-7 text-black" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black uppercase">
                  {tripData.title || "Trip Summary"}
                </h2>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-auto bg-white p-2 rounded-md border-2 border-black"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-black transition-transform ${
                      isExpanded ? "transform rotate-180" : ""
                    }`}
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trip Details */}
                  <div
                    className={`border-3 border-black rounded-xl p-5 ${cardColors.tripDetails} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
                      <div className="bg-white p-2.5 rounded-md border-2 border-black">
                        <Calendar
                          className="w-6 h-6 text-black"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="font-black text-xl text-black uppercase">
                        Trip Details
                      </h3>
                    </div>

                    <div className="space-y-3 font-bold">
                      <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                        <span>Trip Dates:</span>
                        <span className="font-black">
                          {tripData.startDate} - {tripData.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                        <span>Participants:</span>
                        <span className="font-black">
                          {tripData.numberOfGuests}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div
                    className={`border-3 border-black rounded-xl p-5 ${cardColors.pricing} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
                      <div className="bg-white p-2.5 rounded-md border-2 border-black">
                        <DollarSign
                          className="w-6 h-6 text-black"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="font-black text-xl text-black uppercase">
                        Pricing
                      </h3>
                    </div>

                    <div className="space-y-3 font-bold">
                      <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                        <span>Price per person:</span>
                        <span className="font-black">
                          ${tripData.pricePerPerson}
                        </span>
                      </div>
                      <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                        <span>
                          Subtotal (${tripData.pricePerPerson} ×{" "}
                          {tripData.numberOfGuests}):
                        </span>
                        <span className="font-black">${subtotal}</span>
                      </div>
                      <div className="flex justify-between bg-white border-2 border-black p-3 rounded-md text-lg">
                        <span>Service fee (10%):</span>
                        <span className="font-black">${serviceFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div
                  className={`flex justify-between ${cardColors.totalAmount} border-3 border-black p-4 rounded-xl text-white text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <span className="font-black text-xl">TOTAL AMOUNT</span>
                  <span className="font-black text-xl">${total}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-black">
            <Button
              onClick={handleBack}
              disabled={isProcessing}
              className="bg-white text-black font-black uppercase 
                       border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-200 py-6 px-12
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 h-16"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              Back to Booking
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`${cardColors.header} text-black font-black uppercase 
                       border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       hover:text-white
                       transition-all duration-200 py-6 px-12
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex-1 flex items-center justify-center h-16`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" strokeWidth={2.5} />
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

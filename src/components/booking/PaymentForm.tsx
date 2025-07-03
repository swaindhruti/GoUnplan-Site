"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Lock,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  ChevronDown
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

  // Function to get random background color for cards
  const getRandomBgColor = () => {
    const colors = [
      "bg-[#f5f5e6]", // muted beige
      "bg-[#d3dae6]", // muted blue
      "bg-[#d7dbcb]", // muted olive
      "bg-[#e6dad3]", // muted clay
      "bg-[#e3e3e3]" // muted gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
    <div className="min-h-screen bg-[#f5f5e6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 flex flex-col">
          <div className="inline-block bg-[#bcb7c5] border-3 border-black rounded-xl px-8 py-4 mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-2xl justify-center mx-auto">
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              Payment Details
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Trip Summary */}
          <div className="border-3 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div
              className={`${getRandomBgColor()} text-black border-b-3 border-black p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white p-1.5 rounded-md border-2 border-black">
                  <Calendar className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black uppercase">
                  Booking Summary
                </h2>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-auto bg-white p-1.5 rounded-md border-2 border-black"
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
              <div className="p-4 space-y-4">
                <div className="bg-[#e3e3e3] border-2 border-black p-3 rounded-md font-bold">
                  <span className="block text-lg font-black">
                    {tripData.title || "Adventure Trip"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[#d3dae6] border-2 border-black p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar
                        className="w-4 h-4 text-black"
                        strokeWidth={2.5}
                      />
                      <span className="font-bold">Trip Dates</span>
                    </div>
                    <p className="bg-white border-2 border-black p-2 rounded-md text-center font-bold">
                      {tripData.startDate} - {tripData.endDate}
                    </p>
                  </div>

                  <div className="bg-[#f5f5e6] border-2 border-black p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-black" strokeWidth={2.5} />
                      <span className="font-bold">Guests</span>
                    </div>
                    <p className="bg-white border-2 border-black p-2 rounded-md text-center font-bold">
                      {tripData.numberOfGuests}{" "}
                      {tripData.numberOfGuests > 1 ? "guests" : "guest"}
                    </p>
                  </div>
                </div>

                <div className="bg-[#d7dbcb] border-2 border-black p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign
                      className="w-4 h-4 text-black"
                      strokeWidth={2.5}
                    />
                    <span className="font-bold">Cost Breakdown</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                      <span className="font-bold">Price per person:</span>
                      <span className="font-black">
                        ${tripData.pricePerPerson}
                      </span>
                    </div>
                    <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                      <span className="font-bold">
                        Subtotal (${tripData.pricePerPerson} ×{" "}
                        {tripData.numberOfGuests}):
                      </span>
                      <span className="font-black">${subtotal}</span>
                    </div>
                    <div className="flex justify-between bg-white border-2 border-black p-2 rounded-md">
                      <span className="font-bold">Service fee (10%):</span>
                      <span className="font-black">${serviceFee}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between bg-black text-white border-2 border-black p-3 rounded-md">
                  <span className="font-black text-lg">TOTAL AMOUNT</span>
                  <span className="font-black text-lg">${total}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Card Info */}
          <div className="border-3 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <div className="bg-[#bcb7c5] text-black border-b-3 border-black p-4">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-md border-2 border-black">
                  <CreditCard
                    className="w-5 h-5 text-black"
                    strokeWidth={2.5}
                  />
                </div>
                <h2 className="text-xl font-black uppercase">Payment Method</h2>
              </div>
            </div>

            <div className="p-4 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="font-bold text-black">
                  Card Number <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="border-2 border-black p-2 font-mono bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="font-bold text-black">
                    Expiry Date <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="border-2 border-black p-2 font-mono bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc" className="font-bold text-black">
                    CVC <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    className="border-2 border-black p-2 font-mono bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName" className="font-bold text-black">
                  Name on Card <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  className="border-2 border-black p-2 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 bg-[#e6dad3] border-2 border-black p-3 rounded-md font-bold">
                <Lock className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Terms and Policies */}
          <div className="border-3 border-black rounded-xl p-4 bg-[#e9cfcf] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="bg-white border-2 border-black p-3 rounded-md font-bold text-center">
              By completing this payment, you agree to our{" "}
              <a
                href="#"
                className="underline decoration-2 decoration-black hover:bg-[#f5f5e6] transition-colors"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline decoration-2 decoration-black hover:bg-[#f5f5e6] transition-colors"
              >
                Cancellation Policy
              </a>
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t-3 border-black">
            <Button
              onClick={handleBack}
              disabled={isProcessing}
              className="bg-white text-black font-black uppercase 
                       border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-200 py-3 px-6 rounded-md
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              Back to Summary
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-black text-white font-black uppercase 
                       border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-200 py-3 px-6 rounded-md
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex-1 flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" strokeWidth={2.5} />
                  Pay ${total} Now
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

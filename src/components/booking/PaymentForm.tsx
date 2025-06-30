"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock } from "lucide-react";

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
    <div className="flex justify-center items-center p-10 md:p-20">
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>

        {/* Trip Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-800">
            <div className="flex justify-between font-medium">
              <span>{tripData.title}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {tripData.startDate} - {tripData.endDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                {tripData.numberOfGuests} guest
                {tripData.numberOfGuests > 1 ? "s" : ""}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  ${tripData.pricePerPerson} × {tripData.numberOfGuests}
                </span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Card Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" className="font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isProcessing ? "Processing..." : `Pay $${total}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

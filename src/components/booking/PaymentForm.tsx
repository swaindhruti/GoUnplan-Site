"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock } from "lucide-react";

interface PaymentFormProps {
  onBack: () => void;
  onComplete: () => void;
  tripData: {
    title: string;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    pricePerPerson: number;
  };
}

export function PaymentForm({
  onBack,
  onComplete,
  tripData
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  // const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")

  const subtotal = tripData.numberOfGuests * tripData.pricePerPerson;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Payment Details
        </h2>

        {/* Trip Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">{tripData.title}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {tripData.startDate} - {tripData.endDate}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {tripData.numberOfGuests} guest
                {tripData.numberOfGuests > 1 ? "s" : ""}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  ${tripData.pricePerPerson} × {tripData.numberOfGuests} guests
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

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
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
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="font-mono"
                  />
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
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
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
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Phone, Shield } from "lucide-react";
import Link from "next/link";
import { sendOtp } from "@/actions/phone/action";

// List of country codes (add more as needed)
const COUNTRY_CODES = [
  { code: "+1", label: "🇺🇸 US" },
  { code: "+91", label: "🇮🇳 India" },
  { code: "+44", label: "🇬🇧 UK" },
  { code: "+61", label: "🇦🇺 Australia" }
];

export default function PhoneAuthPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+1"); // default US
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    return value.replace(/[^\d]/g, ""); // keep only digits
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setErrors({ phone: "Please enter a phone number" });
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
    if (cleanPhone.length < 7) {
      setErrors({ phone: "Please enter a valid phone number" });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const result = await sendOtp(`${countryCode}${cleanPhone}`);

      if (result.success) {
        setStep("otp");
        setCountdown(30);
      } else {
        setErrors({ phone: result.error || "Failed to send OTP" });
      }
    } catch (error) {
      setErrors({ phone: "Unexpected error. Please try again." });
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
      const phone = `${countryCode}${cleanPhone}`;

      const authResult = await signIn("phone", {
        phone,
        otp,
        redirect: false
      });

      if (authResult?.ok) {
        router.push("/");
        router.refresh();
      } else {
        setErrors({ otp: "Authentication failed" });
      }
    } catch (error) {
      setErrors({ otp: "Unexpected error. Please try again." });
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setErrors({});
    try {
      const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
      const result = await sendOtp(`${countryCode}${cleanPhone}`);

      if (result.success) {
        setCountdown(30);
      } else {
        setErrors({ otp: result.error || "Failed to resend OTP" });
      }
    } catch (error) {
      setErrors({ otp: "Unexpected error. Please try again." });
      console.error("Error resending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {step === "phone" ? "Enter your phone number" : "Verify your phone"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === "phone"
              ? "We'll send you a verification code"
              : `We sent a code to ${countryCode}${phoneNumber}`}
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {step === "phone" ? (
                <>
                  <Phone className="w-5 h-5" />
                  Phone Number
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verification Code
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "phone"
                ? "Enter your phone number to receive a verification code"
                : "Enter the 6-digit code sent to your phone"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === "phone" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="border rounded-md px-2 h-12 bg-white"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label} {c.code}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(formatPhoneNumber(e.target.value))
                      }
                      placeholder="Enter phone number"
                      className="flex-1 h-12"
                    />
                  </div>
                  {errors.phone && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.phone}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={isLoading || !phoneNumber}
                  className="w-full h-12"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup className="flex gap-3">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-12 h-14 border-2 border-gray-400 rounded-lg text-2xl font-mono text-center focus:outline-none focus:border-gray-700"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {errors.otp && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.otp}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  <Button
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isLoading}
                    className="text-sm"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setErrors({});
                  }}
                  className="w-full"
                >
                  Use Different Number
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

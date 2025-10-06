"use client";

import { useState, useEffect } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
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
  { code: "+61", label: "🇦🇺 Australia" },
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

  const formatPhoneNumber = (value: string) => {
    return value.replace(/[^\d]/g, "");
  };

  const handlePhoneKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Tab",
      "Enter",
    ];

    if (e.ctrlKey || e.metaKey) return;

    if (allowedKeys.includes(e.key)) return;

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Clean pasted input to digits only
  const handlePhonePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData?.getData("text") ?? "";
    const cleaned = paste.replace(/[^\d]/g, "");
    if (!cleaned) return;
    setPhoneNumber((prev) => {
      // append cleaned digits to existing value
      return `${prev}${cleaned}`;
    });
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!phoneNumber) {
      const errorMessage = "Please enter a phone number";
      setErrors({ phone: errorMessage });
      toast.error(errorMessage, {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 4000,
      });
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
    if (cleanPhone.length < 7) {
      const errorMessage = "Please enter a valid phone number";
      setErrors({ phone: errorMessage });
      toast.error(errorMessage, {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    toast.loading("Sending verification code...", {
      style: {
        background: "rgba(147, 51, 234, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(196, 181, 253, 0.3)",
        color: "white",
        fontFamily: "var(--font-instrument)",
      },
      duration: 2000,
    });

    try {
      const result = await sendOtp(`${countryCode}${cleanPhone}`);

      if (result.success) {
        setStep("otp");
        setCountdown(30);
        toast.success(`Code sent to ${countryCode}${cleanPhone}`, {
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
        const errorMessage = result.error || "Failed to send OTP";
        setErrors({ phone: errorMessage });
        toast.error(errorMessage, {
          style: {
            background: "rgba(147, 51, 234, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            color: "white",
            fontFamily: "var(--font-instrument)",
          },
          duration: 4000,
        });
      }
    } catch (error) {
      const errorMessage = "Unexpected error. Please try again.";
      setErrors({ phone: errorMessage });
      toast.error(errorMessage, {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 4000,
      });
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      const errorMessage = "Please enter a valid 6-digit OTP";
      setErrors({ otp: errorMessage });
      toast.error(errorMessage, {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    toast.loading("Verifying code...", {
      style: {
        background: "rgba(147, 51, 234, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(196, 181, 253, 0.3)",
        color: "white",
        fontFamily: "var(--font-instrument)",
      },
      duration: 2000,
    });

    try {
      const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
      const phone = `${countryCode}${cleanPhone}`;

      const authResult = await signIn("phone", {
        phone,
        otp,
        redirect: false,
      });

      if (authResult?.ok) {
        toast.success("Phone verified successfully! Welcome!", {
          style: {
            background: "rgba(147, 51, 234, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            color: "white",
            fontFamily: "var(--font-instrument)",
          },
          duration: 3000,
        });
        router.push("/");
        router.refresh();
      } else {
        const errorMessage = "Invalid verification code. Please try again.";
        setErrors({ otp: errorMessage });
        toast.error(errorMessage, {
          style: {
            background: "rgba(147, 51, 234, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            color: "white",
            fontFamily: "var(--font-instrument)",
          },
          duration: 4000,
        });
      }
    } catch (error) {
      const errorMessage = "Verification failed. Please try again.";
      setErrors({ otp: errorMessage });
      toast.error(errorMessage, {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 4000,
      });
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setErrors({});

    toast.loading("Resending verification code...", {
      style: {
        background: "rgba(147, 51, 234, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(196, 181, 253, 0.3)",
        color: "white",
        fontFamily: "var(--font-instrument)",
      },
      duration: 2000,
    });

    try {
      const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
      const result = await sendOtp(`${countryCode}${cleanPhone}`);

      if (result.success) {
        setCountdown(30);
        toast.success("New code sent successfully!", {
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
        const errorMessage = result.error || "Failed to resend OTP";
        setErrors({ otp: errorMessage });
        toast.error(errorMessage, {
          style: {
            background: "rgba(147, 51, 234, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            color: "white",
            fontFamily: "var(--font-instrument)",
          },
          duration: 4000,
        });
      }
    } catch (error) {
      const errorMessage = "Failed to resend code. Please try again.";
      setErrors({ otp: errorMessage });
      toast.error(errorMessage, {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 4000,
      });
      console.error("Error resending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseifferentNumber = () => {
    setStep("phone");
    setOtp("");
    setErrors({});
    toast.info("Enter a different phone number", {
      style: {
        background: "rgba(147, 51, 234, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(196, 181, 253, 0.3)",
        color: "white",
        fontFamily: "var(--font-instrument)",
      },
      duration: 2000,
    });
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(formatPhoneNumber(e.target.value))
                      }
                      placeholder="Enter phone number"
                      className="flex-1 h-12"
                      onKeyDown={handlePhoneKeyDown}
                      onPaste={handlePhonePaste}
                      onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter" && phoneNumber) {
                          handleSendOtp();
                        }
                      }}
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) =>
                        setOtp(value.replace(/\D/g, "").slice(0, 6))
                      }
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
                  onClick={handleUseifferentNumber}
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

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  resetPassword,
  verifyResetToken,
} from "@/actions/password-reset/actions";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

function ResetPasswordForm() {
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        const result = await verifyResetToken(token);
        setIsTokenValid(true);
        setUser(result.user);
      } catch (error) {
        console.error("Token verification error:", error);
        setIsTokenValid(false);
        toast.error("Invalid or expired reset link", {
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
    };

    verifyToken();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don&apos;t match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError, {
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

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) return;

    setIsLoading(true);
    setErrors({});

    try {
      await resetPassword(token, formData.password);

      setIsSuccess(true);
      toast.success("Password reset successful!", {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 5000,
      });

      // Redirect to signin page after a delay
      setTimeout(() => {
        router.push(
          "/auth/signin?message=Password reset successfully. You can now sign in."
        );
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
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
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isTokenValid === null) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  // Invalid token
  if (isTokenValid === false) {
    return (
      <div className="w-full">
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-bricolage">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 font-instrument mt-2">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-instrument">
              The reset link may have expired or been used already. Please
              request a new one.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Link href="/auth/forgot-password">
              <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument">
                Request New Reset Link
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="w-full h-12 border-purple-200 text-purple-600 hover:bg-purple-50 font-instrument"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full">
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-bricolage">
              Password Reset Complete
            </h1>
            <p className="text-gray-600 font-instrument mt-2">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-instrument">
              Redirecting you to sign in page...
            </AlertDescription>
          </Alert>

          <Link href="/auth/signin">
            <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument">
              Continue to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="text-center">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-bricolage">
            Set New Password
          </h1>
          <p className="text-gray-600 font-instrument mt-2">
            Hi {user?.name}! Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-instrument">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 font-instrument">
                New Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument ${
                    errors.password ? "border-red-400" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-instrument mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 font-instrument">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument ${
                    errors.confirmPassword ? "border-red-400" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 font-instrument mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Updating Password...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Update Password</span>
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-2">
              <Compass className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 font-bricolage">
                GoUnplan
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-instrument font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 font-instrument"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  </div>
                }
              >
                <ResetPasswordForm />
              </Suspense>
            </div>
          </div>
        </div>
        {/* Right Side - Image */}
        <div className="hidden lg:block flex-1 relative">
          <Image
            src="https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?q=80&w=2070&auto=format&fit=crop"
            alt="Peaceful lake with mountains"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-2xl font-bold font-bricolage mb-2">
              Fresh Start Awaits
            </h2>
            <p className="text-white/80 font-instrument">
              Set a strong password and continue your adventure with confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

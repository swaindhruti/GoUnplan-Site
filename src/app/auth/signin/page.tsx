"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Compass,
  Sparkles,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function SignInForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
      toast.success(message, {
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
  }, [searchParams]);

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

  const handleGoogleSignIn = async () => {
    try {
      // toast.loading("Redirecting to Google...", {
      //   style: {
      //     background: "rgba(147, 51, 234, 0.95)",
      //     backdropFilter: "blur(12px)",
      //     border: "1px solid rgba(196, 181, 253, 0.3)",
      //     color: "white",
      //     fontFamily: "var(--font-instrument)",
      //   },
      //   duration: 2000,
      // });

      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Google signin error:", error);
      toast.error("Failed to sign in with Google. Please try again.", {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = "Invalid email or password";
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
      } else if (result?.ok) {
        toast.success("Welcome back! Signing you in...", {
          style: {
            background: "rgba(147, 51, 234, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            color: "white",
            fontFamily: "var(--font-instrument)",
          },
          duration: 3000,
        });

        const session = await getSession();
        if (session) {
          router.push("/");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Signin error:", error);
      const networkError = "Network error. Please try again.";
      setErrors({ general: networkError });
      toast.error(networkError, {
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

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-bricolage">
            Welcome Back
          </h1>
          <p className="text-gray-600 font-instrument mt-2">
            Sign in to your account to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-instrument">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

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
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument rounded-md border ${
                    errors.email ? "border-red-400" : ""
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 font-instrument mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 font-instrument">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument rounded-md border ${
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
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 font-instrument"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors font-instrument"
              >
                Forgot password?
              </Link>
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
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </div>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-instrument">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50 font-instrument"
            onClick={handleGoogleSignIn}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50 font-instrument"
            onClick={() => {
              toast.info("redirecting to registering through phone 📱", {
                style: {
                  background: "rgba(147, 51, 234, 0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(196, 181, 253, 0.3)",
                  color: "white",
                  fontFamily: "var(--font-instrument)",
                },
                duration: 3000,
              });
              router.push("/auth/phone");
            }}
          >
            Continue with Phone
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600 font-instrument">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading fallback component
function SignInFallback() {
  return (
    <div className="p-8">
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    </div>
  );
}

export default function SignInPage() {
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
                href="/auth/signup"
                className="text-gray-600 hover:text-gray-900 font-instrument font-medium transition-colors"
              >
                Sign up
              </Link>
              <Link href="/host">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 font-instrument"
                >
                  Become a Host
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
              <Suspense fallback={<SignInFallback />}>
                <SignInForm />
              </Suspense>
            </div>
          </div>
        </div>
        {/* Right Side - Image */}
        <div className="hidden lg:block flex-1 relative">
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop"
            alt="Travel adventure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40"></div>

          <div className="relative z-10 flex items-center justify-center h-full p-12">
            <div className="max-w-lg">
              <div className="space-y-8">
                <div>
                  <Sparkles className="h-12 w-12 text-yellow-400 mb-4" />
                  <h2 className="text-4xl font-bold text-white font-bricolage mb-4">
                    Welcome Back, Explorer
                  </h2>
                  <p className="text-white/90 text-lg font-instrument">
                    Continue your journey and discover amazing new destinations
                    with trusted local hosts.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold font-bricolage mb-1">
                        Your Adventures Await
                      </h3>
                      <p className="text-white/80 text-sm font-instrument">
                        Pick up where you left off and continue exploring
                        incredible destinations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold font-bricolage mb-1">
                        Trusted Community
                      </h3>
                      <p className="text-white/80 text-sm font-instrument">
                        Connect with verified hosts and fellow travelers from
                        around the world
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold font-bricolage mb-1">
                        Seamless Experience
                      </h3>
                      <p className="text-white/80 text-sm font-instrument">
                        Your personalized dashboard with bookings, messages, and
                        recommendations
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/20">
                  <p className="text-white/60 text-sm font-instrument">
                    Welcome back to your travel community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

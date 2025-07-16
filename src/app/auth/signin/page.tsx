"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  LogIn,
  Shield,
  Eye,
  EyeOff,
  Quote,
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

// Component that uses useSearchParams
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
        setErrors({ general: "Invalid email or password" });
      } else if (result?.ok) {
        const session = await getSession();
        if (session) {
          router.push("/");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Signin error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 font-medium">Sign in to your account</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {successMessage && (
          <Alert className="mb-6 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-emerald-100/80 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <AlertDescription className="font-semibold text-emerald-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errors.general && (
          <Alert className="mb-6 bg-gradient-to-r from-red-50/90 to-pink-50/90 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-red-100/80 p-2 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDescription className="font-semibold text-red-800">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <label
              htmlFor="email"
              className="text-base font-semibold text-gray-900"
            >
              Email Address
            </label>
          </div>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 border-2 ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-purple-200 focus:border-purple-400"
              } rounded-xl bg-white text-gray-900 placeholder:text-gray-500 text-base font-medium focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm font-medium text-red-200 bg-red-500/20 backdrop-blur-sm border border-red-400/30 p-3 rounded-lg">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
            <label
              htmlFor="password"
              className="text-base font-semibold text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 pr-12 border-2 ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-purple-200 focus:border-purple-400"
              } rounded-xl bg-white text-gray-900 placeholder:text-gray-500 text-base font-medium focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="mt-2 text-sm font-medium text-red-200 bg-red-500/20 backdrop-blur-sm border border-red-400/30 p-3 rounded-lg">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 pt-4">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 border-2 border-white/40 rounded text-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
            <label
              htmlFor="remember-me"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700/90 hover:to-purple-700/90 text-white font-semibold 
                   backdrop-blur-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                   transition-all duration-300 py-4 mt-8 h-14
                   disabled:opacity-50 disabled:cursor-not-allowed
                   rounded-xl text-base flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </div>
          )}
        </Button>

        <div className="text-center pt-6">
          <p className="text-sm font-medium text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </form>
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Beautiful Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg')",
          }}
        />
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-slate-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.2),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />

        {/* Subtle animated particles effect */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "30px 30px",
              animation: "float 20s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex flex-1 relative z-10">
        {/* Left Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-white/80 backdrop-blur-xl">
          <div className="w-full max-w-md">
            <div className="bg-white/90 border border-purple-200 rounded-2xl shadow-2xl shadow-purple-200/30 p-10 flex flex-col justify-center min-h-[540px]">
              {/* Wrap the component using useSearchParams in Suspense */}
              <Suspense fallback={<SignInFallback />}>
                <SignInForm />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Right Side - Travel Image with Quote */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751847044/joshua-earle--87JyMb9ZfU-unsplash_accpod.jpg')",
              }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60" />
          </div>
          {/* Quote Content - perfectly centered */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center max-w-lg w-full">
              <div className="mb-8">
                <Quote className="h-16 w-16 text-white/60 mx-auto mb-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                &ldquo;The journey of a thousand miles begins with a single
                step&rdquo;
              </h2>
              <p className="text-xl text-white/90 font-medium drop-shadow-lg">
                Start your adventure today and discover the world&apos;s most
                incredible destinations
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-1 w-16 bg-white/30 rounded-full"></div>
                <span className="text-white/70 font-medium">Lao Tzu</span>
                <div className="h-1 w-16 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

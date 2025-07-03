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
  User,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <CardContent className=" p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <Alert className="mb-4 bg-[#caffbf] border-3 border-black rounded-xl p-4 flex items-center gap-3">
            <div className="bg-white p-1 rounded-full border-2 border-black">
              <CheckCircle2 className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            <AlertDescription className="font-bold text-black">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errors.general && (
          <Alert className="mb-4 bg-[#ffadad] border-3 border-black rounded-xl p-4 flex items-center gap-3">
            <div className="bg-white p-1 rounded-full border-2 border-black">
              <AlertCircle className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            <AlertDescription className="font-bold text-black">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#a0c4ff] p-1.5 rounded-md border-2 border-black">
              <Mail className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <label htmlFor="email" className="text-base font-bold text-black">
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
              className={`w-full px-4 py-3 border-3 ${
                errors.email ? "border-red-600" : "border-black"
              } rounded-xl bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#a0c4ff]`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-2 font-bold text-red-600 bg-[#ffadad] border-2 border-black p-2 rounded-md">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#e0c6ff] p-1.5 rounded-md border-2 border-black">
              <Lock className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <label
              htmlFor="password"
              className="text-base font-bold text-black"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-3 ${
                errors.password ? "border-red-600" : "border-black"
              } rounded-xl bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#e0c6ff]`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-2 font-bold text-red-600 bg-[#ffadad] border-2 border-black p-2 rounded-md">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 pt-3 mt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-5 w-5 border-2 border-black rounded text-black focus:ring-2 focus:ring-[#fdffb6]"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-base font-bold text-black"
            >
              Remember me
            </label>
          </div>
          <div className="text-base">
            <Link
              href="/auth/forgot-password"
              className="font-bold text-black border-b-2 border-black hover:bg-[#fdffb6] px-1"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#a0c4ff] hover:bg-[#fdffb6] text-black font-black uppercase 
                   border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                   hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                   hover:translate-x-[2px] hover:translate-y-[2px]
                   transition-all duration-200 py-6 mt-6 h-16
                   disabled:opacity-50 disabled:cursor-not-allowed
                   rounded-xl text-lg flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5" strokeWidth={2.5} />
              <span>Sign In</span>
            </div>
          )}
        </Button>
      </form>
    </CardContent>
  );
}

// Loading fallback component
function SignInFallback() {
  return (
    <CardContent className="pt-6">
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div>
      </div>
    </CardContent>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      {/* Header */}
      <header className="bg-[#e0c6ff] border-b-3 border-black py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-black text-black flex items-center"
          >
            <div className="bg-white p-2 rounded-md border-2 border-black mr-2">
              <User className="h-6 w-6 text-black" strokeWidth={2.5} />
            </div>
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signup">
              <Button
                className="bg-white text-black font-black uppercase 
                          border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                          hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                          hover:translate-x-[2px] hover:translate-y-[2px]
                          transition-all duration-200 px-6 py-3"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-3 border-black rounded-xl py-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <CardHeader className="space-y-1 border-b-3 border-black bg-[#a0c4ff] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-2 rounded-md border-2 border-black">
                <LogIn className="h-6 w-6 text-black" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-2xl font-black text-black uppercase">
                Sign in to your account
              </CardTitle>
            </div>
            <CardDescription className="text-black font-bold">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>

          {/* Wrap the component using useSearchParams in Suspense */}
          <Suspense fallback={<SignInFallback />}>
            <SignInForm />
          </Suspense>

          {/* Optional footer inside card */}
          <CardFooter className="flex justify-center border-t-3 border-black pt-6 pb-6 bg-[#fdffb6]">
            <p className="text-base font-bold text-black">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline decoration-2 font-black hover:bg-white"
              >
                Sign up now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-[#e0c6ff] border-t-3 border-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-bold text-black">
              © 2024 Unplan. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-3">
              <Link
                href="#"
                className="font-bold text-black border-b-2 border-black hover:bg-[#fdffb6] px-1"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="font-bold text-black border-b-2 border-black hover:bg-[#fdffb6] px-1"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="font-bold text-black border-b-2 border-black hover:bg-[#fdffb6] px-1"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

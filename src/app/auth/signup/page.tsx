"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertCircle,
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  MapPin,
  Compass
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(50, { message: "Name must not exceed 50 characters." })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name can only contain letters and spaces."
      }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .max(100, { message: "Email must not exceed 100 characters." }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits." })
      .max(15, { message: "Phone number must not exceed 15 digits." })
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Please enter a valid phone number."
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(100, { message: "Password must not exceed 100 characters." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"]
  });

type FormData = z.infer<typeof formSchema>;

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: values.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach(
            (error: { path?: string[]; message: string }) => {
              if (error.path && error.path[0]) {
                form.setError(error.path[0] as keyof FormData, {
                  type: "server",
                  message: error.message
                });
                // Show error toast with purple theme
                toast.error(error.message, {
                  style: {
                    background: "rgba(147, 51, 234, 0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(196, 181, 253, 0.3)",
                    color: "white",
                    fontFamily: "var(--font-instrument)"
                  },
                  duration: 4000
                });
              }
            }
          );
        } else {
          const errorMessage =
            data.error || "Something went wrong. Please try again.";
          setServerError(errorMessage);
          toast.error(errorMessage, {
            style: {
              background: "rgba(147, 51, 234, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(196, 181, 253, 0.3)",
              color: "white",
              fontFamily: "var(--font-instrument)"
            },
            duration: 4000
          });
        }
        return;
      }

      // Show success toast
      toast.success("Account created successfully! 🎉", {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)"
        },
        duration: 3000
      });

      router.push(
        "/auth/signin?message=Account created successfully! Please sign in."
      );
    } catch (error) {
      console.error("Signup error:", error);
      const networkError =
        "Network error. Please check your connection and try again.";
      setServerError(networkError);
      toast.error(networkError, {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)"
        },
        duration: 4000
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
            Create your account
          </h1>
          <p className="text-gray-600 font-instrument mt-2">
            Join thousands of travelers discovering unique experiences
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 font-instrument">
                  {serverError}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={isLoading}
                          className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                        />
                      </div>
                    </FormControl>
                    {form.formState.errors.name && (
                      <p className="text-xs text-red-600 font-instrument mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          {...field}
                          disabled={isLoading}
                          className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                        />
                      </div>
                    </FormControl>
                    {form.formState.errors.phone && (
                      <p className="text-xs text-red-600 font-instrument mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        disabled={isLoading}
                        className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                      />
                    </div>
                  </FormControl>
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-600 font-instrument mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
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
                    </FormControl>
                    {form.formState.errors.password && (
                      <p className="text-xs text-red-600 font-instrument mt-1">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {form.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-600 font-instrument mt-1">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500 font-instrument">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-200 hover:bg-gray-50 font-instrument"
              onClick={() => {
                toast.info("Google OAuth coming soon! 🚀", {
                  style: {
                    background: "rgba(147, 51, 234, 0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(196, 181, 253, 0.3)",
                    color: "white",
                    fontFamily: "var(--font-instrument)"
                  },
                  duration: 3000
                });
              }}
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

            <div className="text-center">
              <p className="text-sm text-gray-600 font-instrument">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function SignUpPage() {
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

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <SignUpForm />
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block flex-1 relative">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop"
            alt="Travel adventure"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40"></div>

          <div className="relative z-10 flex items-center justify-center h-full p-12">
            <div className="max-w-lg">
              <div className="space-y-8">
                <div>
                  <Sparkles className="h-12 w-12 text-yellow-400 mb-4" />
                  <h2 className="text-4xl font-bold text-white font-bricolage mb-4">
                    Start Your Journey Today
                  </h2>
                  <p className="text-white/90 text-lg font-instrument">
                    Join thousands of travelers discovering unique, personalized
                    experiences around the world.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold font-bricolage mb-1">
                        Unique Destinations
                      </h3>
                      <p className="text-white/80 text-sm font-instrument">
                        Explore hidden gems and off-the-beaten-path locations
                        curated by local hosts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold font-bricolage mb-1">
                        Verified Hosts
                      </h3>
                      <p className="text-white/80 text-sm font-instrument">
                        Connect with trusted local experts who make your travel
                        dreams come true
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold font-bricolage mb-1">
                        Personalized Experiences
                      </h3>
                      <p className="text-white/80 text-sm font-instrument">
                        Every trip is tailored to your preferences for
                        unforgettable memories
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/20">
                  <p className="text-white/60 text-sm font-instrument">
                    Trusted by over 10,000+ travelers worldwide
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

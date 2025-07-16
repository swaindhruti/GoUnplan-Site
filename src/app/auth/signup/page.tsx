"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertCircle,
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  Quote,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(50, { message: "Name must not exceed 50 characters." })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name can only contain letters and spaces.",
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
        message: "Please enter a valid phone number.",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(100, { message: "Password must not exceed 100 characters." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
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
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach(
            (error: { path?: string[]; message: string }) => {
              if (error.path && error.path[0]) {
                form.setError(error.path[0] as keyof FormData, {
                  type: "server",
                  message: error.message,
                });
              }
            }
          );
        } else {
          setServerError(
            data.error || "Something went wrong. Please try again."
          );
        }
        return;
      }

      router.push(
        "/auth/signin?message=Account created successfully! Please sign in."
      );
    } catch (error) {
      console.error("Signup error:", error);
      setServerError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Join Unplan</h1>
            <p className="text-gray-600 font-medium text-sm">
              Create your account and start exploring
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <Alert className="mb-4 bg-gradient-to-r from-red-50/90 to-pink-50/90 backdrop-blur-sm border border-red-200/50 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-red-100/80 p-1.5 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <AlertDescription className="font-semibold text-red-800 text-sm">
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Full Name
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      disabled={isLoading}
                      className="px-3 py-3 border-2 border-purple-200 focus:border-purple-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                    />
                  </FormControl>
                  {form.formState.errors.name && (
                    <p className="mt-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-green-100/80 to-emerald-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Email Address
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                      disabled={isLoading}
                      className="px-3 py-3 border-2 border-purple-200 focus:border-purple-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <p className="mt-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-orange-100/80 to-amber-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-orange-600" />
                    </div>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Phone Number
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...field}
                      disabled={isLoading}
                      className="px-3 py-3 border-2 border-purple-200 focus:border-purple-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                    />
                  </FormControl>
                  {form.formState.errors.phone && (
                    <p className="mt-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-purple-600" />
                    </div>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Password
                    </FormLabel>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                        className="px-3 py-3 pr-10 border-2 border-purple-200 focus:border-purple-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                    <p className="mt-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
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
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-indigo-100/80 to-blue-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-indigo-600" />
                    </div>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Confirm Password
                    </FormLabel>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        disabled={isLoading}
                        className="px-3 py-3 pr-10 border-2 border-purple-200 focus:border-purple-400 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                    <p className="mt-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700/90 hover:to-purple-700/90 text-white font-semibold 
                     backdrop-blur-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                     transition-all duration-300 py-3 mt-4 h-12
                     disabled:opacity-50 disabled:cursor-not-allowed
                     rounded-lg text-sm flex items-center justify-center gap-2"
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
              </div>
            )}
          </Button>

          <div className="text-center pt-3">
            <p className="text-xs font-medium text-gray-700">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function SignUpPage() {
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
        {/* Left Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-white/80 backdrop-blur-xl">
          <div className="w-full max-w-md">
            <div className="bg-white/90 border border-purple-200 rounded-2xl shadow-2xl shadow-purple-200/30 p-6 flex flex-col justify-center min-h-[520px]">
              <SignUpForm />
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
                &ldquo;Adventure is not outside man; it is within&rdquo;
              </h2>
              <p className="text-xl text-white/90 font-medium drop-shadow-lg">
                Begin your journey with us and discover the extraordinary
                experiences that await
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-1 w-16 bg-white/30 rounded-full"></div>
                <span className="text-white/70 font-medium">George Eliot</span>
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, ArrowRight, User, Mail, Phone, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="space-y-1 border-b bg-gray-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Join Unplan today and start exploring unique adventures
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {serverError && (
                  <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                          <User className="mr-2 h-4 w-4 text-gray-500" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            disabled={isLoading}
                            className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                          <Mail className="mr-2 h-4 w-4 text-gray-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                            disabled={isLoading}
                            className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                          <Phone className="mr-2 h-4 w-4 text-gray-500" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                            disabled={isLoading}
                            className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                          <Lock className="mr-2 h-4 w-4 text-gray-500" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                            disabled={isLoading}
                            className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                          <Lock className="mr-2 h-4 w-4 text-gray-500" />
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isLoading}
                            className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <div className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign in instead
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Unplan. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

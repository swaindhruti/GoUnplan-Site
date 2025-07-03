"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, User, Mail, Phone, Lock, UserPlus } from "lucide-react";

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
            <Link href="/auth/signin">
              <Button
                className="bg-white text-black font-black uppercase 
                         border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                         hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-200 px-6 py-3"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl pt-0 pb-0 border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <CardHeader className="space-y-1 border-b-3 border-black bg-[#fdffb6] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-2 rounded-md border-2 border-black">
                <UserPlus className="h-6 w-6 text-black" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-2xl font-black text-black uppercase">
                Create your account
              </CardTitle>
            </div>
            <CardDescription className="text-black font-bold">
              Join Unplan today and start exploring unique adventures
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {serverError && (
                  <Alert className="mb-4 bg-[#ffadad] border-3 border-black rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-white p-1 rounded-full border-2 border-black">
                      <AlertCircle
                        className="h-4 w-4 text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                    <AlertDescription className="font-bold text-black">
                      {serverError}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-[#fdffb6] p-1.5 rounded-md border-2 border-black">
                            <User
                              className="h-5 w-5 text-black"
                              strokeWidth={2.5}
                            />
                          </div>
                          <FormLabel className="text-base font-bold text-black">
                            Full Name
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            disabled={isLoading}
                            className="px-4 py-3 border-3 border-black rounded-xl bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#fdffb6]"
                          />
                        </FormControl>
                        {form.formState.errors.name && (
                          <p className="mt-2 font-bold text-red-600 bg-[#ffadad] border-2 border-black p-2 rounded-md">
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
                          <div className="bg-[#a0c4ff] p-1.5 rounded-md border-2 border-black">
                            <Mail
                              className="h-5 w-5 text-black"
                              strokeWidth={2.5}
                            />
                          </div>
                          <FormLabel className="text-base font-bold text-black">
                            Email Address
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                            disabled={isLoading}
                            className="px-4 py-3 border-3 border-black rounded-xl bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#a0c4ff]"
                          />
                        </FormControl>
                        {form.formState.errors.email && (
                          <p className="mt-2 font-bold text-red-600 bg-[#ffadad] border-2 border-black p-2 rounded-md">
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
                          <div className="bg-[#caffbf] p-1.5 rounded-md border-2 border-black">
                            <Phone
                              className="h-5 w-5 text-black"
                              strokeWidth={2.5}
                            />
                          </div>
                          <FormLabel className="text-base font-bold text-black">
                            Phone Number
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                            disabled={isLoading}
                            className="px-4 py-3 border-3 border-black rounded-xl bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#caffbf]"
                          />
                        </FormControl>
                        {form.formState.errors.phone && (
                          <p className="mt-2 font-bold text-red-600 bg-[#ffadad] border-2 border-black p-2 rounded-md">
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
                          <div className="bg-[#e0c6ff] p-1.5 rounded-md border-2 border-black">
                            <Lock
                              className="h-5 w-5 text-black"
                              strokeWidth={2.5}
                            />
                          </div>
                          <FormLabel className="text-base font-bold text-black">
                            Password
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                            disabled={isLoading}
                            className="px-4 py-3 border-3 border-black rounded-xl bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#e0c6ff]"
                          />
                        </FormControl>
                        {form.formState.errors.password && (
                          <p className="mt-2 font-bold text-red-600 bg-[#ffadad] border-2 border-black p-2 rounded-md">
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
                          <div className="bg-[#ffd6ff] p-1.5 rounded-md border-2 border-black">
                            <Lock
                              className="h-5 w-5 text-black"
                              strokeWidth={2.5}
                            />
                          </div>
                          <FormLabel className="text-base font-bold text-black">
                            Confirm Password
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isLoading}
                            className="px-4 py-3 border-3 border-black rounded-xl bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#ffd6ff]"
                          />
                        </FormControl>
                        {form.formState.errors.confirmPassword && (
                          <p className="mt-2 font-bold text-red-600 bg-[#ffadad] border-2 border-black p-2 rounded-md">
                            {form.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#a0c4ff] hover:bg-[#fdffb6] text-black font-black uppercase 
                           border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                           hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                           hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-200 py-6 mt-6 h-16
                           disabled:opacity-50 disabled:cursor-not-allowed
                           rounded-xl text-lg flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" strokeWidth={2.5} />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center border-t-3 border-black pt-6 pb-6 bg-[#fdffb6]">
            <p className="text-base font-bold text-black">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="underline decoration-2 font-black hover:bg-white"
              >
                Sign in instead
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

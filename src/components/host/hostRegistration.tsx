"use client";

import React, { useEffect, useCallback, useState } from "react";
import { Home, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { applyForHost } from "@/actions/user/action";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import Link from "next/link";

export const HostRegistration = ({ userEmail }: { userEmail: string }) => {
  const router = useRouter();

  const [state, setState] = useState({
    isRegistering: false,
    successMessage: null as string | null,
    errorMessage: null as string | null,
  });

  useEffect(() => {
    if (userEmail === "no session") {
      router.push("/auth/signin");
    }
  }, [userEmail, router]);

  const handleRegister = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRegistering: true,
    }));

    try {
      const register = await applyForHost(userEmail);

      if (register.success) {
        setState((prev) => ({
          ...prev,
          successMessage: "Successfully applied as a host!",
        }));
        console.log("Request success:", register.user);
      } else {
        setState((prev) => ({
          ...prev,
          errorMessage: "Failed to register as a host.",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errorMessage: "Something went wrong. Please try again.",
      }));
      console.error(error);
    } finally {
      setState((prev) => ({ ...prev, isRegistering: false }));
    }
  }, [userEmail]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/user">
              <Button
                variant="outline"
                className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Home className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Want to be a <span className="text-purple-700">Host?</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of hosts who share their unique spaces and create
                unforgettable experiences for travelers around the world.
              </p>

              {state.successMessage && (
                <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 mx-auto max-w-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{state.successMessage}</AlertDescription>
                </Alert>
              )}

              {state.errorMessage && (
                <Alert className="mb-6 bg-red-50 border-red-200 text-red-800 mx-auto max-w-lg">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="bg-gray-50 rounded-lg p-8 max-w-lg mx-auto mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Benefits of being a host
                </h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Share your local knowledge and experiences</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Earn money by creating unique travel plans</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Connect with travelers from around the world</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                    <span>Flexibility to manage your own schedule</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleRegister}
                disabled={state.isRegistering}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                {state.isRegistering ? "Processing..." : "Apply to be a Host"}
                <ArrowRight className="w-5 h-5" />
              </Button>

              <p className="text-sm text-gray-500 mt-6">
                Already a host?{" "}
                <button
                  className="text-purple-600 font-medium hover:underline"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-center items-center gap-2 text-gray-500">
              <div className="w-12 h-px bg-gray-300" />
              <span className="text-sm">
                Trusted by 50,000+ hosts worldwide
              </span>
              <div className="w-12 h-px bg-gray-300" />
            </div>
          </div>
        </div>
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
};

"use client";

import React, { useEffect, useCallback, useState } from "react";
import { Home, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { applyForHost } from "@/actions/user/action";
import { Button } from "../ui/button";

export const HostRegistration = ({ userEmail }: { userEmail: string }) => {
  const router = useRouter();

  const [state, setState] = useState({
    isRegistering: false,
    successMessage: null as string | null,
    errorMessage: null as string | null
  });

  useEffect(() => {
    if (userEmail === "no session") {
      router.push("/auth/signin");
    }
  }, [userEmail, router]);

  const handleRegister = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRegistering: true
    }));

    try {
      const register = await applyForHost(userEmail);

      if (register.success) {
        setState((prev) => ({
          ...prev,
          successMessage: "Successfully applied as a host!"
        }));
        console.log("Request success:", register.user);
      } else {
        setState((prev) => ({
          ...prev,
          errorMessage: "Failed to register as a host."
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errorMessage: "Something went wrong. Please try again."
      }));
      console.error(error);
    } finally {
      setState((prev) => ({ ...prev, isRegistering: false }));
    }
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="bg-black rounded-full p-4">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Want to be a <span className="block text-black">Host?</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of hosts who share their unique spaces and create
            unforgettable experiences for travelers around the world.
          </p>
        </header>

        <main className="text-center">
          <Button
            onClick={handleRegister}
            disabled={state.isRegistering}
            className="bg-black text-white px-12 py-6 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-[101%] cursor-pointer hover:shadow-xl flex items-center gap-3 mx-auto group disabled:opacity-50"
          >
            {state.isRegistering ? "Registering..." : "Register Now"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>

          {state.successMessage && (
            <p className="text-green-600 mt-4 text-sm">
              {state.successMessage}
            </p>
          )}
          {state.errorMessage && (
            <p className="text-red-600 mt-4 text-sm">{state.errorMessage}</p>
          )}

          <p className="text-sm text-gray-500 mt-6">
            Already a host?
            <button
              className="text-black font-medium hover:underline"
              onClick={() => router.push("/auth/signin")}
            >
              Sign in here
            </button>
          </p>
        </main>

        <footer className="mt-20 text-center">
          <div className="flex justify-center items-center gap-2 text-gray-400">
            <div className="w-12 h-px bg-gray-300" />
            <span className="text-sm">Trusted by 50,000+ hosts worldwide</span>
            <div className="w-12 h-px bg-gray-300" />
          </div>
        </footer>
      </div>
    </div>
  );
};

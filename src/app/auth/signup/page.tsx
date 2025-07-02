"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

import { SignupForm } from "@/components/auth/signup-form";
import { PageHeader } from "@/components/layout/page-header";
import { PageFooter } from "@/components/layout/page-footer";
import { BenefitsCard } from "@/components/auth/benefits-card";
import { DecoElements } from "@/components/ui/deco-elements";
import DotGridBackgroundProvider from "@/components/providers/dotGridBackgroundProvider";
import { type SignupForm as SignupFormData } from "@/lib/validation";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // Cursor tracking states
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track mouse position for custom cursor
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Check if cursor is over any interactive element
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest(".interactive");

      setIsOverInteractive(!!isInteractive);
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);

  const handleSubmit = async (values: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Combine first name and last name
      const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName, // Send the combined name
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
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
    <>
      {/* Custom plane cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
          isOverInteractive ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%)`,
        }}
      >
        <div className="relative">
          <Plane
            className="h-14 w-14 text-black fill-amber-500 rotate-22.5"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Hide default cursor when custom cursor is visible */}
      <style jsx global>{`
        @media (min-width: 768px) {
          body {
            cursor: none;
          }
          .interactive {
            cursor: pointer;
          }
          button,
          a,
          input,
          textarea,
          .interactive {
            cursor: pointer;
          }
        }
      `}</style>

      <DotGridBackgroundProvider
        dotSize={4}
        gap={20}
        baseColor="#c3c3c3"
        activeColor="#7c3aed"
        proximity={140}
        shockRadius={200}
        shockStrength={6}
      >
        <div className="min-h-screen flex flex-col" ref={contentRef}>
          <PageHeader />

          {/* Main Content */}
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              className="mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-black text-black">Create Account</h1>
              <p className="text-lg font-bold text-black mt-2">
                Join the adventure and start planning your next trip
              </p>
            </motion.div>

            <DecoElements />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2"
              >
                <SignupForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  serverError={serverError}
                />
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <BenefitsCard />
              </motion.div>
            </div>

            {/* Additional decorative elements */}
            <motion.div
              className="absolute top-[20%] left-[5%] w-8 h-8 bg-yellow-300 border-3 border-black rounded-full hidden md:block"
              animate={{
                scale: [1, 1.2, 1],
                backgroundColor: ["#fde047", "#fbbf24", "#fde047"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>

            <motion.div
              className="absolute bottom-[10%] right-[5%] w-10 h-10 bg-blue-400 border-3 border-black rounded-2xl hidden md:block"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            ></motion.div>
          </div>

          <PageFooter />
        </div>
      </DotGridBackgroundProvider>
    </>
  );
}

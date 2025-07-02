"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Home,
  AlertTriangle,
  ChevronLeft,
  Plane,
  Star,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import DotGridBackgroundProvider from "@/components/providers/dotGridBackgroundProvider";

// Create a separate component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "AccessDenied":
          setError("You do not have access to this resource.");
          break;
        case "CredentialsSignin":
          setError(
            "Invalid credentials. Please check your email and password."
          );
          break;
        case "OAuthAccountNotLinked":
          setError(
            "To confirm your identity, sign in with the same account you used originally."
          );
          break;
        default:
          setError("An authentication error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  return (
    <CardContent className="p-6">
      {error && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="mb-6 bg-pink-400 border-3 border-black text-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center">
              <AlertTriangle
                className="mr-2 h-5 w-5 text-black"
                strokeWidth={2.5}
              />
              <AlertDescription className="font-bold text-base">
                {error}
              </AlertDescription>
            </div>
          </Alert>
        </motion.div>
      )}
      <motion.div
        className="text-center bg-yellow-200 border-3 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Decorative elements */}
        <motion.div
          className="absolute -top-3 -right-3 w-6 h-6 bg-blue-400 border-2 border-black rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        ></motion.div>

        <p className="font-bold text-black">
          Please try again or contact support if the issue persists.
        </p>
        <p className="mt-2 font-bold text-black">
          You can also try using a different authentication method.
        </p>
      </motion.div>
    </CardContent>
  );
}

// Fallback component to show while loading
function ErrorFallback() {
  return (
    <CardContent className="p-6">
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-2xl h-12 w-12 border-t-8 border-l-8 border-r-8 border-b-8 border-b-transparent border-black"></div>
      </div>
      <div className="text-center font-bold text-black mt-4 bg-yellow-200 border-3 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <p>Loading error details...</p>
      </div>
    </CardContent>
  );
}

export default function AuthError() {
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
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".interactive");

      setIsOverInteractive(!!isInteractive);
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);

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
          .nav-button {
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
          {/* Header */}
          <header className="bg-red-400 border-b-4 border-black relative z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-3xl font-black text-black uppercase flex items-center"
                >
                  <ChevronLeft className="h-6 w-6 mr-1" strokeWidth={2.5} />
                  UNPLAN
                </motion.div>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button className="nav-button text-black bg-white border-3 border-black rounded-2xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="nav-button text-white bg-purple-600 border-3 border-black rounded-2xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 items-center justify-center px-4 py-12 relative">
            {/* Decorative elements - kept within screen boundaries */}
            <motion.div
              initial={{ rotate: -12 }}
              animate={{ rotate: [-12, -5, -12] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute top-10 right-[5%] w-12 h-12 bg-green-400 border-3 border-black rounded-2xl hidden md:block"
            ></motion.div>

            <motion.div
              initial={{ rotate: 12 }}
              animate={{ rotate: [12, 5, 12] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute bottom-10 left-[5%] w-10 h-10 bg-blue-400 border-3 border-black rounded-2xl hidden md:block"
            ></motion.div>

            <motion.div
              className="absolute top-[20%] left-[20%] hidden md:block"
              animate={{
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="bg-yellow-300 p-2 rounded-full border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <X className="h-8 w-8 text-black" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md content-card relative"
            >
              <Card className="border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white pt-0 pb-0">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 border-3 border-black transform rotate-12 rounded-xl"></div>
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 border-3 border-black rounded-xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                ></motion.div>

                <CardHeader className="border-b-3 border-black bg-red-400 p-6 rounded-t-2xl relative">
                  {/* Floating bubbles decoration */}
                  <motion.div
                    className="absolute left-8 top-5"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 bg-green-300 rounded-full border border-black"></div>
                  </motion.div>
                  <motion.div
                    className="absolute left-14 top-8"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.5, delay: 0.3, repeat: Infinity }}
                  >
                    <div className="w-4 h-4 bg-yellow-300 rounded-full border border-black"></div>
                  </motion.div>

                  <div className="mx-auto h-14 w-14 bg-white border-3 border-black rounded-full flex items-center justify-center mb-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <AlertCircle
                      className="h-8 w-8 text-black"
                      strokeWidth={2}
                    />
                  </div>

                  <CardTitle className="text-2xl font-black text-center text-black uppercase">
                    AUTHENTICATION ERROR
                  </CardTitle>
                  <CardDescription className="text-center text-black font-bold">
                    There was a problem with your authentication request
                  </CardDescription>
                </CardHeader>

                {/* Wrap the component using useSearchParams in Suspense */}
                <Suspense fallback={<ErrorFallback />}>
                  <ErrorContent />
                </Suspense>

                <CardFooter className="flex flex-col space-y-4 p-6 border-t-3 border-black bg-orange-200 rounded-b-2xl">
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: -0.5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase py-4 border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <Link
                        href="/auth/signin"
                        className="flex items-center justify-center"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" strokeWidth={2.5} />{" "}
                        BACK TO SIGN IN
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 0.5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    {/* Decorative star */}
                    <motion.div
                      className="absolute -top-3 -right-3 w-6 h-6"
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Star
                        className="w-6 h-6 text-yellow-400"
                        fill="yellow"
                        strokeWidth={1.5}
                      />
                    </motion.div>

                    <Button
                      asChild
                      className="w-full bg-green-400 hover:bg-green-500 text-black font-black uppercase py-4 border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <Link
                        href="/"
                        className="flex items-center justify-center"
                      >
                        <Home className="mr-2 h-5 w-5" strokeWidth={2.5} />{" "}
                        RETURN TO HOME
                      </Link>
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="bg-yellow-300 border-t-4 border-black py-6 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="uppercase font-black text-black">
                  © 2025 UNPLAN. ALL RIGHTS RESERVED.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link
                    href="#"
                    className="text-black font-bold hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="text-black font-bold hover:underline"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="text-black font-bold hover:underline"
                  >
                    Help
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </DotGridBackgroundProvider>
    </>
  );
}

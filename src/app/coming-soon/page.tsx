"use client";

import React, { useState, useEffect, useRef } from "react";
import DotGridBackgroundProvider from "@/components/providers/dotGridBackgroundProvider";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Mail,
  Users,
  Plane,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  addEmailToWaitingList,
  getWaitingListCount
} from "@/actions/common/waiting-list/action";

// Base count to add to the actual database count
const BASE_COUNT = 326;

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isOverCard, setIsOverCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch waiting list count on component mount
  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        const response = await getWaitingListCount();
        if (response.success && response.count !== undefined) {
          const dbCount = response.count;
          setWaitlistCount(BASE_COUNT + dbCount);
        } else {
          console.error("Failed to fetch waitlist count:", response.message);
        }
      } catch (error) {
        console.error("Error fetching waitlist count:", error);
      }
    };

    fetchWaitlistCount();
  }, []);

  // Track mouse position
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Check if cursor is over the card
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const isOver =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        setIsOverCard(isOver);
      }
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await addEmailToWaitingList(email);

      if (result.success) {
        setSubmitted(true);
        setMessage({
          text: "Thanks for joining our waitlist! We'll notify you when we launch.",
          type: "success"
        });

        // Update the count
        const countResponse = await getWaitingListCount();
        if (countResponse.success && countResponse.count !== undefined) {
          const countResponse = await getWaitingListCount();
          if (countResponse.success && countResponse.count !== undefined) {
            const newDbCount = countResponse.count;
            setWaitlistCount(BASE_COUNT + newDbCount);
          } else {
          }

          // Clear the form
          setEmail("");

          // Reset success state after a few seconds
          setTimeout(() => {
            setSubmitted(false);
            setMessage({ text: "", type: "" });
          }, 5000);
        } else {
          setMessage({
            text:
              result.message || "Failed to join waitlist. Please try again.",
            type: "error"
          });
        }
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setMessage({
        text: "Something went wrong. Please try again later.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Custom plane cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
          isOverCard ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%) rotate(-45deg)`
        }}
      >
        <div className="relative">
          <Plane className="h-16 w-16 rotate-45" fill="orange" />
        </div>
      </div>

      {/* Hide default cursor when custom cursor is visible */}
      <style jsx global>{`
        @media (min-width: 768px) {
          body {
            cursor: none;
          }
          .content-card {
            cursor: default;
          }
          .content-card button,
          .content-card a,
          .content-card input {
            cursor: pointer;
          }
        }
      `}</style>

      <DotGridBackgroundProvider>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
          {/* Main content container with neobrutalist styling */}
          <div className="relative max-w-2xl w-full -rotate-1">
            {/* Yellow accent shape */}
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-yellow-300 rounded-3xl -rotate-6 z-0"></div>

            {/* Primary card */}
            <div
              ref={cardRef}
              className="content-card relative bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0)] z-10 overflow-visible"
            >
              {/* Skewed header section */}
              <div className="bg-purple-600 border-b-4 border-black p-8 -rotate-1 transform origin-left rounded-t-2xl">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight uppercase">
                  Coming Soon
                </h1>
              </div>

              {/* Waitlist counter - positioned as badge */}
              <div className="absolute -top-5 -right-5 bg-red-500 text-white border-3 border-black rounded-full px-5 py-2 font-bold text-3xl tracking-wide flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
                <Users className="w-5 h-5 mr-2" />
                <span>{waitlistCount.toLocaleString()}</span>
                <span className="text-lg ml-1 font-medium tracking-wide">
                  joined
                </span>
              </div>

              {/* Randomly positioned decorative elements */}
              <div className="absolute top-32 -right-6 h-12 w-12 bg-pink-500 rounded-full border-4 border-black"></div>
              <div className="absolute -bottom-5 -left-7 h-14 w-14 bg-blue-400 rounded-lg border-4 border-black rotate-12"></div>

              {/* Main content */}
              <div className="p-8 md:p-10 pt-10">
                <p className="text-xl font-bold mb-10 ml-4 leading-relaxed">
                  We&apos;re building something{" "}
                  <span className="underline decoration-wavy decoration-yellow-400">
                    amazing
                  </span>{" "}
                  for your travel adventures. Our new platform is launching
                  soon.
                </p>

                {/* Notification Form */}
                <div className="mb-12 rotate-1">
                  <h3 className="text-2xl font-extrabold mb-4 uppercase tracking-tight">
                    Get Notified
                  </h3>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="relative flex-grow">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="pl-12 pr-4 py-7 w-full bg-gray-100 border-3 border-black rounded-md text-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="johndoe@gmail.com"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-500 hover:bg-green-400 border-3 border-black text-black font-bold text-lg py-7 px-6 rounded-md flex items-center justify-center transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        "Submitting..."
                      ) : (
                        <>
                          Notify Me <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  {message.text && (
                    <div
                      className={`mt-4 ${
                        message.type === "success"
                          ? "bg-yellow-300"
                          : "bg-red-100 text-red-800"
                      } border-3 border-black p-3 rounded-md flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      )}
                      <span className="font-bold">{message.text}</span>
                    </div>
                  )}

                  {submitted && waitlistCount > 0 && (
                    <div className="mt-4 pt-2 text-center font-bold">
                      You&apos;re number{" "}
                      <span className="text-purple-600">{waitlistCount}</span>{" "}
                      on our waitlist! 🚀
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DotGridBackgroundProvider>
    </>
  );
}

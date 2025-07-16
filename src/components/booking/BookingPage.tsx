"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DateSelector } from "./DateSelector";
import { TripSummary } from "./TripSummary";
import { TripCard } from "./TripCard";
import { BookingProgress } from "./BookingProgress";
import { GuestInformationForm } from "./GuestInformation";
import { format, addDays } from "date-fns";
import { useBookingStore } from "@/store/booking-store";
import type { TravelPlan, BookingFormData, BookingData } from "@/types/booking";
import {
  Loader2,
  Calendar,
  Users,
  CheckCircle,
  MapPin,
  Clock,
  Save,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface BookingPageProps {
  userId: string;
  existingBookingData: Partial<BookingData>;
  tripData: TravelPlan;
  existingBookingId?: string;
  Step?: number;
}

// Animated Counter Component
const AnimatedCounter = ({
  value,
  duration = 2000,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={className}>{count}</span>;
};

// Enhanced Loading Component with premium design
const EnhancedLoadingState = ({ tripData }: { tripData: TravelPlan }) => {
  const [loadingText, setLoadingText] = useState("Preparing your booking...");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const messages = [
      "Preparing your booking...",
      "Checking availability...",
      "Securing your spot...",
      "Almost ready...",
    ];

    let messageIndex = 0;
    let progressValue = 0;

    const interval = setInterval(() => {
      progressValue += 25;
      setProgress(progressValue);
      setCurrentStep(messageIndex);

      if (messageIndex < messages.length - 1) {
        setLoadingText(messages[messageIndex]);
        messageIndex++;
      }

      if (progressValue >= 100) {
        clearInterval(interval);
        setLoadingText("Finalizing booking...");
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-12 overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="backdrop-blur-3xl bg-white/15 border border-white/25 rounded-3xl p-10 shadow-2xl shadow-purple-900/20 text-center max-w-md w-full animate-fade-in-up">
            {/* Trip Info Card */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 mb-8 shadow-xl">
              <h2 className="text-2xl font-playfair font-bold text-white mb-4 drop-shadow-lg">
                {tripData.title}
              </h2>
              <div className="flex items-center justify-center gap-6 text-white/90 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {tripData.city}, {tripData.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{tripData.noOfDays} days</span>
                </div>
              </div>
            </div>

            {/* Animated Loading Icon */}
            <div className="mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 rounded-full shadow-2xl shadow-purple-500/30 mb-4 inline-block animate-pulse">
                  <Save className="h-16 w-16 text-white" strokeWidth={2.5} />
                </div>
                <Loader2 className="h-12 w-12 animate-spin text-purple-400 absolute -top-2 -right-2 bg-white/90 backdrop-blur-xl rounded-full border-2 border-purple-300 p-2 shadow-lg" />

                {/* Floating sparkles */}
                <div className="absolute -top-4 -left-4 animate-bounce">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                </div>
                <div
                  className="absolute -bottom-4 -right-4 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Sparkles className="h-6 w-6 text-pink-300" />
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="mb-8">
              <p className="text-2xl font-playfair font-bold text-white mb-3 drop-shadow-lg animate-fade-in">
                {loadingText}
              </p>
              <p className="text-lg font-medium text-white/80">
                Please don&apos;t close this page
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-full transition-all duration-700 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-bold mt-3 text-white/90">
                <AnimatedCounter value={progress} duration={500} />% Complete
              </p>
            </div>

            {/* Progress Steps */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {["Prep", "Check", "Secure", "Ready"].map((step, index) => (
                <div
                  key={step}
                  className={`text-xs font-bold p-2 rounded-lg transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Info Card */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-left">
              <p className="text-base font-medium text-white/90">
                💡 <span className="font-bold">Did you know?</span> Your booking
                is secured with our free cancellation policy up to 14 days
                before your trip!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function BookingPage({
  userId,
  tripData,
  existingBookingData,
  Step,
}: BookingPageProps) {
  const [currentStep, setCurrentStep] = useState(Step || 1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const bookingData = useBookingStore((state) => state.bookingData);
  const isLoading = useBookingStore((state) => state.isLoading);
  const error = useBookingStore((state) => state.error);
  const updateBookingData = useBookingStore((state) => state.updateBookingData);
  const updateDateSelection = useBookingStore(
    (state) => state.updateDateSelection
  );
  const updateGuestInfo = useBookingStore((state) => state.updateGuestInfo);
  const createNewBooking = useBookingStore((state) => state.createNewBooking);

  const [startDate, setStartDate] = useState<Date>(
    bookingData.startDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    bookingData.endDate || addDays(new Date(), (tripData.noOfDays || 1) - 1)
  );
  const [numberOfGuests, setNumberOfGuests] = useState<number>(
    bookingData.participants || 1
  );

  useEffect(() => {
    updateBookingData({
      userId,
      travelPlanId: tripData.travelPlanId,
      pricePerPerson: tripData.price,
      participants: tripData.maxParticipants,
      ...existingBookingData,
    });
  }, [
    existingBookingData,
    tripData.price,
    tripData.travelPlanId,
    updateBookingData,
    userId,
    tripData.maxParticipants,
  ]);

  useEffect(() => {
    if (bookingData.startDate) setStartDate(bookingData.startDate);
    if (bookingData.endDate) setEndDate(bookingData.endDate);
    if (bookingData.participants) setNumberOfGuests(bookingData.participants);
  }, [bookingData]);

  const handleDateChange = useCallback(
    async (newStartDate: Date, newEndDate: Date) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);

      await updateDateSelection({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    },
    [updateDateSelection]
  );

  const handleContinue = useCallback(async () => {
    setIsTransitioning(true);

    if (currentStep === 1 && !bookingData.id) {
      const initialBookingData = {
        userId,
        travelPlanId: tripData.travelPlanId,
        startDate,
        endDate,
        pricePerPerson: tripData.price,
        participants: numberOfGuests,
        status: "PENDING" as const,
        totalPrice: (tripData?.price || 0) * numberOfGuests,
      };

      const newBooking = await createNewBooking(initialBookingData);
      if (!newBooking) {
        console.error("Failed to create booking");
        setIsTransitioning(false);
        return;
      }
    }

    if (currentStep < 3) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [
    currentStep,
    bookingData.id,
    userId,
    tripData.travelPlanId,
    startDate,
    endDate,
    tripData.price,
    numberOfGuests,
    createNewBooking,
  ]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentStep]);

  const handleGuestInfoSubmit = useCallback(
    async (guestCount: number, guestData: BookingFormData) => {
      setNumberOfGuests(guestCount);

      const success = await updateGuestInfo({
        participants: guestCount,
        guests: guestData.guests,
        specialRequirements: guestData.specialRequirements,
      });

      if (success) {
        handleContinue();
      }
    },
    [updateGuestInfo, handleContinue]
  );

  const displayTripData = useMemo(
    () => ({
      title: tripData.title,
      duration: tripData.noOfDays,
      maxPeople: tripData.maxParticipants,
      location: `${tripData.city}, ${tripData.state}, ${tripData.country}`,
      pricePerPerson: tripData.price,
      imageUrl: "/placeholder.svg?height=300&width=400",
      whatsIncluded: tripData.includedActivities,
      cancellationPolicy:
        "Free cancellation up to 14 days before the trip. 50% refund for cancellations 7-14 days before. No refund for cancellations within 7 days of the trip start date.",
      hostInfo: {
        name: tripData.host?.user.name || "",
        experience: "Professional travel guide with 5+ years experience",
        description: tripData.host?.description || "",
      },
    }),
    [tripData]
  );

  // Show enhanced loading state
  if (isLoading) {
    return <EnhancedLoadingState tripData={tripData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-16 overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]" />

        <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
          {/* Error state */}
          {error && (
            <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-6 mb-8 shadow-xl animate-fade-in">
              <p className="text-white font-semibold text-lg">{error}</p>
            </div>
          )}

          <div className="text-center mb-12">
            <div className="inline-block backdrop-blur-xl bg-white/20 border border-white/30 text-white py-4 px-8 rounded-2xl shadow-2xl mb-8 animate-fade-in-up">
              <h1 className="text-4xl font-playfair font-bold uppercase tracking-tight drop-shadow-lg">
                {tripData.title}
              </h1>
            </div>

            {/* Interactive Progress Steps */}
            <div className="flex justify-center items-center gap-6 mt-12">
              {[
                { icon: Calendar, label: "Select Date", step: 1 },
                { icon: Users, label: "Guest Info", step: 2 },
                { icon: CheckCircle, label: "Confirmation", step: 3 },
              ].map(({ icon: Icon, label, step }, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center h-20 w-20 rounded-full border-2 transition-all duration-500 shadow-xl ${
                      currentStep >= step
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 border-white/50 text-white shadow-purple-500/30 scale-110"
                        : "bg-white/20 backdrop-blur-xl border-white/30 text-white/60"
                    }`}
                  >
                    <Icon className="h-10 w-10" strokeWidth={2} />
                  </div>
                  <span className="text-white/90 font-medium mt-3 text-sm">
                    {label}
                  </span>

                  {/* Progress Line */}
                  {index < 2 && (
                    <div className="h-1 w-16 bg-white/30 rounded-full mt-4 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000 ${
                          currentStep > step ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div
                className={`backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl shadow-2xl p-8 transition-all duration-500 ${
                  isTransitioning
                    ? "opacity-50 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                {currentStep === 1 && (
                  <>
                    <div className="flex items-center gap-4 border-b border-white/30 pb-6 mb-8">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-2xl shadow-lg">
                        <Calendar
                          className="h-8 w-8 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h2 className="text-3xl font-playfair font-bold text-gray-800">
                        Select Your Travel Date
                      </h2>
                    </div>

                    <DateSelector
                      tripDuration={tripData.noOfDays || 0}
                      onDateChange={handleDateChange}
                      selectedDate={startDate}
                    />

                    <div className="mt-10">
                      <div className="backdrop-blur-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">
                          Trip Summary
                        </h3>
                        <TripSummary
                          startDate={format(startDate, "MMMM dd, yyyy")}
                          endDate={format(endDate, "MMMM dd, yyyy")}
                          duration={`${tripData.noOfDays} days`}
                          location={displayTripData.location}
                        />
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/30">
                      <Button
                        onClick={handleContinue}
                        disabled={isTransitioning}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center gap-3 text-xl group"
                      >
                        <span>Continue to Guest Details</span>
                        <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <GuestInformationForm
                    onBack={handleBack}
                    onContinue={handleGuestInfoSubmit}
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col space-y-6">
              <TripCard
                title={displayTripData.title}
                maxPeople={displayTripData.maxPeople || 1}
                imageUrl={displayTripData.imageUrl}
                whatsIncluded={displayTripData.whatsIncluded || []}
                cancellationPolicy={displayTripData.cancellationPolicy}
                hostInfo={displayTripData.hostInfo}
              />

              <div className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-2xl p-6 shadow-xl">
                <BookingProgress bookingData={bookingData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
      `}</style>
    </div>
  );
}

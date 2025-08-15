"use client";

import { useState, useEffect, useCallback } from "react";
import { BookingProgress } from "./BookingProgress";
import { GuestInformationForm } from "./GuestInformation";
import { useBookingStore } from "@/store/booking-store";
import type { TravelPlan, BookingFormData, BookingData } from "@/types/booking";
import {
  Loader2,
  Calendar,
  Users,
  DollarSign,
  MessageCircle,
  Languages,
  Star
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/global/buttons";

interface BookingPageProps {
  userId: string;
  existingBookingData: Partial<BookingData>;
  tripData: TravelPlan;
  existingBookingId?: string;
  Step?: number;
}

const EnhancedLoadingState = () => {
  const [loadingText, setLoadingText] = useState("Preparing your booking...");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const messages = [
      "Preparing your booking...",
      "Checking availability...",
      "Securing your spot...",
      "Almost ready..."
    ];
    let messageIndex = 0;
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 25;
      setProgress(progressValue);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 font-bricolage">
          {loadingText}
        </h2>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
          <div
            className="bg-gradient-to-r from-purple-600 to-purple-700 h-3 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 font-roboto">
          Please don&apos;t close this page
        </p>
      </div>
    </div>
  );
};

export function BookingPage({
  userId,
  tripData,
  existingBookingData,
  Step
}: BookingPageProps) {
  const [currentStep, setCurrentStep] = useState(Step || 1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bookingData = useBookingStore((state) => state.bookingData);
  const isLoading = useBookingStore((state) => state.isLoading);
  const updateBookingData = useBookingStore((state) => state.updateBookingData);
  const updateGuestInfo = useBookingStore((state) => state.updateGuestInfo);
  const createNewBooking = useBookingStore((state) => state.createNewBooking);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(
    bookingData.participants || 1
  );

  useEffect(() => {
    updateBookingData({
      userId,
      travelPlanId: tripData.travelPlanId,
      pricePerPerson: tripData.price,
      participants: tripData.maxParticipants,
      ...existingBookingData
    });
  }, [
    existingBookingData,
    tripData.price,
    tripData.travelPlanId,
    updateBookingData,
    userId,
    tripData.maxParticipants
  ]);

  useEffect(() => {
    if (bookingData.participants) setNumberOfGuests(bookingData.participants);
  }, [bookingData]);

  const handleContinue = useCallback(async () => {
    setIsTransitioning(true);
    if (currentStep === 1 && !bookingData.id) {
      const initialBookingData = {
        userId,
        travelPlanId: tripData.travelPlanId,
        pricePerPerson: tripData.price,
        startDate: new Date(tripData.startDate || new Date()),
        endDate: new Date(tripData.endDate || new Date()),
        participants: numberOfGuests,
        status: "PENDING" as const,
        totalPrice: (tripData?.price || 0) * numberOfGuests
      };
      const newBooking = await createNewBooking(initialBookingData);
      if (!newBooking) {
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
    tripData.startDate,
    tripData.endDate,
    tripData.travelPlanId,
    tripData.price,
    numberOfGuests,
    createNewBooking
  ]);

  const handleGuestInfoSubmit = useCallback(
    async (guestCount: number, guestData: BookingFormData) => {
      setNumberOfGuests(guestCount);
      const success = await updateGuestInfo({
        participants: guestCount,
        guests: guestData.guests,
        specialRequirements: guestData.specialRequirements
      });
      if (success) {
        handleContinue();
      }
    },
    [updateGuestInfo, handleContinue]
  );

  const createdYear = new Date(tripData.createdAt || new Date()).getFullYear();
  const heroTags = [
    "Available year-round",
    `${tripData.noOfDays} days`,
    `Max ${tripData.maxParticipants} people`,
    `₹${tripData.price} per person`
  ];
  const hostInfo = {
    name: tripData.host?.user.name || "Host",
    image: tripData.host?.image || "https://via.placeholder.com/60",
    email: tripData.host?.hostEmail || "",
    description: tripData.host?.description || "",
    createdYear
  };
  const tripStats = {
    price: tripData.price,
    noOfDays: tripData.noOfDays,
    maxParticipants: tripData.maxParticipants,
    languages: tripData.languages?.join(", ") || "English"
  };

  if (isLoading) {
    return <EnhancedLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section
        className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752778285/1432000_1_byxulb.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <BackButton isWhite={true} route="/trips" />
          <div className="text-center mt-6 sm:mt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl font-bricolage">
              Book Your Adventure
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4 sm:mb-8 font-roboto">
              {tripData.title} - {tripData.destination}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-8">
              {heroTags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold text-sm sm:text-base font-roboto shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div
              className={`bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl md:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-500 ${
                isTransitioning
                  ? "opacity-50 scale-95"
                  : "opacity-100 scale-100"
              }`}
            >
              <div className="flex justify-center items-center gap-8 mb-12">
                {[{ icon: Users, label: "Guest Info", step: 1 }].map(
                  ({ icon: Icon, label, step }, index) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`flex items-center justify-center h-16 w-16 rounded-2xl border-2 transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 border-purple-600 text-white shadow-lg"
                            : "bg-white/60 border-slate-200 text-slate-400"
                        }`}
                      >
                        <Icon className="h-8 w-8" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 mt-3 font-roboto">
                        {label}
                      </span>
                      {index < 1 && (
                        <div className="h-1 w-12 bg-slate-200 rounded-full mt-3" />
                      )}
                    </div>
                  )
                )}
              </div>

              {currentStep === 1 && (
                <GuestInformationForm onContinue={handleGuestInfoSubmit} />
              )}
            </div>
          </div>
          <div className="flex flex-col   space-y-6 order-1 lg:order-2">
            <div className="bg-white/80 sticky top-5 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <span className="text-3xl font-bold text-gray-900 font-bricolage">
                  ₹{tripStats.price}
                </span>
                <span className="text-base text-gray-600 font-roboto">
                  per person
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700 font-medium font-roboto">
                    {tripStats.noOfDays} days
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700 font-medium font-roboto">
                    Up to {tripStats.maxParticipants} people
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Languages className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700 font-medium font-roboto">
                    {tripStats.languages}
                  </span>
                </div>
              </div>

              <div>
                <BookingProgress bookingData={bookingData} />
              </div>
            </div>

            {/* Host Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <MessageCircle className="h-6 w-6 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900 font-bricolage">
                  About Your Host
                </span>
              </div>

              <div className="flex gap-4 items-center mb-6">
                <Avatar className="h-16 w-16 border-2 border-purple-100">
                  <AvatarImage src={hostInfo.image} />
                  <AvatarFallback className="bg-purple-200 text-purple-700 font-bold text-lg font-bricolage">
                    {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-bold text-gray-900 font-bricolage mb-1">
                    {hostInfo.name}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2 font-roboto">
                      4.9 (124 reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-roboto">
                    Host since {hostInfo.createdYear}
                  </p>
                  <p className="text-sm text-gray-600 font-roboto">
                    {hostInfo.email}
                  </p>
                </div>
              </div>

              <div className="text-base text-gray-700 mb-6 font-roboto leading-relaxed">
                {hostInfo.description}
              </div>

              <button className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 text-purple-700 font-bold py-3 rounded-2xl transition-all duration-300 font-montserrat">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

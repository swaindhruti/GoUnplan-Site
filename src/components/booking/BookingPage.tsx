"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DateSelector } from "./DateSelector";
import { TripSummary } from "./TripSummary";
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
  DollarSign,
  MessageCircle,
  Languages,
  Star,
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
      "Almost ready...",
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md border border-purple-100 rounded-2xl shadow-sm p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          {loadingText}
        </h2>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
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
  Step,
}: BookingPageProps) {
  const [currentStep, setCurrentStep] = useState(Step || 1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bookingData = useBookingStore((state) => state.bookingData);
  const isLoading = useBookingStore((state) => state.isLoading);
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

  const createdYear = new Date(tripData.createdAt || new Date()).getFullYear();
  const heroTags = [
    "Available year-round",
    `${tripData.noOfDays} days`,
    `Max ${tripData.maxParticipants} people`,
    `₹${tripData.price} per person`,
  ];
  const hostInfo = {
    name: tripData.host?.user.name || "Host",
    image: tripData.host?.image || "https://via.placeholder.com/60",
    email: tripData.host?.hostEmail || "",
    description: tripData.host?.description || "",
    createdYear,
  };
  const tripStats = {
    price: tripData.price,
    noOfDays: tripData.noOfDays,
    maxParticipants: tripData.maxParticipants,
    languages: tripData.languages?.join(", ") || "English",
  };

  if (isLoading) {
    return <EnhancedLoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden bg-cover bg-center bg-no-repeat border-b border-purple-100"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752778285/1432000_1_byxulb.jpg')`,
        }}
      >
        {/* Black overlay for readability, now lighter */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/50" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <BackButton isWhite={true} route="/trips" />
          <div className="text-center mt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-xl font-playfair">
              Book Your Adventure
            </h1>
            <p className="text-lg text-white mb-4 font-roboto">
              {tripData.title} - {tripData.destination}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {heroTags.map((tag, i) => (
                <span
                  key={i}
                  className={`bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white font-medium text-sm backdrop-blur-md font-roboto`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8 font-roboto">
        {/* Main Booking Form */}
        <div className="md:col-span-2">
          <div
            className={`bg-white border border-purple-100 rounded-2xl shadow-sm p-8 transition-all duration-500 ${
              isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {/* Progress Steps */}
            <div className="flex justify-center items-center gap-6 mb-8">
              {[
                { icon: Calendar, label: "Select Date", step: 1 },
                { icon: Users, label: "Guest Info", step: 2 },
                { icon: CheckCircle, label: "Confirmation", step: 3 },
              ].map(({ icon: Icon, label, step }, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full border-2 ${
                      currentStep >= step
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "bg-white border-purple-100 text-purple-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-gray-700 mt-2 font-roboto">
                    {label}
                  </span>
                  {index < 2 && (
                    <div className="h-1 w-8 bg-purple-100 rounded-full mt-2" />
                  )}
                </div>
              ))}
            </div>
            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 font-playfair">
                  Select Your Travel Date
                </h2>
                <DateSelector
                  tripDuration={tripData.noOfDays || 0}
                  onDateChange={handleDateChange}
                  selectedDate={startDate}
                />
                <div className="mt-8">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 font-playfair">
                      Trip Summary
                    </h3>
                    <TripSummary
                      startDate={format(startDate, "MMMM dd, yyyy")}
                      endDate={format(endDate, "MMMM dd, yyyy")}
                      duration={`${tripData.noOfDays} days`}
                      location={`${tripData.city}, ${tripData.state}, ${tripData.country}`}
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <Button
                    onClick={handleContinue}
                    disabled={isTransitioning}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all font-montserrat"
                  >
                    Continue to Guest Details
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
        {/* Sidebar */}
        <div className="flex flex-col space-y-6">
          {/* Trip Card */}
          <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 font-playfair">
                ₹{tripStats.price}
              </span>
              <span className="text-sm text-gray-500 font-roboto">
                per person
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-gray-700 text-sm font-roboto">
                {tripStats.noOfDays} days
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-gray-700 text-sm font-roboto">
                Up to {tripStats.maxParticipants} people
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Languages className="h-4 w-4 text-purple-500" />
              <span className="text-gray-700 text-sm font-roboto">
                {tripStats.languages}
              </span>
            </div>
            <div className="mt-4">
              <BookingProgress bookingData={bookingData} />
            </div>
          </div>
          {/* Host Card */}
          <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold text-gray-900 font-playfair">
                About Your Host
              </span>
            </div>
            <div className="flex gap-4 items-center mb-4">
              <Avatar className="h-12 w-12 border-2 border-purple-100">
                <AvatarImage src={hostInfo.image} />
                <AvatarFallback className="bg-purple-200 text-purple-700 font-bold font-playfair">
                  {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 font-playfair">
                  {hostInfo.name}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1 font-roboto">
                    4.9 (124 reviews)
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-roboto">
                  Host since {hostInfo.createdYear}
                </p>
                <p className="text-xs text-gray-500 font-roboto">
                  {hostInfo.email}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-4 font-roboto">
              {hostInfo.description}
            </div>
            <button className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-700 font-semibold py-2 rounded-xl transition-all font-montserrat">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
} from "lucide-react";

interface BookingPageProps {
  userId: string;
  existingBookingData: Partial<BookingData>;
  tripData: TravelPlan;
  existingBookingId?: string;
  Step?: number;
}

// Enhanced Loading Component with vibrant colors
const EnhancedLoadingState = ({ tripData }: { tripData: TravelPlan }) => {
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
    <div className="min-h-screen bg-gradient-to-b from-[#f9f9ff] to-[#e0e0ff] py-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white border-3 border-black rounded-xl p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md w-full">
            <div className="bg-[#e0c6ff] border-3 border-black rounded-xl p-5 mb-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
                {tripData.title}
              </h2>
              <div className="flex items-center justify-center gap-5 text-base font-bold">
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

            <div className="mb-8">
              <div className="relative">
                <div className="bg-[#fdffb6] p-5 rounded-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 inline-block">
                  <Save
                    className="h-14 w-14 text-black animate-pulse"
                    strokeWidth={2.5}
                  />
                </div>
                <Loader2 className="h-10 w-10 animate-spin text-black absolute -top-1 -right-1 bg-white rounded-full border-2 border-black p-1" />
              </div>
            </div>

            <div className="mb-8">
              <p className="text-2xl font-black uppercase tracking-tight mb-3">
                {loadingText}
              </p>
              <p className="text-lg font-medium text-gray-700">
                Please don&apos;t close this page
              </p>
            </div>

            <div className="mb-8">
              <div className="bg-[#f0f0ff] border-3 border-black rounded-full h-6 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="bg-[#a0c4ff] h-full transition-all duration-700 ease-out border-r-2 border-black"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-bold mt-3 text-gray-700">
                {progress}% Complete
              </p>
            </div>

            <div className="bg-[#caffbf] border-2 border-black rounded-xl p-4 text-left">
              <p className="text-base font-bold text-gray-800">
                💡 <span className="font-black">Did you know?</span> Your
                booking is secured with our free cancellation policy up to 14
                days before your trip!
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
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
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
      setCurrentStep((prev) => prev - 1);
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

  // Define step colors for consistent usage
  const stepColors = {
    step1: "bg-[#e0c6ff]", // soft lavender
    step2: "bg-[#caffbf]", // light green
    step3: "bg-[#fdffb6]", // pale yellow
    inactive: "bg-white",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5ff] to-[#e3e3ff] py-12">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Error state */}
        {error && (
          <div className="border-3 border-black rounded-xl p-5 bg-[#ffadad] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8 font-bold text-lg">
            {error}
          </div>
        )}

        <div className="text-center mb-12">
          <div className="inline-block bg-[#a0c4ff] text-black py-3 px-8 border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-6">
            <h1 className="text-4xl font-black uppercase tracking-tight">
              {tripData.title}
            </h1>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <div
              className={`flex items-center justify-center h-16 w-16 rounded-full border-3 border-black ${
                currentStep >= 1 ? stepColors.step1 : stepColors.inactive
              } shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <Calendar className="h-8 w-8 text-black" strokeWidth={2.5} />
              <span className="sr-only">Select Date</span>
            </div>
            <div className="h-2 w-16 bg-black"></div>
            <div
              className={`flex items-center justify-center h-16 w-16 rounded-full border-3 border-black ${
                currentStep >= 2 ? stepColors.step2 : stepColors.inactive
              } shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <Users className="h-8 w-8 text-black" strokeWidth={2.5} />
              <span className="sr-only">Guest Info</span>
            </div>
            <div className="h-2 w-16 bg-black"></div>
            <div
              className={`flex items-center justify-center h-16 w-16 rounded-full border-3 border-black ${
                currentStep >= 3 ? stepColors.step3 : stepColors.inactive
              } shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <CheckCircle className="h-8 w-8 text-black" strokeWidth={2.5} />
              <span className="sr-only">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-8">
              {currentStep === 1 && (
                <>
                  <div className="flex items-center gap-4 border-b-3 border-black pb-4 mb-8">
                    <div className="bg-[#e0c6ff] p-3 rounded-lg border-2 border-black">
                      <Calendar
                        className="h-7 w-7 text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h2 className="text-3xl font-black text-black uppercase tracking-tight">
                      Select Your Travel Date
                    </h2>
                  </div>

                  <DateSelector
                    tripDuration={tripData.noOfDays || 0}
                    onDateChange={handleDateChange}
                    selectedDate={startDate}
                  />

                  <div className="mt-10">
                    <div className="bg-[#a0c4ff] border-3 border-black rounded-xl p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="font-black uppercase mb-4 text-xl">
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

                  <div className="mt-10 pt-8 border-t-3 border-black">
                    <Button
                      onClick={handleContinue}
                      className="w-full bg-[#caffbf] hover:bg-[#b8e6a9] text-black font-black uppercase tracking-wider
                      border-3 border-black rounded-lg py-6 px-4
                      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                      hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                      hover:translate-x-[2px] hover:translate-y-[2px]
                      transition-all duration-200 text-xl"
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
          <div className="lg:col-span-1 flex flex-col">
            <TripCard
              title={displayTripData.title}
              maxPeople={displayTripData.maxPeople || 1}
              imageUrl={displayTripData.imageUrl}
              whatsIncluded={displayTripData.whatsIncluded || []}
              cancellationPolicy={displayTripData.cancellationPolicy}
              hostInfo={displayTripData.hostInfo}
            />

            <div className="mt-6">
              <BookingProgress bookingData={bookingData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

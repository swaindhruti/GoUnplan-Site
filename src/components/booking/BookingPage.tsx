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
import { Loader2, Calendar, Users, CheckCircle } from "lucide-react";

interface BookingPageProps {
  userId: string;
  existingBookingData: Partial<BookingData>;
  tripData: TravelPlan;
  existingBookingId?: string;
  Step?: number;
}

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Loading and error states */}
        {isLoading && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="border-3 border-black rounded-xl p-8 bg-yellow-300 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center">
              <Loader2 className="h-16 w-16 animate-spin text-black mx-auto mb-4" />
              <p className="text-xl font-black uppercase">
                Saving your booking...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="border-3 border-black rounded-xl p-4 bg-red-400 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-6 font-bold">
            {error}
          </div>
        )}

        {/* Title and step indicator */}
        <div className="text-center mb-10">
          <div className="inline-block bg-purple-600 text-white py-2 px-5 border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-4">
            <h1 className="text-3xl font-black uppercase tracking-tight">
              {tripData.title}
            </h1>
          </div>

          {/* Custom NeoBrutalist Step Indicator */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <div
              className={`flex items-center justify-center h-14 w-14 rounded-full border-3 border-black ${
                currentStep >= 1 ? "bg-pink-400" : "bg-white"
              } shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <Calendar className="h-7 w-7 text-black" strokeWidth={2.5} />
              <span className="sr-only">Select Date</span>
            </div>
            <div className="h-1 w-12 bg-black"></div>
            <div
              className={`flex items-center justify-center h-14 w-14 rounded-full border-3 border-black ${
                currentStep >= 2 ? "bg-blue-400" : "bg-white"
              } shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <Users className="h-7 w-7 text-black" strokeWidth={2.5} />
              <span className="sr-only">Guest Info</span>
            </div>
            <div className="h-1 w-12 bg-black"></div>
            <div
              className={`flex items-center justify-center h-14 w-14 rounded-full border-3 border-black ${
                currentStep >= 3 ? "bg-green-500" : "bg-white"
              } shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <CheckCircle className="h-7 w-7 text-black" strokeWidth={2.5} />
              <span className="sr-only">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-6">
              {currentStep === 1 && (
                <>
                  <div className="flex items-center gap-3 border-b-3 border-black pb-2 mb-6">
                    <div className="bg-pink-400 p-2 rounded-lg border-2 border-black">
                      <Calendar
                        className="h-6 w-6 text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                      Select Your Travel Date
                    </h2>
                  </div>

                  <DateSelector
                    tripDuration={tripData.noOfDays || 0}
                    onDateChange={handleDateChange}
                    selectedDate={startDate}
                  />

                  <div className="mt-8">
                    <div className="bg-blue-200 border-3 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="font-black uppercase mb-3 text-lg">
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

                  <div className="mt-8 pt-6 border-t-3 border-black">
                    <Button
                      onClick={handleContinue}
                      disabled={isLoading}
                      className="w-full bg-purple-600 text-white font-black uppercase tracking-wider
                        border-3 border-black rounded-lg py-4 px-4
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        transition-all duration-200 text-lg"
                    >
                      {isLoading ? "Saving..." : "Continue to Guest Details"}
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

          {/* Sidebar with trip card and booking progress */}
          <div className="lg:col-span-1 flex flex-col">
            <TripCard
              title={displayTripData.title}
              maxPeople={displayTripData.maxPeople || 1}
              imageUrl={displayTripData.imageUrl}
              whatsIncluded={displayTripData.whatsIncluded || []}
              cancellationPolicy={displayTripData.cancellationPolicy}
              hostInfo={displayTripData.hostInfo}
            />

            <div className="mt-4">
              <BookingProgress bookingData={bookingData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

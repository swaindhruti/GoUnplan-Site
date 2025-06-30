"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { DateSelector } from "./DateSelector";
import { TripSummary } from "./TripSummary";
import { TripCard } from "./TripCard";
import { GuestInformationForm } from "./GuestInformation";
import { format, addDays } from "date-fns";
import { useBookingStore } from "@/store/booking-store";
import type { TravelPlan, BookingFormData, BookingData } from "@/types/booking";
import { Loader2 } from "lucide-react";
// import type { BookingStoreState } from "@/store/booking-store";

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
  Step
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
        endDate: newEndDate
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
        totalPrice: (tripData?.price || 0) * numberOfGuests
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
    createNewBooking
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
        specialRequirements: guestData.specialRequirements
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
        description: tripData.host?.description || ""
      }
    }),
    [tripData]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {isLoading && (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
              <p>Saving your booking...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tripData.title}
          </h1>
          <StepIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {currentStep === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Select Your Travel Date
                  </h2>
                  <DateSelector
                    tripDuration={tripData.noOfDays || 0}
                    onDateChange={handleDateChange}
                    selectedDate={startDate}
                  />
                  <div className="mt-8">
                    <TripSummary
                      startDate={format(startDate, "MMMM dd, yyyy")}
                      endDate={format(endDate, "MMMM dd, yyyy")}
                      duration={`${tripData.noOfDays} days`}
                      location={displayTripData.location}
                    />
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleContinue}
                      size="lg"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105"
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

          <div className="lg:col-span-1">
            <TripCard
              title={displayTripData.title}
              maxPeople={displayTripData.maxPeople || 1}
              imageUrl={displayTripData.imageUrl}
              whatsIncluded={displayTripData.whatsIncluded || []}
              cancellationPolicy={displayTripData.cancellationPolicy}
              hostInfo={displayTripData.hostInfo}
            />

            <div className="mt-4 sticky top-52 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Booking Progress
              </h3>
              <div className="text-sm text-gray-600">
                {bookingData.id ? (
                  <p>Booking ID: {bookingData.id.slice(-8)}</p>
                ) : (
                  <p>Creating new booking...</p>
                )}
                <p>Status: {bookingData.status || "Draft"}</p>
                {bookingData.startDate && (
                  <p>
                    Dates: {format(bookingData.startDate, "MMM dd")} -{" "}
                    {format(bookingData.endDate!, "MMM dd")}
                  </p>
                )}
                {bookingData.participants && (
                  <p>Guests: {bookingData.participants}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

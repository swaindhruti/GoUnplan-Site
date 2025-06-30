"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { DateSelector } from "./DateSelector";
import { TripSummary } from "./TripSummary";
import { TripCard } from "./TripCard";
import { GuestInformationForm } from "./GuestInformation";
import { format, addDays } from "date-fns";
import { useBookingState } from "@/hooks/use-booking";
import type { TravelPlan, BookingFormData, BookingData } from "@/types/booking";

interface BookingPageProps {
  userId: string;
  // travelPlanId: string;
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
  // console.log(existingBookingData, existingBookingId);
  const {
    bookingData,
    isLoading,
    error,
    updateDateSelection,
    updateGuestInfo,
    createNewBooking
  } = useBookingState({
    userId,
    travelPlanId: tripData.travelPlanId,
    initialData: existingBookingData || {
      pricePerPerson: tripData.price,
      participants: 1
    }
  });

  const [startDate, setStartDate] = useState<Date>(
    bookingData.startDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    bookingData.endDate || addDays(new Date(), tripData.noOfDays || 0 - 1)
  );
  const [numberOfGuests, setNumberOfGuests] = useState<number>(
    bookingData.participants || 1
  );

  const displayTripData = {
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
  };

  useEffect(() => {
    if (bookingData.startDate) setStartDate(bookingData.startDate);
    if (bookingData.endDate) setEndDate(bookingData.endDate);
    if (bookingData.participants) setNumberOfGuests(bookingData.participants);
  }, [bookingData]);

  const handleDateChange = async (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    await updateDateSelection({
      startDate: newStartDate,
      endDate: newEndDate
    });
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      if (!bookingData.id) {
        const initialBookingData = {
          userId,
          travelPlanId: tripData.travelPlanId,
          startDate,
          endDate,
          pricePerPerson: tripData.price,
          participants: numberOfGuests,
          status: "PENDING" as const,
          totalPrice: tripData?.price || 0 * numberOfGuests
        };

        const newBooking = await createNewBooking(initialBookingData);
        if (!newBooking) {
          console.error("Failed to create booking");
          return;
        }
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGuestInfoSubmit = async (
    guestCount: number,
    guestData: BookingFormData
  ) => {
    setNumberOfGuests(guestCount);

    const success = await updateGuestInfo({
      participants: guestCount,
      guests: guestData.guests,
      specialRequirements: guestData.specialRequirements
    });

    if (success) {
      handleContinue();
    }
  };

  // const handlePaymentComplete = async () => {
  //   const totalPrice = numberOfGuests * (tripData?.price || 0);

  //   const success = await updatePaymentInfo({
  //     totalPrice,
  //     status: "CONFIRMED"
  //   });

  //   if (success) {
  //     console.log("Payment completed successfully!");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Loading/Error States */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <p>Saving your booking...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tripData.title}
          </h1>
          <StepIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
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

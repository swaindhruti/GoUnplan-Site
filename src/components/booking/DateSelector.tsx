"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CalendarIcon } from "lucide-react";
import { addDays, format, isBefore, isAfter, startOfDay } from "date-fns";
import { z } from "zod";

// Define base schema without refinements for field validation
const baseDateSelectionSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Please select a valid date",
  }),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "Please select a valid date",
  }),
  duration: z.number().min(1, "Duration must be at least 1 day"),
});

// Enhanced schema with refinements for full validation
const dateSelectionSchema = baseDateSelectionSchema
  .refine(
    (data) => !isBefore(startOfDay(data.startDate), startOfDay(new Date())),
    {
      message: "Start date cannot be in the past",
      path: ["startDate"],
    }
  )
  .refine((data) => isAfter(data.endDate, data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

interface DateSelectorProps {
  tripDuration: number;
  onDateChange: (startDate: Date, endDate: Date) => void;
  selectedDate?: Date;
}

export function DateSelector({
  tripDuration,
  onDateChange,
  selectedDate,
}: DateSelectorProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "weekend" | "summer" | "all"
  >("all");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const endDate = addDays(newDate, tripDuration - 1);

      // Validate the date selection
      const validation = dateSelectionSchema.safeParse({
        startDate: newDate,
        endDate: endDate,
        duration: tripDuration,
      });

      if (validation.success) {
        setDate(newDate);
        setValidationErrors([]);
        onDateChange(newDate, endDate);
      } else {
        const errors = validation.error.errors.map((err) => err.message);
        setValidationErrors(errors);
      }
    }
  };

  const availabilityOptions = [
    { value: "weekend" as const, label: "Every weekend" },
    { value: "summer" as const, label: "Summer months" },
    { value: "all" as const, label: "All year round" },
  ];

  // Helper function to check if date should be disabled based on filter
  const isDateDisabled = (checkDate: Date) => {
    // Always disable past dates
    if (isBefore(startOfDay(checkDate), startOfDay(new Date()))) {
      return true;
    }

    // Apply availability filter
    if (availabilityFilter === "weekend") {
      const dayOfWeek = checkDate.getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Only weekends (0 = Sunday, 6 = Saturday)
    }

    if (availabilityFilter === "summer") {
      const month = checkDate.getMonth();
      return month < 5 || month > 8; // Only June (5) to September (8)
    }

    return false;
  };

  return (
    <div className="space-y-8">
      {/* Trip Duration Card */}
      <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Clock className="w-7 h-7 text-purple-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            Trip Duration: {tripDuration} days
          </h3>
        </div>
        {date && (
          <div className="mt-4 bg-white border border-purple-50 rounded-xl p-4 font-semibold text-lg">
            <div className="flex items-center gap-3">
              <CalendarIcon
                className="w-6 h-6 text-purple-600"
                strokeWidth={2.5}
              />
              <span className="text-gray-800">
                Selected: {format(date, "MMM dd, yyyy")} -{" "}
                {format(addDays(date, tripDuration - 1), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-6 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-7 w-7 text-red-600" strokeWidth={2.5} />
            <h3 className="font-bold text-xl text-red-700">Validation Error</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 font-medium text-base text-red-700">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Calendar Section */}
      <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6">
        <label className="block text-2xl font-playfair font-bold text-gray-800 mb-6">
          Select Start Date
        </label>
        <div className="bg-white border border-purple-50 rounded-2xl p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="w-full"
            classNames={{
              day_selected:
                "bg-purple-600 text-white font-bold rounded-xl w-full",
              day_today: "bg-purple-400 text-white font-bold rounded-xl w-full",
              day_disabled:
                "text-gray-400 opacity-50 w-full cursor-not-allowed",
              day: "bg-white text-gray-800 font-medium rounded-xl w-full transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md hover:scale-105",
              head_cell: "font-bold uppercase text-sm text-gray-700",
              cell: "text-center font-medium p-0 w-full",
              button:
                "w-12 h-12 p-0 font-medium hover:bg-purple-50 hover:text-purple-700 w-full transition-all duration-300 rounded-xl",
              nav_button:
                "bg-white hover:bg-purple-50 border border-purple-100 rounded-xl",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption: "font-bold text-gray-800 text-lg",
            }}
          />
        </div>
      </div>

      {/* Availability Filters */}
      <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6">
        <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
          Available Dates
        </h3>
        <div className="flex flex-wrap gap-4">
          {availabilityOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setAvailabilityFilter(option.value)}
              className={`font-semibold text-base py-3 px-6 rounded-xl transition-all duration-300 font-montserrat border border-purple-100 ${
                availabilityFilter === option.value
                  ? "bg-purple-600 text-white"
                  : "bg-white text-purple-700 hover:bg-purple-50"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-base font-medium mt-4 bg-white border border-purple-50 rounded-xl p-4 text-gray-700">
          Filter available dates based on your preference
        </p>
      </div>

      {/* Quick Date Selection */}
      <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6">
        <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
          Quick Selection
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 7))}
            className="bg-white border border-purple-100 text-purple-700 font-semibold justify-start text-base font-montserrat hover:bg-purple-50 transition-all duration-300 py-4 rounded-xl"
          >
            Next Week
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 14))}
            className="bg-white border border-purple-100 text-purple-700 font-semibold justify-start text-base font-montserrat hover:bg-purple-50 transition-all duration-300 py-4 rounded-xl"
          >
            In 2 Weeks
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 30))}
            className="bg-white border border-purple-100 text-purple-700 font-semibold justify-start text-base font-montserrat hover:bg-purple-50 transition-all duration-300 py-4 rounded-xl"
          >
            Next Month
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 60))}
            className="bg-white border border-purple-100 text-purple-700 font-semibold justify-start text-base font-montserrat hover:bg-purple-50 transition-all duration-300 py-4 rounded-xl"
          >
            In 2 Months
          </Button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

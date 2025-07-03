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
    <div className="space-y-6">
      {/* Trip Duration Card */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#a0c4ff] p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white p-2.5 rounded-md border-2 border-black flex-shrink-0">
            <Clock className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black uppercase">
            Trip Duration: {tripDuration} days
          </h3>
        </div>

        {date && (
          <div className="mt-3 bg-white border-2 border-black rounded-lg p-3 font-bold text-lg">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" strokeWidth={2.5} />
              <span>
                Selected: {format(date, "MMM dd, yyyy")} -{" "}
                {format(addDays(date, tripDuration - 1), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="border-3 border-black rounded-xl p-5 bg-[#ffadad] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-black" strokeWidth={2.5} />
            <h3 className="font-black uppercase text-xl">Error</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 font-bold text-base">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Calendar Section */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-5">
        <label className="block text-xl font-black uppercase mb-4">
          Select Start Date
        </label>
        <div className="bg-[#e0c6ff] border-3 border-black rounded-lg p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="w-full"
            classNames={{
              day_selected: "bg-[#222] text-white font-black rounded-md w-full",
              day_today: "bg-[#444] text-white font-black rounded-md w-full",
              day_disabled: "text-gray-300 opacity-50 w-full",
              day: "bg-white text-black font-black rounded-md w-full transition-colors duration-100 hover:bg-[#caffbf] hover:text-black",
              head_cell: "font-black uppercase text-sm",
              cell: "text-center font-bold p-0 w-full",
              button:
                "w-10 h-10 p-0 font-bold hover:bg-[#caffbf] hover:text-black w-full transition-colors duration-100",
              nav_button: "bg-white hover:bg-[#fdffb6]",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption: "font-black text-black text-lg",
            }}
          />
        </div>
      </div>

      {/* Availability Filters */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#fdffb6] p-5">
        <h3 className="text-xl font-black uppercase mb-4">Available Dates</h3>
        <div className="flex flex-wrap gap-3">
          {availabilityOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setAvailabilityFilter(option.value)}
              className={`border-2 border-black hover:bg-white font-black uppercase text-base py-2.5 px-4
                ${
                  availabilityFilter === option.value
                    ? "bg-black text-white shadow-none hover:bg-black"
                    : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-base font-bold mt-3 bg-white border-2 border-black rounded-md p-3">
          Filter available dates based on your preference
        </p>
      </div>

      {/* Quick Date Selection */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#caffbf] p-5">
        <h3 className="text-xl font-black uppercase mb-4">Quick Selection</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 7))}
            className="border-2 border-black bg-white text-black font-bold justify-start text-base
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white py-3"
          >
            Next Week
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 14))}
            className="border-2 border-black bg-white text-black font-bold justify-start text-base
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white py-3"
          >
            In 2 Weeks
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 30))}
            className="border-2 border-black bg-white text-black font-bold justify-start text-base
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white py-3"
          >
            Next Month
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 60))}
            className="border-2 border-black bg-white text-black font-bold justify-start text-base
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white py-3"
          >
            In 2 Months
          </Button>
        </div>
      </div>
    </div>
  );
}

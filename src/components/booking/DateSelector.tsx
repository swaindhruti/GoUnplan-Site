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
    invalid_type_error: "Please select a valid date"
  }),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "Please select a valid date"
  }),
  duration: z.number().min(1, "Duration must be at least 1 day")
});

// Enhanced schema with refinements for full validation
const dateSelectionSchema = baseDateSelectionSchema
  .refine(
    (data) => !isBefore(startOfDay(data.startDate), startOfDay(new Date())),
    {
      message: "Start date cannot be in the past",
      path: ["startDate"]
    }
  )
  .refine((data) => isAfter(data.endDate, data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"]
  });

interface DateSelectorProps {
  tripDuration: number;
  onDateChange: (startDate: Date, endDate: Date) => void;
  selectedDate?: Date;
}

export function DateSelector({
  tripDuration,
  onDateChange,
  selectedDate
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
        duration: tripDuration
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
    { value: "all" as const, label: "All year round" }
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
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#d7dbcb] p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-1.5 rounded-md border-2 border-black flex-shrink-0">
            <Clock className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-black uppercase">
            Trip Duration: {tripDuration} days
          </h3>
        </div>

        {date && (
          <div className="mt-2 bg-white border-2 border-black rounded-lg p-2 font-bold">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" strokeWidth={2.5} />
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
        <div className="border-3 border-black rounded-xl p-4 bg-[#e9cfcf] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-black" strokeWidth={2.5} />
            <h3 className="font-black uppercase">Error</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 font-bold">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Calendar Section */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-4">
        <label className="block text-lg font-black uppercase mb-4">
          Select Start Date
        </label>
        <div className="bg-[#d3dae6] border-3 border-black rounded-lg p-4">
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
              day: "bg-white text-black font-black rounded-md w-full transition-colors duration-100 hover:bg-[#bcb7c5] hover:text-black",
              head_cell: "font-black uppercase text-xs",
              cell: "text-center font-bold p-0 w-full",
              button:
                "w-9 h-9 p-0 font-bold hover:bg-[#bcb7c5] hover:text-black w-full transition-colors duration-100",
              nav_button: "bg-white hover:bg-[#e6dad3]",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption: "font-black text-black"
            }}
          />
        </div>
      </div>

      {/* Availability Filters */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#f5f5e6] p-4">
        <h3 className="text-lg font-black uppercase mb-3">Available Dates</h3>
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setAvailabilityFilter(option.value)}
              className={`border-2 border-black hover:bg-white font-black uppercase text-xs py-2 px-3
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
        <p className="text-sm font-bold mt-2 bg-white border-2 border-black rounded-md p-2">
          Filter available dates based on your preference
        </p>
      </div>

      {/* Quick Date Selection */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#e6dad3] p-4">
        <h3 className="text-lg font-black uppercase mb-3">Quick Selection</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 7))}
            className="border-2 border-black bg-white text-black font-bold justify-start 
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white"
          >
            Next Week
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 14))}
            className="border-2 border-black bg-white text-black font-bold justify-start
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white"
          >
            In 2 Weeks
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 30))}
            className="border-2 border-black bg-white text-black font-bold justify-start
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white"
          >
            Next Month
          </Button>
          <Button
            onClick={() => handleDateSelect(addDays(new Date(), 60))}
            className="border-2 border-black bg-white text-black font-bold justify-start
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] 
                     hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-white"
          >
            In 2 Months
          </Button>
        </div>
      </div>
    </div>
  );
}

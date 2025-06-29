"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Clock, AlertCircle, CalendarIcon } from "lucide-react"
import { addDays, format, isBefore, isAfter, startOfDay } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { z } from "zod"

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
})

// Enhanced schema with refinements for full validation
const dateSelectionSchema = baseDateSelectionSchema
  .refine((data) => !isBefore(startOfDay(data.startDate), startOfDay(new Date())), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  })
  .refine((data) => isAfter(data.endDate, data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })

interface DateSelectorProps {
  tripDuration: number
  onDateChange: (startDate: Date, endDate: Date) => void
  selectedDate?: Date
}

export function DateSelector({ tripDuration, onDateChange, selectedDate }: DateSelectorProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate)
  const [availabilityFilter, setAvailabilityFilter] = useState<"weekend" | "summer" | "all">("all")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const endDate = addDays(newDate, tripDuration - 1)

      // Validate the date selection
      const validation = dateSelectionSchema.safeParse({
        startDate: newDate,
        endDate: endDate,
        duration: tripDuration,
      })

      if (validation.success) {
        setDate(newDate)
        setValidationErrors([])
        onDateChange(newDate, endDate)
      } else {
        const errors = validation.error.errors.map((err) => err.message)
        setValidationErrors(errors)
      }
    }
  }

  const availabilityOptions = [
    { value: "weekend" as const, label: "Every weekend" },
    { value: "summer" as const, label: "Summer months" },
    { value: "all" as const, label: "All year round" },
  ]

  // Helper function to check if date should be disabled based on filter
  const isDateDisabled = (checkDate: Date) => {
    // Always disable past dates
    if (isBefore(startOfDay(checkDate), startOfDay(new Date()))) {
      return true
    }

    // Apply availability filter
    if (availabilityFilter === "weekend") {
      const dayOfWeek = checkDate.getDay()
      return dayOfWeek !== 0 && dayOfWeek !== 6 // Only weekends (0 = Sunday, 6 = Saturday)
    }

    if (availabilityFilter === "summer") {
      const month = checkDate.getMonth()
      return month < 5 || month > 8 // Only June (5) to September (8)
    }

    return false
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-purple-600" />
            Trip Duration: {tripDuration} days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {date && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  Selected: {format(date, "MMM dd, yyyy")} - {format(addDays(date, tripDuration - 1), "MMM dd, yyyy")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-4">Select Start Date</label>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="w-full"
            classNames={{
              day_selected: "bg-purple-600 text-white hover:bg-purple-700",
              day_today: "bg-purple-100 text-purple-900 font-semibold",
              day_disabled: "text-gray-300 opacity-50",
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Dates</h3>
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map((option) => (
            <Button
              key={option.value}
              variant={availabilityFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setAvailabilityFilter(option.value)}
              className={
                availabilityFilter === option.value
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "hover:bg-purple-50 hover:border-purple-300"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">Filter available dates based on your preference</p>
      </div>

      {/* Quick Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateSelect(addDays(new Date(), 7))}
              className="text-left justify-start"
            >
              Next Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateSelect(addDays(new Date(), 14))}
              className="text-left justify-start"
            >
              In 2 Weeks
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateSelect(addDays(new Date(), 30))}
              className="text-left justify-start"
            >
              Next Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateSelect(addDays(new Date(), 60))}
              className="text-left justify-start"
            >
              In 2 Months
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { z, ZodError } from "zod";
import { BookingFormData } from "@/types/booking";

const baseGuestInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  memberEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters"),
  isteamLead: z.boolean().default(false)
});

const baseGuestInformationFormSchema = z.object({
  participants: z
    .number()
    .min(1, "At least 1 guest is required")
    .max(8, "Maximum 8 guests allowed"),
  guests: z
    .array(baseGuestInfoSchema)
    .min(1, "At least one guest is required")
    .max(8, "Maximum 8 guests allowed"),
  specialRequirements: z
    .string()
    .max(500, "Special requirements must be less than 500 characters")
    .optional()
});

const guestInformationFormSchema = baseGuestInformationFormSchema
  .refine((data) => data.guests.length === data.participants, {
    message: "Number of guest forms must match selected number of guests",
    path: ["guests"]
  })
  .refine(
    (data) => {
      // Ensure exactly one team lead
      const teamLeads = data.guests.filter((guest) => guest.isteamLead);
      return teamLeads.length === 1;
    },
    {
      message: "Exactly one guest must be designated as the team lead",
      path: ["guests"]
    }
  );

type GuestInfo = z.infer<typeof baseGuestInfoSchema>;
type GuestInformationForm = z.infer<typeof guestInformationFormSchema>;
type ValidationErrors = Record<string, string[]>;

interface GuestInformationFormProps {
  onBack: () => void;
  onContinue: (guestCount: number, guestData: BookingFormData) => Promise<void>;
  maxGuests?: number;
}

export function GuestInformationForm({
  onBack,
  onContinue,
  maxGuests = 8
}: GuestInformationFormProps) {
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [guestForms, setGuestForms] = useState<GuestInfo[]>([
    {
      firstName: "",
      lastName: "",
      memberEmail: "",
      phone: "",
      isteamLead: true
    }
  ]);
  const [specialRequirements, setSpecialRequirements] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateField = (
    field: string,
    value: string | number | boolean,
    guestIndex?: number
  ): void => {
    const newErrors: ValidationErrors = { ...validationErrors };

    try {
      if (guestIndex !== undefined) {
        const fieldSchema = baseGuestInfoSchema.shape[field as keyof GuestInfo];
        fieldSchema.parse(value);
        const errorKey = `guests.${guestIndex}.${field}`;
        if (newErrors[errorKey]) {
          delete newErrors[errorKey];
        }
      } else {
        if (field === "participants") {
          baseGuestInformationFormSchema.shape.participants.parse(value);
        } else if (field === "specialRequirements") {
          baseGuestInformationFormSchema.shape.specialRequirements.parse(value);
        }
        if (newErrors[field]) {
          delete newErrors[field];
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const errorKey =
          guestIndex !== undefined ? `guests.${guestIndex}.${field}` : field;
        newErrors[errorKey] = error.errors.map((e) => e.message);
      } else if (error instanceof Error) {
        const errorKey =
          guestIndex !== undefined ? `guests.${guestIndex}.${field}` : field;
        newErrors[errorKey] = [error.message];
      }
    }

    setValidationErrors(newErrors);
  };

  const handleNumberOfGuestsChange = (value: string): void => {
    const num = Number.parseInt(value, 10);
    setNumberOfGuests(num);
    validateField("participants", num);

    const currentForms = [...guestForms];
    if (num > currentForms.length) {
      for (let i = currentForms.length; i < num; i++) {
        currentForms.push({
          firstName: "",
          lastName: "",
          memberEmail: "",
          phone: "",
          isteamLead: false
        });
      }
    } else if (num < currentForms.length) {
      currentForms.splice(num);
      if (currentForms.length > 0) {
        currentForms[0].isteamLead = true;
      }
    }
    setGuestForms(currentForms);
  };

  const addGuestForm = (): void => {
    if (guestForms.length < numberOfGuests) {
      setGuestForms([
        ...guestForms,
        {
          firstName: "",
          lastName: "",
          memberEmail: "",
          phone: "",
          isteamLead: false
        }
      ]);
    }
  };

  const removeGuestForm = (index: number): void => {
    if (guestForms.length > 1) {
      const newForms = guestForms.filter((_, i) => i !== index);

      // If removing the team lead, make the first guest the team lead
      if (guestForms[index].isteamLead && newForms.length > 0) {
        newForms[0].isteamLead = true;
      }

      setGuestForms(newForms);
      const newCount = newForms.length;
      setNumberOfGuests(newCount);
      validateField("participants", newCount);

      const newErrors: ValidationErrors = { ...validationErrors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`guests.${index}.`)) {
          delete newErrors[key];
        }
      });
      setValidationErrors(newErrors);
    }
  };

  const updateGuestForm = (
    index: number,
    field: keyof GuestInfo,
    value: string | boolean
  ): void => {
    const newForms = [...guestForms];

    // Handle team lead selection
    if (field === "isteamLead" && value === true) {
      // Set all other guests to not be team lead
      newForms.forEach((guest, i) => {
        if (i !== index) {
          guest.isteamLead = false;
        }
      });
    }

    newForms[index] = { ...newForms[index], [field]: value };
    setGuestForms(newForms);
    validateField(field, value, index);
  };

  const handleSpecialRequirementsChange = (value: string): void => {
    setSpecialRequirements(value);
    validateField("specialRequirements", value);
  };

  const canAddMoreForms: boolean =
    guestForms.length < numberOfGuests && guestForms.length < maxGuests;

  const handleContinueClick = async (): Promise<void> => {
    setIsSubmitting(true);

    const formData: BookingFormData = {
      guests: guestForms,
      specialRequirements: specialRequirements || undefined,
      participants: numberOfGuests
    };
    console.log(formData);

    const validation = guestInformationFormSchema.safeParse(formData);

    if (validation.success) {
      setValidationErrors({});
      onContinue(numberOfGuests, formData);
    } else {
      const errors: ValidationErrors = {};
      validation.error.errors.forEach((error) => {
        const path = error.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(error.message);
      });
      setValidationErrors(errors);
    }

    setIsSubmitting(false);
  };

  const getFieldError = (
    field: string,
    guestIndex?: number
  ): string | undefined => {
    const errorKey =
      guestIndex !== undefined ? `guests.${guestIndex}.${field}` : field;
    return validationErrors[errorKey]?.[0];
  };

  const hasErrors: boolean = Object.keys(validationErrors).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Guest Information
        </h2>
        {hasErrors && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please correct the errors below before continuing.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Number of Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="guests">Select number of guests</Label>
              <Select
                value={numberOfGuests.toString()}
                onValueChange={handleNumberOfGuestsChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number of guests" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "person" : "people"}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Maximum {maxGuests} people per booking
              </p>
              {getFieldError("participants") && (
                <p className="text-sm text-red-600">
                  {getFieldError("participants")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guest Forms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Guest Details</h3>
          <div className="text-sm text-gray-500">
            {guestForms.length} of {numberOfGuests} guest
            {numberOfGuests > 1 ? "s" : ""}
          </div>
        </div>

        {guestForms.map((guest, index) => (
          <Card key={index} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg">
                Guest {index + 1}
                {guest.isteamLead && (
                  <span className="ml-2 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Team Lead
                  </span>
                )}
              </CardTitle>
              {guestForms.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeGuestForm(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`firstName-${index}`}
                    placeholder="John"
                    value={guest.firstName}
                    onChange={(e) =>
                      updateGuestForm(index, "firstName", e.target.value)
                    }
                    className={
                      getFieldError("firstName", index) ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("firstName", index) && (
                    <p className="text-sm text-red-600">
                      {getFieldError("firstName", index)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`lastName-${index}`}
                    placeholder="Doe"
                    value={guest.lastName}
                    onChange={(e) =>
                      updateGuestForm(index, "lastName", e.target.value)
                    }
                    className={
                      getFieldError("lastName", index) ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("lastName", index) && (
                    <p className="text-sm text-red-600">
                      {getFieldError("lastName", index)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`memberEmail-${index}`}>
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`memberEmail-${index}`}
                    type="email"
                    placeholder="john@example.com"
                    value={guest.memberEmail}
                    onChange={(e) =>
                      updateGuestForm(index, "memberEmail", e.target.value)
                    }
                    className={
                      getFieldError("memberEmail", index)
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {getFieldError("memberEmail", index) && (
                    <p className="text-sm text-red-600">
                      {getFieldError("memberEmail", index)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`phone-${index}`}>
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={guest.phone}
                    onChange={(e) =>
                      updateGuestForm(index, "phone", e.target.value)
                    }
                    className={
                      getFieldError("phone", index) ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("phone", index) && (
                    <p className="text-sm text-red-600">
                      {getFieldError("phone", index)}
                    </p>
                  )}
                </div>
              </div>

              {/* Team Lead Selection */}
              {numberOfGuests > 1 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`teamLead-${index}`}
                      checked={guest.isteamLead}
                      onChange={(e) =>
                        updateGuestForm(index, "isteamLead", e.target.checked)
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor={`teamLead-${index}`} className="text-sm">
                      Make this person the primary contact (Team Lead)
                    </Label>
                  </div>
                </div>
              )}

              {/* Primary contact note for single guest or team lead */}
              {(numberOfGuests === 1 || guest.isteamLead) && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Note:</strong> This person will be the primary
                    contact for the booking.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add Guest Button */}
        {canAddMoreForms && (
          <Button
            variant="outline"
            onClick={addGuestForm}
            className="w-full border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Guest ({guestForms.length}/{numberOfGuests})
          </Button>
        )}

        {/* Show message if max guests reached */}
        {guestForms.length === numberOfGuests && numberOfGuests < maxGuests && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              All guest forms added. You can increase the number of guests above
              to add more.
            </p>
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Special Requirements (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="requirements">
              Any dietary restrictions, accessibility needs, medical conditions,
              or other special requests
            </Label>
            <Textarea
              id="requirements"
              placeholder="Please describe any special requirements, dietary restrictions, accessibility needs, or other requests we should know about..."
              value={specialRequirements}
              onChange={(e) => handleSpecialRequirementsChange(e.target.value)}
              rows={4}
              className={
                getFieldError("specialRequirements") ? "border-red-500" : ""
              }
            />
            <p className="text-xs text-gray-500">
              Maximum 500 characters ({specialRequirements.length}/500)
            </p>
            {getFieldError("specialRequirements") && (
              <p className="text-sm text-red-600">
                {getFieldError("specialRequirements")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Number of Guests:</span>
              <span className="font-medium">{numberOfGuests}</span>
            </div>
            <div className="flex justify-between">
              <span>Forms Completed:</span>
              <span className="font-medium">
                {
                  guestForms.filter(
                    (guest) =>
                      guest.firstName &&
                      guest.lastName &&
                      guest.memberEmail &&
                      guest.phone
                  ).length
                }{" "}
                of {numberOfGuests}
              </span>
            </div>
            {numberOfGuests > 1 && (
              <div className="flex justify-between">
                <span>Team Lead:</span>
                <span className="font-medium">
                  {guestForms.find((g) => g.isteamLead)?.firstName ||
                    "Not selected"}
                </span>
              </div>
            )}
            {specialRequirements && (
              <div className="pt-2 border-t">
                <span className="text-gray-600">Special Requirements:</span>
                <p className="text-xs mt-1 text-gray-700">
                  {specialRequirements}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back to Dates
        </Button>
        <Button
          onClick={handleContinueClick}
          disabled={isSubmitting || guestForms.length !== numberOfGuests}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Validating..." : "Continue to Payment"}
        </Button>
      </div>
    </div>
  );
}

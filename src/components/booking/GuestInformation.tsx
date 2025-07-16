"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Plus,
  User,
  Users,
  FileText,
  BriefcaseMedical,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
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
  isteamLead: z.boolean().default(false),
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
    .optional(),
});

const guestInformationFormSchema = baseGuestInformationFormSchema
  .refine((data) => data.guests.length === data.participants, {
    message: "Number of guest forms must match selected number of guests",
    path: ["guests"],
  })
  .refine(
    (data) => {
      // Ensure exactly one team lead
      const teamLeads = data.guests.filter((guest) => guest.isteamLead);
      return teamLeads.length === 1;
    },
    {
      message: "Exactly one guest must be designated as the team lead",
      path: ["guests"],
    }
  );

type GuestInfo = z.infer<typeof baseGuestInfoSchema>;
type ValidationErrors = Record<string, string[]>;

interface GuestInformationFormProps {
  onBack: () => void;
  onContinue: (guestCount: number, guestData: BookingFormData) => Promise<void>;
  maxGuests?: number;
}

export function GuestInformationForm({
  onBack,
  onContinue,
  maxGuests = 8,
}: GuestInformationFormProps) {
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [guestForms, setGuestForms] = useState<GuestInfo[]>([
    {
      firstName: "",
      lastName: "",
      memberEmail: "",
      phone: "",
      isteamLead: true,
    },
  ]);
  const [specialRequirements, setSpecialRequirements] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Premium color palette for guest cards
  const guestCardColors = useMemo(
    () => [
      "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200/50",
      "bg-gradient-to-r from-green-100 to-emerald-100 border-green-200/50",
      "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200/50",
      "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200/50",
      "bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200/50",
      "bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200/50",
      "bg-gradient-to-r from-violet-100 to-purple-100 border-violet-200/50",
      "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200/50",
    ],
    []
  );

  // Get color by guest index - consistent assignment
  const getGuestCardColor = (index: number): string => {
    return guestCardColors[index % guestCardColors.length];
  };

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
          isteamLead: false,
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
          isteamLead: false,
        },
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
      participants: numberOfGuests,
    };

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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-white/30 pb-6 mb-8">
        <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-4 rounded-2xl shadow-lg">
          <Users className="h-8 w-8 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-playfair font-bold text-gray-800">
          Guest Information
        </h2>
      </div>

      {/* Number of Guests */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-6 border-b border-white/30 pb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-xl shadow-lg">
            <Users className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            Number of Guests
          </h3>
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="guests"
            className="font-semibold text-gray-700 text-lg"
          >
            Select number of guests
          </Label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mt-3">
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberOfGuestsChange(num.toString())}
                className={`font-bold text-lg py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  numberOfGuests === num
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30"
                    : "bg-white/80 backdrop-blur-xl border border-white/60 text-gray-700 hover:bg-white hover:shadow-2xl hover:shadow-purple-500/20"
                }`}
              >
                {num}
              </Button>
            ))}
          </div>
          <p className="backdrop-blur-xl bg-white/80 border border-white/60 p-4 rounded-xl mt-4 font-semibold text-gray-700 shadow-lg">
            Maximum {maxGuests} people per booking
          </p>
          {getFieldError("participants") && (
            <p className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 p-4 rounded-xl font-semibold text-red-700 shadow-lg animate-fade-in">
              {getFieldError("participants")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6 border-b border-white/30 pb-4">
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            Guest Details
          </h3>
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 rounded-xl px-6 py-3 font-bold text-lg shadow-lg">
            {guestForms.length} of {numberOfGuests} guest
            {numberOfGuests > 1 ? "s" : ""}
          </div>
        </div>

        {guestForms.map((guest, index) => (
          <div
            key={index}
            className={`backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${getGuestCardColor(
              index
            )}`}
          >
            <div className="backdrop-blur-xl bg-white/80 border-b border-white/30 flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-xl shadow-lg">
                  <User className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl text-gray-800">
                  Guest {index + 1}
                  {guest.isteamLead && (
                    <span className="ml-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm rounded-xl uppercase font-semibold shadow-lg">
                      Team Lead
                    </span>
                  )}
                </h3>
              </div>
              {guestForms.length > 1 && (
                <Button
                  onClick={() => removeGuestForm(index)}
                  className="bg-white/80 backdrop-blur-xl border border-white/60 text-red-600 hover:bg-red-500 hover:text-white 
                            font-semibold shadow-lg hover:shadow-2xl hover:shadow-red-500/20 
                            hover:scale-105 transition-all duration-300 p-3 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor={`firstName-${index}`}
                    className="font-semibold text-gray-700 text-lg"
                  >
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`firstName-${index}`}
                    placeholder="John"
                    value={guest.firstName}
                    onChange={(e) =>
                      updateGuestForm(index, "firstName", e.target.value)
                    }
                    className={`backdrop-blur-xl bg-white/80 border border-white/60 text-lg rounded-xl shadow-lg transition-all duration-300 ${
                      getFieldError("firstName", index)
                        ? "border-red-400 shadow-red-500/20"
                        : "hover:border-purple-400 hover:shadow-purple-500/20"
                    }`}
                  />
                  {getFieldError("firstName", index) && (
                    <p className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 p-3 rounded-xl font-medium text-red-700 shadow-lg animate-fade-in">
                      {getFieldError("firstName", index)}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor={`lastName-${index}`}
                    className="font-semibold text-gray-700 text-lg"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`lastName-${index}`}
                    placeholder="Doe"
                    value={guest.lastName}
                    onChange={(e) =>
                      updateGuestForm(index, "lastName", e.target.value)
                    }
                    className={`backdrop-blur-xl bg-white/80 border border-white/60 text-lg rounded-xl shadow-lg transition-all duration-300 ${
                      getFieldError("lastName", index)
                        ? "border-red-400 shadow-red-500/20"
                        : "hover:border-purple-400 hover:shadow-purple-500/20"
                    }`}
                  />
                  {getFieldError("lastName", index) && (
                    <p className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 p-3 rounded-xl font-medium text-red-700 shadow-lg animate-fade-in">
                      {getFieldError("lastName", index)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor={`memberEmail-${index}`}
                    className="font-semibold text-gray-700 text-lg"
                  >
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
                    className={`backdrop-blur-xl bg-white/80 border border-white/60 text-lg rounded-xl shadow-lg transition-all duration-300 ${
                      getFieldError("memberEmail", index)
                        ? "border-red-400 shadow-red-500/20"
                        : "hover:border-purple-400 hover:shadow-purple-500/20"
                    }`}
                  />
                  {getFieldError("memberEmail", index) && (
                    <p className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 p-3 rounded-xl font-medium text-red-700 shadow-lg animate-fade-in">
                      {getFieldError("memberEmail", index)}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor={`phone-${index}`}
                    className="font-semibold text-gray-700 text-lg"
                  >
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
                    className={`backdrop-blur-xl bg-white/80 border border-white/60 text-lg rounded-xl shadow-lg transition-all duration-300 ${
                      getFieldError("phone", index)
                        ? "border-red-400 shadow-red-500/20"
                        : "hover:border-purple-400 hover:shadow-purple-500/20"
                    }`}
                  />
                  {getFieldError("phone", index) && (
                    <p className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 p-3 rounded-xl font-medium text-red-700 shadow-lg animate-fade-in">
                      {getFieldError("phone", index)}
                    </p>
                  )}
                </div>
              </div>

              {numberOfGuests > 1 && (
                <div className="pt-6 border-t border-white/30">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id={`teamLead-${index}`}
                      checked={guest.isteamLead}
                      onChange={(e) =>
                        updateGuestForm(index, "isteamLead", e.target.checked)
                      }
                      className="w-6 h-6 border-2 border-purple-400 rounded-lg accent-purple-600"
                    />
                    <Label
                      htmlFor={`teamLead-${index}`}
                      className="font-semibold text-gray-700 text-lg"
                    >
                      Make this person the primary contact (Team Lead)
                    </Label>
                  </div>
                </div>
              )}

              {(numberOfGuests === 1 || guest.isteamLead) && (
                <div className="pt-6 border-t border-white/30">
                  <p className="backdrop-blur-xl bg-white/80 border border-white/60 p-4 rounded-xl font-medium text-gray-700 shadow-lg">
                    <strong>Note:</strong> This person will be the primary
                    contact for the booking.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {canAddMoreForms && (
          <Button
            onClick={addGuestForm}
            className="w-full backdrop-blur-xl bg-white/80 border border-white/60 text-gray-700 font-semibold text-lg
                     shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 
                     transition-all duration-300 py-6 rounded-2xl"
          >
            <Plus className="w-6 h-6 mr-3" strokeWidth={2.5} />
            Add Guest ({guestForms.length}/{numberOfGuests})
          </Button>
        )}

        {/* Show message if max guests reached */}
        {guestForms.length === numberOfGuests && numberOfGuests < maxGuests && (
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 rounded-2xl p-6 shadow-xl">
            <p className="font-semibold text-lg text-gray-700">
              All guest forms added. You can increase the number of guests above
              to add more.
            </p>
          </div>
        )}
      </div>

      {/* Special Requirements */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-6 border-b border-white/30 pb-4">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-xl shadow-lg">
            <BriefcaseMedical
              className="w-7 h-7 text-white"
              strokeWidth={2.5}
            />
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            Special Requirements (Optional)
          </h3>
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="requirements"
            className="font-semibold text-gray-700 text-lg"
          >
            Any dietary restrictions, accessibility needs, medical conditions,
            or other special requests
          </Label>
          <Textarea
            id="requirements"
            placeholder="Please describe any special requirements, dietary restrictions, accessibility needs, or other requests we should know about..."
            value={specialRequirements}
            onChange={(e) => handleSpecialRequirementsChange(e.target.value)}
            rows={4}
            className={`backdrop-blur-xl bg-white/80 border border-white/60 text-lg rounded-xl shadow-lg transition-all duration-300 ${
              getFieldError("specialRequirements")
                ? "border-red-400 shadow-red-500/20"
                : "hover:border-purple-400 hover:shadow-purple-500/20"
            }`}
          />
          <p className="backdrop-blur-xl bg-white/80 border border-white/60 p-4 rounded-xl mt-3 font-semibold text-gray-700 shadow-lg">
            Maximum 500 characters ({specialRequirements.length}/500)
          </p>
          {getFieldError("specialRequirements") && (
            <p className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 p-4 rounded-xl font-medium text-red-700 shadow-lg animate-fade-in">
              {getFieldError("specialRequirements")}
            </p>
          )}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/50 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-6 border-b border-white/30 pb-4">
          <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-3 rounded-xl shadow-lg">
            <FileText className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            Booking Summary
          </h3>
        </div>

        <div className="space-y-4 backdrop-blur-xl bg-white/80 border border-white/60 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between border-b border-white/30 pb-4">
            <span className="font-semibold text-lg text-gray-700">
              Number of Guests:
            </span>
            <span className="font-bold text-lg text-gray-800">
              {numberOfGuests}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/30 pb-4">
            <span className="font-semibold text-lg text-gray-700">
              Forms Completed:
            </span>
            <span className="font-bold text-lg text-gray-800">
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
            <div className="flex justify-between border-b border-white/30 pb-4">
              <span className="font-semibold text-lg text-gray-700">
                Team Lead:
              </span>
              <span className="font-bold text-lg text-gray-800">
                {guestForms.find((g) => g.isteamLead)?.firstName ||
                  "Not selected"}
              </span>
            </div>
          )}
          {specialRequirements && (
            <div className="pt-4 border-t border-white/30">
              <span className="font-semibold block mb-3 text-lg text-gray-700">
                Special Requirements:
              </span>
              <p className="backdrop-blur-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 border border-gray-200/50 rounded-xl text-lg text-gray-700 shadow-lg">
                {specialRequirements}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t border-white/30">
        <Button
          onClick={onBack}
          disabled={isSubmitting}
          className="backdrop-blur-xl bg-white/80 border border-white/60 text-gray-700 hover:text-white font-semibold text-xl
                   shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105
                   transition-all duration-300 py-6 px-8 rounded-2xl flex items-center gap-3"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Dates
        </Button>
        <Button
          onClick={handleContinueClick}
          disabled={isSubmitting || guestForms.length !== numberOfGuests}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 text-xl
                   shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105
                   transition-all duration-300 py-6 px-8 rounded-2xl flex items-center gap-3"
        >
          {isSubmitting ? "Validating..." : "Continue to Payment"}
          <ArrowRight className="w-6 h-6" />
        </Button>
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

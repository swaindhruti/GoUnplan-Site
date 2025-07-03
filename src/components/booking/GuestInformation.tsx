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

  // Fixed colors for guest cards - defined once and reused
  const guestCardColors = useMemo(
    () => [
      "bg-[#fdffb6]", // pale yellow
      "bg-[#caffbf]", // light green
      "bg-[#e0c6ff]", // soft lavender
      "bg-[#a0c4ff]", // baby blue
      "bg-[#ffd6ff]", // pink lavender
      "bg-[#fdffb6]", // repeat for more than 5 guests
      "bg-[#caffbf]",
      "bg-[#e0c6ff]",
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b-3 border-black pb-4 mb-6">
        <div className="bg-[#caffbf] p-2.5 rounded-lg border-2 border-black">
          <Users className="h-7 w-7 text-black" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">
          Guest Information
        </h2>
      </div>

      {/* Number of Guests */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#fdffb6] p-5">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
          <div className="bg-white p-2.5 rounded-md border-2 border-black flex-shrink-0">
            <Users className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black uppercase">Number of Guests</h3>
        </div>

        <div className="space-y-3">
          <Label htmlFor="guests" className="font-bold text-black text-lg">
            Select number of guests
          </Label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mt-2">
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberOfGuestsChange(num.toString())}
                className={`border-3 border-black font-black text-xl py-3 px-4
                  ${
                    numberOfGuests === num
                      ? "bg-black text-white shadow-none"
                      : "bg-white hover:text-white/[0.7] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
              >
                {num}
              </Button>
            ))}
          </div>
          <p className="bg-white border-2 border-black p-3 rounded-md mt-2 font-bold text-lg">
            Maximum {maxGuests} people per booking
          </p>
          {getFieldError("participants") && (
            <p className="bg-[#ffadad] border-2 border-black p-3 rounded-md font-bold text-lg">
              {getFieldError("participants")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-3">
          <h3 className="text-xl font-black uppercase">Guest Details</h3>
          <div className="bg-[#a0c4ff] border-2 border-black rounded-md px-4 py-2 font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {guestForms.length} of {numberOfGuests} guest
            {numberOfGuests > 1 ? "s" : ""}
          </div>
        </div>

        {guestForms.map((guest, index) => (
          <div
            key={index}
            className={`border-3 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${getGuestCardColor(
              index
            )}`}
          >
            <div className="bg-white border-b-3 border-black flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#e0c6ff] p-2.5 rounded-md border-2 border-black flex-shrink-0">
                  <User className="w-6 h-6 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="font-black uppercase text-xl">
                  Guest {index + 1}
                  {guest.isteamLead && (
                    <span className="ml-2 bg-black text-white px-3 py-0.5 text-sm rounded-md uppercase">
                      Team Lead
                    </span>
                  )}
                </h3>
              </div>
              {guestForms.length > 1 && (
                <Button
                  onClick={() => removeGuestForm(index)}
                  className="bg-white border-2 border-black text-black hover:bg-[#ffadad] 
                            font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none 
                            hover:translate-x-[2px] hover:translate-y-[2px] p-2.5"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`firstName-${index}`}
                    className="font-bold text-black text-lg"
                  >
                    First Name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id={`firstName-${index}`}
                    placeholder="John"
                    value={guest.firstName}
                    onChange={(e) =>
                      updateGuestForm(index, "firstName", e.target.value)
                    }
                    className={`border-2 border-black bg-white text-lg ${
                      getFieldError("firstName", index)
                        ? "border-red-600 border-3"
                        : ""
                    }`}
                  />
                  {getFieldError("firstName", index) && (
                    <p className="bg-[#ffadad] border-2 border-black p-2 rounded-md font-bold">
                      {getFieldError("firstName", index)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`lastName-${index}`}
                    className="font-bold text-black text-lg"
                  >
                    Last Name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id={`lastName-${index}`}
                    placeholder="Doe"
                    value={guest.lastName}
                    onChange={(e) =>
                      updateGuestForm(index, "lastName", e.target.value)
                    }
                    className={`border-2 border-black bg-white text-lg ${
                      getFieldError("lastName", index)
                        ? "border-red-600 border-3"
                        : ""
                    }`}
                  />
                  {getFieldError("lastName", index) && (
                    <p className="bg-[#ffadad] border-2 border-black p-2 rounded-md font-bold">
                      {getFieldError("lastName", index)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`memberEmail-${index}`}
                    className="font-bold text-black text-lg"
                  >
                    Email Address <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id={`memberEmail-${index}`}
                    type="email"
                    placeholder="john@example.com"
                    value={guest.memberEmail}
                    onChange={(e) =>
                      updateGuestForm(index, "memberEmail", e.target.value)
                    }
                    className={`border-2 border-black bg-white text-lg ${
                      getFieldError("memberEmail", index)
                        ? "border-red-600 border-3"
                        : ""
                    }`}
                  />
                  {getFieldError("memberEmail", index) && (
                    <p className="bg-[#ffadad] border-2 border-black p-2 rounded-md font-bold">
                      {getFieldError("memberEmail", index)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`phone-${index}`}
                    className="font-bold text-black text-lg"
                  >
                    Phone Number <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={guest.phone}
                    onChange={(e) =>
                      updateGuestForm(index, "phone", e.target.value)
                    }
                    className={`border-2 border-black bg-white text-lg ${
                      getFieldError("phone", index)
                        ? "border-red-600 border-3"
                        : ""
                    }`}
                  />
                  {getFieldError("phone", index) && (
                    <p className="bg-[#ffadad] border-2 border-black p-2 rounded-md font-bold">
                      {getFieldError("phone", index)}
                    </p>
                  )}
                </div>
              </div>

              {numberOfGuests > 1 && (
                <div className="pt-4 border-t-2 border-black">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`teamLead-${index}`}
                      checked={guest.isteamLead}
                      onChange={(e) =>
                        updateGuestForm(index, "isteamLead", e.target.checked)
                      }
                      className="w-6 h-6 border-2 border-black"
                    />
                    <Label
                      htmlFor={`teamLead-${index}`}
                      className="font-bold text-black text-lg"
                    >
                      Make this person the primary contact (Team Lead)
                    </Label>
                  </div>
                </div>
              )}

              {(numberOfGuests === 1 || guest.isteamLead) && (
                <div className="pt-4 border-t-2 border-black">
                  <p className="bg-white border-2 border-black p-3 rounded-md font-bold">
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
            className="w-full border-3 border-black text-black font-black uppercase text-lg
                     bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                     hover:translate-x-[2px] hover:translate-y-[2px] 
                     hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                     py-5"
          >
            <Plus className="w-6 h-6 mr-2" strokeWidth={2.5} />
            Add Guest ({guestForms.length}/{numberOfGuests})
          </Button>
        )}

        {/* Show message if max guests reached */}
        {guestForms.length === numberOfGuests && numberOfGuests < maxGuests && (
          <div className="bg-[#a0c4ff] border-3 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-lg">
              All guest forms added. You can increase the number of guests above
              to add more.
            </p>
          </div>
        )}
      </div>

      {/* Special Requirements */}
      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#e0c6ff] p-5">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
          <div className="bg-white p-2.5 rounded-md border-2 border-black flex-shrink-0">
            <BriefcaseMedical
              className="w-6 h-6 text-black"
              strokeWidth={2.5}
            />
          </div>
          <h3 className="text-xl font-black uppercase">
            Special Requirements (Optional)
          </h3>
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="requirements"
            className="font-bold text-black text-lg"
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
            className={`border-2 border-black bg-white text-lg ${
              getFieldError("specialRequirements")
                ? "border-red-600 border-3"
                : ""
            }`}
          />
          <p className="bg-white border-2 border-black p-3 rounded-md mt-2 font-bold">
            Maximum 500 characters ({specialRequirements.length}/500)
          </p>
          {getFieldError("specialRequirements") && (
            <p className="bg-[#ffadad] border-2 border-black p-3 rounded-md font-bold">
              {getFieldError("specialRequirements")}
            </p>
          )}
        </div>
      </div>

      <div className="border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#ffd6ff] p-5">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
          <div className="bg-white p-2.5 rounded-md border-2 border-black flex-shrink-0">
            <FileText className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black uppercase">Booking Summary</h3>
        </div>

        <div className="space-y-3 bg-white border-2 border-black p-5 rounded-lg">
          <div className="flex justify-between border-b-2 border-dashed border-black pb-3">
            <span className="font-bold text-lg">Number of Guests:</span>
            <span className="font-black text-lg">{numberOfGuests}</span>
          </div>
          <div className="flex justify-between border-b-2 border-dashed border-black pb-3">
            <span className="font-bold text-lg">Forms Completed:</span>
            <span className="font-black text-lg">
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
            <div className="flex justify-between border-b-2 border-dashed border-black pb-3">
              <span className="font-bold text-lg">Team Lead:</span>
              <span className="font-black text-lg">
                {guestForms.find((g) => g.isteamLead)?.firstName ||
                  "Not selected"}
              </span>
            </div>
          )}
          {specialRequirements && (
            <div className="pt-3 border-t-2 border-black">
              <span className="font-bold block mb-2 text-lg">
                Special Requirements:
              </span>
              <p className="bg-[#f9f9ff] p-3 border-2 border-black rounded-md text-lg">
                {specialRequirements}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t-3 border-black">
        <Button
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-white text-black hover:text-white/[0.7] font-black uppercase text-xl
                   border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                   hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                   hover:translate-x-[2px] hover:translate-y-[2px]
                   transition-all duration-200 py-5 px-6"
        >
          Back to Dates
        </Button>
        <Button
          onClick={handleContinueClick}
          disabled={isSubmitting || guestForms.length !== numberOfGuests}
          className="bg-[#caffbf] text-black font-black hover:text-white/[0.7] uppercase text-xl
                   border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                   hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                   hover:translate-x-[2px] hover:translate-y-[2px]
                   transition-all duration-200 py-5 px-6"
        >
          {isSubmitting ? "Validating..." : "Continue to Payment"}
        </Button>
      </div>
    </div>
  );
}

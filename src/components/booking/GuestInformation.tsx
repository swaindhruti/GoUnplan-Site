'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, User, Users, FileText, BriefcaseMedical, ArrowRight } from 'lucide-react';
import { z, ZodError } from 'zod';
import { BookingFormData } from '@/types/booking';

const baseGuestInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  memberEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters'),
  isteamLead: z.boolean().default(false),
});

const baseGuestInformationFormSchema = z.object({
  participants: z
    .number()
    .min(1, 'At least 1 guest is required')
    .max(8, 'Maximum 8 guests allowed'),
  guests: z
    .array(baseGuestInfoSchema)
    .min(1, 'At least one guest is required')
    .max(8, 'Maximum 8 guests allowed'),
  specialRequirements: z
    .string()
    .max(500, 'Special requirements must be less than 500 characters')
    .optional(),
});

const guestInformationFormSchema = baseGuestInformationFormSchema
  .refine(data => data.guests.length === data.participants, {
    message: 'Number of guest forms must match selected number of guests',
    path: ['guests'],
  })
  .refine(
    data => {
      // Ensure exactly one team lead
      const teamLeads = data.guests.filter(guest => guest.isteamLead);
      return teamLeads.length === 1;
    },
    {
      message: 'Exactly one guest must be designated as the team lead',
      path: ['guests'],
    }
  );

type GuestInfo = z.infer<typeof baseGuestInfoSchema>;
type ValidationErrors = Record<string, string[]>;

interface GuestInformationFormProps {
  onContinue: (guestCount: number, guestData: BookingFormData) => Promise<void>;
  maxGuests?: number;
}

export function GuestInformationForm({ onContinue, maxGuests = 8 }: GuestInformationFormProps) {
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [guestForms, setGuestForms] = useState<GuestInfo[]>([
    {
      firstName: '',
      lastName: '',
      memberEmail: '',
      phone: '',
      isteamLead: true,
    },
  ]);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
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
        if (field === 'participants') {
          baseGuestInformationFormSchema.shape.participants.parse(value);
        } else if (field === 'specialRequirements') {
          baseGuestInformationFormSchema.shape.specialRequirements.parse(value);
        }
        if (newErrors[field]) {
          delete newErrors[field];
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const errorKey = guestIndex !== undefined ? `guests.${guestIndex}.${field}` : field;
        newErrors[errorKey] = error.errors.map(e => e.message);
      } else if (error instanceof Error) {
        const errorKey = guestIndex !== undefined ? `guests.${guestIndex}.${field}` : field;
        newErrors[errorKey] = [error.message];
      }
    }

    setValidationErrors(newErrors);
  };

  const handleNumberOfGuestsChange = (value: string): void => {
    const num = Number.parseInt(value, 10);
    setNumberOfGuests(num);
    validateField('participants', num);

    const currentForms = [...guestForms];
    if (num > currentForms.length) {
      for (let i = currentForms.length; i < num; i++) {
        currentForms.push({
          firstName: '',
          lastName: '',
          memberEmail: '',
          phone: '',
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
          firstName: '',
          lastName: '',
          memberEmail: '',
          phone: '',
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
      validateField('participants', newCount);

      const newErrors: ValidationErrors = { ...validationErrors };
      Object.keys(newErrors).forEach(key => {
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
    if (field === 'isteamLead' && value === true) {
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
    validateField('specialRequirements', value);
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
      validation.error.errors.forEach(error => {
        const path = error.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(error.message);
      });
      setValidationErrors(errors);
    }

    setIsSubmitting(false);
  };

  const getFieldError = (field: string, guestIndex?: number): string | undefined => {
    const errorKey = guestIndex !== undefined ? `guests.${guestIndex}.${field}` : field;
    return validationErrors[errorKey]?.[0];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 font-bricolage mb-2">Guest Information</h2>
        <p className="text-gray-600 font-instrument">Please provide details for all travelers</p>
      </div>

      {/* Number of Guests */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-bricolage">Number of Travelers</h3>
        </div>

        <div className="space-y-4">
          <Label htmlFor="guests" className="text-gray-700 font-instrument">
            Select how many people will be joining this trip
          </Label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
              <Button
                key={num}
                onClick={() => handleNumberOfGuestsChange(num.toString())}
                className={`h-12 w-12 rounded-lg font-semibold transition-all duration-200 font-instrument ${
                  numberOfGuests === num
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {num}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-600 font-instrument">
            Maximum {maxGuests} travelers per booking
          </p>
          {getFieldError('participants') && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg font-instrument">
              {getFieldError('participants')}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-bricolage">Traveler Details</h3>
          <div className="bg-purple-50 text-purple-700 rounded-lg px-4 py-2 text-sm font-semibold font-instrument">
            {guestForms.length} of {numberOfGuests} completed
          </div>
        </div>

        {guestForms.map((guest, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 font-instrument">
                  Traveler {index + 1}
                  {guest.isteamLead && (
                    <span className="ml-2 bg-purple-600 text-white px-2 py-1 text-xs rounded-md uppercase font-semibold">
                      Primary Contact
                    </span>
                  )}
                </h4>
              </div>
              {guestForms.length > 1 && (
                <Button
                  onClick={() => removeGuestForm(index)}
                  className="bg-white border border-gray-300 text-red-600 hover:bg-red-50 p-2 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`firstName-${index}`}
                    className="text-sm font-medium text-gray-700 font-instrument"
                  >
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`firstName-${index}`}
                    placeholder="John"
                    value={guest.firstName}
                    onChange={e => updateGuestForm(index, 'firstName', e.target.value)}
                    className={`border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 ${
                      getFieldError('firstName', index) ? 'border-red-400' : ''
                    }`}
                  />
                  {getFieldError('firstName', index) && (
                    <p className="text-sm text-red-600 font-instrument">
                      {getFieldError('firstName', index)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`lastName-${index}`}
                    className="text-sm font-medium text-gray-700 font-instrument"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`lastName-${index}`}
                    placeholder="Doe"
                    value={guest.lastName}
                    onChange={e => updateGuestForm(index, 'lastName', e.target.value)}
                    className={`border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 ${
                      getFieldError('lastName', index) ? 'border-red-400' : ''
                    }`}
                  />
                  {getFieldError('lastName', index) && (
                    <p className="text-sm text-red-600 font-instrument">
                      {getFieldError('lastName', index)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`memberEmail-${index}`}
                    className="text-sm font-medium text-gray-700 font-instrument"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`memberEmail-${index}`}
                    type="email"
                    placeholder="john@example.com"
                    value={guest.memberEmail}
                    onChange={e => updateGuestForm(index, 'memberEmail', e.target.value)}
                    className={`border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 ${
                      getFieldError('memberEmail', index) ? 'border-red-400' : ''
                    }`}
                  />
                  {getFieldError('memberEmail', index) && (
                    <p className="text-sm text-red-600 font-instrument">
                      {getFieldError('memberEmail', index)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`phone-${index}`}
                    className="text-sm font-medium text-gray-700 font-instrument"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={guest.phone}
                    onChange={e => updateGuestForm(index, 'phone', e.target.value)}
                    className={`border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 ${
                      getFieldError('phone', index) ? 'border-red-400' : ''
                    }`}
                  />
                  {getFieldError('phone', index) && (
                    <p className="text-sm text-red-600 font-instrument">
                      {getFieldError('phone', index)}
                    </p>
                  )}
                </div>
              </div>

              {numberOfGuests > 1 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`teamLead-${index}`}
                      checked={guest.isteamLead}
                      onChange={e => updateGuestForm(index, 'isteamLead', e.target.checked)}
                      className="w-4 h-4 border-2 border-gray-300 rounded accent-purple-600"
                    />
                    <Label
                      htmlFor={`teamLead-${index}`}
                      className="text-sm text-gray-700 font-instrument"
                    >
                      Make this person the primary contact
                    </Label>
                  </div>
                </div>
              )}

              {(numberOfGuests === 1 || guest.isteamLead) && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800 font-instrument">
                    <strong>Primary Contact:</strong> This person will receive all booking
                    confirmations and updates.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {canAddMoreForms && (
          <Button
            onClick={addGuestForm}
            className="w-full bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 py-3 rounded-lg font-instrument"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Traveler ({guestForms.length}/{numberOfGuests})
          </Button>
        )}

        {/* Show message if max guests reached */}
        {guestForms.length === numberOfGuests && numberOfGuests < maxGuests && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-instrument">
              All traveler forms completed. You can increase the number of travelers above to add
              more.
            </p>
          </div>
        )}
      </div>

      {/* Special Requirements */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BriefcaseMedical className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-bricolage">Special Requirements</h3>
          <span className="text-sm text-gray-500 font-instrument">(Optional)</span>
        </div>

        <div className="space-y-3">
          <Label htmlFor="requirements" className="text-gray-700 font-instrument">
            Any dietary restrictions, accessibility needs, medical conditions, or other special
            requests
          </Label>
          <Textarea
            id="requirements"
            placeholder="Please describe any special requirements we should know about..."
            value={specialRequirements}
            onChange={e => handleSpecialRequirementsChange(e.target.value)}
            rows={3}
            className={`border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 ${
              getFieldError('specialRequirements') ? 'border-red-400' : ''
            }`}
          />
          <p className="text-xs text-gray-500 font-instrument">
            {specialRequirements.length}/500 characters
          </p>
          {getFieldError('specialRequirements') && (
            <p className="text-sm text-red-600 font-instrument">
              {getFieldError('specialRequirements')}
            </p>
          )}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-bricolage">Summary</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700 font-instrument">Number of Travelers:</span>
            <span className="font-semibold text-gray-900 font-instrument">{numberOfGuests}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700 font-instrument">Forms Completed:</span>
            <span className="font-semibold text-gray-900 font-instrument">
              {
                guestForms.filter(
                  guest => guest.firstName && guest.lastName && guest.memberEmail && guest.phone
                ).length
              }{' '}
              of {numberOfGuests}
            </span>
          </div>
          {numberOfGuests > 1 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 font-instrument">Primary Contact:</span>
              <span className="font-semibold text-gray-900 font-instrument">
                {guestForms.find(g => g.isteamLead)?.firstName || 'Not selected'}
              </span>
            </div>
          )}
          {specialRequirements && (
            <div className="pt-3 border-t border-gray-200">
              <span className="text-gray-700 font-instrument block mb-2">
                Special Requirements:
              </span>
              <p className="bg-gray-50 p-3 border border-gray-200 rounded-lg text-sm text-gray-700 font-instrument">
                {specialRequirements}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <Button
          onClick={handleContinueClick}
          disabled={isSubmitting || guestForms.length !== numberOfGuests}
          className="w-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-200 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-instrument"
        >
          {isSubmitting ? 'Validating...' : 'Continue to Payment'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

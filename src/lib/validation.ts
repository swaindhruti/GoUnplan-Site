import { z } from 'zod';

// Date selector validation
export const dateSelectionSchema = z
  .object({
    startDate: z
      .date({
        required_error: 'Start date is required',
        invalid_type_error: 'Please select a valid date',
      })
      .refine(date => date >= new Date(), {
        message: 'Start date cannot be in the past',
      }),
    endDate: z.date({
      required_error: 'End date is required',
      invalid_type_error: 'Please select a valid date',
    }),
    duration: z.number().min(1, 'Duration must be at least 1 day'),
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

// Guest information validation
export const guestInfoSchema = z.object({
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

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters'),
});

// Guest information form validation
export const guestInformationFormSchema = z
  .object({
    submissionType: z.enum(['individual', 'team'], {
      required_error: 'Please select a submission type',
    }),

    numberOfGuests: z
      .number()
      .min(1, 'At least 1 guest is required')
      .max(8, 'Maximum 8 guests allowed'),

    guests: z
      .array(guestInfoSchema)
      .min(1, 'At least one guest is required')
      .max(8, 'Maximum 8 guests allowed'),

    specialRequirements: z
      .string()
      .max(500, 'Special requirements must be less than 500 characters')
      .optional(),
  })
  .refine(data => data.guests.length === data.numberOfGuests, {
    message: 'Number of guest forms must match selected number of guests',
    path: ['guests'],
  })
  .refine(
    data => {
      if (data.submissionType === 'individual') {
        return data.numberOfGuests === 1;
      }
      return true;
    },
    {
      message: 'Individual submission must have exactly 1 guest',
      path: ['numberOfGuests'],
    }
  );

// Credit card validation
export const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^[\d\s]+$/, 'Card number can only contain digits and spaces')
    .transform(val => val.replace(/\s/g, ''))
    .refine(val => val.length >= 13 && val.length <= 19, {
      message: 'Card number must be between 13 and 19 digits',
    })
    .refine(
      val => {
        // Luhn algorithm for card validation
        let sum = 0;
        let isEven = false;
        for (let i = val.length - 1; i >= 0; i--) {
          let digit = parseInt(val.charAt(i), 10);
          if (isEven) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }
          sum += digit;
          isEven = !isEven;
        }
        return sum % 10 === 0;
      },
      {
        message: 'Please enter a valid card number',
      }
    ),

  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .refine(
      val => {
        const [month, year] = val.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        return expiry > now;
      },
      {
        message: 'Card has expired',
      }
    ),

  cvc: z
    .string()
    .min(1, 'CVC is required')
    .regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),

  cardholderName: z
    .string()
    .min(1, 'Cardholder name is required')
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Cardholder name can only contain letters, spaces, hyphens, and apostrophes'
    ),
});

// Payment form validation
export const paymentFormSchema = z
  .object({
    paymentMethod: z.enum(['credit-card', 'paypal'], {
      required_error: 'Please select a payment method',
    }),

    creditCard: creditCardSchema.optional(),

    agreeToTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine(
    data => {
      if (data.paymentMethod === 'credit-card') {
        return data.creditCard !== undefined;
      }
      return true;
    },
    {
      message: 'Credit card information is required',
      path: ['creditCard'],
    }
  );

// Trip booking summary validation
export const tripBookingSummarySchema = z.object({
  title: z.string().min(1, 'Trip title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  numberOfGuests: z
    .number()
    .min(1, 'At least 1 guest is required')
    .max(8, 'Maximum 8 guests allowed'),
  pricePerPerson: z.number().min(0, 'Price must be a positive number'),
});

// Complete booking validation (combines all steps)
export const completeBookingSchema = z.object({
  dateSelection: dateSelectionSchema,
  guestInformation: guestInformationFormSchema,
  payment: paymentFormSchema,
  tripSummary: tripBookingSummarySchema,
});

// Type exports for TypeScript
export type DateSelection = z.infer<typeof dateSelectionSchema>;
export type GuestInfo = z.infer<typeof guestInfoSchema>;
export type GuestInformationForm = z.infer<typeof guestInformationFormSchema>;
export type CreditCard = z.infer<typeof creditCardSchema>;
export type PaymentForm = z.infer<typeof paymentFormSchema>;
export type TripBookingSummary = z.infer<typeof tripBookingSummarySchema>;
export type CompleteBooking = z.infer<typeof completeBookingSchema>;

import { z } from "zod";

// Full validation schema for trip submission
export const CreateDestinationSchema = z.object({
  tripName: z.string().min(3, "Trip name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  destination: z.string().min(3, "Destination is required"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  maxLimit: z.coerce
    .number()
    .positive("Participant limit must be a positive number"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  filters: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  includedActivities: z.array(z.string()).optional().default([]),
  restrictions: z.array(z.string()).optional().default([]),
  tripImage: z
    .string()
    .min(1, "Trip cover image is required")
    .url("Must be a valid image URL"),

  dayWiseData: z
    .array(
      z.object({
        dayNumber: z.number(),
        title: z.string().min(1, "Day title is required"),
        description: z.string().min(1, "Day description is required"),
        activities: z.array(z.string()).optional().default([]),
        meals: z.string().optional().default(""),
        accommodation: z.string().optional().default(""),
        dayWiseImage: z
          .string()
          .min(1, "Day image is required")
          .url("Must be a valid image URL"),
      })
    )
    .nonempty("At least one day must be added"),
});

// Minimal validation schema for drafts - only basic structure validation
export const CreateDestinationDraftSchema = z.object({
  tripName: z.string().optional().default(""),
  description: z.string().optional().default(""),
  destination: z.string().optional().default(""),
  country: z.string().optional().default(""),
  state: z.string().optional().default(""),
  city: z.string().optional().default(""),
  price: z.coerce.number().optional().default(0),
  maxLimit: z.coerce.number().optional().default(0),
  startDate: z.string().or(z.date()).optional().default(""),
  endDate: z.string().or(z.date()).optional().default(""),
  filters: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  includedActivities: z.array(z.string()).optional().default([]),
  restrictions: z.array(z.string()).optional().default([]),
  tripImage: z.string().optional().default(""),

  dayWiseData: z
    .array(
      z.object({
        dayNumber: z.number(),
        title: z.string().optional().default(""),
        description: z.string().optional().default(""),
        activities: z.array(z.string()).optional().default([]),
        meals: z.string().optional().default(""),
        accommodation: z.string().optional().default(""),
        dayWiseImage: z.string().optional().default(""),
      })
    )
    .optional()
    .default([
      {
        dayNumber: 1,
        title: "",
        description: "",
        activities: [],
        meals: "",
        accommodation: "",
        dayWiseImage: "",
      },
    ]),
});

// Function to get appropriate schema based on mode
export const getValidationSchema = (isDraft: boolean) => {
  return isDraft ? CreateDestinationDraftSchema : CreateDestinationSchema;
};

import { z } from "zod";

export const CreateDestinationSchema = z
  .object({
    tripName: z.string().min(3, "Trip name must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    destination: z.string().min(3, "Destination is required"),
  country: z.string().min(2, "Country is required"),
  noofdays: z.coerce.number().int().min(1, "Number of days must be at least 1"),
  // Removed top-level `state` and `city` per form change (stops handled separately)
  stops: z.array(z.string()).optional().default([]),
    activities: z.array(z.string()).optional().default([]),
    
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
    special: z.array(z.string()).optional().default([]),
    tripImage: z
      .string()
      .min(1, "Trip cover image is required")
      .url("Must be a valid image URL"),
    dayWiseData: z
      .array(
        z.object({
          dayNumber: z.number().min(1, "Day number must be at least 1").optional(),
          title: z.string().min(1, "Day title is required"),
          destination: z.string().optional(),
          accommodation: z.string().optional(),
          description: z.string().optional(),
          meals: z.string().optional(),
          activities: z.array(z.string()).optional().default([]),
          dayWiseImage: z.string().optional(),
          latitude: z
            .number()
            .min(-90, "Latitude must be between -90 and 90")
            .max(90, "Latitude must be between -90 and 90")
            .optional(),
          longitude: z
            .number()
            .min(-180, "Longitude must be between -180 and 180")
            .max(180, "Longitude must be between -180 and 180")
            .optional(),
          city: z
            .string()
            .min(2, "City must be at least 2 characters")
            .optional(),
          state: z
            .string()
            .min(2, "State must be at least 2 characters")
            .optional(),
          country: z
            .string()
            .min(2, "Country must be at least 2 characters")
            .optional()
        })
      )
      .nonempty("At least one day must be added")
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"]
    }
  );

export const CreateDestinationDraftSchema = z
  .object({
    tripName: z.string().optional().default(""),
    description: z.string().optional().default(""),
    destination: z.string().optional().default(""),
  country: z.string().optional().default(""),
  // Removed top-level state and city for draft schema
  stops: z.array(z.string()).optional().default([]),
  price: z.coerce.number().optional().default(0),
  noofdays: z.coerce.number().optional().default(1),
    maxLimit: z.coerce.number().optional().default(0),
    startDate: z.string().or(z.date()).optional().default(""),
    endDate: z.string().or(z.date()).optional().default(""),
    filters: z.array(z.string()).optional().default([]),
    languages: z.array(z.string()).optional().default([]),
    includedActivities: z.array(z.string()).optional().default([]),
    restrictions: z.array(z.string()).optional().default([]),
    special: z.array(z.string()).optional().default([]),
    tripImage: z.string().optional().default(""),
    dayWiseData: z
      .array(
        z.object({
          dayNumber: z.number().min(1, "Day number must be at least 1").optional(),
          title: z.string().optional().default(""),
          destination: z.string().optional(),
          accommodation: z.string().optional().default(""),
          description: z.string().optional().default(""),
          meals: z.string().optional().default(""),
          activities: z.array(z.string()).optional().default([]),
          dayWiseImage: z.string().optional().default(""),
          latitude: z
            .number()
            .min(-90, "Latitude must be between -90 and 90")
            .max(90, "Latitude must be between -90 and 90")
            .optional(),
          longitude: z
            .number()
            .min(-180, "Longitude must be between -180 and 180")
            .max(180, "Longitude must be between -180 and 180")
            .optional(),
          city: z
            .string()
            .min(2, "City must be at least 2 characters")
            .optional(),
          state: z
            .string()
            .min(2, "State must be at least 2 characters")
            .optional(),
          country: z
            .string()
            .min(2, "Country must be at least 2 characters")
            .optional()
        })
      )
      .optional()
      .default([
        {
          title: "",
          description: "",
          accommodation: "",
          meals: "",
          activities: [],
          dayWiseImage: "",
          latitude: undefined,
          longitude: undefined,
          city: "",
          state: "",
          country: ""
        }
      ])
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"]
    }
  );

// Function to get appropriate schema based on mode
export const getValidationSchema = (isDraft: boolean) => {
  return isDraft ? CreateDestinationDraftSchema : CreateDestinationSchema;
};

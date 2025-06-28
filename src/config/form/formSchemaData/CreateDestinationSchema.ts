import { z } from "zod";

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

  // Properly define the dayWiseData schema
  dayWiseData: z
    .array(
      z.object({
        dayNumber: z.number(),
        title: z.string().min(1, "Day title is required"),
        description: z.string().min(1, "Day description is required"),
        activities: z.array(z.string()).optional().default([]),
        meals: z.string().optional().default(""),
        accommodation: z.string().optional().default(""),
      })
    )
    .nonempty("At least one day must be added"),
});

import { z } from "zod";

export const CreateDestinationSchema = z
  .object({
    tripName: z.string().min(1, "Trip Name is required"),
    destination: z.string().min(1, "Destination is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    price: z.coerce.number().min(1, "Price must be a positive number"),

    filters: z
      .array(
        z.enum(["Adventure", "Beach", "Historical", "Trekking", "Cultural"])
      )
      .min(1, "At least one filter tag is required"),

    startDate: z.coerce.date({
      errorMap: () => ({ message: "Start Date is required" })
    }),
    endDate: z.coerce.date({
      errorMap: () => ({ message: "End Date is required" })
    }),

    maxLimit: z.coerce.number().min(1, "Max Limit must be at least 1"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    languages: z
      .array(z.enum(["English", "Hindi", "Spanish", "French"]))
      .min(1, "At least one language must be selected")
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date",
    path: ["endDate"]
  });

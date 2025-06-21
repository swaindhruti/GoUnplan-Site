import { z } from "zod";

export const CreateDestinationSchema = z
  .object({
    tripName: z.string().min(1, "Trip Name is required"),
    destination: z.string().min(1, "Destination is required"),
    price: z.coerce.number().min(1, "Price must be a positive number"),
    filters: z.enum(
      ["Adventure", "Beach", "Historical", "Trekking", "Cultural"],
      { errorMap: () => ({ message: "Filter Tags is required" }) }
    ),
    // startDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    //   message: "Start Date must be a valid date"
    // }),
    // endDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    //   message: "End Date must be a valid date"
    // }),
    minLimit: z.number().min(1, "Min Limit must be at least 1"),
    maxLimit: z.number().min(1, "Max Limit must be at least 1"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    languages: z.enum(["English", "Hindi", "Spanish", "French"], {
      errorMap: () => ({ message: "Languages Offered is required" })
    })
  })
  // .refine(
  //   (data) => {
  //     return data.startDate < data.endDate;
  //   },
  //   {
  //     message: "Start date must be before end date",
  //     path: ["endDate"]
  //   }
  // )
  .refine(
    (data) => {
      return data.minLimit <= data.maxLimit;
    },
    {
      message: "Minimum limit cannot be greater than maximum limit",
      path: ["maxLimit"]
    }
  );

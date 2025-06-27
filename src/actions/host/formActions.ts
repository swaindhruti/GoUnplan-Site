// actions/host/formActions.ts
"use server";

import { CreateDestinationSchema } from "@/config/form/formSchemaData/CreateDestinationSchema";
import { updateTravelPlan } from "@/actions/host/action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleEditTrip(tripId: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parse = CreateDestinationSchema.safeParse({
    ...raw,
    price: Number(raw.price),
    minLimit: raw.minLimit ? Number(raw.minLimit) : undefined,
    maxLimit: raw.maxLimit ? Number(raw.maxLimit) : undefined,
    startDate: raw.startDate ? new Date(raw.startDate as string) : undefined,
    endDate: raw.endDate ? new Date(raw.endDate as string) : undefined,
    filters: Array.isArray(raw.filters) ? raw.filters : [raw.filters as string],
    languages: Array.isArray(raw.languages)
      ? raw.languages
      : [raw.languages as string]
  });

  if (!parse.success) {
    console.log("Validation Error:", parse.error.flatten());
    return { error: "Validation failed" };
  }

  const result = await updateTravelPlan(tripId, parse.data);

  if ("error" in result) {
    console.error("Update Error:", result.error);
    return { error: "Update failed" };
  }

  revalidatePath("/dashboard/host");
  redirect("/dashboard/host");
}

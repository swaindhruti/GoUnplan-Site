import { EditTripForm } from "@/components/host/components/EditTripForm";
import { getTripById } from "@/actions/host/action";
import { redirect } from "next/navigation";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const tripData = await getTripById(tripId);

  if ("error" in tripData) {
    redirect("/dashboard/host");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EditTripForm trip={tripData} />
    </div>
  );
}
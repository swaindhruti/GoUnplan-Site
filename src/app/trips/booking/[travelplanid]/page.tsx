// import { BookingPage } from './components/booking/BookingPage';
import { getTripById } from "@/actions/host/action";
import { BookingPage } from "@/components/booking/BookingPage";
import { requireUser } from "@/lib/roleGaurd";
import { notFound } from "next/navigation";
type Props = {
  params: {
    travelplanid: string;
  };
};
export default async function Booking({ params }: Props) {
  const tripId = params["travelplanid"];
  const trip = await getTripById(tripId);
  const userSession = await requireUser();

  if (!trip || "error" in trip) {
    return notFound();
  }
  return (
    <BookingPage
      travelPlanId={trip.travelPlanId}
      userId={userSession.user.id || ""}
      tripData={{
        ...trip,
        destination: trip.destination ?? undefined,
        endDate: trip.endDate ?? undefined,
        startDate: trip.endDate ?? undefined
      }}
    />
  );
}

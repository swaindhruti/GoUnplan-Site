// import { BookingPage } from './components/booking/BookingPage';
import { getTripById } from "@/actions/user/action";
import { BookingPage } from "@/components/booking/BookingPage";
import { requireUser } from "@/lib/roleGaurd";
import { notFound } from "next/navigation";
type Props = {
  params: Promise<{
    travelPlanId: string;
  }>;
};
export default async function Booking({ params }: Props) {
  const tripId = (await params).travelPlanId;
  const trip = await getTripById(tripId);
  const userSession = await requireUser();
  if (!trip || "error" in trip) {
    return notFound();
  }
  return (
    <BookingPage
      existingBookingData={trip.bookings[0]}
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

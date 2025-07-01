import { getTripById } from "@/actions/trips/getTripByIdForBooking";
import { BookingPage } from "@/components/booking/BookingPage";
// import { GetTrip } from "@/hooks/use-get-trip";
import { requireUser } from "@/lib/roleGaurd";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
type Props = {
  params: Promise<{
    travelplanid: string;
  }>;
};
export default async function Booking({ params }: Props) {
  const tripId = (await params).travelplanid;
  const { trip, booking } = await getTripById(tripId);
  const userSession = await requireUser();

  if (!trip) {
    return <div>Booking not found</div>;
  }

  if (booking?.formSubmitted) {
    redirect(`/trips/booking/${trip.travelPlanId}/booking-summary`);
  }

  return (
    <>
      {
        <BookingPage
          existingBookingData={booking || {}}
          userId={userSession.user.id || ""}
          tripData={{
            ...trip,
          }}
        />
      }
    </>
  );
}

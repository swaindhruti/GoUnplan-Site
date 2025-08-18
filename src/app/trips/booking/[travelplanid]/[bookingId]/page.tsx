import { getTripById } from "@/actions/trips/getTripByIdForBooking";
import { BookingPage } from "@/components/booking/BookingPage";
// import { GetTrip } from "@/hooks/use-get-trip";
import { requireUser } from "@/lib/roleGaurd";
// import { revalidatePath } from "next/cache";
type Props = {
  params: Promise<{
    travelplanid: string;
    bookingId: string;
  }>;
};
export default async function Booking({ params }: Props) {
  const tripId = (await params).travelplanid;
  const bookingId = (await params).bookingId;
  const { trip, booking } = await getTripById(tripId, bookingId);
  const userSession = await requireUser();

  if (!trip) {
    return <div>Booking not found</div>;
  }
  console.log(booking);
  /*  if (booking?.formSubmitted) {
    redirect(`/trips/booking/${trip.travelPlanId}/booking-summary`);
  } */

  return (
    <>
      {
        <BookingPage
          bookingId={bookingId}
          existingBookingData={booking || {}}
          userId={userSession.user.id || ""}
          tripData={{
            ...trip
          }}
        />
      }
    </>
  );
}

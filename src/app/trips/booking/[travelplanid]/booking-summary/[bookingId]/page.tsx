import { getAllActiveTrips } from '@/actions/trips/getAllActiveTrips';
import { getTripById } from '@/actions/trips/getTripByIdForBookingSummary';
import BookingSummary from '@/components/booking/Bookingsummary';
// import { GetTrip } from "@/hooks/use-get-trip";
import { requireUser } from '@/lib/roleGaurd';
import { notFound, redirect } from 'next/navigation';
// import { BookingSummary } from "@/components/booking/BookingSummary";

type Props = {
  params: Promise<{
    travelplanid: string;
    bookingId: string;
  }>;
};

export default async function BookingSummaryPage({ params }: Props) {
  const tripId = (await params).travelplanid;
  const bookingId = (await params).bookingId;

  try {
    const [{ trip, booking }, userSession] = await Promise.all([
      getTripById(tripId, bookingId),
      requireUser(),
    ]);
    const result = await getAllActiveTrips();

    if (!userSession) {
      redirect('/auth/signin');
    }
    if (!booking?.formSubmitted) {
      redirect(`/trips/booking/${tripId}`);
    }

    return (
      <>
        <BookingSummary
          booking={{
            ...booking,
          }}
          travelPlan={trip}
          allTrips={result.trips}
        />
      </>
    );
  } catch (error) {
    console.error('Booking summary error:', error);
    return notFound();
  }
}

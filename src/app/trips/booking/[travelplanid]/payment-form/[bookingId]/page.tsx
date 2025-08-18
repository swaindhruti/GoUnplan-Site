// import { getTripById } from "@/actions/trips/getTripByIdForBookingSummary";
// import BookingSummary from "@/components/booking/Bookingsummary";
import { getTripById } from "@/actions/trips/getTripByIdForPayment";
import { PaymentForm } from "@/components/booking/PaymentForm";
// import { GetTrip } from "@/hooks/use-get-trip";
import { requireUser } from "@/lib/roleGaurd";
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
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
      requireUser()
    ]);

    if (!userSession) {
      redirect("/auth/signin");
    }
    if (!booking || !trip) {
      return <>booking not!...404</>;
    }

    const startDate = booking.startDate;
    const endDate = booking.endDate;

    return (
      <>
        <PaymentForm
          booking={booking}
          tripData={{
            ...trip,
            tripImage:
              trip?.tripImage ||
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
            pricePerPerson: trip?.price || 0,
            numberOfGuests: booking?.guests?.length,
            startDate: format(startDate, "MMM dd, yyyy"),
            endDate: format(endDate, "MMM dd, yyyy")
          }}
        />
      </>
    );
  } catch (error) {
    console.error("Booking summary error:", error);
    return notFound();
  }
}

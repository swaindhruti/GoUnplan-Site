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
    travelPlanId: string;
  }>;
};

export default async function BookingSummaryPage({ params }: Props) {
  const tripId = (await params).travelPlanId;

  try {
    const [{ trip, booking }, userSession] = await Promise.all([
      getTripById(tripId),
      requireUser()
    ]);

    if (!userSession) {
      redirect("/auth/signin");
    }
    if (!booking || !trip) {
      return <></>;
    }

    const startDate = booking.startDate;
    const endDate = booking.endDate;

    return (
      <>
        <PaymentForm
          tripData={{
            ...trip,
            pricePerPerson: trip?.price || 0,
            numberOfGuests: booking?.guests?.length + 1,
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

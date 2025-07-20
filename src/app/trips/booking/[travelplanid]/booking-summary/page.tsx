import { getTripById } from "@/actions/trips/getTripByIdForBookingSummary";
import BookingSummary from "@/components/booking/Bookingsummary";
// import { GetTrip } from "@/hooks/use-get-trip";
import { requireUser } from "@/lib/roleGaurd";
import { notFound, redirect } from "next/navigation";
// import { BookingSummary } from "@/components/booking/BookingSummary";

type Props = {
  params: Promise<{
    travelplanid: string;
  }>;
};

export default async function BookingSummaryPage({ params }: Props) {
  const tripId = (await params).travelplanid;

  try {
    const [{ trip, booking }, userSession] = await Promise.all([
      getTripById(tripId),
      requireUser(),
    ]);

    if (!userSession) {
      redirect("/auth/signin");
    }
    // Only redirect if form is not submitted and we're not in edit mode
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
        />
      </>
    );
  } catch (error) {
    console.error("Booking summary error:", error);
    return notFound();
  }
}

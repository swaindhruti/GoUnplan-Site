import { requireUser } from "@/lib/roleGaurd";
import { getUserBookings } from "@/actions/booking/actions";
import { redirect } from "next/navigation";
import MyTripsComponent from "@/components/trips/MyTripsComponent";

export const dynamic = "force-dynamic";

export default async function MyTripsPage() {
  try {
    // Require user authentication
    const userSession = await requireUser();

    if (!userSession) {
      redirect("/auth/signin");
    }

    // Fetch user bookings
    if (!userSession.user.id) {
      redirect("/auth/signin");
    }
    const bookingsResponse = await getUserBookings(userSession.user.id);

    console.log(bookingsResponse.bookings);

    if (!bookingsResponse.success) {
      console.error("Failed to fetch bookings:", bookingsResponse.error);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to load your trips
            </h1>
            <p className="text-gray-600">
              There was an error loading your bookings. Please try again later.
            </p>
          </div>
        </div>
      );
    }

    return (
      <MyTripsComponent
        bookings={bookingsResponse.bookings || []}
        user={{
          id: userSession.user.id,
          name: userSession.user.name || "",
          email: userSession.user.email || ""
        }}
      />
    );
  } catch (error) {
    console.error("Error loading my trips page:", error);
    redirect("/auth/signin");
  }
}

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Booking } from "@/types/dashboard";
import { formatDateRange } from "@/utils/dateUtils";
import { useRouter } from "next/navigation";

interface BookingsTabProps {
  bookings: Booking[];
  bookingFilter: string;
  setBookingFilter: (filter: string) => void;
}

export function BookingsTab({
  bookings,
  bookingFilter,
  setBookingFilter,
}: BookingsTabProps) {
  const router = useRouter();

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (bookingFilter === "all") return true;
    return booking.status.toLowerCase() === bookingFilter.toLowerCase();
  });

  // Get badge class for booking status
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      confirmed:
        "bg-green-500 border-2 border-black text-black font-extrabold px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      pending:
        "bg-yellow-300 border-2 border-black text-black font-extrabold px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      completed:
        "bg-blue-400 border-2 border-black text-black font-extrabold px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      cancelled:
        "bg-red-400 border-2 border-black text-black font-extrabold px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    };

    const statusKey = status.toLowerCase() as keyof typeof statusStyles;
    const className = statusStyles[statusKey] || statusStyles.pending;

    return (
      <span className={className}>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
      <div className="border-b-4 border-black bg-blue-400 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-black uppercase">
              Your Bookings
            </h3>
            <p className="text-sm font-bold text-black">
              Manage your travel bookings
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setBookingFilter("all")}
              className={`px-4 py-2 text-sm font-extrabold rounded-lg transition-colors border-3 border-black ${
                bookingFilter === "all"
                  ? "bg-yellow-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setBookingFilter("confirmed")}
              className={`px-4 py-2 text-sm font-extrabold rounded-lg transition-colors border-3 border-black ${
                bookingFilter === "confirmed"
                  ? "bg-green-500 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setBookingFilter("pending")}
              className={`px-4 py-2 text-sm font-extrabold rounded-lg transition-colors border-3 border-black ${
                bookingFilter === "pending"
                  ? "bg-purple-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredBookings.length > 0 ? (
          <Table>
            <TableHeader className="bg-yellow-300 border-b-4 border-black">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                  Trip
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                  Destination
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                  Dates
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                  Price
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                  Participants
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-purple-500 border-2 border-black flex items-center justify-center text-white font-extrabold text-sm mr-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {booking.travelPlan.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-black">
                        {booking.travelPlan.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 font-medium">
                    {[
                      booking.travelPlan.city,
                      booking.travelPlan.state,
                      booking.travelPlan.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-800 font-medium">
                    {formatDateRange(booking.startDate, booking.endDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="font-extrabold text-black bg-green-500 border-2 border-black px-2 py-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block">
                      ${booking.totalPrice.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="bg-blue-400 font-extrabold text-black border-2 border-black rounded-full w-8 h-8 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {booking.participants}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="bg-purple-500 text-white hover:bg-purple-600 font-extrabold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-pink-500 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                <Calendar className="h-10 w-10 text-black" />
              </div>
              <p className="mt-2 text-xl font-black text-black">
                {bookings.length === 0
                  ? "No bookings found. Start by booking your first trip!"
                  : `No ${bookingFilter} bookings found.`}
              </p>
              <div className="mt-6">
                <Link href="/trips">
                  <Button className="bg-green-500 text-black hover:bg-green-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-extrabold">
                    Explore Trips
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

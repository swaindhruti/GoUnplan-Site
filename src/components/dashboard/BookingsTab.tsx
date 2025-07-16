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
        "bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg",
      pending:
        "bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-lg",
      completed: "bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg",
      cancelled: "bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-lg",
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your Bookings
            </h3>
            <p className="text-gray-600 font-medium">
              Manage your travel bookings
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setBookingFilter("all")}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                bookingFilter === "all"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setBookingFilter("confirmed")}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                bookingFilter === "confirmed"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setBookingFilter("pending")}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                bookingFilter === "pending"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Trip
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Destination
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Dates
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Price
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Participants
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="hover:bg-gray-50 transition-all duration-300"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-xl bg-slate-700 flex items-center justify-center text-white font-semibold text-lg mr-4">
                        {booking.travelPlan.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {booking.travelPlan.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700 font-medium">
                    {[
                      booking.travelPlan.city,
                      booking.travelPlan.state,
                      booking.travelPlan.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700 font-medium">
                    {formatDateRange(booking.startDate, booking.endDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-white bg-slate-700 px-4 py-2 rounded-lg inline-block">
                      ${booking.totalPrice.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="bg-slate-100 font-semibold text-slate-700 rounded-full w-10 h-10 flex items-center justify-center">
                      {booking.participants}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="bg-slate-700 text-white hover:bg-slate-800 font-semibold shadow-sm"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-12 w-12 text-slate-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                {bookings.length === 0
                  ? "No bookings found. Start by booking your first trip!"
                  : `No ${bookingFilter} bookings found.`}
              </p>
              <div className="mt-8">
                <Link href="/trips">
                  <Button className="bg-slate-700 text-white hover:bg-slate-800 font-semibold px-8 py-3 shadow-sm">
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

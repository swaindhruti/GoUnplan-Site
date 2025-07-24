import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
    if (status.toLowerCase() === "confirmed") {
      return (
        <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Confirmed
        </Badge>
      );
    }
    if (status.toLowerCase() === "pending") {
      return (
        <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Pending
        </Badge>
      );
    }
    if (status.toLowerCase() === "completed") {
      return (
        <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Completed
        </Badge>
      );
    }
    if (status.toLowerCase() === "cancelled") {
      return (
        <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Cancelled
        </Badge>
      );
    }
    return (
      <Badge className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Your Bookings
          </h3>
          <p className="text-gray-600 font-medium">
            Manage your travel bookings
          </p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => setBookingFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              bookingFilter === "all"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setBookingFilter("confirmed")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              bookingFilter === "confirmed"
                ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setBookingFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              bookingFilter === "pending"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredBookings.length > 0 ? (
          <Table>
            <TableHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Trip
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Destination
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Dates
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Price
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Participants
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-slate-200">
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                        {booking.travelPlan.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
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
                    <div className="font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg inline-block">
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
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg rounded-xl px-6 py-2"
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
              <div className="mx-auto h-24 w-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <Calendar className="h-12 w-12 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                {bookings.length === 0
                  ? "No bookings found. Start by booking your first trip!"
                  : `No ${bookingFilter} bookings found.`}
              </p>
              <div className="mt-8">
                <Link href="/trips">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 font-semibold px-8 py-3 shadow-lg rounded-xl">
                    Explore Trips
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

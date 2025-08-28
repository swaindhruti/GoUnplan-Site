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
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Booking } from "@/types/dashboard";
import { formatDateRange } from "@/utils/dateUtils";
import { useRouter } from "next/navigation";
import { PaymentStatus } from "@prisma/client";

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

  // Helper function to get payment status display info
  const getPaymentStatusInfo = (status: PaymentStatus) => {
    const statusMap = {
      FULLY_PAID: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Fully Paid",
      },
      PARTIALLY_PAID: {
        icon: CheckCircle,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Partially Paid",
      },
      PENDING: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Payment Pending",
      },
      OVERDUE: {
        icon: AlertTriangle,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Overdue",
      },
      CANCELLED: {
        icon: XCircle,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled",
      },
      REFUNDED: {
        icon: RefreshCw,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Refunded",
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (bookingFilter === "all") return true;
    // Check both booking status and payment status
    return (
      booking.status.toLowerCase() === bookingFilter.toLowerCase() ||
      booking.paymentStatus === bookingFilter.toUpperCase()
    );
  });

  // Get badge class for booking status
  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === "confirmed") {
      return (
        <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium font-instrument">
          Confirmed
        </Badge>
      );
    }
    if (status.toLowerCase() === "pending") {
      return (
        <Badge className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium font-instrument">
          Pending
        </Badge>
      );
    }
    if (status.toLowerCase() === "completed") {
      return (
        <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium font-instrument">
          Completed
        </Badge>
      );
    }
    if (status.toLowerCase() === "cancelled") {
      return (
        <Badge className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium font-instrument">
          Cancelled
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium font-instrument">
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1 font-bricolage">
            Your Bookings
          </h3>
          <p className="text-gray-600 font-instrument mt-1">
            Manage your travel bookings
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {/* Booking Status Filters */}
          <button
            onClick={() => setBookingFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200 ${
              bookingFilter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setBookingFilter("confirmed")}
            className={`px-4 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200 ${
              bookingFilter === "confirmed"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setBookingFilter("pending")}
            className={`px-4 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200 ${
              bookingFilter === "pending"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>

          {/* Payment Status Filters */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>
          <button
            onClick={() => setBookingFilter("FULLY_PAID")}
            className={`px-4 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200 ${
              bookingFilter === "FULLY_PAID"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
          >
            Fully Paid
          </button>
          <button
            onClick={() => setBookingFilter("PARTIALLY_PAID")}
            className={`px-4 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200 ${
              bookingFilter === "PARTIALLY_PAID"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            Partial Payment
          </button>
          <button
            onClick={() => setBookingFilter("PENDING")}
            className={`px-4 py-2 rounded-full text-sm font-instrument font-semibold transition-all duration-200 ${
              bookingFilter === "PENDING"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            }`}
          >
            Payment Due
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredBookings.length > 0 ? (
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                  Trip
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                  Destination
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                  Dates
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                  Price
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                  Participants
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                  Payment Status
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
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
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
                        {booking.travelPlan.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 font-instrument">
                        {booking.travelPlan.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                    {[
                      booking.travelPlan.city,
                      booking.travelPlan.state,
                      booking.travelPlan.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                    {formatDateRange(booking.startDate, booking.endDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 font-bricolage">
                        ${booking.totalPrice.toLocaleString()}
                      </div>
                      {booking.paymentStatus === "PARTIALLY_PAID" &&
                        booking.amountPaid && (
                          <p className="text-xs text-blue-600">
                            Paid: ${booking.amountPaid.toLocaleString()}
                          </p>
                        )}
                      {booking.refundAmount && booking.refundAmount > 0 && (
                        <p className="text-xs text-red-600">
                          Refunded: ${booking.refundAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="bg-gray-100 font-semibold text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-instrument">
                      {booking.participants}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {(() => {
                      const statusInfo = getPaymentStatusInfo(
                        booking.paymentStatus
                      );
                      const IconComponent = statusInfo.icon;
                      return (
                        <div className="space-y-1">
                          <Badge
                            className={`flex items-center gap-1 w-fit px-3 py-1 rounded-full border text-xs font-semibold ${statusInfo.color}`}
                          >
                            <IconComponent className="h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                          {booking.paymentStatus === "PARTIALLY_PAID" &&
                            booking.remainingAmount && (
                              <p className="text-xs text-orange-600">
                                Remaining: $
                                {booking.remainingAmount.toLocaleString()}
                              </p>
                            )}
                          {(booking.paymentStatus === "PENDING" ||
                            booking.paymentStatus === "OVERDUE") &&
                            booking.paymentDeadline && (
                              <p className="text-xs text-gray-500">
                                Due:{" "}
                                {new Date(
                                  booking.paymentDeadline
                                ).toLocaleDateString()}
                              </p>
                            )}
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
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
              <div className="mx-auto h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-bricolage">
                {bookings.length === 0
                  ? "No bookings found"
                  : `No ${bookingFilter} bookings found`}
              </h3>
              <p className="text-gray-600 font-instrument mb-8">
                {bookings.length === 0
                  ? "Start by booking your first trip!"
                  : `Try adjusting your filter or book a new trip.`}
              </p>
              <Link href="/trips">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold px-8 py-3 rounded-full transition-colors duration-200">
                  Explore Trips
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

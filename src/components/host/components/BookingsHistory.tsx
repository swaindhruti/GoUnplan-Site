"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Copy,
  Check
} from "lucide-react";
import Image from "next/image";
import { getHostBookings } from "@/actions/host/action";
import { BookingStatus, TeamMemberInput } from "@/types/booking";
import { PaymentStatus } from "@prisma/client";

type Booking = {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  participants: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  specialRequirements: string | null;
  pricePerPerson: number;
  refundAmount: number;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    image: string | null;
  };
  travelPlan: {
    travelPlanId: string;
    title: string;
    destination: string | null;
    startDate: Date | null;
    endDate: Date | null;
    price: number;
    tripImage: string | null;
    maxParticipants: number | null;
  };
  guests: TeamMemberInput[];
};

type BookingCounts = {
  ALL: number;
  CONFIRMED: number;
  PENDING: number;
  PARTIALLY_PAID: number;
  FULLY_PAID: number;
  OVERDUE: number;
  CANCELLED: number;
  REFUNDED: number;
};

export const BookingsHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<BookingCounts>({
    ALL: 0,
    CONFIRMED: 0,
    PENDING: 0,
    PARTIALLY_PAID: 0,
    FULLY_PAID: 0,
    OVERDUE: 0,
    CANCELLED: 0,
    REFUNDED: 0
  });

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all bookings without trip filter, using payment status filtering
      const response = await getHostBookings(undefined, undefined, "payment");

      if ("error" in response) {
        setError(response.error as string);
      } else if (response.success) {
        setBookings(response.bookings || []);
        // Calculate payment status counts from the bookings data
        const paymentCounts = (response.bookings || []).reduce(
          (acc: BookingCounts, booking: Booking) => {
            acc.ALL++;

            // Count by booking status
            if (booking.status === "CONFIRMED") {
              acc.CONFIRMED++;
            } else if (booking.status === "PENDING") {
              acc.PENDING++;
            } else if (booking.status === "CANCELLED") {
              acc.CANCELLED++;
            }

            // Count by payment status
            if (booking.paymentStatus === "PARTIALLY_PAID") {
              acc.PARTIALLY_PAID++;
            } else if (booking.paymentStatus === "FULLY_PAID") {
              acc.FULLY_PAID++;
            } else if (booking.paymentStatus === "OVERDUE") {
              acc.OVERDUE++;
            } else if (booking.paymentStatus === "REFUNDED") {
              acc.REFUNDED++;
            }

            return acc;
          },
          {
            ALL: 0,
            CONFIRMED: 0,
            PENDING: 0,
            PARTIALLY_PAID: 0,
            FULLY_PAID: 0,
            OVERDUE: 0,
            CANCELLED: 0,
            REFUNDED: 0
          }
        );
        setCounts(paymentCounts);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterBookings = useCallback(() => {
    let filtered = bookings;

    // Filter by status (both booking status and payment status)
    if (selectedStatus !== "ALL") {
      if (selectedStatus === "CONFIRMED") {
        // Filter for confirmed bookings (booking status = CONFIRMED)
        filtered = filtered.filter((booking) => booking.status === "CONFIRMED");
      } else {
        // Filter by payment status for other filters
        filtered = filtered.filter(
          (booking) => booking.paymentStatus === selectedStatus
        );
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.user.name.toLowerCase().includes(term) ||
          booking.user.email ||
          "".toLowerCase().includes(term) ||
          booking.travelPlan.title.toLowerCase().includes(term) ||
          booking.travelPlan.destination?.toLowerCase().includes(term) ||
          booking.id.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const copyBookingId = async (bookingId: string) => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setCopiedId(bookingId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy booking ID:", err);
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "REFUNDED":
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPaymentStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "FULLY_PAID":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "PARTIALLY_PAID":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "OVERDUE":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case "REFUNDED":
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "FULLY_PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PARTIALLY_PAID":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OVERDUE":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bookings History
          </h2>
          <p className="text-gray-600 font-medium">
            View and manage all your booking history
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bookings History
          </h2>
          <p className="text-gray-600 font-medium">
            View and manage all your booking history
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Bookings
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bookings History
        </h2>
        <p className="text-gray-600 font-medium">
          View and manage all your booking history across all trips
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, trip title, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Payment Status Filter Tabs - Updated to match user dashboard style */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 font-instrument">
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "ALL", label: "All", color: "purple" },
              { key: "CONFIRMED", label: "Confirmed", color: "blue" },
              { key: "PENDING", label: "Pending", color: "yellow" },
              { key: "FULLY_PAID", label: "Fully Paid", color: "green" },
              {
                key: "PARTIALLY_PAID",
                label: "Partial Payment",
                color: "orange"
              },
              { key: "OVERDUE", label: "Payment Due", color: "red" }
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setSelectedStatus(status.key)}
                className={`
                  inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 font-instrument
                  ${
                    selectedStatus === status.key
                      ? status.color === "purple"
                        ? "bg-purple-600 text-white shadow-sm"
                        : status.color === "green"
                        ? "bg-green-500 text-white shadow-sm"
                        : status.color === "orange"
                        ? "bg-orange-500 text-white shadow-sm"
                        : status.color === "blue"
                        ? "bg-blue-500 text-white shadow-sm"
                        : status.color === "yellow"
                        ? "bg-yellow-500 text-white shadow-sm"
                        : "bg-red-500 text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }
                `}
              >
                {status.label}
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    selectedStatus === status.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status.key === "ALL"
                    ? counts.ALL
                    : status.key === "CONFIRMED"
                    ? counts.PENDING || 0 // Assuming PENDING represents confirmed bookings in this context
                    : counts[status.key as keyof BookingCounts] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredBookings.length} of {bookings.length} bookings
          </span>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No bookings match your search "${searchTerm}"`
                : selectedStatus === "ALL"
                ? "You don't have any bookings yet."
                : `No ${selectedStatus.toLowerCase()} bookings found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {booking.id}
                        </div>
                        <button
                          onClick={() => copyBookingId(booking.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy Booking ID"
                        >
                          {copiedId === booking.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 mr-3">
                          <Image
                            src={
                              booking.travelPlan.tripImage ||
                              "https://avatar.iran.liara.run/public"
                            }
                            alt={booking.travelPlan.title}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-32 truncate">
                            {booking.travelPlan.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.travelPlan.destination ||
                              "Destination TBA"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.participants}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                      {booking.refundAmount > 0 && (
                        <div className="text-red-600">
                          Refunded: {formatCurrency(booking.refundAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                          booking.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusIcon(booking.paymentStatus)}
                        {booking.paymentStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Mail,
  Phone,
  User,
  ChevronDown,
  ChevronRight,
  MapPin,
  AlertCircle,
  TrendingUp
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
  amountPaid?: number;
  remainingAmount?: number;
  paymentDeadline?: Date | null;
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

type Trip = {
  travelPlanId: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  maxParticipants: number | null;
  destination: string | null;
  tripImage: string | null;
  confirmedParticipants: number;
  remainingSeats: number;
};

type BookingCounts = {
  ALL: number;
  PENDING: number;
  PARTIALLY_PAID: number;
  FULLY_PAID: number;
  OVERDUE: number;
  CANCELLED: number;
  REFUNDED: number;
};

export const BookingsSection = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [expandedBookings, setExpandedBookings] = useState<Set<string>>(
    new Set()
  );
  const [counts, setCounts] = useState<BookingCounts>({
    ALL: 0,
    PENDING: 0,
    PARTIALLY_PAID: 0,
    FULLY_PAID: 0,
    OVERDUE: 0,
    CANCELLED: 0,
    REFUNDED: 0
  });
  const [showUpcoming, setShowUpcoming] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHostBookings(
        selectedStatus,
        selectedTrip || undefined,
        "payment"
      );

      if ("error" in response) {
        setError(response.error as string);
      } else if (response.success) {
        setBookings(response.bookings || []);
        setTrips(response.trips || []);
        // Calculate payment status counts from the bookings data
        const paymentCounts = (response.bookings || []).reduce(
          (acc: BookingCounts, booking: Booking) => {
            acc.ALL++;
            if (
              booking.paymentStatus &&
              acc[booking.paymentStatus as keyof BookingCounts] !== undefined
            ) {
              acc[booking.paymentStatus as keyof BookingCounts]++;
            }
            return acc;
          },
          {
            ALL: 0,
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
  }, [selectedStatus, selectedTrip]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (selectedTrip || selectedStatus !== "ALL") {
      fetchBookings();
    }
  }, [selectedTrip, selectedStatus, fetchBookings]);

  const toggleBookingExpansion = (bookingId: string) => {
    setExpandedBookings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const handleTripSelect = (tripId: string) => {
    setSelectedTrip(tripId === selectedTrip ? null : tripId);
    setExpandedBookings(new Set()); // Reset expanded bookings when changing trips
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

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "FULLY_PAID":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PARTIALLY_PAID":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "PENDING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "OVERDUE":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "REFUNDED":
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get upcoming trips based on bookings
  const upcomingTrips = bookings.filter((booking) => {
    const startDate = new Date(booking.startDate);
    const now = new Date();
    return startDate > now && booking.paymentStatus === "FULLY_PAID";
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h2>
          <p className="text-gray-600 font-medium">
            Manage and track all your trip bookings
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h2>
          <p className="text-gray-600 font-medium">
            Manage and track all your trip bookings
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h2>
        <p className="text-gray-600 font-medium">
          Select a trip to view and manage its bookings
        </p>
      </div>

      {/* Upcoming Trips Toggle */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm border border-purple-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Upcoming Trips
              </h3>
              <p className="text-sm text-gray-600">
                View all upcoming confirmed bookings
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            {showUpcoming ? "Hide" : "Show"} Upcoming ({upcomingTrips.length})
          </button>
        </div>

        {/* Upcoming Trips List */}
        {showUpcoming && upcomingTrips.length > 0 && (
          <div className="mt-6 space-y-3">
            {upcomingTrips.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg border border-purple-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {booking.travelPlan.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.startDate)} • {booking.participants}{" "}
                      guests • {booking.user.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showUpcoming && upcomingTrips.length === 0 && (
          <div className="mt-6 text-center py-4">
            <p className="text-gray-600">No upcoming trips found</p>
          </div>
        )}
      </div>

      {/* Active Trips Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Active Trips
        </h3>
        {trips.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600">No active trips found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <div
                key={trip.travelPlanId}
                onClick={() => handleTripSelect(trip.travelPlanId)}
                className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                  selectedTrip === trip.travelPlanId
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25"
                }`}
              >
                <div className="relative h-32 rounded-t-lg overflow-hidden">
                  <Image
                    src={
                      trip.tripImage || "https://avatar.iran.liara.run/public"
                    }
                    alt={trip.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        trip.remainingSeats <= 5
                          ? "bg-red-100 text-red-800"
                          : trip.remainingSeats <= 15
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {trip.remainingSeats} left
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 truncate">
                    {trip.title}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">
                        {trip.destination || "Destination TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {trip.startDate
                          ? formatDate(trip.startDate)
                          : "Date TBA"}{" "}
                        - {trip.endDate ? formatDate(trip.endDate) : "Date TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {trip.confirmedParticipants}/
                        {trip.maxParticipants || 50} confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter - Only show when trip is selected */}
      {selectedTrip && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap gap-3">
            {["ALL", "CONFIRMED", "PENDING", "REFUNDED", "CANCELLED"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedStatus === status
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{status}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-xs">
                    {counts[status as keyof BookingCounts]}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Bookings List - Only show when trip is selected */}
      {selectedTrip && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Bookings for{" "}
            {trips.find((t) => t.travelPlanId === selectedTrip)?.title}
          </h3>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Bookings Found
              </h4>
              <p className="text-gray-600">
                {selectedStatus === "ALL"
                  ? "This trip doesn't have any bookings yet."
                  : `No ${selectedStatus.toLowerCase()} bookings found for this trip.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Booking Header - Clickable */}
                  <div
                    onClick={() => toggleBookingExpansion(booking.id)}
                    className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 font-mono">
                            {booking.id}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {booking.participants}{" "}
                            {booking.participants === 1 ? "guest" : "guests"} •
                            Booked on {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${getPaymentStatusColor(
                            booking.paymentStatus || "PENDING"
                          )}`}
                        >
                          {getPaymentStatusIcon(
                            booking.paymentStatus || "PENDING"
                          )}
                          {booking.paymentStatus || "PENDING"}
                        </span>
                        {expandedBookings.has(booking.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details - Expandable */}
                  {expandedBookings.has(booking.id) && (
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="space-y-4">
                        {/* Booking Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              Booking Details
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Booking Date:
                                </span>
                                <span>{formatDate(booking.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Trip Dates:
                                </span>
                                <span>
                                  {formatDate(booking.startDate)} -{" "}
                                  {formatDate(booking.endDate)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Total Price:
                                </span>
                                <span className="font-semibold">
                                  {formatCurrency(booking.totalPrice)}
                                </span>
                              </div>
                              {booking.amountPaid !== undefined &&
                                booking.amountPaid > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Amount Paid:
                                    </span>
                                    <span className="text-green-600 font-semibold">
                                      {formatCurrency(booking.amountPaid)}
                                    </span>
                                  </div>
                                )}
                              {booking.remainingAmount !== undefined &&
                                booking.remainingAmount > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Remaining:
                                    </span>
                                    <span className="text-orange-600 font-semibold">
                                      {formatCurrency(booking.remainingAmount)}
                                    </span>
                                  </div>
                                )}
                              {booking.paymentDeadline && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Payment Due:
                                  </span>
                                  <span
                                    className={
                                      new Date(booking.paymentDeadline) <
                                      new Date()
                                        ? "text-red-600"
                                        : ""
                                    }
                                  >
                                    {formatDate(booking.paymentDeadline)}
                                  </span>
                                </div>
                              )}
                              {booking.refundAmount > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Refund Amount:
                                  </span>
                                  <span className="text-red-600">
                                    {formatCurrency(booking.refundAmount)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              Contact Information
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <a
                                  href={`mailto:${booking.user.email}`}
                                  className="text-purple-600 hover:text-purple-700"
                                >
                                  {booking.user.email}
                                </a>
                              </div>
                              {booking.user.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{booking.user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Special Requirements */}
                        {booking.specialRequirements && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              Special Requirements
                            </h5>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                {booking.specialRequirements}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Guest List */}
                        {booking.guests && booking.guests.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              Guests ({booking.guests.length})
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {booking.guests.map((guest, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                                >
                                  <User className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {guest.firstName} {guest.lastName}
                                    </p>
                                    {guest.isteamLead && (
                                      <p className="text-xs text-purple-600">
                                        Team Lead
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

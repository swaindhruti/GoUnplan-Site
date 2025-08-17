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
  User
} from "lucide-react";
import Image from "next/image";
import { getHostBookings } from "@/actions/host/action";
import { BookingStatus, TeamMemberInput } from "@/types/booking";

type Booking = {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  participants: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  specialRequirements: string | null;
  pricePerPerson: number;
  refundAmount: number;
  user: {
    id: string;
    name: string;
    email: string;
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
  };
  guests: TeamMemberInput[];
};

type BookingCounts = {
  ALL: number;
  PENDING: number;
  CONFIRMED: number;
  CANCELLED: number;
  REFUNDED: number;
};

export const BookingsSection = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [counts, setCounts] = useState<BookingCounts>({
    ALL: 0,
    PENDING: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
    REFUNDED: 0
  });

  const filterBookings = useCallback(() => {
    if (selectedStatus === "ALL") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((booking) => booking.status === selectedStatus)
      );
    }
  }, [selectedStatus, bookings]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHostBookings();

      if ("error" in response) {
        setError(response.error as string);
      } else if (response.success) {
        setBookings(response.bookings || []);
        setCounts(
          response.counts || {
            ALL: 0,
            PENDING: 0,
            CONFIRMED: 0,
            CANCELLED: 0,
            REFUNDED: 0
          }
        );
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
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
          Manage and track all your trip bookings
        </p>
      </div>

      {/* Status Filter Tabs */}
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
              {selectedStatus === "ALL"
                ? "You don't have any bookings yet."
                : `No ${selectedStatus.toLowerCase()} bookings found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Trip Image and Info */}
                <div className="flex-shrink-0">
                  <div className="relative w-full lg:w-32 h-32">
                    <Image
                      src={
                        booking.travelPlan.tripImage ||
                        "https://avatar.iran.liara.run/public"
                      }
                      alt={booking.travelPlan.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-grow space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.travelPlan.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.travelPlan.destination ||
                          "Destination not specified"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {booking.participants}{" "}
                          {booking.participants === 1 ? "guest" : "guests"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                      {booking.refundAmount > 0 && (
                        <p className="text-sm text-red-600">
                          Refunded: {formatCurrency(booking.refundAmount)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                          <Image
                            src={
                              booking.user.image ||
                              "https://avatar.iran.liara.run/public"
                            }
                            alt={booking.user.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Booked on {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 sm:ml-auto">
                        <a
                          href={`mailto:${booking.user.email}`}
                          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                        >
                          <Mail className="h-4 w-4" />
                          {booking.user.email}
                        </a>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          {booking.user.phone}
                        </span>
                      </div>
                    </div>

                    {/* Special Requirements */}
                    {booking.specialRequirements && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">
                          Special Requirements:
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.specialRequirements}
                        </p>
                      </div>
                    )}

                    {/* Team Members */}
                    {booking.guests && booking.guests.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Team Members:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {booking.guests.map((guest, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <User className="h-4 w-4" />
                              <span>
                                {guest.firstName} {guest.lastName}
                                {guest.isteamLead && (
                                  <span className="ml-1 text-purple-600">
                                    (Team Lead)
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

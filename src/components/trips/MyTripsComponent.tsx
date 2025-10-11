"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Plane,
  ChevronRight,
  Eye,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import Image from "next/image";
import { cancelBooking } from "@/actions/booking/actions";
import { getSuggestedTripsWrapper } from "@/actions/trips/getSuggestedTripsWrapper";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TripCard } from "./TripCard";
import { Trip } from "@/types/trips";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TravelPlan {
  travelPlanId: string;
  title: string;
  description: string;
  destination: string | null;
  country?: string;
  state?: string;
  city?: string;
  tripImage?: string | null;
  noOfDays: number;
}

interface Booking {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  totalPrice: number;
  participants: number;
  status: BookingStatus;
  pricePerPerson: number;
  refundAmount?: number;
  amountPaid?: number;
  remainingAmount?: number;
  specialRequirements?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  travelPlan: TravelPlan;
  paymentStatus: PaymentStatus;
}

interface User {
  id: string;
  name: string;
  email?: string;
}

interface MyTripsComponentProps {
  bookings: Booking[];
  user: User;
}

type FilterStatus = "ALL" | "UPCOMING" | "PAST" | PaymentStatus;
type SortBy = "ALL_TRIPS" | PaymentStatus;

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50",
  },
  FULLY_PAID: {
    label: "Fully Paid",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50",
  },
  OVERDUE: {
    label: "Overdue",
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50",
  },
  REFUNDED: {
    label: "Refunded",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50",
  },
};

export default function MyTripsComponent({ bookings }: MyTripsComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("ALL_TRIPS");

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    const now = new Date();

    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.travelPlan.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (booking.travelPlan.destination || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filter by status
      if (statusFilter === "ALL") return true;

      const startDate = new Date(booking.startDate);

      if (statusFilter === "UPCOMING") {
        return (
          (startDate > now && booking.paymentStatus === "FULLY_PAID") ||
          (startDate > now && booking.paymentStatus === "PARTIALLY_PAID")
        );
      }

      if (statusFilter === "PAST") {
        return (
          startDate <= now ||
          booking.paymentStatus === "CANCELLED" ||
          booking.paymentStatus === "REFUNDED"
        );
      }

      // Payment status filters
      return booking.paymentStatus === statusFilter;
    });

    // Apply sort filter
    if (sortBy !== "ALL_TRIPS") {
      filtered = filtered.filter((booking) => booking.paymentStatus === sortBy);
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [bookings, searchTerm, statusFilter, sortBy]);

  // Get status counts for filter buttons
  const statusCounts = useMemo(() => {
    const now = new Date();
    const counts = bookings.reduce((acc, booking) => {
      const startDate = new Date(booking.startDate);

      // Count payment statuses
      acc[booking.paymentStatus] = (acc[booking.paymentStatus] || 0) + 1;

      // Count upcoming trips
      if (
        (startDate > now && booking.paymentStatus === "FULLY_PAID") ||
        (startDate > now && booking.paymentStatus === "PARTIALLY_PAID")
      ) {
        acc.UPCOMING = (acc.UPCOMING || 0) + 1;
      }

      // Count past trips
      if (
        startDate <= now ||
        booking.paymentStatus === "CANCELLED" ||
        booking.paymentStatus === "REFUNDED"
      ) {
        acc.PAST = (acc.PAST || 0) + 1;
      }

      return acc;
    }, {} as Record<string, number>);

    return {
      ALL: bookings.length,
      ...counts,
    } as Record<FilterStatus, number>;
  }, [bookings]);

  // Categorize bookings for better organization
  const categorizedBookings = useMemo(() => {
    const now = new Date();
    return filteredAndSortedBookings.reduce(
      (acc, booking) => {
        const startDate = new Date(booking.startDate);

        if (
          (booking.status === "CONFIRMED" && startDate > now) ||
          (startDate > now && booking.paymentStatus === "PARTIALLY_PAID")
        ) {
          acc.upcoming.push(booking);
        } else if (booking.status === "CONFIRMED" && startDate <= now) {
          acc.completed.push(booking);
        } else {
          acc.other.push(booking);
        }

        return acc;
      },
      {
        upcoming: [] as Booking[],
        completed: [] as Booking[],
        other: [] as Booking[],
      }
    );
  }, [filteredAndSortedBookings]);

  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center px-6 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full mb-4">
                <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                  My Travel History
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
                Your Adventure
                <span className="block text-purple-300 mt-2">Collection</span>
              </h1>
              <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
                Track and manage all your bookings in one place
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium font-instrument">
                  Total Trips: {bookings.length}
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium font-instrument">
                  Upcoming: {categorizedBookings.upcoming.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Plane className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Filter className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-bricolage">
                Filter & Search
              </h2>
            </div>

            <div className="space-y-6">
              {/* Search Bar - Full Width */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search trips by destination or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full h-12 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 font-instrument text-base"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Status Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-instrument">
                    Filter Trips
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(["ALL", "UPCOMING", "PAST"] as FilterStatus[]).map(
                      (status) => (
                        <Button
                          key={status}
                          variant={
                            statusFilter === status ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter(status)}
                          className={`
                          ${
                            statusFilter === status
                              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          } 
                          rounded-lg font-instrument transition-all duration-200 hover:scale-105
                        `}
                        >
                          {status === "ALL"
                            ? "All Trips"
                            : status === "UPCOMING"
                            ? "Upcoming"
                            : "Past"}
                          <span
                            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                              statusFilter === status
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {statusCounts[status] || 0}
                          </span>
                        </Button>
                      )
                    )}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="lg:w-64">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 font-instrument">
                    Sort by Payment Status
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-full h-10 border border-gray-300 rounded-lg px-4 pr-10 text-sm font-instrument focus:border-purple-500 focus:ring-purple-500 bg-white appearance-none cursor-pointer"
                    >
                      <option value="ALL_TRIPS">All Trips</option>
                      <option value="FULLY_PAID">Fully Paid</option>
                      <option value="PARTIALLY_PAID">Partially Paid</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="OVERDUE">Overdue</option>
                      <option value="PENDING">Pending</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(searchTerm || statusFilter !== "ALL") && (
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 text-sm text-purple-700 font-instrument">
                    <span className="font-semibold">Active Filters:</span>
                    {searchTerm && (
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-md text-xs">
                        Search: &quot;{searchTerm}&quot;
                      </span>
                    )}
                    {statusFilter !== "ALL" && (
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-md text-xs">
                        Status:{" "}
                        {statusConfig[statusFilter as PaymentStatus]?.label ||
                          statusFilter}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("ALL");
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 p-1 h-auto font-instrument"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Results Summary */}
              <div className="text-sm text-gray-600 font-instrument">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredAndSortedBookings.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {bookings.length}
                </span>{" "}
                trips
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAndSortedBookings.length === 0 ? (
          // Empty State with Suggested Trips
          <EmptyTripState
            hasFilters={!!(searchTerm || statusFilter !== "ALL")}
            searchTerm={searchTerm}
          />
        ) : (
          // Bookings Grid
          <div className="space-y-8">
            {/* Upcoming Trips */}
            {categorizedBookings.upcoming.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-bricolage mb-6 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  Upcoming Trips ({categorizedBookings.upcoming.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedBookings.upcoming.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Trips */}
            {(categorizedBookings.completed.length > 0 ||
              categorizedBookings.other.length > 0) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-bricolage mb-6 flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  Trip History (
                  {categorizedBookings.completed.length +
                    categorizedBookings.other.length}
                  )
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    ...categorizedBookings.completed,
                    ...categorizedBookings.other,
                  ].map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const statusConfig = getStatusConfig(booking.paymentStatus);
  const StatusIcon = statusConfig.icon;
  const isUpcomingTrip = isUpcoming(booking);

  const canCancelBooking = () => {
    if (booking.paymentStatus !== "FULLY_PAID") return false;

    const now = new Date();
    const startDate = new Date(booking.startDate);
    const daysUntilTrip = Math.ceil(
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilTrip >= 4;
  };

  const getDaysUntilTrip = () => {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    return Math.ceil(
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const calculateRefundAmount = () => {
    const daysUntilTrip = getDaysUntilTrip();
    let refundPercentage = 0;

    if (daysUntilTrip >= 30) {
      refundPercentage = 1.0;
    } else if (daysUntilTrip >= 14) {
      refundPercentage = 0.8;
    } else if (daysUntilTrip >= 7) {
      refundPercentage = 0.5;
    } else if (daysUntilTrip >= 4) {
      refundPercentage = 0.2;
    }

    return {
      refundAmount: Math.floor(
        (booking.amountPaid || booking.totalPrice) * refundPercentage
      ),
      refundPercentage: Math.round(refundPercentage * 100),
    };
  };

  const handleOpenCancelModal = () => {
    if (!canCancelBooking()) {
      toast.error(
        "Cancellation not allowed less than 4 days prior to the trip"
      );
      return;
    }
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (isLoading) return; // Prevent double-clicks

    setIsLoading(true);
    try {
      const result = await cancelBooking(booking.id);

      if (result.success) {
        toast.success(
          "Booking cancelled successfully. Refund will be processed shortly."
        );
        setShowCancelModal(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Frontend: Cancellation error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
      bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden
      ${isUpcomingTrip ? "ring-2 ring-green-200" : ""}
    `}
    >
      {/* Trip Image */}
      <div className="relative h-48 bg-gradient-to-r from-purple-500 to-blue-600">
        <Image
          src={
            booking.travelPlan.tripImage ||
            `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
          }
          alt={booking.travelPlan.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Status Badge - Payment Status */}
        <div className="absolute top-4 right-4">
          <Badge
            className={`${statusConfig.color} font-instrument flex items-center gap-1`}
          >
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Upcoming Badge */}
        {isUpcomingTrip && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-600 text-white font-instrument">
              Upcoming
            </Badge>
          </div>
        )}

        {/* Trip Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg font-bricolage leading-tight drop-shadow-lg">
            {booking.travelPlan.title}
          </h3>
          <div className="flex items-center gap-1 text-white/90 text-sm mt-1">
            <MapPin className="h-3 w-3" />
            {booking.travelPlan.destination || "Unknown"}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Trip Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="font-instrument">
                {format(new Date(booking.startDate), "MMM dd")} -{" "}
                {format(new Date(booking.endDate), "MMM dd")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="font-instrument">
                {booking.participants} travelers
              </span>
            </div>
          </div>

          {/* Payment Status Info */}
          {booking.paymentStatus === "PARTIALLY_PAID" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-orange-700 font-medium font-instrument">
                  Remaining Amount:
                </span>
                <span className="text-orange-900 font-bold font-instrument">
                  {formatCurrency(booking.remainingAmount || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Duration and Price */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-600 font-instrument">
              {booking.travelPlan.noOfDays} days
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 font-instrument">
                {formatCurrency(booking.totalPrice)}
              </div>
              <div className="text-xs text-gray-600 font-instrument">
                {booking.paymentStatus === "FULLY_PAID"
                  ? "Paid"
                  : booking.paymentStatus === "PARTIALLY_PAID"
                  ? `Paid: ${formatCurrency(booking.amountPaid || 0)}`
                  : "Payment Status: " + statusConfig.label}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Link
              href={`/trips/booking/${booking.travelPlan.travelPlanId}/booking-summary/${booking.id}`}
              className="flex-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-300 hover:bg-gray-50 font-instrument"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </Link>

            {isUpcomingTrip && canCancelBooking() && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenCancelModal}
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 font-instrument"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Cancel Booking
              </Button>
            )}

            {isUpcomingTrip &&
              !canCancelBooking() &&
              booking.status === "CONFIRMED" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="flex-1 border-gray-300 text-gray-400 cursor-not-allowed font-instrument"
                  title="Cancellation not allowed less than 4 days prior to trip"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Cannot Cancel
                </Button>
              )}
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 font-bricolage">
              <AlertTriangle className="h-5 w-5" />
              Cancel Booking Confirmation
            </DialogTitle>
            <DialogDescription className="text-gray-700 font-instrument">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="font-semibold text-blue-900 font-instrument mb-2">
                Booking Details:
              </div>
              <div className="text-sm text-blue-800 space-y-1 font-instrument">
                <div>
                  <strong>Trip:</strong> {booking.travelPlan.title}
                </div>
                <div>
                  <strong>Start Date:</strong>{" "}
                  {format(new Date(booking.startDate), "MMM dd, yyyy")}
                </div>
                <div>
                  <strong>Days until trip:</strong> {getDaysUntilTrip()} days
                </div>
                <div>
                  <strong>Total Amount:</strong>{" "}
                  {formatCurrency(booking.totalPrice)}
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="font-semibold text-green-900 font-instrument mb-2">
                Refund Information:
              </div>
              <div className="text-sm text-green-800 font-instrument">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>
                    <strong>
                      {calculateRefundAmount().refundPercentage === 100
                        ? "Full refund"
                        : `${calculateRefundAmount().refundPercentage}% refund`}
                      :
                    </strong>{" "}
                    {formatCurrency(calculateRefundAmount().refundAmount)}
                  </span>
                </div>
                <div className="mt-1 text-green-700">
                  The refund amount will be processed shortly after
                  cancellation.
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={isLoading}
              className="font-instrument"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isLoading}
              className="font-instrument"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusConfig(status: PaymentStatus) {
  return statusConfig[status] || "";
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function isUpcoming(booking: Booking) {
  const startDate = new Date(booking.startDate);
  const now = new Date();
  return booking.paymentStatus === "FULLY_PAID" && startDate > now;
}

// Empty State Component for My Trips
function EmptyTripState({
  hasFilters,
  searchTerm,
}: {
  hasFilters: boolean;
  searchTerm: string;
}) {
  const [suggestedTrips, setSuggestedTrips] = useState<Trip[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!hasFilters || !searchTerm) return;

      setIsLoadingSuggestions(true);
      try {
        const result = await getSuggestedTripsWrapper({ searchTerm }, 6);
        if (result.trips) {
          // Transform the raw trip data to match Trip type
          const transformedTrips: Trip[] = result.trips.map((trip) => ({
            ...trip,
            vibes: trip.filters || [],
            tripImage: `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
            languages: trip.languages || [],
            filters: trip.filters || [],
            averageRating: trip.averageRating || 0,
            reviewCount: trip.reviewCount || 0,
            createdAt:
              typeof trip.createdAt === "string"
                ? trip.createdAt
                : trip.createdAt.toISOString(),
          }));
          setSuggestedTrips(transformedTrips);
        }
      } catch (error) {
        console.error("Error fetching suggested trips:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [hasFilters, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Original Empty State */}
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Plane className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-bricolage">
          {hasFilters ? "No trips found" : "No trips yet"}
        </h3>
        <p className="text-gray-600 font-instrument mb-6">
          {hasFilters
            ? suggestedTrips.length > 0
              ? "No matching trips in your bookings, but here are some similar adventures you might like!"
              : "Try adjusting your search or filters"
            : "Start your adventure by exploring our amazing destinations"}
        </p>
        {!hasFilters && (
          <Link href="/trips">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-instrument">
              Explore Trips
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Suggested Trips Section */}
      {hasFilters && (isLoadingSuggestions || suggestedTrips.length > 0) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bricolage font-bold text-gray-900">
                  Discover Similar Adventures
                </h3>
                <p className="text-gray-600 font-instrument text-sm">
                  Since you&apos;re looking for &quot;{searchTerm}&quot;, here
                  are some trips you might enjoy
                </p>
              </div>
            </div>
          </div>

          {isLoadingSuggestions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-4"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl mb-4">
                    <div className="bg-gray-200 animate-pulse w-full h-full rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 animate-pulse h-6 w-3/4 rounded-lg" />
                    <div className="bg-gray-200 animate-pulse h-4 w-full rounded-md" />
                    <div className="bg-gray-200 animate-pulse h-4 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedTrips.map((trip) => (
                <div key={trip.travelPlanId} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      Suggested
                    </div>
                  </div>
                  <TripCard trip={trip} onClick={() => {}} />
                </div>
              ))}
            </div>
          )}

          {suggestedTrips.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/trips">
                <Button
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 font-instrument font-semibold px-8 py-3 rounded-full"
                >
                  Explore All Trips
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

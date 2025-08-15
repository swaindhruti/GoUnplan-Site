"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Plane,
  Star,
  ChevronRight,
  Eye,
  Edit3,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { BookingStatus } from "@prisma/client";
import Image from "next/image";

// Types based on the existing booking structure
interface TravelPlan {
  travelPlanId: string;
  title: string;
  description: string;
  destination: string;
  country?: string;
  state?: string;
  city?: string;
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
  specialRequirements?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  travelPlan: TravelPlan;
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

type FilterStatus = "ALL" | BookingStatus;

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgColor: "bg-yellow-50"
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50"
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50"
  },
  REFUNDED: {
    label: "Refunded",
    icon: RotateCcw,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "bg-blue-50"
  }
};

export default function MyTripsComponent({ bookings, user }: MyTripsComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "price" | "status">("date");

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch = 
        booking.travelPlan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.travelPlan.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort bookings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "price":
          return b.totalPrice - a.totalPrice;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, searchTerm, statusFilter, sortBy]);

  // Get status counts for filter buttons
  const statusCounts = useMemo(() => {
    const counts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>);
    
    return {
      ALL: bookings.length,
      ...counts
    };
  }, [bookings]);

  // Categorize bookings for better organization
  const categorizedBookings = useMemo(() => {
    const now = new Date();
    return filteredAndSortedBookings.reduce((acc, booking) => {
      const startDate = new Date(booking.startDate);
      
      if (booking.status === "CONFIRMED" && startDate > now) {
        acc.upcoming.push(booking);
      } else if (booking.status === "CONFIRMED" && startDate <= now) {
        acc.completed.push(booking);
      } else {
        acc.other.push(booking);
      }
      
      return acc;
    }, {
      upcoming: [] as Booking[],
      completed: [] as Booking[],
      other: [] as Booking[]
    });
  }, [filteredAndSortedBookings]);

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const getStatusConfig = (status: BookingStatus) => {
    return statusConfig[status] || statusConfig.PENDING;
  };

  const isUpcoming = (booking: Booking) => {
    const startDate = new Date(booking.startDate);
    const now = new Date();
    return booking.status === "CONFIRMED" && startDate > now;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search trips by destination or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {(["ALL", "CONFIRMED", "PENDING", "CANCELLED", "REFUNDED"] as FilterStatus[]).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={`
                      ${statusFilter === status 
                        ? "bg-purple-600 text-white" 
                        : "bg-white text-gray-700 hover:bg-gray-100"
                      } 
                      border border-gray-300 rounded-lg font-instrument
                    `}
                  >
                    {status === "ALL" ? "All" : statusConfig[status as BookingStatus]?.label || status}
                    <span className="ml-2 text-xs">
                      ({statusCounts[status] || 0})
                    </span>
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "price" | "status")}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-instrument focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAndSortedBookings.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-bricolage">
              {searchTerm || statusFilter !== "ALL" ? "No trips found" : "No trips yet"}
            </h3>
            <p className="text-gray-600 font-instrument mb-6">
              {searchTerm || statusFilter !== "ALL" 
                ? "Try adjusting your search or filters" 
                : "Start your adventure by exploring our amazing destinations"}
            </p>
            {!searchTerm && statusFilter === "ALL" && (
              <Link href="/trips">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-instrument">
                  Explore Trips
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
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
            {(categorizedBookings.completed.length > 0 || categorizedBookings.other.length > 0) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-bricolage mb-6 flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  Trip History ({categorizedBookings.completed.length + categorizedBookings.other.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...categorizedBookings.completed, ...categorizedBookings.other].map((booking) => (
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

// Individual Booking Card Component
function BookingCard({ booking }: { booking: Booking }) {
  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;
  const isUpcomingTrip = isUpcoming(booking);

  return (
    <div className={`
      bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden
      ${isUpcomingTrip ? 'ring-2 ring-green-200' : ''}
    `}>
      {/* Trip Image */}
      <div className="relative h-48 bg-gradient-to-r from-purple-500 to-blue-600">
        <Image
          src={`https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
          alt={booking.travelPlan.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={`${statusConfig.color} font-instrument flex items-center gap-1`}>
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
            {booking.travelPlan.destination}
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
                {format(new Date(booking.startDate), "MMM dd")} - {format(new Date(booking.endDate), "MMM dd")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="font-instrument">{booking.participants} travelers</span>
            </div>
          </div>

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
                Booked on {format(new Date(booking.createdAt), "MMM dd, yyyy")}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Link href={`/trips/booking/${booking.travelPlan.travelPlanId}/booking-summary`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-300 hover:bg-gray-50 font-instrument"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </Link>
            
            {isUpcomingTrip && (
              <Link href={`/trips/${booking.travelPlan.travelPlanId}`} className="flex-1">
                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-instrument"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Manage
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions (moved outside component to avoid re-creation)
function getStatusConfig(status: BookingStatus) {
  return statusConfig[status] || statusConfig.PENDING;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}

function isUpcoming(booking: Booking) {
  const startDate = new Date(booking.startDate);
  const now = new Date();
  return booking.status === "CONFIRMED" && startDate > now;
}
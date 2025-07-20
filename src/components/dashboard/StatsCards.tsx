import { ShoppingBag, Calendar, DollarSign, MapPin } from "lucide-react";
import { UserProfile, Booking } from "@/types/dashboard";

interface StatsCardsProps {
  profile: UserProfile | null;
  bookings: Booking[];
}

export function StatsCards({ profile, bookings }: StatsCardsProps) {
  const totalSpent = bookings.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );
  const upcomingTrips = bookings.filter(
    (booking) =>
      new Date(booking.startDate) > new Date() && booking.status === "confirmed"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Total Bookings Card */}
      <div className="relative group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">
              Total Bookings
            </h3>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {profile?.bookingCounts.total || 0}
          </div>
          <p className="text-blue-600 font-medium text-sm">All time bookings</p>
        </div>
      </div>

      {/* Upcoming Trips Card */}
      <div className="relative group bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 shadow-lg border border-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wide">
              Upcoming Trips
            </h3>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {upcomingTrips}
          </div>
          <p className="text-emerald-600 font-medium text-sm">
            Confirmed bookings
          </p>
        </div>
      </div>

      {/* Completed Trips Card */}
      <div className="relative group bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide">
              Completed Trips
            </h3>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {profile?.bookingCounts.completed || 0}
          </div>
          <p className="text-purple-600 font-medium text-sm">Travel memories</p>
        </div>
      </div>

      {/* Spent on Travel Card */}
      <div className="relative group bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wide">
              Spent on Travel
            </h3>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${totalSpent.toLocaleString()}
          </div>
          <p className="text-amber-600 font-medium text-sm">Total expenses</p>
        </div>
      </div>
    </div>
  );
}

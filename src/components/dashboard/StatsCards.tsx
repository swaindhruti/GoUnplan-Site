import { ShoppingBag, Calendar, Clock, DollarSign } from "lucide-react";
import { UserProfile, Booking } from "@/types/dashboard";

interface StatsCardsProps {
  profile: UserProfile | null;
  bookings: Booking[];
}

export function StatsCards({ profile, bookings }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Total Bookings Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Total Bookings
          </h3>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {profile?.bookingCounts.total || 0}
        </div>
        <p className="text-gray-600 font-medium">All time bookings</p>
      </div>

      {/* Upcoming Trips Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Upcoming Trips
          </h3>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {profile?.bookingCounts.confirmed || 0}
        </div>
        <p className="text-gray-600 font-medium">Confirmed bookings</p>
      </div>

      {/* Completed Trips Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Completed Trips
          </h3>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {profile?.bookingCounts.completed || 0}
        </div>
        <p className="text-gray-600 font-medium">Travel memories</p>
      </div>

      {/* Spent on Travel Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Spent on Travel
          </h3>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          $
          {bookings
            .reduce((sum, booking) => sum + booking.totalPrice, 0)
            .toLocaleString()}
        </div>
        <p className="text-gray-600 font-medium">Total expenses</p>
      </div>
    </div>
  );
}

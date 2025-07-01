import { ShoppingBag, Calendar, Clock, DollarSign } from "lucide-react";
import { UserProfile, Booking } from "@/types/dashboard";

interface StatsCardsProps {
  profile: UserProfile | null;
  bookings: Booking[];
}

export function StatsCards({ profile, bookings }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Bookings Card */}
      <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-yellow-300 border-b-3 border-black px-5 py-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-black uppercase tracking-wide">
            Total Bookings
          </h3>
          <div className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShoppingBag className="h-5 w-5 text-black" />
          </div>
        </div>

        <div className="p-5">
          <div className="text-3xl font-black text-black mb-1">
            {profile?.bookingCounts.total || 0}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-bold">All time bookings</p>
            {/* Decorative element */}
            <div className="w-3 h-3 bg-purple-400 border-2 border-black rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Upcoming Trips Card */}
      <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-green-500 border-b-3 border-black px-5 py-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-black uppercase tracking-wide">
            Upcoming Trips
          </h3>
          <div className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Calendar className="h-5 w-5 text-black" />
          </div>
        </div>

        <div className="p-5">
          <div className="text-3xl font-black text-black mb-1">
            {profile?.bookingCounts.confirmed || 0}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-bold">
              Confirmed bookings
            </p>
          </div>
        </div>
      </div>

      {/* Completed Trips Card */}
      <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-blue-400 border-b-3 border-black px-5 py-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-black uppercase tracking-wide">
            Completed Trips
          </h3>
          <div className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Clock className="h-5 w-5 text-black" />
          </div>
        </div>

        <div className="p-5">
          <div className="text-3xl font-black text-black mb-1">
            {profile?.bookingCounts.completed || 0}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-bold">Travel memories</p>
            {/* Decorative element */}
            <div className="w-3 h-3 bg-pink-500 border-2 border-black rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Spent on Travel Card */}
      <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-pink-500 border-b-3 border-black px-5 py-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-black uppercase tracking-wide">
            Spent on Travel
          </h3>
          <div className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <DollarSign className="h-5 w-5 text-black" />
          </div>
        </div>

        <div className="p-5">
          <div className="text-3xl font-black text-black mb-1">
            $
            {bookings
              .reduce((sum, booking) => sum + booking.totalPrice, 0)
              .toLocaleString()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-bold">Total expenses</p>
          </div>
        </div>
      </div>
    </div>
  );
}

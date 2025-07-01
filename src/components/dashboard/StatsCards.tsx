import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Calendar, Clock, DollarSign } from "lucide-react";
import { UserProfile, Booking } from "@/types/dashboard";

interface StatsCardsProps {
  profile: UserProfile | null;
  bookings: Booking[];
}

export function StatsCards({ profile, bookings }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-300 border-b-3 border-black">
          <CardTitle className="text-sm font-extrabold text-black uppercase">
            Total Bookings
          </CardTitle>
          <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-black" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black text-black">
            {profile?.bookingCounts.total || 0}
          </div>
          <p className="text-xs text-gray-700 font-bold">All time bookings</p>
        </CardContent>
      </Card>

      <Card className="border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-500 border-b-3 border-black">
          <CardTitle className="text-sm font-extrabold text-black uppercase">
            Upcoming Trips
          </CardTitle>
          <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
            <Calendar className="h-4 w-4 text-black" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black text-black">
            {profile?.bookingCounts.confirmed || 0}
          </div>
          <p className="text-xs text-gray-700 font-bold">Confirmed bookings</p>
        </CardContent>
      </Card>

      <Card className="border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-400 border-b-3 border-black">
          <CardTitle className="text-sm font-extrabold text-black uppercase">
            Completed Trips
          </CardTitle>
          <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
            <Clock className="h-4 w-4 text-black" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black text-black">
            {profile?.bookingCounts.completed || 0}
          </div>
          <p className="text-xs text-gray-700 font-bold">Travel memories</p>
        </CardContent>
      </Card>

      <Card className="border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-pink-500 border-b-3 border-black">
          <CardTitle className="text-sm font-extrabold text-black uppercase">
            Spent on Travel
          </CardTitle>
          <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-black" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black text-black">
            $
            {bookings
              .reduce((sum, booking) => sum + booking.totalPrice, 0)
              .toLocaleString()}
          </div>
          <p className="text-xs text-gray-700 font-bold">Total expenses</p>
        </CardContent>
      </Card>
    </div>
  );
}

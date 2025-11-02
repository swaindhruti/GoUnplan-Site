import { ShoppingBag, Calendar, DollarSign, MapPin } from 'lucide-react';
import { UserProfile, Booking } from '@/types/dashboard';

interface StatsCardsProps {
  profile: UserProfile | null;
  bookings: Booking[];
}

export function StatsCards({ profile, bookings }: StatsCardsProps) {
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const upcomingTrips = bookings.filter(
    booking => new Date(booking.startDate) > new Date() && booking.status === 'confirmed'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {/* Total Bookings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-50 rounded-full">
            <ShoppingBag className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 font-bricolage">
          {profile?.bookingCounts.total || 0}
        </div>
        <p className="text-gray-600 text-sm mt-1 font-instrument">Total Bookings</p>
      </div>

      {/* Upcoming Trips Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-50 rounded-full">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 font-bricolage">{upcomingTrips}</div>
        <p className="text-gray-600 text-sm mt-1 font-instrument">Upcoming Trips</p>
      </div>

      {/* Completed Trips Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 font-bricolage">
          {profile?.bookingCounts.completed || 0}
        </div>
        <p className="text-gray-600 text-sm mt-1 font-instrument">Completed Trips</p>
      </div>

      {/* Spent on Travel Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 rounded-full">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 font-bricolage">
          ${totalSpent.toLocaleString()}
        </div>
        <p className="text-gray-600 text-sm mt-1 font-instrument">Total Spent</p>
      </div>
    </div>
  );
}

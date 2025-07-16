"use client";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

export const BookingsSection = () => {
  // This is a placeholder component - will be implemented later
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
          <div className="mx-auto h-20 w-20 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <Calendar className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bookings Management
          </h3>
          <p className="text-gray-600 mb-6">This section is coming soon!</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Guest Management
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Booking Timeline
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Status Tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

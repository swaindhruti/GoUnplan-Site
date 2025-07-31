import { format } from "date-fns";
import { CheckCircle, Calendar, Clock, Users, Tag } from "lucide-react";
import type { BookingData } from "@/types/booking";

interface BookingProgressProps {
  bookingData: Partial<BookingData>;
}

export function BookingProgress({ bookingData }: BookingProgressProps) {
  // Dynamic status styling
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-600 text-white font-bold";
      case "PENDING":
        return "bg-yellow-600 text-white font-bold";
      default:
        return "bg-purple-600 text-white font-bold";
    }
  };

  return (
    <div className="border border-purple-100 rounded-2xl overflow-hidden shadow-sm bg-white">
      {/* Header */}
      <div className="bg-white border-b border-purple-100 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <CheckCircle
              className="h-7 w-7 text-purple-600"
              strokeWidth={2.5}
            />
          </div>
          <h3 className="text-2xl font-bricolage font-bold text-gray-800">
            Booking Progress
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Booking ID */}
        {bookingData.id ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 bg-white border border-purple-50 shadow-sm">
            <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
              <Tag className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
              <span>Booking ID:</span>
            </div>
            <span className="bg-purple-100 px-4 py-2 border border-purple-200 rounded-xl font-bold text-sm flex-shrink-0 text-purple-700">
              {bookingData.id.slice(-8)}
            </span>
          </div>
        ) : (
          <div className="py-3 px-4 border border-purple-50 rounded-xl bg-white shadow-sm">
            <p className="text-lg font-semibold flex items-center gap-3 text-gray-700">
              <span className="animate-pulse">⏳</span> Creating new booking...
            </p>
          </div>
        )}

        {/* Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 bg-white border border-purple-50 shadow-sm">
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
            <Clock className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
            <span>Status:</span>
          </div>
          <span
            className={`px-4 py-2 border border-purple-100 rounded-xl ${getStatusStyle(
              bookingData.status
            )} flex-shrink-0`}
          >
            {bookingData.status || "DRAFT"}
          </span>
        </div>

        {/* Dates */}
        {bookingData.startDate && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 bg-white border border-purple-50 shadow-sm">
            <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
              <Calendar className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
              <span>Dates:</span>
            </div>
            <span className="bg-purple-100 px-4 py-2 border border-purple-200 rounded-xl font-bold text-sm flex-shrink-0 text-purple-700">
              {format(bookingData.startDate, "MMM dd")} -{" "}
              {format(bookingData.endDate!, "MMM dd")}
            </span>
          </div>
        )}

        {/* Guests */}
        {bookingData.participants && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 bg-white border border-purple-50 shadow-sm">
            <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
              <Users className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
              <span>Guests:</span>
            </div>
            <span className="bg-purple-100 px-4 py-2 border border-purple-200 rounded-xl font-bold text-sm flex-shrink-0 text-purple-700">
              {bookingData.participants}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

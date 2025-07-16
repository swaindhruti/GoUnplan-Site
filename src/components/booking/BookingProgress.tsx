import { format } from "date-fns";
import { CheckCircle, Calendar, Clock, Users, Tag } from "lucide-react";
import type { BookingData } from "@/types/booking";
import { useMemo } from "react";

interface BookingProgressProps {
  bookingData: Partial<BookingData>;
}

export function BookingProgress({ bookingData }: BookingProgressProps) {
  // Premium color palette
  const progressColors = useMemo(
    () => ({
      header: "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200/50",
      confirmed: "bg-gradient-to-r from-green-400 to-emerald-400 text-white",
      pending: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white",
      draft: "bg-gradient-to-r from-purple-400 to-pink-400 text-white",
      bookingId:
        "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200/50",
      row: "bg-white/80 backdrop-blur-xl border border-white/60",
      shadow: "shadow-xl hover:shadow-2xl",
      innerShadow: "shadow-lg",
      border: "border border-white/60",
      iconBg: "bg-gradient-to-r from-blue-400 to-indigo-400",
    }),
    []
  );

  // Dynamic status styling
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return `${progressColors.confirmed} font-bold shadow-lg`;
      case "PENDING":
        return `${progressColors.pending} font-bold shadow-lg`;
      default:
        return `${progressColors.draft} font-bold shadow-lg`;
    }
  };

  return (
    <div
      className={`${progressColors.border} rounded-2xl overflow-hidden ${progressColors.shadow} bg-white/90 backdrop-blur-xl transition-all duration-300 hover:scale-105`}
    >
      {/* Header */}
      <div className={`${progressColors.header} p-6 border-b border-white/30`}>
        <div className="flex items-center gap-4">
          <div className={`${progressColors.iconBg} p-3 rounded-xl shadow-lg`}>
            <CheckCircle className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800">
            Booking Progress
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Booking ID */}
        {bookingData.id ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 ${progressColors.row} shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
              <Tag className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
              <span>Booking ID:</span>
            </div>
            <span
              className={`${progressColors.bookingId} px-4 py-2 border border-purple-200/50 rounded-xl font-bold text-sm flex-shrink-0 text-purple-700 shadow-lg`}
            >
              {bookingData.id.slice(-8)}
            </span>
          </div>
        ) : (
          <div className="py-3 px-4 border border-white/60 rounded-xl bg-white/80 backdrop-blur-xl shadow-lg">
            <p className="text-lg font-semibold flex items-center gap-3 text-gray-700">
              <span className="animate-pulse">⏳</span> Creating new booking...
            </p>
          </div>
        )}

        {/* Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 ${progressColors.row} shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
            <Clock className="h-5 w-5 text-yellow-600" strokeWidth={2.5} />
            <span>Status:</span>
          </div>
          <span
            className={`px-4 py-2 border border-white/60 rounded-xl ${getStatusStyle(
              bookingData.status
            )} flex-shrink-0`}
          >
            {bookingData.status || "DRAFT"}
          </span>
        </div>

        {/* Dates */}
        {bookingData.startDate && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 ${progressColors.row} shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
              <Calendar className="h-5 w-5 text-green-600" strokeWidth={2.5} />
              <span>Dates:</span>
            </div>
            <span className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 border border-green-200/50 rounded-xl font-bold text-sm flex-shrink-0 text-green-700 shadow-lg">
              {format(bookingData.startDate, "MMM dd")} -{" "}
              {format(bookingData.endDate!, "MMM dd")}
            </span>
          </div>
        )}

        {/* Guests */}
        {bookingData.participants && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 rounded-xl p-4 ${progressColors.row} shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 font-semibold text-lg text-gray-700">
              <Users className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
              <span>Guests:</span>
            </div>
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 border border-blue-200/50 rounded-xl font-bold text-sm flex-shrink-0 text-blue-700 shadow-lg">
              {bookingData.participants}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

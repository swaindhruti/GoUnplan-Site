import { format } from "date-fns";
import { CheckCircle, Calendar, Clock, Users, Tag } from "lucide-react";
import type { BookingData } from "@/types/booking";
import { useMemo } from "react";

interface BookingProgressProps {
  bookingData: Partial<BookingData>;
}

export function BookingProgress({ bookingData }: BookingProgressProps) {
  // Consistent color palette
  const progressColors = useMemo(
    () => ({
      header: "bg-[#a0c4ff]", // baby blue
      confirmed: "bg-[#caffbf]", // light green
      pending: "bg-[#fdffb6]", // pale yellow
      draft: "bg-[#e0c6ff]", // soft lavender
      bookingId: "bg-[#ffd6ff]", // pink lavender
      row: "bg-[#f9f9ff]", // light lavender for row backgrounds
      shadow: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      innerShadow: "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      border: "border-black border-3",
      iconBg: "bg-white",
    }),
    []
  );

  // Dynamic status styling
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return `${progressColors.confirmed} text-black font-black`;
      case "PENDING":
        return `${progressColors.pending} text-black font-black`;
      default:
        return `${progressColors.draft} text-black font-black`;
    }
  };

  return (
    <div
      className={`${progressColors.border} rounded-xl overflow-hidden ${progressColors.shadow} bg-white`}
    >
      {/* Header */}
      <div className={`${progressColors.header} p-5 border-b-3 border-black`}>
        <div className="flex items-center gap-3">
          <div
            className={`${progressColors.iconBg} p-2.5 rounded-lg border-2 border-black ${progressColors.innerShadow}`}
          >
            <CheckCircle className="h-6 w-6 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black text-black uppercase tracking-tight">
            Booking Progress
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Booking ID */}
        {bookingData.id ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 rounded-lg p-3 border-2 border-black bg-white">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Tag className="h-5 w-5" strokeWidth={2.5} />
              <span>Booking ID:</span>
            </div>
            <span
              className={`${progressColors.bookingId} px-3 py-1.5 border-2 border-black rounded-md font-black text-base flex-shrink-0`}
            >
              {bookingData.id.slice(-8)}
            </span>
          </div>
        ) : (
          <div className="py-2 px-3 border-2 border-black rounded-lg bg-white">
            <p className="text-lg font-bold flex items-center gap-2">
              <span className="animate-pulse">⏳</span> Creating new booking...
            </p>
          </div>
        )}

        {/* Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 rounded-lg p-3 border-2 border-black bg-white">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Clock className="h-5 w-5" strokeWidth={2.5} />
            <span>Status:</span>
          </div>
          <span
            className={`px-3 py-1.5 border-2 border-black rounded-md ${getStatusStyle(
              bookingData.status
            )} flex-shrink-0`}
          >
            {bookingData.status || "DRAFT"}
          </span>
        </div>

        {/* Dates */}
        {bookingData.startDate && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 rounded-lg p-3 border-2 border-black bg-white">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Calendar className="h-5 w-5" strokeWidth={2.5} />
              <span>Dates:</span>
            </div>
            <span className="bg-green-200 px-3 py-1.5 border-2 border-black rounded-md font-black text-base flex-shrink-0">
              {format(bookingData.startDate, "MMM dd")} -{" "}
              {format(bookingData.endDate!, "MMM dd")}
            </span>
          </div>
        )}

        {/* Guests */}
        {bookingData.participants && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 rounded-lg p-3 border-2 border-black bg-white">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Users className="h-5 w-5" strokeWidth={2.5} />
              <span>Guests:</span>
            </div>
            <span className="bg-blue-200 px-3 py-1.5 border-2 border-black rounded-md font-black text-base flex-shrink-0">
              {bookingData.participants}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

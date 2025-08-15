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
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900 font-instrument">
        Booking Details
      </h4>
      
      <div className="space-y-3">
        {/* Booking ID */}
        {bookingData.id ? (
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-instrument">Booking ID:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 font-instrument">
              #{bookingData.id.slice(-8)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-2">
            <span className="text-sm text-gray-600 font-instrument animate-pulse">
              Creating booking...
            </span>
          </div>
        )}

        {/* Status */}
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 font-instrument">Status:</span>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded-md font-semibold font-instrument ${getStatusStyle(
              bookingData.status
            )}`}
          >
            {bookingData.status || "DRAFT"}
          </span>
        </div>

        {/* Dates */}
        {bookingData.startDate && (
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-instrument">Dates:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 font-instrument">
              {format(bookingData.startDate, "MMM dd")} - {format(bookingData.endDate!, "MMM dd")}
            </span>
          </div>
        )}

        {/* Guests */}
        {bookingData.participants && (
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-instrument">Travelers:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 font-instrument">
              {bookingData.participants} {bookingData.participants === 1 ? 'person' : 'people'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

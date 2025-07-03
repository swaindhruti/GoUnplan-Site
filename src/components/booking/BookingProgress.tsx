import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import type { BookingData } from "@/types/booking";

interface BookingProgressProps {
  bookingData: Partial<BookingData>;
}

export function BookingProgress({ bookingData }: BookingProgressProps) {
  return (
    <div className="bg-white border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-4">
      <div className="flex items-center gap-3 border-b-3 border-black pb-2 mb-3">
        <div className="bg-[#d7dbcb] p-1.5 rounded-lg border-2 border-black">
          <CheckCircle className="h-5 w-5 text-black" strokeWidth={2.5} />
        </div>
        <h3 className="font-black text-black uppercase tracking-tight">
          Booking Progress
        </h3>
      </div>

      <div className="font-bold">
        {bookingData.id ? (
          <div className="flex justify-between py-1">
            <span>Booking ID:</span>
            <span className="bg-[#f5f5e6] px-2 border-2 border-black rounded">
              {bookingData.id.slice(-8)}
            </span>
          </div>
        ) : (
          <p className="py-1">Creating new booking...</p>
        )}

        <div className="flex justify-between py-1 border-t-2 border-dashed border-black">
          <span>Status:</span>
          <span
            className={`${
              bookingData.status === "CONFIRMED"
                ? "bg-[#d7dbcb]"
                : "bg-[#e6dad3]"
            } px-2 border-2 border-black rounded`}
          >
            {bookingData.status || "Draft"}
          </span>
        </div>

        {bookingData.startDate && (
          <div className="flex justify-between py-1 border-t-2 border-dashed border-black">
            <span>Dates:</span>
            <span>
              {format(bookingData.startDate, "MMM dd")} -{" "}
              {format(bookingData.endDate!, "MMM dd")}
            </span>
          </div>
        )}

        {bookingData.participants && (
          <div className="flex justify-between py-1 border-t-2 border-dashed border-black">
            <span>Guests:</span>
            <span>{bookingData.participants}</span>
          </div>
        )}
      </div>
    </div>
  );
}

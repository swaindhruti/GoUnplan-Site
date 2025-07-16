import { Calendar, MapPin, Clock } from "lucide-react";
import { useMemo } from "react";

interface TripSummaryProps {
  startDate: string;
  endDate: string;
  duration: string;
  location: string;
}

export function TripSummary({
  startDate,
  endDate,
  duration,
  location,
}: TripSummaryProps) {
  // Premium color palette
  const summaryColors = useMemo(
    () => ({
      dates:
        "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200/50",
      duration:
        "bg-gradient-to-r from-green-100 to-emerald-100 border-green-200/50",
      location:
        "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200/50",
      shadow: "shadow-xl hover:shadow-2xl",
      border: "border border-white/60",
    }),
    []
  );

  return (
    <div className="font-semibold space-y-4">
      <div
        className={`flex items-center gap-4 ${summaryColors.border} rounded-xl p-4 ${summaryColors.dates} ${summaryColors.shadow} transition-all duration-300 hover:scale-105 backdrop-blur-xl`}
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-xl shadow-lg flex-shrink-0">
          <Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm uppercase font-bold tracking-wide mb-1 text-gray-700">
            Dates
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {startDate} - {endDate}
          </div>
        </div>
      </div>

      <div
        className={`flex items-center gap-4 ${summaryColors.border} rounded-xl p-4 ${summaryColors.duration} ${summaryColors.shadow} transition-all duration-300 hover:scale-105 backdrop-blur-xl`}
      >
        <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-3 rounded-xl shadow-lg flex-shrink-0">
          <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm uppercase font-bold tracking-wide mb-1 text-gray-700">
            Duration
          </div>
          <div className="text-lg font-semibold text-gray-800">{duration}</div>
        </div>
      </div>

      <div
        className={`flex items-center gap-4 ${summaryColors.border} rounded-xl p-4 ${summaryColors.location} ${summaryColors.shadow} transition-all duration-300 hover:scale-105 backdrop-blur-xl`}
      >
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-xl shadow-lg flex-shrink-0">
          <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm uppercase font-bold tracking-wide mb-1 text-gray-700">
            Location
          </div>
          <div className="text-lg font-semibold text-gray-800">{location}</div>
        </div>
      </div>
    </div>
  );
}

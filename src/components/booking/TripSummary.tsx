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
  // Consistent color palette
  const summaryColors = useMemo(
    () => ({
      dates: "bg-[#fdffb6]", // pale yellow
      duration: "bg-[#caffbf]", // light green
      location: "bg-[#e0c6ff]", // soft lavender
      shadow: "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
      border: "border-black border-2",
    }),
    []
  );

  return (
    <div className="font-bold">
      <div className="space-y-4">
        <div
          className={`flex items-center gap-4 ${summaryColors.border} rounded-lg p-4 ${summaryColors.dates} ${summaryColors.shadow}`}
        >
          <div className="bg-white p-2.5 rounded-md border-2 border-black flex-shrink-0">
            <Calendar className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm uppercase font-black tracking-wide mb-1">
              Dates
            </div>
            <div className="text-lg font-bold">
              {startDate} - {endDate}
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 ${summaryColors.border} rounded-lg p-4 ${summaryColors.duration} ${summaryColors.shadow}`}
        >
          <div className="bg-white p-2.5 rounded-md border-2 border-black flex-shrink-0">
            <Clock className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm uppercase font-black tracking-wide mb-1">
              Duration
            </div>
            <div className="text-lg font-bold">{duration}</div>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 ${summaryColors.border} rounded-lg p-4 ${summaryColors.location} ${summaryColors.shadow}`}
        >
          <div className="bg-white p-2.5 rounded-md border-2 border-black flex-shrink-0">
            <MapPin className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm uppercase font-black tracking-wide mb-1">
              Location
            </div>
            <div className="text-lg font-bold">{location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

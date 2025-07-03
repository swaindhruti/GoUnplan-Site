import { Calendar, MapPin, Clock } from "lucide-react";

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
  location
}: TripSummaryProps) {
  return (
    <div className="font-bold">
      <div className="space-y-3">
        <div className="flex items-center gap-3 border-2 border-black rounded-lg p-3 bg-[#e6dad3] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-white p-1.5 rounded-md border-2 border-black flex-shrink-0">
            <Calendar className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs uppercase font-black tracking-wide">
              Dates
            </div>
            <div className="text-sm">
              {startDate} - {endDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-2 border-black rounded-lg p-3 bg-[#d7dbcb] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-white p-1.5 rounded-md border-2 border-black flex-shrink-0">
            <Clock className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs uppercase font-black tracking-wide">
              Duration
            </div>
            <div className="text-sm">{duration}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-2 border-black rounded-lg p-3 bg-[#d3dae6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-white p-1.5 rounded-md border-2 border-black flex-shrink-0">
            <MapPin className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs uppercase font-black tracking-wide">
              Location
            </div>
            <div className="text-sm">{location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

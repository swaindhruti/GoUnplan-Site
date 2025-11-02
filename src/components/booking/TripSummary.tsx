import { Calendar, MapPin, Clock } from 'lucide-react';

interface TripSummaryProps {
  startDate: string;
  endDate: string;
  duration: string;
  location: string;
}

export function TripSummary({ startDate, endDate, duration, location }: TripSummaryProps) {
  return (
    <div className="font-semibold space-y-4">
      <div className="flex items-center gap-4 border border-purple-100 rounded-xl p-4 bg-white shadow-sm">
        <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
          <Calendar className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm uppercase font-bold tracking-wide mb-1 text-gray-700">Dates</div>
          <div className="text-lg font-semibold text-gray-800">
            {startDate} - {endDate}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 border border-purple-100 rounded-xl p-4 bg-white shadow-sm">
        <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
          <Clock className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm uppercase font-bold tracking-wide mb-1 text-gray-700">
            Duration
          </div>
          <div className="text-lg font-semibold text-gray-800">{duration}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 border border-purple-100 rounded-xl p-4 bg-white shadow-sm">
        <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
          <MapPin className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
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

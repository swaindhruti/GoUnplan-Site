import Link from "next/link";
import { Map, Compass, Calendar, DollarSign, Languages } from "lucide-react";
import { Trip } from "@/types/trips";

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  // Pick a random background color from these options
  const bgColors = [
    "bg-yellow-300",
    "bg-pink-400",
    "bg-blue-400",
    "bg-green-500",
    "bg-orange-400",
  ];
  const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <div
      className={`
        border-3 border-black rounded-xl overflow-hidden
        bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] 
        transition-all duration-200
        hover:translate-y-1 hover:translate-x-1
        transform flex flex-col h-full
      `}
    >
      {/* Card Header with Map Icon */}
      <div
        className={`${randomBgColor} border-b-3 border-black h-48 flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="bg-white border-3 border-black rounded-xl p-3 rotate-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Map className="h-16 w-16 text-black" strokeWidth={2} />
        </div>
      </div>

      {/* Card Title */}
      <div className="p-5 border-b-3 border-black bg-white">
        <h3 className="text-2xl font-black text-black uppercase tracking-tight leading-tight">
          {trip.title}
        </h3>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4 flex-grow">
        <p className="text-black text-base font-bold line-clamp-2 border-b-2 border-dashed border-black pb-3">
          {trip.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-base font-bold">
            <div className="bg-pink-400 p-1.5 rounded-md border-2 border-black mr-3">
              <Compass className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            {trip.city}, {trip.state}, {trip.country}
          </div>

          <div className="flex items-center text-base font-bold">
            <div className="bg-green-400 p-1.5 rounded-md border-2 border-black mr-3">
              <Calendar className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            {trip.noOfDays} {trip.noOfDays === 1 ? "Day" : "Days"}
          </div>

          <div className="flex items-center text-base font-bold">
            <div className="bg-yellow-300 p-1.5 rounded-md border-2 border-black mr-3">
              <DollarSign className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black">
              ${trip.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-3">
          {trip.languages.length > 0 && (
            <div className="flex items-center bg-blue-300 px-3 py-1.5 border-2 border-black rounded text-sm font-black uppercase">
              <Languages className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
              {trip.languages.join(", ")}
            </div>
          )}

          {trip.vibes.map((vibe) => (
            <span
              key={vibe}
              className="bg-orange-300 text-black px-3 py-1.5 border-2 border-black rounded text-sm font-black uppercase"
            >
              {vibe}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer - Always at bottom */}
      <div className="p-5 mt-auto">
        <Link href={`/trips/${trip.travelPlanId}`} className="block">
          <button
            className="
              w-full bg-purple-600 text-white font-black uppercase tracking-wider
              border-3 border-black rounded-lg py-4 px-4
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-200
              text-lg
            "
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

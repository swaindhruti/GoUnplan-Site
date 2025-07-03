import Link from "next/link";
import { Map, Compass, Calendar, DollarSign, Languages } from "lucide-react";
import { Trip } from "@/types/trips";

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  // Enhanced with vibrant multi-color variations
  const bgColors = [
    "bg-[#e0c6ff]", // soft lavender
    "bg-[#ffd6ff]", // pink lavender
    "bg-[#9bf6ff]", // cyan blue
    "bg-[#ffadad]", // light coral
    "bg-[#caffbf]", // light green
    "bg-[#fdffb6]", // pale yellow
    "bg-[#ffc6ff]", // pale magenta
    "bg-[#a0c4ff]", // baby blue
    "bg-[#bdb2ff]", // periwinkle
    "bg-[#fffffc]", // ivory
  ];
  const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  // Icon container colors
  const iconColors = [
    { bg: "bg-[#ffc8dd]", text: "text-black" }, // pink
    { bg: "bg-[#caffbf]", text: "text-black" }, // green
    { bg: "bg-[#a0c4ff]", text: "text-black" }, // blue
    { bg: "bg-[#fdffb6]", text: "text-black" }, // yellow/orange
    { bg: "bg-[#e0c6ff]", text: "text-black" }, // purple
  ];

  const compassColor = iconColors[0];
  const calendarColor = iconColors[1];
  const dollarColor = iconColors[2];

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
        <h3 className="text-3xl font-black text-black uppercase tracking-tight leading-tight">
          {trip.title}
        </h3>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4 flex-grow">
        <p className="text-black text-lg font-bold line-clamp-2 border-b-2 border-dashed border-black pb-3">
          {trip.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-lg font-bold text-black">
            <div
              className={`${compassColor.bg} p-2 rounded-md border-2 border-black mr-3`}
            >
              <Compass
                className={`h-6 w-6 ${compassColor.text}`}
                strokeWidth={2.5}
              />
            </div>
            {trip.city}, {trip.state}, {trip.country}
          </div>

          <div className="flex items-center text-lg font-bold text-black">
            <div
              className={`${calendarColor.bg} p-2 rounded-md border-2 border-black mr-3`}
            >
              <Calendar
                className={`h-6 w-6 ${calendarColor.text}`}
                strokeWidth={2.5}
              />
            </div>
            {trip.noOfDays} {trip.noOfDays === 1 ? "Day" : "Days"}
          </div>

          <div className="flex items-center text-lg font-bold text-black">
            <div
              className={`${dollarColor.bg} p-2 rounded-md border-2 border-black mr-3`}
            >
              <DollarSign
                className={`h-6 w-6 ${dollarColor.text}`}
                strokeWidth={2.5}
              />
            </div>
            <span className="text-2xl font-black text-black">
              ${trip.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-3">
          {trip.languages.length > 0 && (
            <div className="flex items-center bg-[#a0c4ff] px-3 py-2 border-2 border-black rounded text-base font-black uppercase text-black">
              <Languages
                className="h-5 w-5 mr-1.5 text-black"
                strokeWidth={2.5}
              />
              {trip.languages.join(", ")}
            </div>
          )}

          {trip.vibes.map((vibe, index) => {
            // Rotate through different tag colors
            const tagColors = [
              "bg-[#caffbf]",
              "bg-[#ffadad]",
              "bg-[#fdffb6]",
              "bg-[#ffc6ff]",
              "bg-[#bdb2ff]",
            ];
            const tagColor = tagColors[index % tagColors.length];

            return (
              <span
                key={vibe}
                className={`${tagColor} text-black px-3 py-2 border-2 border-black rounded text-base font-black uppercase`}
              >
                {vibe}
              </span>
            );
          })}
        </div>
      </div>

      {/* Card Footer - Always at bottom */}
      <div className="p-5 mt-auto">
        <Link href={`/trips/${trip.travelPlanId}`} className="block">
          <button
            className="
              w-full bg-black text-white font-black uppercase tracking-wider
              border-3 border-black rounded-lg py-4 px-4
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-200
              text-xl
            "
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

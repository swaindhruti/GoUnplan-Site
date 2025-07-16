import Link from "next/link";
import { Compass, Calendar, Languages, ArrowRight } from "lucide-react";
import { Trip } from "@/types/trips";
import Image from "next/image";

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TripCard = ({
  trip,
  onClick,
  isSelected = false,
}: TripCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer ${
        isSelected ? "ring-4 ring-purple-400 ring-opacity-50 scale-105" : ""
      }`}
      onClick={onClick}
    >
      {/* Card Header with Background Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Premium overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-playfair font-bold text-gray-800 leading-tight group-hover:text-purple-600 transition-colors duration-300 flex-1 pr-4">
            {trip.title}
          </h3>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-4 py-2 shadow-xl shadow-purple-500/25 flex-shrink-0">
            <span className="text-white font-bold text-lg">
              ${trip.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-2">
          {trip.description}
        </p>

        {/* Trip Details */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-2 rounded-xl shadow-sm">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-700 font-medium">
              {trip.noOfDays} {trip.noOfDays === 1 ? "Day" : "Days"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-2 rounded-xl shadow-sm">
              <Compass className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-gray-700 font-medium">
              {trip.city}, {trip.state}, {trip.country}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {trip.languages.length > 0 && (
            <div className="flex items-center bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1.5 rounded-full shadow-sm">
              <Languages className="w-4 h-4 mr-1.5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {trip.languages.join(", ")}
              </span>
            </div>
          )}

          {trip.vibes.slice(0, 2).map((vibe, index) => {
            const tagColors = [
              "bg-gradient-to-r from-green-100 to-green-200 text-green-700",
              "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700",
              "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700",
              "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700",
              "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700",
            ];
            const tagColor = tagColors[index % tagColors.length];

            return (
              <span
                key={vibe}
                className={`${tagColor} px-3 py-1.5 rounded-full text-sm font-medium shadow-sm`}
              >
                {vibe}
              </span>
            );
          })}

          {trip.vibes.length > 2 && (
            <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
              +{trip.vibes.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0">
        <Link href={`/trips/${trip.travelPlanId}`} className="block">
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center gap-2 group/btn">
            <span>View Details</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </Link>
      </div>

      {/* Premium Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

      {/* Premium border glow effect */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-purple-300/30 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

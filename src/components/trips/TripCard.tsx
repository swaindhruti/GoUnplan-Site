import Link from "next/link";
import { Compass, Calendar, Languages, ArrowRight, Users, Star } from "lucide-react";
import { Trip } from "@/types/trips";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TripCard = ({
  trip,
  onClick,
  isSelected = false
}: TripCardProps) => {
  return (
    <div
      className={`group w-full relative rounded-xl bg-white border border-gray-200 shadow-sm transition-transform h-auto duration-300 ease-in-out cursor-pointer flex flex-col`}
      onClick={onClick}
    >
      <div className="relative h-72 rounded-t-xl overflow-hidden flex-shrink-0">
        <Image
          src={trip.tripImage || ""}
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isSelected && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white rounded-full p-1 shadow-md">
            <svg
              className="w-4 h-4"
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
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bricolage font-semibold text-gray-800 leading-snug pr-2 line-clamp-2">
              {trip.title}
            </h3>
            <Badge className="text-sm font-semibold px-3 py-1 bg-purple-100 text-purple-700 rounded-md whitespace-nowrap">
              ${trip.price.toLocaleString()}
            </Badge>
          </div>

          <p className="text-sm font-roboto text-gray-600 line-clamp-2">
            {trip.description}
          </p>

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(trip.averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {trip.averageRating > 0 
                ? trip.averageRating.toFixed(1) 
                : "0.0"
              } ({trip.reviewCount} {trip.reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>
                {trip.noOfDays} {trip.noOfDays === 1 ? "Day" : "Days"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-500" />
              <span className="truncate">
                {trip.city}, {trip.state}, {trip.country}
              </span>
            </div>
            {trip.maxParticipants && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm">{trip.seatsLeft} Seats Left</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {trip.languages.length > 0 && (
              <div className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                <Languages className="w-3 h-3 mr-1 text-purple-500" />
                {trip.languages.join(", ")}
              </div>
            )}
            {trip.vibes.slice(0, 2).map((vibe) => (
              <span
                key={vibe}
                className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full"
              >
                {vibe}
              </span>
            ))}
            {trip.vibes.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{trip.vibes.length - 2} more
              </span>
            )}
          </div>
          <Link href={`/trips/${trip.travelPlanId}`}>
            <button className="w-full text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors">
              View Details <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

import Link from 'next/link';
import {
  Compass,
  Calendar,
  Languages,
  ArrowRight,
  Users,
  Star,
  CalendarDays,
  UserCheck,
} from 'lucide-react';
import { Trip } from '@/types/trips';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  isSelected?: boolean;
  isTripPage?: boolean;
}

export const TripCard = ({
  trip,
  onClick,
  isSelected = false,
  isTripPage = true,
}: TripCardProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate end date from start date + number of days
  const calculateEndDate = (startDate: string, noOfDays: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + noOfDays - 1); // Subtract 1 because if it's a 3-day trip starting Monday, it ends Wednesday
    return end.toISOString();
  };

  // Get formatted dates
  const startDate = trip.startDate ? formatDate(trip.startDate) : null;
  const endDate = trip.startDate
    ? formatDate(calculateEndDate(trip.startDate, trip.noOfDays))
    : null;

  // Format gender preference for display
  const formatGenderPreference = (preference?: string) => {
    if (!preference) return null;
    const displayMap: Record<string, string> = {
      MALE: 'Male Only',
      FEMALE: 'Female Only',
      MIX: 'Mixed',
      OTHER: 'Other',
    };
    return displayMap[preference] || preference;
  };

  // Get color for gender preference badge
  const getGenderPreferenceColor = (preference?: string) => {
    const colorMap: Record<string, string> = {
      MALE: 'bg-blue-50 text-blue-700 border-blue-200',
      FEMALE: 'bg-pink-50 text-pink-700 border-pink-200',
      MIX: 'bg-purple-50 text-purple-700 border-purple-200',
      OTHER: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return preference ? colorMap[preference] || colorMap['OTHER'] : colorMap['OTHER'];
  };

  return (
    <div
      className={`group w-full relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all h-auto duration-300 ease-in-out cursor-pointer flex flex-col`}
      onClick={onClick}
    >
      <div
        className={`relative ${
          isTripPage ? 'h-72' : 'h-40'
        } rounded-t-2xl overflow-hidden flex-shrink-0`}
      >
        <Image
          src={
            trip.tripImage ||
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          }
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isSelected && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white rounded-full p-1 shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Date Badge Overlay */}
        {startDate && (
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
              {startDate} - {endDate}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between p-4 flex-grow">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bricolage font-bold text-gray-900 leading-snug pr-2 line-clamp-2">
              {trip.title}
            </h3>
            <Badge className="text-sm font-semibold px-3 py-1 bg-purple-100 text-purple-700 rounded-md whitespace-nowrap">
              ₹{trip.price.toLocaleString()}
            </Badge>
          </div>

          <p className="text-sm font-instrument text-gray-600 line-clamp-2">{trip.description}</p>

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(trip.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-instrument font-medium">
              {trip.averageRating > 0 ? trip.averageRating.toFixed(1) : '0.0'} ({trip.reviewCount}{' '}
              {trip.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {isTripPage ? (
          <div className="space-y-3 mt-4">
            <div className="flex flex-col gap-1 text-sm text-gray-700 font-instrument">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>
                  {trip.noOfDays} {trip.noOfDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <span className="truncate">{trip.country}</span>
              </div>

              {trip.maxParticipants && (
                <div className="flex items-center gap-2">
                  <Users
                    className={`w-4 h-4 ${trip.seatsLeft && trip.seatsLeft <= 0 ? 'text-red-600' : trip.seatsLeft && trip.seatsLeft <= 5 ? 'text-orange-600' : 'text-purple-600'}`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      trip.seatsLeft && trip.seatsLeft <= 0
                        ? 'text-red-600'
                        : trip.seatsLeft && trip.seatsLeft <= 5
                          ? 'text-orange-600'
                          : 'text-purple-600'
                    }`}
                  >
                    {trip.seatsLeft && trip?.seatsLeft <= 0
                      ? 'Fully Occupied'
                      : trip.seatsLeft && trip.seatsLeft <= 5
                        ? `Only ${trip.seatsLeft} Seats Left!`
                        : `${trip.seatsLeft} Seats Available`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {trip.languages.length > 0 && (
                <div className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  <Languages className="w-3 h-3 mr-1 text-purple-600" />
                  {trip.languages.join(', ')}
                </div>
              )}
              {trip.genderPreference && (
                <div
                  className={`flex items-center px-2 py-1 rounded-full border ${getGenderPreferenceColor(trip.genderPreference)}`}
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  {formatGenderPreference(trip.genderPreference)}
                </div>
              )}
              {trip.vibes.slice(0, 2).map(vibe => (
                <span key={vibe} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
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
              <button className="w-full text-sm font-instrument font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors duration-200">
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {startDate && endDate && (
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-1">
                <CalendarDays className="w-3 h-3" />
                <span>
                  {startDate} - {endDate}
                </span>
              </div>
            )}

            <Link href={`/trips/${trip.travelPlanId}`}>
              <button className="w-full text-sm font-instrument font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors duration-200">
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

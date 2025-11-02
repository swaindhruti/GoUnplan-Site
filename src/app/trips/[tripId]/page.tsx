import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTripById } from '@/actions/trips/getTripByIdForTripDetail';
import { Calendar, Users, Star, MessageCircle, Map, ArrowRightCircle, Dot } from 'lucide-react';
import { ChatButton } from '@/components/chat/ChatButton';
import { requireUser } from '@/lib/roleGaurd';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';
import TripItinerary from '@/components/trips/Itenary';
import React from 'react';
import { MapWrapper } from '@/components/trips/MapWrapper';

type Props = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripDetailsPage({ params }: Props) {
  const tripId = (await params).tripId;
  const trip = await getTripById(tripId);
  const UserSession = await requireUser();
  const bookingId = uuidv4();

  if (!trip || 'error' in trip) return notFound();

  const createdYear = new Date(trip.createdAt).getFullYear();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })
      .toUpperCase();
  };

  const highlights = (() => {
    const result: string[][] = [];

    const tripHighlights: string[] = trip.includedActivities?.length
      ? trip.includedActivities.slice(0, 2)
      : [
          `${trip.noOfDays} days of adventure`,
          `Explore ${trip.city}, ${trip.state}`,
          `Professional guidance included`,
        ];

    result.push(tripHighlights);

    return result;
  })();

  const restrictions = (() => {
    const result: string[][] = [];

    const tripRestrictions: string[] = trip.restrictions?.length
      ? trip.restrictions.slice(0, 3)
      : ['No pets allowed', 'Suitable for ages 12+', 'Not wheelchair accessible'];

    result.push(tripRestrictions);

    return result;
  })();

  const specials = (() => {
    const result: string[][] = [];

    const tripSpecials: string[] = trip.special?.length
      ? trip.special.slice(0, 3)
      : [
          'Exclusive local experiences',
          'Personalized guided tours',
          'Scenic hidden spots included',
        ];

    result.push(tripSpecials);

    return result;
  })();

  /*   const calculateDate = (dayNumber: number, baseStartDate?: Date | null) => {
    if (!baseStartDate) return null;

    const date = new Date(baseStartDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date;
  };
 */
  /*   const mapItinerary = trip.dayWiseItinerary.map((day) => {
    const currentDate = calculateDate(day.dayNumber, trip.startDate);
    const odishaCoordinates = [
      { lat: 20.296059, lng: 85.824539 },
      { lat: 19.817743, lng: 85.828629 },
      { lat: 22.125401, lng: 84.045067 },
      { lat: 20.462519, lng: 85.882989 },
      { lat: 22.249377, lng: 84.882798 }
    ];
    return {
      latitude:
        odishaCoordinates[(day.dayNumber - 1) % odishaCoordinates.length].lat,
      longitude:
        odishaCoordinates[(day.dayNumber - 1) % odishaCoordinates.length].lng,
      destination: "delhi",
      date: formatDate(currentDate?.toString() || "").toString() || ""
    };
  }); */
  const hostInfo = {
    name: trip.host.user.name,
    image: trip.host.image || 'https://via.placeholder.com/60',
    email: trip.host.hostEmail,
    description: trip.host.description,
    createdYear,
  };

  const tripStats = {
    price: trip.price,
    noOfDays: trip.noOfDays,
    maxParticipants: trip.maxParticipants,
    languages: trip.languages.join(', '),
  };

  const sections = [
    {
      title: "What's Special",
      items: specials,
      icon: '★',
      iconColor: 'text-yellow-400',
    },
    {
      title: "What's Included",
      items: highlights,
      icon: '✓',
      iconColor: 'text-green-400',
    },
    {
      title: "What's Not Included",
      items: restrictions,
      icon: '✗',
      iconColor: 'text-red-400',
    },
  ];

  const bookedSeats = trip.bookings.reduce((sum, b) => sum + b.participants, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={trip.tripImage || ''}
            alt="Trip Background"
            fill
            className="object-cover opacity-40 blur-sm scale-110"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative bg-transparent z-10 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="relative w-full bg-transparent  max-w-6xl h-[100vh]">
            <Image
              src={trip.tripImage || ''}
              alt="Trip Experience"
              fill
              className="object-contain rounded-xl shadow-2xl bg-transparent"
              priority
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 lg:w-2/3 space-y-8 lg:space-y-12">
            {/* Host Information Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4">
                <Image
                  src={trip.host.image || 'https://via.placeholder.com/48'}
                  alt="Host"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full ring-2 ring-purple-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-lg sm:text-xl text-gray-900 mb-1">
                    Hosted by {trip.host.user.name}
                  </p>

                  {/* Languages Display */}
                  {trip.host.languages && trip.host.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                      <span className="text-sm text-gray-600 mr-1 font-medium">Speaks:</span>
                      {trip.host.languages.slice(0, 3).map(language => (
                        <span
                          key={language}
                          className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                        >
                          {language}
                        </span>
                      ))}
                      {trip.host.languages.length > 3 && (
                        <span className="text-xs text-gray-500 py-1">
                          +{trip.host.languages.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Ask a Question Button */}
                  {UserSession.user?.id && (
                    <div className="mt-4">
                      <ChatButton
                        currentUserId={UserSession.user.id}
                        hostId={trip.host.user.id}
                        travelPlanId={trip.travelPlanId}
                        hostName={trip.host.user.name}
                        isTripSide={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm sm:text-base text-gray-700">
              <div className="flex items-center gap-2">
                <span>⏳</span>
                <span className="truncate">{tripStats.noOfDays} days</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span className="truncate">{trip.country}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>👥</span>
                <span className="truncate">{tripStats.maxParticipants} Mates</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>🚩</span>
              <span className="truncate">
                {trip.stops.map((items, index) => (
                  <div key={index}>{items}</div>
                ))}
              </span>
            </div>

            <div className="space-y-6">
              {sections.map((section, sectionIdx) => (
                <div
                  key={sectionIdx}
                  className="border border-gray-200 bg-purple-50/70 rounded-lg p-4 sm:p-6"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 font-bricolage">
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.flat().map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-3">
                        <span
                          className={`${section.iconColor} text-sm font-medium mt-0.5 flex-shrink-0`}
                        >
                          {section.icon}
                        </span>
                        <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {trip.description}
              </p>
            </div>

            <MapWrapper stops={trip.stops} startDate={trip.startDate!} />

            <TripItinerary
              itinerary={trip.dayWiseItinerary.map(day => ({
                ...day,
                startDate: trip.startDate ?? null,
                accommodation: day.accommodation ?? undefined,
              }))}
            />
          </div>

          {/* Booking Card - Right Side on Desktop, Below Content on Mobile */}
          <div className="lg:w-1/3 ">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-2 overflow-hidden">
              {/* Date Range */}
              <div className="text-sm sm:text-base font-medium p-3 bg-black/5 rounded-xl mb-4 sm:mb-6 text-center">
                {formatDate(trip.startDate?.toString() || '')} →{' '}
                {formatDate(trip.endDate?.toString() || '')}
              </div>

              {/* Guided Trip Indicator */}
              <div className="flex gap-2 items-center mb-4 sm:mb-6">
                <Map className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <div className="text-gray-600 text-sm sm:text-base">Guided trip</div>
              </div>

              {/* Price Section */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <div className="text-lg sm:text-xl font-bold">TOTAL PRICE</div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Includes all taxes and fees
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 font-bricolage">
                    ₹{tripStats.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Reserve Button */}
              <Link
                href={`/trips/booking/${trip.travelPlanId}/${bookingId}`}
                className="block mb-4 sm:mb-6"
              >
                <button className="w-full bg-purple-600 flex items-center justify-center gap-2 hover:bg-purple-700 text-white font-semibold py-4 sm:py-6 lg:py-7 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] text-sm sm:text-base lg:text-lg">
                  Reserve a Spot
                  <ArrowRightCircle className="w-5 h-5 sm:w-6  lg:w-7 lg:h-7" />
                </button>
              </Link>

              {/* Seats Left */}
              <div className="py-4 sm:py-5 rounded-xl bg-green-50/75 flex items-center justify-center mb-4 sm:mb-6">
                <Dot className="w-8 h-8 sm:w-10 sm:h-10 text-green-700 animate-pulse -mr-2" />
                <div className="text-green-700 font-semibold text-sm sm:text-base lg:text-lg">
                  {tripStats.maxParticipants - bookedSeats} seats left
                </div>
              </div>

              <Separator className="mb-4 sm:mb-6" />

              {/* Trip Details */}
              <div className="space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-gray-100 border border-gray-200 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {tripStats.noOfDays} days
                  </span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-gray-100 border border-gray-200 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    Up to {tripStats.maxParticipants} people
                  </span>
                </div>
              </div>

              {/* About Your Host Section - Moved here from bottom */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                    About Your Host
                  </h4>
                </div>

                {/* Host Profile - Compact Version */}
                <div className="flex gap-3 items-start mb-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-purple-200 flex-shrink-0">
                    <AvatarImage src={hostInfo.image} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-bold">
                      {hostInfo.name?.charAt(0).toUpperCase() ?? 'H'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {hostInfo.name}
                    </p>

                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.round(trip.host.averageRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {trip.host.averageRating > 0
                          ? trip.host.averageRating.toFixed(1)
                          : 'No ratings'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">Host since {hostInfo.createdYear}</p>
                  </div>
                </div>

                {/* Host Description - Truncated */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {hostInfo.description}
                  </p>
                </div>

                {/* View Profile Button */}
                <Link href={`/host/${trip.host.hostId}`}>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                    View Host Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripById } from "@/actions/trips/getTripByIdForTripDetail";
import {
  Calendar,
  Users,
  Star,
  MessageCircle,
  Map,
  ArrowRightCircle,
  Dot,
  MapPin,
  Flag,
} from "lucide-react";
import { ChatButton } from "@/components/chat/ChatButton";
import { requireUser } from "@/lib/roleGaurd";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from "uuid";
import TripItinerary from "@/components/trips/Itenary";
import React from "react";
import { MapWrapper } from "@/components/trips/MapWrapper";

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

  if (!trip || "error" in trip) return notFound();

  const createdYear = new Date(trip.createdAt).getFullYear();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
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
      : [
          "No pets allowed",
          "Suitable for ages 12+",
          "Not wheelchair accessible",
        ];
    result.push(tripRestrictions);
    return result;
  })();

  const specials = (() => {
    const result: string[][] = [];
    const tripSpecials: string[] = trip.special?.length
      ? trip.special.slice(0, 3)
      : [
          "Exclusive local experiences",
          "Personalized guided tours",
          "Scenic hidden spots included",
        ];
    result.push(tripSpecials);
    return result;
  })();

  const hostInfo = {
    name: trip.host.user.name,
    image: trip.host.image || "https://via.placeholder.com/60",
    email: trip.host.hostEmail,
    description: trip.host.description,
    createdYear,
  };

  const tripStats = {
    price: trip.price,
    noOfDays: trip.noOfDays,
    maxParticipants: trip.maxParticipants,
    languages: trip.languages.join(", "),
  };

  const sections = [
    {
      title: "What's Special",
      items: specials,
      icon: "★",
      iconColor: "text-yellow-400",
    },
    {
      title: "What's Included",
      items: highlights,
      icon: "✓",
      iconColor: "text-green-400",
    },
    {
      title: "What's Not Included",
      items: restrictions,
      icon: "✗",
      iconColor: "text-red-400",
    },
  ];

  const bookedSeats = trip.bookings.reduce((sum, b) => sum + b.participants, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      {/* Background Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={trip.tripImage || ""}
            alt="Trip Background"
            fill
            className="object-cover opacity-40 blur-sm scale-110"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative bg-transparent z-10 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="relative w-full bg-transparent max-w-6xl h-[100vh]">
            <Image
              src={trip.tripImage || ""}
              alt="Trip Experience"
              fill
              className="object-contain rounded-xl shadow-2xl bg-transparent"
              priority
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6 text-left">
        {trip.title}
      </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 lg:w-2/3 space-y-8 lg:space-y-12">
            <div className="flex flex-wrap gap-2 mt-2">
              {trip.filters.map((filter, index) => (
                <span
                  key={index}
                  className="text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 backdrop-blur-sm hover:bg-purple-100 hover:scale-[1.03] transition-all duration-300 shadow-sm"
                >
                  {filter}
                </span>
              ))}
            </div>

            {/* Trip Stats */}
       <div className="flex flex-wrap  gap-3 mb-6 -mt-6">
        <span className="flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm">
          <Calendar size={16} className="text-purple-600" /> {trip.noOfDays}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm">
          <MapPin size={16} className="text-purple-600" /> {trip.destination}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm">
          <Users size={16} className="text-purple-600" /> {trip.maxParticipants} Mates
        </span>
      </div>

             <div className="space-y-2 text-gray-800">
        {trip.stops.map((place, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm font-medium bg-purple-50 px-3 py-2 rounded-xl border border-purple-100"
          >
            <Flag size={16} className="text-purple-600 mt-0.5" />
            <span>{place}</span>
          </div>
        ))}
      </div>

            {/* Sections */}
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
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {item}
                        </span>
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
              itinerary={trip.dayWiseItinerary.map((day) => ({
                ...day,
                startDate: trip.startDate ?? null,
                accommodation: day.accommodation ?? undefined,
              }))}
            />
          </div>

          {/* Right Booking Card */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-2 overflow-hidden">
              {/* Date Range */}
              <div className="text-sm sm:text-base font-medium p-3 bg-black/5 rounded-xl mb-4 sm:mb-6 text-center">
                {formatDate(trip.startDate?.toString() || "")} →{" "}
                {formatDate(trip.endDate?.toString() || "")}
              </div>

              {/* Guided Trip */}
              <div className="flex gap-2 items-center mb-4 sm:mb-6">
                <Map className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <div className="text-gray-600 text-sm sm:text-base">
                  Guided trip
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <div className="text-lg sm:text-xl font-bold">
                      TOTAL PRICE
                    </div>
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
                  <ArrowRightCircle className="w-5 h-5 sm:w-6 lg:w-7 lg:h-7" />
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

              {/* Host Section */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                    About Your Host
                  </h4>
                </div>

                <div className="flex gap-3 items-start mb-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-purple-200 flex-shrink-0">
                    <AvatarImage src={hostInfo.image} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-bold">
                      {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
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
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {trip.host.averageRating > 0
                          ? trip.host.averageRating.toFixed(1)
                          : "No ratings"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Host since {hostInfo.createdYear}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {hostInfo.description}
                  </p>
                </div>

                <Link href={`/host/${trip.host.hostId}`}>
                  <button className="w-full mb-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                    View Host Profile
                  </button>
                </Link>

                {UserSession.user?.id && (
                  <ChatButton
                    currentUserId={UserSession.user.id}
                    hostId={trip.host.user.id}
                    travelPlanId={trip.travelPlanId}
                    hostName={trip.host.user.name}
                    isTripSide={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
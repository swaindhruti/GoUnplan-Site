import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripById } from "@/actions/trips/getTripByIdForTripDetail";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  MessageCircle,
  Languages
} from "lucide-react";
import { ChatButton } from "@/components/chat/ChatButton";
import { requireUser } from "@/lib/roleGaurd";
import TripItinerary from "@/components/trips/Itenary";
import Image from "next/image";

type Props = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripDetailsPage({ params }: Props) {
  const tripId = (await params).tripId;
  const trip = await getTripById(tripId);
  const UserSession = await requireUser();

  if (!trip || "error" in trip) return notFound();

  const createdYear = new Date(trip.createdAt).getFullYear();

  const highlights = (() => {
    const result: string[][] = [];

    const tripHighlights: string[] = trip.includedActivities?.length
      ? trip.includedActivities.slice(0, 2)
      : [
          `${trip.noOfDays} days of adventure`,
          `Explore ${trip.city}, ${trip.state}`,
          `Professional guidance included`
        ];

    result.push(tripHighlights);

    result.push([
      `Discover ${trip.country}'s hidden gems`,
      `Experience local culture and traditions`,
      `Comfortable accommodation throughout`
    ]);

    return result;
  })();

  const hostInfo = {
    name: trip.host.user.name,
    image: trip.host.image || "https://via.placeholder.com/60",
    email: trip.host.hostEmail,
    description: trip.host.description,
    createdYear
  };

  const tripStats = {
    price: trip.price,
    noOfDays: trip.noOfDays,
    maxParticipants: trip.maxParticipants,
    languages: trip.languages.join(", ")
  };

  return (
    <div className="min-h-screen bg-gray-50  font-instrument">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
        <Image
          src={trip.tripImage || ""}
          alt="True Italy Experience"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div>
          <h1 className="text-3xl font-bricolage sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {trip.title}
          </h1>
          <div className="flex items-center">
            <Image
              src={trip.host.image || "https://via.placeholder.com/48"}
              alt="Host"
              width={48}
              height={48}
              className="rounded-full mr-3"
            />
            <div>
              <p className="font-semibold font-instrument text-gray-800">
                Hosted by {trip.host.user.name}
              </p>

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

        {/* Trip Info */}
        <div className="flex flex-wrap gap-6  font-instrument text-gray-700">
          <div className="flex items-center gap-2">
            <span>⏳</span> {tripStats.noOfDays} days
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span> {trip.city}, {trip.country}
          </div>
          <div className="flex items-center gap-2">
            <span>🚩</span> {trip.dayWiseItinerary.length} stops
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span> {tripStats.maxParticipants} Mates
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-purple-600 text-white rounded-lg p-6">
          <div className="grid font-instrument grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.flat().map((item, idx) => (
              <div key={idx}>⚡ {item}</div>
            ))}
          </div>
        </div>

        <p className="text-lg text-gray-700  font-instrument leading-relaxed">
          {trip.description}
        </p>

        <TripItinerary
          itinerary={trip.dayWiseItinerary.map((day) => ({
            ...day,
            accommodation: day.accommodation ?? undefined
          }))}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white shadow-sm">
                <DollarSign className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
                  ₹{tripStats.price.toLocaleString()}
                </p>
                <span className="text-lg text-gray-600">per person</span>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 border border-gray-200 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-medium">
                  {tripStats.noOfDays} days
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gray-100 border border-gray-200 p-3 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-medium">
                  Up to {tripStats.maxParticipants} people
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gray-100 border border-gray-200 p-3 rounded-lg">
                  <Languages className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-medium">
                  {tripStats.languages}
                </span>
              </div>
            </div>

            <Link href={`/trips/booking/${trip.travelPlanId}`}>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] text-lg mb-4">
                Book Now
              </button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-gray-200 pb-6 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white shadow-sm">
                <MessageCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
                About Your Host
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-8">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-3 border-purple-200 shadow-sm">
                <AvatarImage src={hostInfo.image} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xl font-bold">
                  {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 font-serif mb-2">
                  {hostInfo.name}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(trip.host.averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {trip.host.averageRating > 0
                      ? trip.host.averageRating.toFixed(1)
                      : "No ratings"}{" "}
                    ({trip.host.reviewCount}{" "}
                    {trip.host.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Host since {hostInfo.createdYear}
                </p>
                <p className="text-sm text-gray-600 break-all">
                  {hostInfo.email}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <p className="text-gray-800 leading-relaxed">
                {hostInfo.description}
              </p>
            </div>

            <Link href={`/host/${trip.host.hostId}`}>
              <button className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

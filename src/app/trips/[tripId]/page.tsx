import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripById } from "@/actions/trips/getTripByIdForTripDetail";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  MessageCircle,
  Languages,
  ArrowLeft,
} from "lucide-react";
import { ChatButton } from "@/components/chat/ChatButton";
import { requireUser } from "@/lib/roleGaurd";

type Props = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function MountainBikingAdventure({ params }: Props) {
  const tripId = (await params).tripId;
  const trip = await getTripById(tripId);
  const UserSession = await requireUser();
  if (!trip || "error" in trip) return notFound();

  const createdYear = new Date(trip.createdAt).getFullYear();

  const heroTags = [
    "Available year-round",
    `${trip.noOfDays} days`,
    `Max ${trip.maxParticipants} people`,
    `₹${trip.price} per person`,
  ];

  const highlights = [
    [
      "Conquer challenging alpine single-track trails",
      "Experience breathtaking mountain panoramas",
      "High-quality mountain bike rentals included",
    ],
    [
      "Ride through picturesque Swiss villages",
      "Professional guides with local knowledge",
      "Authentic alpine accommodation",
    ],
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-20 overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.3),transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Trips</span>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-playfair md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              {trip.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-lg font-medium">
              {trip.destination}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {heroTags.map((tag, i) => (
                <span
                  key={i}
                  className={`backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl px-6 py-3 text-white font-semibold shadow-xl transition-all duration-300 hover:bg-white/30 hover:scale-105 ${
                    tag.includes("₹")
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50"
                      : ""
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Highlights Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-playfair md:text-4xl font-bold text-gray-800">
              Trip Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {highlights.map((group, idx) => (
              <div
                key={idx}
                className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
              >
                <ul className="space-y-6">
                  {group.map((point, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-8 w-8 flex items-center justify-center rounded-full flex-shrink-0 mt-1 shadow-lg">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium text-lg leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs Section */}
        <div className="mb-16">
          <Tabs
            defaultValue="itinerary"
            className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl overflow-hidden shadow-2xl"
          >
            <TabsList className="w-full grid grid-cols-3 bg-white/90 backdrop-blur-xl border-b border-white/60 p-0 h-auto rounded-none">
              <TabsTrigger
                value="itinerary"
                className="py-6 font-semibold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger
                value="included"
                className="py-6 font-semibold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
              >
                What&apos;s Included
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="py-6 font-semibold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="p-0 m-0">
              {trip.dayWiseItinerary.map((day, index) => (
                <div
                  key={index}
                  className={`p-10 ${
                    index !== trip.dayWiseItinerary.length - 1
                      ? "border-b border-white/60"
                      : ""
                  }`}
                >
                  <div className="flex gap-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 h-min rounded-2xl shadow-xl">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl mb-4 text-gray-800">
                        Day {day.dayNumber}: {day.title}
                      </h3>
                      <p className="mb-6 text-gray-600 text-lg leading-relaxed">
                        {day.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-2xl p-4">
                          <strong className="text-gray-800 font-semibold">
                            Meals:
                          </strong>{" "}
                          <span className="text-gray-600">{day.meals}</span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-2xl p-4">
                          <strong className="text-gray-800 font-semibold">
                            Stay:
                          </strong>{" "}
                          <span className="text-gray-600">
                            {day.accommodation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="included" className="p-10 m-0">
              <div className="backdrop-blur-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 shadow-xl">
                <h3 className="font-bold text-2xl mb-6 text-gray-800">
                  Included in the price:
                </h3>
                <ul className="space-y-4">
                  {[
                    "All meals during the trip",
                    "Comfortable lodging for all nights",
                    "Professional guide fees",
                    "Equipment rentals",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-7 w-7 flex items-center justify-center rounded-full shadow-lg">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium text-lg">
                        {item}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 h-7 w-7 flex items-center justify-center rounded-full shadow-lg">
                      <span className="text-white font-bold text-sm">✗</span>
                    </div>
                    <span className="text-gray-700 font-medium text-lg">
                      Flights not included
                    </span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-10 m-0">
              <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl shadow-lg">
                    <Star className="h-8 w-8 text-white fill-white" />
                  </div>
                  <div>
                    <span className="text-4xl font-bold text-gray-800">
                      4.9
                    </span>
                    <span className="text-gray-600 font-medium text-lg ml-2">
                      (124 verified reviews)
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 font-medium text-xl italic">
                  &quot;The best biking trip of my life! Incredible views and
                  amazing guides!&quot;
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Cards */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Booking Card */}
          <div className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-800">
                  ₹{tripStats.price}
                </p>
                <span className="text-lg font-medium text-gray-600">
                  per person
                </span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl shadow-sm">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-700 text-lg">
                  {tripStats.noOfDays} days
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl shadow-sm">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 text-lg">
                  Up to {tripStats.maxParticipants} people
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-3 rounded-xl shadow-sm">
                  <Languages className="h-6 w-6 text-orange-600" />
                </div>
                <span className="font-medium text-gray-700 text-lg">
                  {tripStats.languages}
                </span>
              </div>
            </div>

            <Link href={`/trips/booking/${trip.travelPlanId}`}>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 text-xl mb-4">
                Book Now
              </button>
            </Link>
            {UserSession.user && UserSession.user.id && (
              <ChatButton
                currentUserId={UserSession.user.id}
                hostId={trip.host.user.id}
                travelPlanId={trip.travelPlanId}
                hostName={trip.host.user.name}
              />
            )}
          </div>

          {/* Host Card */}
          <div className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-5 border-b border-white/60 pb-6 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                About Your Host
              </h3>
            </div>

            <div className="flex gap-6 items-center mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                  <AvatarImage src={hostInfo.image} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
                    {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-bold text-xl text-gray-800">
                  {hostInfo.name}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-600">
                    4.9 (124 reviews)
                  </span>
                </div>
                <p className="font-medium text-gray-600">
                  Host since {hostInfo.createdYear}
                </p>
                <p className="font-medium text-gray-600">{hostInfo.email}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6">
              <p className="text-gray-700 font-medium leading-relaxed">
                {hostInfo.description}
              </p>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-gray-800 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

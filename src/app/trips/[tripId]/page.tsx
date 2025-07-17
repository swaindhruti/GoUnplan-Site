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
  ArrowLeft
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
    `₹${trip.price} per person`
  ];

  const highlights = [
    [
      "Conquer challenging alpine single-track trails",
      "Experience breathtaking mountain panoramas",
      "High-quality mountain bike rentals included"
    ],
    [
      "Ride through picturesque Swiss villages",
      "Professional guides with local knowledge",
      "Authentic alpine accommodation"
    ]
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752778285/1432000_1_byxulb.jpg')`
        }}
      >
        {/* Enhanced Dark Overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80" />

        {/* Additional overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-white hover:text-white/90 mb-8 transition-colors duration-300 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 hover:bg-black/30"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium font-roboto">Back to Trips</span>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-playfair md:text-6xl font-bold text-white mb-6 drop-shadow-2xl text-shadow-lg">
              {trip.title}
            </h1>
            <p className="text-xl md:text-2xl text-white font-roboto mb-8 drop-shadow-lg font-medium">
              {trip.destination}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {heroTags.map((tag, i) => (
                <span
                  key={i}
                  className={`backdrop-blur-xl bg-white/25 border border-white/40 rounded-2xl px-6 py-3 text-white font-semibold shadow-2xl transition-all duration-300 hover:bg-white/35 hover:scale-105 font-roboto ${
                    tag.includes("₹")
                      ? "bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-400/60 text-yellow-100"
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
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair">
              Trip Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {highlights.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-200 hover:bg-slate-50"
              >
                <ul className="space-y-6">
                  {group.map((point, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-bold shadow-md mt-1 flex-shrink-0">
                        ✓
                      </div>
                      <span className="text-gray-800 text-base font-medium leading-relaxed font-roboto">
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
            className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg overflow-hidden"
          >
            <TabsList className="w-full grid grid-cols-3 bg-slate-100/80 border-b border-slate-200/60 rounded-none">
              {["itinerary", "included", "reviews"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="py-6 font-medium text-gray-700 font-roboto data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-md"
                >
                  {tab === "itinerary"
                    ? "Itinerary"
                    : tab === "included"
                    ? "What's Included"
                    : "Reviews"}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Itinerary */}
            <TabsContent value="itinerary" className="pt-6">
              {trip.dayWiseItinerary.map((day, index) => (
                <div
                  key={index}
                  className={`p-8 ${
                    index !== trip.dayWiseItinerary.length - 1
                      ? "border-b border-slate-200/60"
                      : ""
                  }`}
                >
                  <div className="flex gap-6">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl text-white shadow-lg flex-shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-4 font-playfair">
                        Day {day.dayNumber}: {day.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-6 font-roboto">
                        {day.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-100/60 border border-slate-200/60 rounded-xl p-5">
                          <strong className="text-gray-900 font-playfair">
                            Meals:
                          </strong>{" "}
                          <span className="text-gray-700 font-roboto">
                            {day.meals}
                          </span>
                        </div>
                        <div className="bg-slate-100/60 border border-slate-200/60 rounded-xl p-5">
                          <strong className="text-gray-900 font-playfair">
                            Stay:
                          </strong>{" "}
                          <span className="text-gray-700 font-roboto">
                            {day.accommodation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Included */}
            <TabsContent value="included" className="p-8">
              <div className="bg-slate-100/60 border border-slate-200/60 rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-playfair">
                  Included in the price:
                </h3>
                <ul className="space-y-5">
                  {[
                    "All meals during the trip",
                    "Comfortable lodging for all nights",
                    "Professional guide fees",
                    "Equipment rentals"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold shadow-md">
                        ✓
                      </div>
                      <span className="text-gray-800 font-roboto font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center gap-4">
                    <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold shadow-md">
                      ✗
                    </div>
                    <span className="text-gray-800 font-roboto font-medium">
                      Flights not included
                    </span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="p-8">
              <div className="bg-slate-100/60 border border-slate-200/60 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl text-white shadow-lg">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-4xl font-bold text-gray-900 font-playfair">
                      4.9
                    </span>
                    <span className="text-gray-600 ml-3 font-roboto">
                      (124 verified reviews)
                    </span>
                  </div>
                </div>
                <p className="text-gray-800 italic font-roboto text-lg">
                  {
                    "The best biking trip of my life! Incredible views and amazing guides!"
                  }
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Cards */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Booking Card */}
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-200">
            <div className="flex items-center gap-6 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white shadow-lg">
                <DollarSign className="h-7 w-7" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900 font-playfair">
                  ₹{tripStats.price}
                </p>
                <span className="text-lg text-gray-600 font-roboto">
                  per person
                </span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-5">
                <div className="bg-slate-100/80 border border-slate-200/60 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-roboto font-medium">
                  {tripStats.noOfDays} days
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="bg-slate-100/80 border border-slate-200/60 p-3 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-roboto font-medium">
                  Up to {tripStats.maxParticipants} people
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="bg-slate-100/80 border border-slate-200/60 p-3 rounded-lg">
                  <Languages className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-800 font-roboto font-medium">
                  {tripStats.languages}
                </span>
              </div>
            </div>

            <Link href={`/trips/booking/${trip.travelPlanId}`}>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-101 font-montserrat text-lg">
                Book Now
              </button>
            </Link>

            {UserSession.user?.id && (
              <div className="mt-4">
                <ChatButton
                  currentUserId={UserSession.user.id}
                  hostId={trip.host.user.id}
                  travelPlanId={trip.travelPlanId}
                  hostName={trip.host.user.name}
                />
              </div>
            )}
          </div>

          {/* Host Card */}
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-200">
            <div className="flex items-center gap-4 border-b border-slate-200/60 pb-6 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white shadow-lg">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-playfair">
                About Your Host
              </h3>
            </div>

            <div className="flex gap-6 items-center mb-8">
              <Avatar className="h-20 w-20 border-4 border-purple-200 shadow-lg">
                <AvatarImage src={hostInfo.image} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xl font-bold">
                  {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-bold text-gray-900 font-playfair">
                  {hostInfo.name}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-roboto">
                    4.9 (124 reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-roboto">
                  Host since {hostInfo.createdYear}
                </p>
                <p className="text-sm text-gray-600 font-roboto">
                  {hostInfo.email}
                </p>
              </div>
            </div>

            <div className="bg-slate-100/60 border border-slate-200/60 rounded-xl p-6 mb-8">
              <p className="text-gray-800 leading-relaxed font-roboto">
                {hostInfo.description}
              </p>
            </div>

            <button className="w-full bg-slate-200/80 hover:bg-slate-300/80 border border-slate-300/60 text-gray-800 font-semibold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-101 font-montserrat">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

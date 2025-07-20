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
} from "lucide-react";
import { ChatButton } from "@/components/chat/ChatButton";
import { requireUser } from "@/lib/roleGaurd";
import { BackButton } from "@/components/global/buttons";

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

  // Generate highlights based on trip data
  const generateHighlights = () => {
    const highlights: string[][] = [];

    // First group: Trip-specific highlights
    const tripHighlights: string[] = [];
    if (trip.includedActivities && trip.includedActivities.length > 0) {
      tripHighlights.push(...trip.includedActivities.slice(0, 2));
    }
    if (tripHighlights.length === 0) {
      tripHighlights.push(
        `${trip.noOfDays} days of adventure`,
        `Explore ${trip.city}, ${trip.state}`,
        `Professional guidance included`
      );
    }
    highlights.push(tripHighlights);

    // Second group: Location and experience highlights
    const locationHighlights: string[] = [
      `Discover ${trip.country}'s hidden gems`,
      `Experience local culture and traditions`,
      `Comfortable accommodation throughout`,
    ];
    highlights.push(locationHighlights);

    return highlights;
  };

  const highlights = generateHighlights();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section
        className="relative py-24 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752778285/1432000_1_byxulb.jpg')`,
        }}
      >
        {/* Enhanced Dark Overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80" />

        {/* Additional overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Back Button */}
          <BackButton isWhite={true} route="/trips" />

          <div className="text-center mt-8">
            <h1 className="text-5xl font-playfair md:text-7xl font-bold text-white mb-8 drop-shadow-2xl text-shadow-lg leading-tight">
              {trip.title}
            </h1>
            <p className="text-2xl md:text-3xl text-white font-roboto mb-12 drop-shadow-lg font-medium">
              {trip.destination}
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-16">
              {heroTags.map((tag, i) => (
                <span
                  key={i}
                  className={`backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl px-8 py-4 text-white font-semibold shadow-2xl transition-all duration-300 hover:bg-white/35 hover:scale-105 font-roboto text-lg ${
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
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Highlights Section */}
        <section className="mb-20">
          <div className="flex items-center gap-6 mb-16">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-2xl shadow-xl">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-playfair">
              Trip Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {highlights.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-200 hover:bg-slate-50"
              >
                <ul className="space-y-8">
                  {group.map((point, i) => (
                    <li key={i} className="flex items-start gap-6">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg font-bold shadow-lg mt-1 flex-shrink-0">
                        ✓
                      </div>
                      <span className="text-gray-800 text-xl font-medium leading-relaxed font-roboto">
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
        <div className="mb-20">
          <Tabs
            defaultValue="itinerary"
            className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl overflow-hidden"
          >
            <TabsList className="w-full grid grid-cols-3 bg-gradient-to-r from-slate-100/90 to-slate-200/90 border-b border-slate-200/60 rounded-none p-0 h-auto">
              {[
                { value: "itinerary", label: "Itinerary", icon: "🗺️" },
                { value: "included", label: "What's Included", icon: "✅" },
                { value: "reviews", label: "Reviews", icon: "⭐" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="py-8 px-6 font-semibold text-gray-700 font-roboto data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-xl data-[state=active]:scale-105 hover:bg-slate-200/80 hover:scale-102 flex items-center gap-3 text-lg"
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Itinerary */}
            <TabsContent value="itinerary" className="pt-12 px-12 pb-12">
              <div className="space-y-10">
                {trip.dayWiseItinerary.map((day, index) => (
                  <div
                    key={index}
                    className={`bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-200 hover:bg-white/80 ${
                      index !== trip.dayWiseItinerary.length - 1 ? "mb-10" : ""
                    }`}
                  >
                    <div className="flex gap-8">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 rounded-2xl text-white shadow-xl flex-shrink-0 h-fit">
                        <Calendar className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                          <h3 className="font-bold text-2xl text-gray-900 font-playfair">
                            Day {day.dayNumber}: {day.title}
                          </h3>
                          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-base font-semibold">
                            Day {day.dayNumber}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-8 font-roboto text-lg">
                          {day.description}
                        </p>

                        {/* Activities Section */}
                        {day.activities && day.activities.length > 0 && (
                          <div className="mb-8">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-3 text-xl">
                              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                              Activities
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {day.activities.map((activity, actIndex) => (
                                <span
                                  key={actIndex}
                                  className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-base font-medium border border-purple-200"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200/60 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-green-600 text-2xl">
                                🍽️
                              </span>
                              <strong className=" font-playfair text-green-800 text-lg">
                                Meals:
                              </strong>
                            </div>
                            <span className="text-gray-700 font-roboto text-base">
                              {day.meals || "Meals not specified"}
                            </span>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/60 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-blue-600 text-2xl">🏨</span>
                              <strong className="font-playfair text-blue-800 text-lg">
                                Stay:
                              </strong>
                            </div>
                            <span className="text-gray-700 font-roboto text-base">
                              {day.accommodation ||
                                "Accommodation not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Included */}
            <TabsContent value="included" className="p-12">
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-10 shadow-lg">
                <div className="mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 font-playfair flex items-center gap-4">
                    <span className="text-green-600 text-3xl">✅</span>
                    What&apos;s Included in Your Trip
                  </h3>
                  <p className="text-gray-600 font-roboto text-lg">
                    Everything you need for an amazing travel experience
                  </p>
                </div>

                {trip.includedActivities &&
                trip.includedActivities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {trip.includedActivities.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-5 p-5 bg-gradient-to-r from-green-50 to-green-100/30 border border-green-200/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-102"
                      >
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold shadow-lg flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-gray-800 font-roboto font-medium text-lg">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 mb-10">
                    <div className="text-8xl mb-6">🤔</div>
                    <p className="text-gray-600 font-roboto text-xl mb-4">
                      No specific inclusions listed for this trip.
                    </p>
                    <p className="text-gray-500 font-roboto text-base">
                      Contact the host for more details about what&apos;s
                      included.
                    </p>
                  </div>
                )}

                {trip.restrictions && trip.restrictions.length > 0 && (
                  <div className="border-t border-slate-200/60 pt-10">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 font-playfair flex items-center gap-4">
                      <span className="text-red-600 text-3xl">❌</span>
                      What&apos;s Not Included
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {trip.restrictions.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-5 p-5 bg-gradient-to-r from-red-50 to-red-100/30 border border-red-200/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-102"
                        >
                          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-bold shadow-lg flex-shrink-0">
                            ✗
                          </div>
                          <span className="text-gray-800 font-roboto font-medium text-lg">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="p-12">
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-10 shadow-lg">
                <div className="flex items-center gap-6 mb-10">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 rounded-2xl text-white shadow-xl">
                    <Star className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-bold text-gray-900 font-playfair">
                        {trip.averageRating > 0
                          ? trip.averageRating.toFixed(1)
                          : "No ratings"}
                      </span>
                      {trip.averageRating > 0 && (
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-6 w-6 ${
                                i < Math.round(trip.averageRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-600 font-roboto text-xl">
                      {trip.reviewCount}{" "}
                      {trip.reviewCount === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>

                {trip.reviews && trip.reviews.length > 0 ? (
                  <div className="space-y-8">
                    {trip.reviews.slice(0, 3).map((review) => (
                      <div
                        key={review.id}
                        className="bg-slate-50/60 border border-slate-200/60 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start gap-6 mb-6">
                          <Avatar className="h-16 w-16 border-3 border-purple-200">
                            <AvatarImage src={review.user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-xl">
                              {review.user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-semibold text-gray-900 font-roboto text-xl">
                                {review.user.name}
                              </p>
                              <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-500 font-roboto text-base">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        {review.comment && (
                          <div className="bg-white/60 rounded-xl p-6 border-l-4 border-purple-500">
                            <p className="text-gray-800 font-roboto text-lg leading-relaxed">
                              &ldquo;{review.comment}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    {trip.reviews.length > 3 && (
                      <div className="text-center pt-6 border-t border-slate-200/60">
                        <p className="text-gray-600 font-roboto text-base mb-3">
                          And {trip.reviews.length - 3} more reviews...
                        </p>
                        <button className="text-purple-600 hover:text-purple-700 font-semibold text-lg transition-colors duration-200">
                          View all reviews
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">⭐</div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600 font-roboto text-xl mb-6">
                      Be the first to review this amazing trip!
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/60 rounded-2xl p-8 max-w-lg mx-auto">
                      <p className="text-gray-700 font-roboto text-base">
                        After your trip, you&apos;ll be able to share your
                        experience and help other travelers make informed
                        decisions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Cards */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Booking Card */}
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-200">
            <div className="flex items-center gap-8 mb-10">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 rounded-2xl text-white shadow-xl">
                <DollarSign className="h-8 w-8" />
              </div>
              <div>
                <p className="text-5xl font-bold text-gray-900 font-playfair">
                  ₹{tripStats.price}
                </p>
                <span className="text-xl text-gray-600 font-roboto">
                  per person
                </span>
              </div>
            </div>

            <div className="space-y-8 mb-10">
              <div className="flex items-center gap-6">
                <div className="bg-slate-100/80 border border-slate-200/60 p-4 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-gray-800 font-roboto font-semibold text-lg">
                  {tripStats.noOfDays} days
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-slate-100/80 border border-slate-200/60 p-4 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-gray-800 font-roboto font-semibold text-lg">
                  Up to {tripStats.maxParticipants} people
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-slate-100/80 border border-slate-200/60 p-4 rounded-xl">
                  <Languages className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-gray-800 font-roboto font-semibold text-lg">
                  {tripStats.languages}
                </span>
              </div>
            </div>

            <Link href={`/trips/booking/${trip.travelPlanId}`}>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-102 font-montserrat text-xl">
                Book Now
              </button>
            </Link>

            {UserSession.user?.id && (
              <div className="mt-6">
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
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-200">
            <div className="flex items-center gap-6 border-b border-slate-200/60 pb-8 mb-10">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 rounded-2xl text-white shadow-xl">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-playfair">
                About Your Host
              </h3>
            </div>

            <div className="flex gap-8 items-center mb-10">
              <Avatar className="h-24 w-24 border-4 border-purple-200 shadow-xl">
                <AvatarImage src={hostInfo.image} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-2xl font-bold">
                  {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-2xl font-bold text-gray-900 font-playfair mb-3">
                  {hostInfo.name}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(trip.host.averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base text-gray-600 font-roboto">
                    {trip.host.averageRating > 0
                      ? trip.host.averageRating.toFixed(1)
                      : "No ratings"}{" "}
                    ({trip.host.reviewCount}{" "}
                    {trip.host.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
                <p className="text-base text-gray-600 font-roboto mb-2">
                  Host since {hostInfo.createdYear}
                </p>
                <p className="text-base text-gray-600 font-roboto">
                  {hostInfo.email}
                </p>
              </div>
            </div>

            <div className="bg-slate-100/60 border border-slate-200/60 rounded-2xl p-8 mb-10">
              <p className="text-gray-800 leading-relaxed font-roboto text-lg">
                {hostInfo.description}
              </p>
            </div>

            <Link href={`/host/${trip.host.hostId}`}>
              <button className="w-full bg-slate-200/80 hover:bg-slate-300/80 border border-slate-300/60 text-gray-800 font-semibold py-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-102 font-montserrat text-lg">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

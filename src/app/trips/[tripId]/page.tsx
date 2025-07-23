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
  MapPin,
  Clock,
  Shield
  /*   Award */
} from "lucide-react";
import { ChatButton } from "@/components/chat/ChatButton";
import { requireUser } from "@/lib/roleGaurd";
import { BackButton } from "@/components/global/buttons";

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

  const heroTags = [
    { label: "Available year-round", icon: <Shield className="h-4 w-4" /> },
    { label: `${trip.noOfDays} days`, icon: <Clock className="h-4 w-4" /> },
    {
      label: `Max ${trip.maxParticipants} people`,
      icon: <Users className="h-4 w-4" />
    },
    {
      label: `₹${trip.price.toLocaleString()} per person`,
      icon: <DollarSign className="h-4 w-4" />,
      highlight: true
    }
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
      `Comfortable accommodation throughout`
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
    createdYear
  };

  const tripStats = {
    price: trip.price,
    noOfDays: trip.noOfDays,
    maxParticipants: trip.maxParticipants,
    languages: trip.languages.join(", ")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752778285/1432000_1_byxulb.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton isWhite={true} route="/trips" />

          <div className="text-center mt-6 sm:mt-8">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <MapPin className="h-5 w-5 text-white/80" />
              <span className="text-sm sm:text-base text-white/80 font-medium">
                {trip.destination}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 font-serif leading-tight">
              {trip.title}
            </h1>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 max-w-4xl mx-auto">
              {heroTags.map((tag, i) => (
                <div
                  key={i}
                  className={`backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white font-medium shadow-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 text-sm sm:text-base flex items-center gap-2 ${
                    tag.highlight
                      ? "bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-amber-400/50"
                      : ""
                  }`}
                >
                  {tag.icon}
                  <span>{tag.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Highlights Section */}
        <section className="mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 sm:p-4 rounded-xl shadow-lg">
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-serif">
              Trip Highlights
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {highlights.map((group, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <ul className="space-y-4 sm:space-y-6">
                  {group.map((point, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-bold shadow-sm mt-0.5 flex-shrink-0">
                        ✓
                      </div>
                      <span className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed">
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
        <div className="mb-16 sm:mb-20">
          <Tabs
            defaultValue="itinerary"
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <TabsList className="w-full grid grid-cols-3 bg-gray-50 border-b border-gray-200 rounded-none p-0 h-auto">
              {[
                {
                  value: "itinerary",
                  label: "Itinerary",
                  icon: <Calendar className="h-5 w-5" />
                },
                {
                  value: "included",
                  label: "What's Included",
                  icon: <DollarSign className="h-5 w-5" />
                },
                {
                  value: "reviews",
                  label: "Reviews",
                  icon: <Star className="h-5 w-5" />
                }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="py-4 sm:py-6 px-3 sm:px-6 font-medium text-gray-600 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-purple-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="itinerary" className="p-6 sm:p-8 lg:p-10">
              <div className="space-y-6 sm:space-y-8">
                {trip.dayWiseItinerary.map((day, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 sm:p-4 rounded-xl text-white shadow-sm flex-shrink-0 h-fit">
                        <Calendar className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                          <h3 className="font-bold text-xl sm:text-2xl text-gray-900 font-serif">
                            Day {day.dayNumber}: {day.title}
                          </h3>
                          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
                            Day {day.dayNumber}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg">
                          {day.description}
                        </p>

                        {day.activities && day.activities.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              Activities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((activity, actIndex) => (
                                <span
                                  key={actIndex}
                                  className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-green-600 text-xl">🍽️</span>
                              <strong className="font-serif text-green-800">
                                Meals:
                              </strong>
                            </div>
                            <span className="text-gray-700 text-sm">
                              {day.meals || "Meals not specified"}
                            </span>
                          </div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-purple-600 text-xl">
                                🏨
                              </span>
                              <strong className="font-serif text-purple-800">
                                Stay:
                              </strong>
                            </div>
                            <span className="text-gray-700 text-sm">
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
            <TabsContent value="included" className="p-6 sm:p-8 lg:p-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-serif flex items-center gap-3">
                    <span className="text-green-600 text-2xl sm:text-3xl">
                      ✅
                    </span>
                    What&apos;s Included
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Everything you need for an amazing travel experience
                  </p>
                </div>

                {trip.includedActivities &&
                trip.includedActivities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trip.includedActivities.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:shadow-sm transition-all duration-200"
                      >
                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-600 text-white text-sm font-bold flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-gray-800 font-medium text-base">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🤔</div>
                    <p className="text-gray-600 text-lg mb-2">
                      No specific inclusions listed for this trip.
                    </p>
                    <p className="text-gray-500">
                      Contact the host for more details about what&apos;s
                      included.
                    </p>
                  </div>
                )}

                {trip.restrictions && trip.restrictions.length > 0 && (
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 font-serif flex items-center gap-3">
                      <span className="text-red-600 text-2xl sm:text-3xl">
                        ❌
                      </span>
                      What&apos;s Not Included
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {trip.restrictions.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg hover:shadow-sm transition-all duration-200"
                        >
                          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-600 text-white text-sm font-bold flex-shrink-0">
                            ✗
                          </div>
                          <span className="text-gray-800 font-medium text-base">
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
            <TabsContent value="reviews" className="p-6 sm:p-8 lg:p-10">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white shadow-sm">
                    <Star className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
                        {trip.averageRating > 0
                          ? trip.averageRating.toFixed(1)
                          : "No ratings"}
                      </span>
                      {trip.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.round(trip.averageRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-600 text-lg">
                      {trip.reviewCount}{" "}
                      {trip.reviewCount === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>

                {trip.reviews && trip.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {trip.reviews.slice(0, 3).map((review) => (
                      <div
                        key={review.id}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-purple-200">
                            <AvatarImage src={review.user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold">
                              {review.user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <p className="font-semibold text-gray-900 text-lg">
                                {review.user.name}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-500 text-sm">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        {review.comment && (
                          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                            <p className="text-gray-800 leading-relaxed italic">
                              {review.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    {trip.reviews.length > 3 && (
                      <div className="text-center pt-6 border-t border-gray-200">
                        <p className="text-gray-600 mb-3">
                          And {trip.reviews.length - 3} more reviews...
                        </p>
                        <button className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200">
                          View all reviews
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6">⭐</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      Be the first to review this amazing trip!
                    </p>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 max-w-lg mx-auto">
                      <p className="text-gray-700">
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Card */}
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

            {UserSession.user?.id && (
              <div>
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
                      : "No ratings"}
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

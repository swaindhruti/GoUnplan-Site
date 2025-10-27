import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/global/buttons";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  MapPin,
  Globe,
  Award,
  Clock,
  Heart,
  MessageCircle,
  ArrowRightCircle,
  Sparkles,
} from "lucide-react";

type Props = {
  params: Promise<{
    hostId: string;
  }>;
};

async function getHostProfile(hostId: string) {
  try {
    const { prisma } = await import("@/lib/shared");

    const host = await prisma.hostProfile.findUnique({
      where: { hostId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            image: true,
            bio: true,
            createdAt: true,
          },
        },
        travelPlans: {
          where: {
            status: "ACTIVE",
          },
          include: {
            reviews: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
            travelPlan: {
              select: {
                title: true,
                destination: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    return host;
  } catch (error) {
    console.error("Error fetching host profile:", error);
    return null;
  }
}

export default async function HostProfilePage({ params }: Props) {
  const hostId = (await params).hostId;

  const host = await getHostProfile(hostId);

  if (!host) return notFound();

  const createdYear = new Date(host.user.createdAt).getFullYear();
  const totalTrips = host.travelPlans.length;
  const totalReviews = host.reviews.length;

  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      {/* Hero Section with Background Image */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <BackButton isWhite={true} route="/trips" />

          <div className="flex items-center justify-between mt-12">
            <div className="space-y-4">
              <div className="inline-flex items-center px-6 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full mb-4">
                <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                  Host Profile
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
                Meet Your Host
                <span className="block text-purple-300 mt-2">
                  {host.user.name}
                </span>
              </h1>
              {/* <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
                Professional travel guide with {totalTrips} experiences and{" "}
                {totalReviews} happy travelers
              </p> */}
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host Profile Card Section */}
      <div className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
            {/* Host Profile Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
              <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-purple-200 shadow-lg">
                <AvatarImage src={host.user.image || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-2xl lg:text-4xl font-bold">
                  {host.user.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-bricolage mb-2">
                  {host.user.name}
                </h2>

                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(host.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {host.averageRating > 0
                        ? host.averageRating.toFixed(1)
                        : "No ratings"}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({host.reviewCount}{" "}
                    {host.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Host since {createdYear}
                  </div>
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {totalTrips} trips
                  </div>
                  <div className="bg-pink-50 text-pink-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {totalReviews} reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Host Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl text-white shadow-sm">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-bricolage">
                  Host Information
                </h3>
              </div>

              <div className="space-y-6">
                {/* <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    Contact Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600 mt-1">{host.user.email}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600 mt-1">{host.user.phone}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Host Email:
                      </span>
                      <p className="text-gray-600 mt-1">{host.hostEmail}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Host Mobile:
                      </span>
                      <p className="text-gray-600 mt-1">{host.hostMobile}</p>
                    </div>
                  </div>
                </div> */}

                {/* Languages Section */}
                {host.languages && host.languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      Languages Spoken
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {host.languages.map((language) => (
                        <span
                          key={language}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    Experience
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">Member since</span>
                      <span className="font-semibold text-purple-700">
                        {createdYear}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Total trips</span>
                      <span className="font-semibold text-green-700">
                        {totalTrips}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-gray-700">Average rating</span>
                      <span className="font-semibold text-yellow-700">
                        {host.averageRating > 0
                          ? host.averageRating.toFixed(1)
                          : "No ratings"}
                      </span>
                    </div>
                  </div>
                </div>

                {(host.description || host.user.bio) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-purple-600">💬</span>
                      About the Host
                    </h4>
                    <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {host.description || host.user.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trips and Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Trips */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl text-white shadow-sm">
                  <Globe className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-bricolage">
                  Active Trips ({totalTrips})
                </h2>
              </div>

              {totalTrips > 0 ? (
                <div className="grid gap-6">
                  {host.travelPlans.map((trip) => (
                    <div
                      key={trip.travelPlanId}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 font-bricolage mb-2">
                                {trip.title}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600 mb-3">
                                <MapPin className="h-4 w-4 text-purple-600" />
                                <span className="font-instrument">
                                  {trip.destination}
                                </span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200 font-instrument">
                              Active
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span className="text-gray-700 font-instrument text-sm">
                                {trip.noOfDays} days
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-purple-600" />
                              <span className="text-gray-700 font-instrument text-sm">
                                Up to {trip.maxParticipants}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-bold text-gray-900">
                                ₹{trip.price.toLocaleString()}
                              </span>
                            </div>
                            {trip.reviews.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-gray-700 font-instrument text-sm">
                                  {trip.averageRating.toFixed(1)} (
                                  {trip.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="lg:w-48">
                          <Link href={`/trips/${trip.travelPlanId}`}>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] font-instrument text-sm flex items-center justify-center gap-2">
                              View Details
                              <ArrowRightCircle className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-bricolage">
                    No Active Trips
                  </h3>
                  <p className="text-gray-600 font-instrument">
                    This host doesn&apos;t have any active trips at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            {host.reviews.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl text-white shadow-sm">
                    <Star className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-bricolage">
                    Recent Reviews ({host.reviews.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {host.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-purple-200">
                          <AvatarImage src={review.user.image || undefined} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold">
                            {review.user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-900 font-instrument">
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

                          <p className="text-gray-600 font-instrument text-sm mb-3">
                            Reviewed &quot;{review.travelPlan.title}&quot; •{" "}
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>

                          {review.comment && (
                            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-4 border-l-4 border-purple-500">
                              <p className="text-gray-800 font-instrument text-sm leading-relaxed">
                                &ldquo;{review.comment}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

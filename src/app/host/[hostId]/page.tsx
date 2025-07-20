import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Mail,
  Globe,
  Award,
  Clock,
  Heart,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <BackButton isWhite={true} route="/trips" />

          <div className="text-center mt-8">
            <div className="flex justify-center mb-8">
              <Avatar className="h-32 w-32 border-6 border-white shadow-2xl">
                <AvatarImage src={host.user.image || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-4xl font-bold">
                  {host.user.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
              {host.user.name}
            </h1>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(host.averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-semibold text-lg">
                  {host.averageRating > 0
                    ? host.averageRating.toFixed(1)
                    : "No ratings"}
                </span>
              </div>
              <span className="text-white/80 text-lg">
                ({host.reviewCount}{" "}
                {host.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">
                    Host since {createdYear}
                  </span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="font-semibold">{totalTrips} trips</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">{totalReviews} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Host Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 font-playfair flex items-center gap-3">
                  <span className="text-purple-600">👤</span>
                  About the Host
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-700 font-roboto">
                      <span className="font-medium">Email:</span>{" "}
                      {host.user.email}
                    </p>
                    <p className="text-gray-700 font-roboto">
                      <span className="font-medium">Phone:</span>{" "}
                      {host.user.phone}
                    </p>
                    <p className="text-gray-700 font-roboto">
                      <span className="font-medium">Host Email:</span>{" "}
                      {host.hostEmail}
                    </p>
                    <p className="text-gray-700 font-roboto">
                      <span className="font-medium">Host Mobile:</span>{" "}
                      {host.hostMobile}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    Hosting Experience
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-roboto">
                      <span className="font-medium">Member since:</span>{" "}
                      {createdYear}
                    </p>
                    <p className="text-gray-700 font-roboto">
                      <span className="font-medium">Total trips:</span>{" "}
                      {totalTrips}
                    </p>
                    <p className="text-gray-700 font-roboto">
                      <span className="font-medium">Average rating:</span>{" "}
                      {host.averageRating > 0
                        ? host.averageRating.toFixed(1)
                        : "No ratings yet"}
                    </p>
                  </div>
                </div>

                {host.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-purple-600">💬</span>
                      Bio
                    </h3>
                    <p className="text-gray-700 font-roboto leading-relaxed">
                      {host.description}
                    </p>
                  </div>
                )}

                {host.user.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-purple-600">📝</span>
                      Personal Bio
                    </h3>
                    <p className="text-gray-700 font-roboto leading-relaxed">
                      {host.user.bio}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trips and Reviews */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Trips */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-playfair flex items-center gap-3">
                <span className="text-purple-600">🗺️</span>
                Active Trips ({totalTrips})
              </h2>

              {totalTrips > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {host.travelPlans.map((trip) => (
                    <Card
                      key={trip.travelPlanId}
                      className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-200"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold text-gray-900 font-playfair mb-2">
                              {trip.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-gray-600 mb-3">
                              <MapPin className="h-4 w-4" />
                              <span className="font-roboto">
                                {trip.destination}
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 font-roboto text-sm">
                              {trip.noOfDays} days
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 font-roboto text-sm">
                              Up to {trip.maxParticipants}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-bold text-gray-900 text-lg">
                              ₹{trip.price}
                            </span>
                            <span className="text-gray-600 text-sm">
                              per person
                            </span>
                          </div>

                          {trip.reviews.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-gray-700 font-roboto text-sm">
                                {trip.averageRating.toFixed(1)} (
                                {trip.reviewCount})
                              </span>
                            </div>
                          )}
                        </div>

                        <Link href={`/trips/${trip.travelPlanId}`}>
                          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-102 font-montserrat text-sm">
                            View Trip Details
                          </button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg">
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-playfair">
                      No Active Trips
                    </h3>
                    <p className="text-gray-600 font-roboto">
                      This host doesn&apos;t have any active trips at the
                      moment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Reviews */}
            {host.reviews.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 font-playfair flex items-center gap-3">
                  <span className="text-purple-600">⭐</span>
                  Recent Reviews ({host.reviews.length})
                </h2>

                <div className="space-y-6">
                  {host.reviews.map((review) => (
                    <Card
                      key={review.id}
                      className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 border-2 border-purple-200">
                            <AvatarImage src={review.user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold">
                              {review.user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-gray-900 font-roboto">
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

                            <p className="text-gray-600 font-roboto text-sm mb-3">
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
                              <div className="bg-slate-50/60 rounded-xl p-4 border-l-4 border-purple-500">
                                <p className="text-gray-800 font-roboto text-sm leading-relaxed">
                                  &ldquo;{review.comment}&rdquo;
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

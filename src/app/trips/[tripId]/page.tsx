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
  Languages
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

  // Function to get random color from a set of neobrutalist colors
  const getRandomBgColor = () => {
    const colors = [
      "bg-yellow-300",
      "bg-pink-400",
      "bg-blue-400",
      "bg-green-500",
      "bg-orange-400"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-purple-600 border-3 border-black rounded-xl text-white py-12 px-6 text-center mb-8 relative overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        {/* Decorative elements */}
        <div className="absolute -left-8 -top-8 w-32 h-32 bg-yellow-300 border-3 border-black rounded-3xl rotate-12 z-0"></div>
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-pink-400 border-3 border-black rounded-full z-0"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tight">
            {trip.title}
          </h1>
          <p className="text-xl font-bold">{trip.destination}</p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {heroTags.map((tag, i) => (
              <span
                key={i}
                className={
                  tag.includes("₹")
                    ? "bg-yellow-300 px-4 py-2 text-black border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white px-4 py-2 text-black border-2 border-black rounded-lg font-bold"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="mb-10">
        <div className="flex items-center gap-3 border-b-3 border-black pb-2 mb-6">
          <div className="bg-green-400 p-2 rounded-lg border-2 border-black">
            <Star className="h-6 w-6 text-black" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">
            Trip Highlights
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {highlights.map((group, idx) => (
            <div
              key={idx}
              className={`${getRandomBgColor()} border-3 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <ul className="space-y-2 font-bold">
                {group.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="bg-white h-5 w-5 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0 mt-1">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs Section */}
      <div className="mb-10">
        <Tabs
          defaultValue="itinerary"
          className="border-3 border-black rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] pt-3 px-3"
        >
          <TabsList className="w-full grid grid-cols-3 bg-white border-b-3 border-black p-0 h-auto divide-x-3 divide-black rounded-2xl border-3 ">
            <TabsTrigger
              value="itinerary"
              className="py-3 font-black uppercase data-[state=active]:bg-blue-400 data-[state=active]:text-black rounded-2xl"
            >
              Itinerary
            </TabsTrigger>
            <TabsTrigger
              value="included"
              className="py-3 font-black uppercase data-[state=active]:bg-pink-400 data-[state=active]:text-black rounded-2xl"
            >
              What&apos;s Included
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="py-3 font-black uppercase data-[state=active]:bg-yellow-300 data-[state=active]:text-black rounded-2xl"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="bg-white p-0 m-0">
            {trip.dayWiseItinerary.map((day, index) => (
              <div
                key={index}
                className={`p-6 ${
                  index !== trip.dayWiseItinerary.length - 1
                    ? "border-b-3 border-black"
                    : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="bg-orange-400 p-2 h-min rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Calendar
                      className="h-6 w-6 text-black"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-2 uppercase">
                      Day {day.dayNumber}: {day.title}
                    </h3>
                    <p className="mb-4 font-bold">{day.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="border-2 border-black rounded-lg p-2 font-bold">
                        <strong className="uppercase">Meals:</strong>{" "}
                        {day.meals}
                      </div>
                      <div className="border-2 border-black rounded-lg p-2 font-bold">
                        <strong className="uppercase">Stay:</strong>{" "}
                        {day.accommodation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="included" className="bg-white p-6 m-0 font-bold">
            <div className="border-3 border-black rounded-xl p-4 bg-green-400">
              <h3 className="font-black uppercase mb-3">
                Included in the price:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-white h-5 w-5 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  All meals during the trip
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white h-5 w-5 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  Comfortable lodging for all nights
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white h-5 w-5 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  Professional guide fees
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white h-5 w-5 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  Equipment rentals
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-red-400 h-5 w-5 flex items-center justify-center border-2 border-black rounded-full">
                    ✗
                  </span>
                  Flights not included
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="bg-white p-6 m-0">
            <div className="border-3 border-black rounded-xl p-4 bg-yellow-300">
              <div className="flex items-center gap-2 mb-4">
                <Star
                  className="h-8 w-8 text-black fill-black"
                  strokeWidth={2.5}
                />
                <span className="text-3xl font-black">4.9</span>
                <span className="font-bold">(124 verified reviews)</span>
              </div>
              <p className="font-bold">
                &quot;The best biking trip of my life! Incredible views and
                amazing guides!&quot;
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Booking Card */}
        <div className="border-3 border-black rounded-xl bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-300 p-2 rounded-lg border-2 border-black">
              <DollarSign className="h-6 w-6 text-black" strokeWidth={2.5} />
            </div>
            <p className="text-3xl font-black">
              ₹{tripStats.price}
              <span className="text-sm font-bold ml-1">per person</span>
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-400 p-1.5 rounded-md border-2 border-black">
                <Calendar className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-bold">{tripStats.noOfDays} days</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-pink-400 p-1.5 rounded-md border-2 border-black">
                <Users className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-bold">
                Up to {tripStats.maxParticipants} people
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-400 p-1.5 rounded-md border-2 border-black">
                <Languages className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-bold">{tripStats.languages}</span>
            </div>
          </div>

          <Link href={`/trips/booking/${trip.travelPlanId}`}>
            <button
              className="w-full bg-purple-600 text-white font-black uppercase tracking-wider
              border-3 border-black rounded-lg py-3 px-4 mb-3
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-200 text-lg"
            >
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
        <div className="border-3 border-black rounded-xl bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 border-b-3 border-black pb-3 mb-4">
            <div className="bg-orange-400 p-2 rounded-lg border-2 border-black">
              <MessageCircle className="h-6 w-6 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-black uppercase tracking-tight">
              About Your Host
            </h3>
          </div>

          <div className="flex gap-4 items-center">
            <div className="border-3 border-black rounded-full overflow-hidden">
              <Avatar className="h-16 w-16">
                <AvatarImage src={hostInfo.image} />
                <AvatarFallback className="bg-blue-400 text-xl font-black">
                  {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-black text-lg">{hostInfo.name}</p>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 stroke-black" />
                <span className="font-bold ml-1">4.9 (124 reviews)</span>
              </div>
              <p className="font-bold">Host since {hostInfo.createdYear}</p>
              <p className="font-bold">{hostInfo.email}</p>
            </div>
          </div>

          <div className="mt-4 p-3 border-2 border-dashed border-black bg-gray-50 font-bold">
            {hostInfo.description}
          </div>

          <button
            className="mt-4 bg-blue-400 text-black font-black uppercase tracking-wider
            border-3 border-black rounded-lg py-2 px-4
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[2px] hover:translate-y-[2px]
            transition-all duration-200"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

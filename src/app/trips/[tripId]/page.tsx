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

  // Function to get random color from a set of soft pastel colors
  const getRandomBgColor = () => {
    const colors = [
      "bg-[#e0c6ff]", // soft lavender
      "bg-[#ffd6ff]", // pink lavender
      "bg-[#caffbf]", // light green
      "bg-[#a0c4ff]", // baby blue
      "bg-[#fdffb6]", // pale yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="bg-[#e0c6ff] border-3 border-black rounded-xl text-black py-16 px-8 text-center mb-12 relative overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        {/* Decorative elements */}
        <div className="absolute -left-8 -top-8 w-32 h-32 bg-[#ffd6ff] border-3 border-black rounded-3xl rotate-12 z-0"></div>
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#a0c4ff] border-3 border-black rounded-full z-0"></div>

        <div className="relative z-10">
          <h1 className="text-6xl md:text-7xl font-black mb-4 uppercase tracking-tight">
            {trip.title}
          </h1>
          <p className="text-3xl font-bold">{trip.destination}</p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">
            {heroTags.map((tag, i) => (
              <span
                key={i}
                className={
                  tag.includes("₹")
                    ? "bg-[#fdffb6] px-6 py-3 text-black text-xl border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white px-6 py-3 text-black text-xl border-2 border-black rounded-lg font-bold"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="mb-14">
        <div className="flex items-center gap-4 border-b-3 border-black pb-3 mb-10">
          <div className="bg-[#ffd6ff] p-3 rounded-lg border-2 border-black">
            <Star className="h-8 w-8 text-black" strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black text-black uppercase tracking-tight">
            Trip Highlights
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {highlights.map((group, idx) => (
            <div
              key={idx}
              className={`${getRandomBgColor()} border-3 border-black rounded-xl p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
            >
              <ul className="space-y-4 font-bold text-xl">
                {group.map((point, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="bg-white h-7 w-7 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0 mt-1">
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
      <div className="mb-14">
        <Tabs
          defaultValue="itinerary"
          className="border-3 border-black rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] pt-4 px-4"
        >
          <TabsList className="w-full grid grid-cols-3 bg-white border-b-3 border-black p-0 h-auto divide-x-3 divide-black rounded-2xl border-3 ">
            <TabsTrigger
              value="itinerary"
              className="py-5 font-black text-xl uppercase data-[state=active]:bg-[#e0c6ff] data-[state=active]:text-black rounded-2xl"
            >
              Itinerary
            </TabsTrigger>
            <TabsTrigger
              value="included"
              className="py-5 font-black text-xl uppercase data-[state=active]:bg-[#caffbf] data-[state=active]:text-black rounded-2xl"
            >
              What&apos;s Included
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="py-5 font-black text-xl uppercase data-[state=active]:bg-[#fdffb6] data-[state=active]:text-black rounded-2xl"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="bg-white p-0 m-0">
            {trip.dayWiseItinerary.map((day, index) => (
              <div
                key={index}
                className={`p-10 ${
                  index !== trip.dayWiseItinerary.length - 1
                    ? "border-b-3 border-black"
                    : ""
                }`}
              >
                <div className="flex gap-5">
                  <div className="bg-[#ffc6ff] p-3 h-min rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Calendar
                      className="h-8 w-8 text-black"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-3xl mb-4 uppercase">
                      Day {day.dayNumber}: {day.title}
                    </h3>
                    <p className="mb-6 font-bold text-xl">{day.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-lg">
                      <div className="border-2 border-black rounded-lg p-4 font-bold bg-[#fdffb6] bg-opacity-40">
                        <strong className="uppercase">Meals:</strong>{" "}
                        {day.meals}
                      </div>
                      <div className="border-2 border-black rounded-lg p-4 font-bold bg-[#caffbf] bg-opacity-40">
                        <strong className="uppercase">Stay:</strong>{" "}
                        {day.accommodation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="included" className="bg-white p-10 m-0 font-bold">
            <div className="border-3 border-black rounded-xl p-6 bg-[#caffbf]">
              <h3 className="font-black uppercase mb-5 text-2xl">
                Included in the price:
              </h3>
              <ul className="space-y-4 text-xl">
                <li className="flex items-center gap-4">
                  <span className="bg-white h-7 w-7 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  All meals during the trip
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-white h-7 w-7 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  Comfortable lodging for all nights
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-white h-7 w-7 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  Professional guide fees
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-white h-7 w-7 flex items-center justify-center border-2 border-black rounded-full">
                    ✓
                  </span>
                  Equipment rentals
                </li>
                <li className="flex items-center gap-4">
                  <span className="bg-[#ffadad] h-7 w-7 flex items-center justify-center border-2 border-black rounded-full">
                    ✗
                  </span>
                  Flights not included
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="bg-white p-10 m-0">
            <div className="border-3 border-black rounded-xl p-6 bg-[#fdffb6]">
              <div className="flex items-center gap-4 mb-6">
                <Star
                  className="h-10 w-10 text-black fill-black"
                  strokeWidth={2.5}
                />
                <span className="text-5xl font-black">4.9</span>
                <span className="font-bold text-xl">
                  (124 verified reviews)
                </span>
              </div>
              <p className="font-bold text-xl">
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
        <div className="border-3 border-black rounded-xl bg-white p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-5 mb-7">
            <div className="bg-[#a0c4ff] p-3 rounded-lg border-2 border-black">
              <DollarSign className="h-8 w-8 text-black" strokeWidth={2.5} />
            </div>
            <p className="text-5xl font-black">
              ₹{tripStats.price}
              <span className="text-xl font-bold ml-2">per person</span>
            </p>
          </div>

          <div className="space-y-5 mb-8">
            <div className="flex items-center gap-5">
              <div className="bg-[#caffbf] p-3 rounded-md border-2 border-black">
                <Calendar className="h-7 w-7 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl">
                {tripStats.noOfDays} days
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="bg-[#ffd6ff] p-3 rounded-md border-2 border-black">
                <Users className="h-7 w-7 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl">
                Up to {tripStats.maxParticipants} people
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="bg-[#fdffb6] p-3 rounded-md border-2 border-black">
                <Languages className="h-7 w-7 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl">{tripStats.languages}</span>
            </div>
          </div>

          <Link href={`/trips/booking/${trip.travelPlanId}`}>
            <button
              className="w-full bg-black text-white font-black uppercase tracking-wider
              border-3 border-black rounded-lg py-5 px-6 mb-4
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-200 text-2xl"
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
        <div className="border-3 border-black rounded-xl bg-white p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-5 border-b-3 border-black pb-5 mb-6">
            <div className="bg-[#e0c6ff] p-3 rounded-lg border-2 border-black">
              <MessageCircle className="h-8 w-8 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black text-black uppercase tracking-tight">
              About Your Host
            </h3>
          </div>

          <div className="flex gap-6 items-center">
            <div className="border-3 border-black rounded-full overflow-hidden">
              <Avatar className="h-24 w-24">
                <AvatarImage src={hostInfo.image} />
                <AvatarFallback className="bg-[#a0c4ff] text-3xl font-black">
                  {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-black text-2xl">{hostInfo.name}</p>
              <div className="flex items-center">
                <Star className="h-6 w-6 fill-yellow-400 stroke-black" />
                <span className="font-bold ml-2 text-xl">
                  4.9 (124 reviews)
                </span>
              </div>
              <p className="font-bold text-xl">
                Host since {hostInfo.createdYear}
              </p>
              <p className="font-bold text-xl">{hostInfo.email}</p>
            </div>
          </div>

          <div className="mt-6 p-5 border-2 border-dashed border-black bg-[#ffd6ff] bg-opacity-30 font-bold text-xl">
            {hostInfo.description}
          </div>

          <button
            className="mt-6 bg-[#e0c6ff] text-black font-black uppercase tracking-wider
            border-3 border-black rounded-lg py-4 px-6
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[2px] hover:translate-y-[2px]
            transition-all duration-200 text-xl"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

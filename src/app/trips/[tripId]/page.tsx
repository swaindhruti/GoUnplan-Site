import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripById } from "@/actions/trips/getTripByIdForTripDetail";

type Props = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function MountainBikingAdventure({ params }: Props) {
  const tripId = (await params).tripId;
  const trip = await getTripById(tripId);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="bg-gradient-to-b from-gray-800 to-transparent text-white py-16 px-4 text-center rounded-lg shadow-lg mb-10">
        <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
        <p className="text-lg">{trip.destination}</p>
        <div className="flex justify-center gap-4 mt-4 flex-wrap text-sm text-gray-300">
          {heroTags.map((tag, i) => (
            <span
              key={i}
              className={
                tag.includes("₹")
                  ? "bg-purple-600 px-3 py-1 rounded-full text-white"
                  : ""
              }
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Trip Highlights</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          {highlights.map((group, idx) => (
            <ul key={idx} className="list-disc pl-5 space-y-1">
              {group.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <Tabs defaultValue="itinerary" className="mb-10">
        <TabsList className="bg-muted">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="included">What&apos;s Included</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary">
          {trip.dayWiseItinerary.map((day, index) => (
            <Card key={index} className="mt-6 bg-purple-50">
              <CardContent className="py-6">
                <h3 className="font-semibold text-lg text-purple-800 mb-2">
                  Day {day.dayNumber}: {day.title}
                </h3>
                <p className="mb-4">{day.description}</p>
                <p className="text-sm">
                  <strong>Meals:</strong> {day.meals}
                  <br />
                  <strong>Accommodation:</strong> {day.accommodation}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="included">
          <p className="text-gray-600 mt-4">
            All meals, lodging, and guide fees included. Flights not included.
          </p>
        </TabsContent>

        <TabsContent value="reviews">
          <p className="text-gray-600 mt-4">
            ⭐ 4.9 from 124 verified guests. The best biking trip of my life!
          </p>
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="text-3xl font-bold">
            ₹{tripStats.price}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              per person
            </span>
          </p>

          <ul className="text-sm text-gray-700 mb-4 space-y-1 mt-2">
            <li>
              <strong>Duration:</strong> {tripStats.noOfDays} days
            </li>
            <li>
              <strong>Group Size:</strong> Up to {tripStats.maxParticipants}{" "}
              people
            </li>
            <li>
              <strong>Languages:</strong> {tripStats.languages}
            </li>
          </ul>

          <Link href={`/trips/booking/${trip.travelPlanId}`}>
            <Button className="w-full mb-2">Book Now</Button>
          </Link>
          <Button variant="outline" className="w-full">
            Message Host
          </Button>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">About Your Host</h3>
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src={hostInfo.image} />
              <AvatarFallback>
                {hostInfo.name?.charAt(0).toUpperCase() ?? "H"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{hostInfo.name}</p>
              <p className="text-sm text-muted-foreground">
                ⭐ 4.9 (124 reviews)
              </p>
              <p className="text-sm text-muted-foreground">
                Host since {hostInfo.createdYear}
              </p>
              <p className="text-sm text-muted-foreground">{hostInfo.email}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-4">{hostInfo.description}</p>
          <Button variant="link" className="mt-2 p-0 text-purple-600">
            View Profile
          </Button>
        </Card>
      </div>
    </div>
  );
}

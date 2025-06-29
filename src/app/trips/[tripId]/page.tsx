// "use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTripById } from "@/actions/user/action";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    tripId: string;
  }>;
};
export default async function MountainBikingAdventure({ params }: Props) {
  const tripId = (await params).tripId;
  const trip = await getTripById(tripId);

  if (!trip || "error" in trip) {
    return notFound();
  }

  const createdAt = new Date(trip.createdAt);
  const year = createdAt.getFullYear();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="bg-gradient-to-b from-gray-800 to-transparent text-white py-16 px-4 text-center rounded-lg shadow-lg mb-10">
        <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
        <p className="text-lg">{trip.destination}</p>
        <div className="flex justify-center gap-4 mt-4 flex-wrap text-sm text-gray-300">
          <span>Available year-round</span>
          <span>• {trip.noOfDays} days</span>
          <span>• Max {trip.maxParticipants} people</span>
          <span className="bg-purple-600 px-3 py-1 rounded-full text-white">
            {trip.price} per person
          </span>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Trip Highlights</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>Conquer challenging alpine single-track trails</li>
            <li>Experience breathtaking mountain panoramas</li>
            <li>High-quality mountain bike rentals included</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ride through picturesque Swiss villages</li>
            <li>Professional guides with local knowledge</li>
            <li>Authentic alpine accommodation</li>
          </ul>
        </div>
      </section>
      <Tabs defaultValue="itinerary" className="mb-10">
        <TabsList className="bg-muted">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="included">What&apos;s Included</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary">
          {trip.dayWiseItinerary.map((dayData, index) => (
            <Card key={index} className="mt-6 bg-purple-50">
              <CardContent className="py-6">
                <h3 className="font-semibold text-lg text-purple-800 mb-2">
                  Day {dayData.dayNumber}: {dayData.title}
                </h3>
                <p className="mb-4">{dayData.description}</p>
                <p className="text-sm">
                  <strong>Meals:</strong> {dayData.meals}
                  <br />
                  <strong>Accommodation:</strong>
                  {dayData.accommodation}
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
            {trip.price}{" "}
            <span className="text-sm font-normal text-muted-foreground mb-4">
              per person
            </span>
          </p>

          <ul className="text-sm text-gray-700 mb-4 space-y-1">
            <li>
              <strong>Duration:</strong> {trip.noOfDays} days
            </li>
            <li>
              <strong>Group Size:</strong> Up to {trip.maxParticipants} people
            </li>
            <li className="flex gap-2">
              <strong>Languages:</strong>
              {trip.languages.map((language, index) => (
                <div key={index}>{language}</div>
              ))}
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
              <AvatarImage
                src={trip.host.image || "https://via.placeholder.com/60"}
              />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{trip.host.user.name}</p>
              <p className="text-sm text-muted-foreground">
                ⭐ 4.9 (124 reviews)
              </p>
              <p className="text-sm text-muted-foreground">Host since {year}</p>
              <p className="text-sm text-muted-foreground">
                {trip.host.hostEmail}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-4">{trip.host.description}</p>
          <Button variant="link" className="mt-2 p-0 text-purple-600">
            View Profile
          </Button>
        </Card>
      </div>
    </div>
  );
}

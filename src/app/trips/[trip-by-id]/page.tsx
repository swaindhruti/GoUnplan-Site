// "use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTripById } from "@/actions/host/action";
import { notFound } from "next/navigation";

type Props = {
  params: {
    "trip-by-id": string;
  };
};
export default async function MountainBikingAdventure({ params }: Props) {
  const tripId = await params["trip-by-id"];
  const trip = await getTripById(tripId);

  if (!trip || "error" in trip) {
    return notFound();
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-800 to-transparent text-white py-16 px-4 text-center rounded-lg shadow-lg mb-10">
        <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
        <p className="text-lg">{trip.destination}</p>
        <div className="flex justify-center gap-4 mt-4 flex-wrap text-sm text-gray-300">
          <span>Available year-round</span>
          <span>• 7 days</span>
          <span>• Max {trip.maxParticipants} people</span>
          <span className="bg-purple-600 px-3 py-1 rounded-full text-white">
            {trip.price} per person
          </span>
        </div>
      </section>

      {/* Trip Highlights */}
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

      {/* Itinerary Tabs */}
      <Tabs defaultValue="itinerary" className="mb-10">
        <TabsList className="bg-muted">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="included">What&apos;s Included</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary">
          {/* Day 1 */}
          <Card className="mt-6 bg-purple-50">
            <CardContent className="py-6">
              <h3 className="font-semibold text-lg text-purple-800 mb-2">
                Day 1: Arrival & Welcome Ride
              </h3>
              <p className="mb-4">
                Arrive in Verbier and check into your accommodation. After a
                welcome briefing, we’ll take a short afternoon ride to get
                familiar with the terrain and adjust your bikes.
              </p>
              <ul className="list-disc pl-5 mb-2 text-sm">
                <li>Airport transfer from Geneva</li>
                <li>Bike fitting and safety briefing</li>
                <li>Welcome dinner with the group</li>
              </ul>
              <p className="text-sm">
                <strong>Meals:</strong> Dinner included
                <br />
                <strong>Accommodation:</strong> Alpine Lodge in Verbier
              </p>
            </CardContent>
          </Card>

          {/* Day 2 */}
          <Card className="mt-6 bg-purple-50">
            <CardContent className="py-6">
              <h3 className="font-semibold text-lg text-purple-800 mb-2">
                Day 2: Verbier Valley Trails
              </h3>
              <p className="mb-4">
                Start with a gondola lift up to 2,200m and enjoy flowing
                singletrack descents through forests and alpine meadows with
                spectacular views of the Mont Blanc massif.
              </p>
              <ul className="list-disc pl-5 mb-2 text-sm">
                <li>Gondola lift ride</li>
                <li>30km of varied terrain riding</li>
                <li>Lunch at mountain restaurant</li>
              </ul>
              <p className="text-sm">
                <strong>Meals:</strong> Breakfast, lunch, and dinner included
                <br />
                <strong>Accommodation:</strong> Alpine Lodge in Verbier
              </p>
            </CardContent>
          </Card>
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

      {/* Booking Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="text-3xl font-bold">$1499</p>
          <p className="text-sm text-muted-foreground mb-4">per person</p>
          <ul className="text-sm text-gray-700 mb-4 space-y-1">
            <li>
              <strong>Duration:</strong> 7 days
            </li>
            <li>
              <strong>Group Size:</strong> Up to 8 people
            </li>
            <li>
              <strong>Languages:</strong> English, German, French
            </li>
          </ul>
          <Button className="w-full mb-2">Book Now</Button>
          <Button variant="outline" className="w-full">
            Message Host
          </Button>
        </Card>

        {/* Host Info */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">About Your Host</h3>
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/60" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Alex Mountaineer</p>
              <p className="text-sm text-muted-foreground">
                ⭐ 4.9 (124 reviews)
              </p>
              <p className="text-sm text-muted-foreground">Host since 2020</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-4">
            Professional mountain biker with 15+ years of experience guiding in
            the Alps. I know these mountains like the back of my hand and
            can&apos;t wait to show you the best trails!
          </p>
          <Button variant="link" className="mt-2 p-0 text-purple-600">
            View Profile
          </Button>
        </Card>
      </div>
    </div>
  );
}

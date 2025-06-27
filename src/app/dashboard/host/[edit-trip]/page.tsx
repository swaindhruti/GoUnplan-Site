import { getTripById, updateTravelPlan } from "@/actions/host/action";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  Map,
  DollarSign,
  Tag,
  ArrowLeft,
  Save,
} from "lucide-react";

type Props = {
  params: {
    "edit-trip": string;
  };
};

async function handleUpdateTrip(formData: FormData) {
  "use server";

  const tripId = formData.get("tripId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const destination = formData.get("destination") as string;
  const price = parseFloat(formData.get("price") as string);
  const noOfDays = parseInt(formData.get("noOfDays") as string);
  const maxParticipants = parseInt(formData.get("maxParticipants") as string);
  const filters = formData.getAll("filters") as string[];

  const updateData = {
    title,
    description,
    destination,
    price,
    noOfDays,
    maxParticipants,
    filters,
  };

  try {
    const result = await updateTravelPlan(tripId, updateData);

    if (result && !("error" in result)) {
      revalidatePath("/dashboard/host");
      redirect("/dashboard/host");
    } else {
      throw new Error("Failed to update trip");
    }
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
}

export default async function EditTripPage({ params }: Props) {
  const tripId = await params["edit-trip"];
  const trip = await getTripById(tripId);

  if (!trip || "error" in trip) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/host">
              <Button
                variant="outline"
                className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              >
                Host Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link
              href="/dashboard/host"
              className="text-purple-600 hover:text-purple-700 flex items-center mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit Trip
            </h1>
          </div>

          <Card className="shadow-lg border border-gray-200 overflow-hidden">
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {trip.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form action={handleUpdateTrip} className="space-y-6">
                <input type="hidden" name="tripId" value={tripId} />

                <div className="space-y-1.5">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Trip Title
                  </label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={trip.title}
                    required
                    className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={trip.description}
                    required
                    className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="destination"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Map className="h-4 w-4 text-gray-500 mr-2" />
                      Destination
                    </label>
                    <Input
                      type="text"
                      id="destination"
                      name="destination"
                      defaultValue={trip?.destination || ""}
                      required
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="price"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                      Price per Person ($)
                    </label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      step="0.01"
                      defaultValue={trip.price}
                      required
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="noOfDays"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <CalendarDays className="h-4 w-4 text-gray-500 mr-2" />
                      Number of Days
                    </label>
                    <Input
                      type="number"
                      id="noOfDays"
                      name="noOfDays"
                      defaultValue={trip.noOfDays}
                      required
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="maxParticipants"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      Maximum Participants
                    </label>
                    <Input
                      type="number"
                      id="maxParticipants"
                      name="maxParticipants"
                      defaultValue={trip.maxParticipants}
                      required
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="filters"
                    className="flex items-center text-sm font-medium text-gray-700 mb-1"
                  >
                    <Tag className="h-4 w-4 text-gray-500 mr-2" />
                    Trip Categories (Hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    id="filters"
                    name="filters"
                    multiple
                    defaultValue={
                      Array.isArray(trip.filters) ? trip.filters : []
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                  >
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="relaxation">Relaxation</option>
                    <option value="business">Business</option>
                    <option value="family">Family</option>
                    <option value="romantic">Romantic</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Selected:{" "}
                    {Array.isArray(trip.filters)
                      ? trip.filters.join(", ")
                      : "None"}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-8">
                  <div className="flex justify-end space-x-4">
                    <Link href="/dashboard/host">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Unplan. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

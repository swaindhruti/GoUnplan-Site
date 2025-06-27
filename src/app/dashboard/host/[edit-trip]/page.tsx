import { getTripById, updateTravelPlan } from "@/actions/host/action";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

type Props = {
  params: {
    "edit-trip": string; // the [edit-trip] param is the trip id
  };
};

// Server action for handling form submission
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
    filters
  };

  try {
    const result = await updateTravelPlan(tripId, updateData);

    if (result && !("error" in result)) {
      // Revalidate the cache and redirect on success
      revalidatePath("/dashboard/host");
      redirect("/dashboard/host");
    } else {
      // Handle error case - you might want to show an error message
      throw new Error("Failed to update trip");
    }
  } catch (error) {
    // Handle error - in a real app, you'd want to show this to the user
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Trip: {trip.title}</h1>

      <form action={handleUpdateTrip} className="space-y-6">
        {/* Hidden field for trip ID */}
        <input type="hidden" name="tripId" value={tripId} />

        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Trip Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={trip.title}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={trip.description}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Destination Field */}
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            defaultValue={trip?.destination || ""}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price Field */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            defaultValue={trip.price}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Duration Field */}
        <div>
          <label
            htmlFor="noOfDays"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Days
          </label>
          <input
            type="number"
            id="noOfDays"
            name="noOfDays"
            defaultValue={trip.noOfDays}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Max Participants Field */}
        <div>
          <label
            htmlFor="maxParticipants"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Maximum Participants
          </label>
          <input
            type="number"
            id="maxParticipants"
            name="maxParticipants"
            defaultValue={trip.maxParticipants}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters Field (Multiple Selection) */}
        <div>
          <label
            htmlFor="filters"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filters (Hold Ctrl/Cmd to select multiple)
          </label>
          <select
            id="filters"
            name="filters"
            multiple
            defaultValue={Array.isArray(trip.filters) ? trip.filters : []}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
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
            {Array.isArray(trip.filters) ? trip.filters.join(", ") : "None"}
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard/host"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-block text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getAllActiveTrips } from "@/actions/user/action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Map,
  Calendar,
  DollarSign,
  Search,
  Compass,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Trip = {
  travelPlanId: string;
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  noOfDays: number;
  price: number;
  hostId: string;
  createdAt: string;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadTrips() {
      try {
        const result = await getAllActiveTrips();

        if (result.error) {
          setError(result.error);
        } else if (result.trips) {
          const formattedTrips = result.trips.map((trip) => ({
            ...trip,
            createdAt: trip.createdAt.toString(),
          }));
          setTrips(formattedTrips);
          setFilteredTrips(formattedTrips);
        }
      } catch (err) {
        setError("Failed to load travel plans");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTrips();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTrips(trips);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(lowercasedSearch) ||
        trip.description.toLowerCase().includes(lowercasedSearch) ||
        trip.city.toLowerCase().includes(lowercasedSearch) ||
        trip.state.toLowerCase().includes(lowercasedSearch) ||
        trip.country.toLowerCase().includes(lowercasedSearch)
    );

    setFilteredTrips(filtered);
  }, [searchTerm, trips]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/user">
              <Button
                variant="outline"
                className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Travel Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover unique experiences crafted by local hosts around the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by destination, title or description..."
              className="pl-10 py-6 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading travel plans...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200 text-red-800 mx-auto max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <p className="text-gray-600 mb-6 text-center">
            Found {filteredTrips.length} travel plan
            {filteredTrips.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Travel Plans Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.travelPlanId}
                className="overflow-hidden hover:shadow-md transition-shadow pt-0"
              >
                <div className="h-48 bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
                  <Map className="h-16 w-16 text-white opacity-75" />
                </div>

                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {trip.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Compass className="h-4 w-4 mr-1" />
                    <span>
                      {trip.city}, {trip.state}, {trip.country}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {trip.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                      <span>{trip.noOfDays} Days</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                      <span>${trip.price} per person</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-100 pt-4">
                  <Link href={`/trips/${trip.travelPlanId}`} className="w-full">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredTrips.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No travel plans found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-10">
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

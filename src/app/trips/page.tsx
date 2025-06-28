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
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Map,
  Calendar,
  DollarSign,
  Search,
  Compass,
  AlertCircle,
  Loader2,
  Languages,
  Sparkles
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactSelect, { StylesConfig, MultiValue } from "react-select";

// ✅ Backend raw trip type
type RawTrip = {
  travelPlanId: string;
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  noOfDays: number;
  price: number;
  hostId: string;
  createdAt: string | Date;
  languages?: string[];
  filters?: string[]; // filters = vibes
};

// ✅ Frontend trip type
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
  languages: string[];
  filters: string[];
  vibes: string[];
};

type SelectOption = {
  value: string;
  label: string;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [daysFilter, setDaysFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);
  const [vibeFilter, setVibeFilter] = useState<string[]>([]);

  // ✅ Load and transform trips
  useEffect(() => {
    async function loadTrips() {
      try {
        const result = await getAllActiveTrips();
        if (result.error) {
          setError(result.error);
        } else if (result.trips) {
          const formattedTrips: Trip[] = (result.trips as RawTrip[]).map(
            (trip) => {
              const safeFilters = Array.isArray(trip.filters)
                ? trip.filters
                : [];
              return {
                ...trip,
                createdAt: new Date(trip.createdAt).toISOString(),
                languages: Array.isArray(trip.languages) ? trip.languages : [],
                filters: safeFilters,
                vibes: safeFilters // alias for UI
              };
            }
          );
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

  // ✅ Filtering logic
  useEffect(() => {
    let filtered = trips;

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(lowerSearch) ||
          trip.description.toLowerCase().includes(lowerSearch) ||
          trip.city.toLowerCase().includes(lowerSearch) ||
          trip.state.toLowerCase().includes(lowerSearch) ||
          trip.country.toLowerCase().includes(lowerSearch)
      );
    }

    filtered = filtered.filter(
      (trip) => trip.price >= priceRange[0] && trip.price <= priceRange[1]
    );

    if (daysFilter !== "all") {
      const [min, max] = daysFilter.split("-").map(Number);
      filtered = filtered.filter(
        (trip) => trip.noOfDays >= min && (max ? trip.noOfDays <= max : true)
      );
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter(
        (trip) => trip.country.toLowerCase() === countryFilter.toLowerCase()
      );
    }

    if (languageFilter.length > 0) {
      filtered = filtered.filter((trip) =>
        languageFilter.some((lang) => trip.languages.includes(lang))
      );
    }

    if (vibeFilter.length > 0) {
      filtered = filtered.filter((trip) =>
        vibeFilter.some((vibe) => trip.vibes.includes(vibe))
      );
    }

    setFilteredTrips(filtered);
  }, [
    searchTerm,
    priceRange,
    daysFilter,
    countryFilter,
    languageFilter,
    vibeFilter,
    trips
  ]);

  const uniqueCountries = Array.from(
    new Set(trips.map((t) => t.country))
  ).sort();
  const uniqueLanguages = Array.from(
    new Set(trips.flatMap((t) => t.languages))
  ).sort();
  const uniqueVibes = Array.from(new Set(trips.flatMap((t) => t.vibes))).sort();

  const selectStyles: StylesConfig<SelectOption, true> = {
    control: (base) => ({
      ...base,
      backgroundColor: "#faf5ff",
      borderColor: "#d8b4fe"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#8b5cf6"
        : state.isFocused
        ? "#f3e8ff"
        : undefined,
      color: state.isSelected ? "white" : "#4c1d95"
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "#e9d5ff" }),
    multiValueLabel: (base) => ({ ...base, color: "#4c1d95" }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#4c1d95",
      ":hover": { backgroundColor: "#d8b4fe", color: "#6b21a8" }
    })
  };

  return (
    <div className="min-h-screen bg-purple-50/50 p-8">
      <h1 className="text-3xl font-bold text-purple-900 text-center mb-6">
        Explore Travel Plans
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Search */}
        <div>
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-purple-400" />
            <Input
              placeholder="Search by destination..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <Label>Price Range</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0] === 0 ? "" : priceRange[0]}
              onChange={(e) =>
                setPriceRange([+e.target.value || 0, priceRange[1]])
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1] === Infinity ? "" : priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], +e.target.value || Infinity])
              }
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <Label>Duration</Label>
          <Select value={daysFilter} onValueChange={setDaysFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1-3">1–3 Days</SelectItem>
              <SelectItem value="4-7">4–7 Days</SelectItem>
              <SelectItem value="8">8+ Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div>
          <Label>Country</Label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {uniqueCountries.map((c) => (
                <SelectItem key={c} value={c.toLowerCase()}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Languages */}
        <div>
          <Label>Languages</Label>
          <ReactSelect
            isMulti
            styles={selectStyles}
            options={uniqueLanguages.map((l) => ({ value: l, label: l }))}
            value={languageFilter.map((l) => ({ value: l, label: l }))}
            onChange={(selected: MultiValue<SelectOption>) =>
              setLanguageFilter(selected.map((opt) => opt.value))
            }
          />
        </div>

        {/* Vibes */}
        <div>
          <Label>Vibes</Label>
          <ReactSelect
            isMulti
            styles={selectStyles}
            options={uniqueVibes.map((v) => ({ value: v, label: v }))}
            value={vibeFilter.map((v) => ({ value: v, label: v }))}
            onChange={(selected: MultiValue<SelectOption>) =>
              setVibeFilter(selected.map((opt) => opt.value))
            }
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-3" />
          <p className="text-purple-600">Loading...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {!isLoading && !error && filteredTrips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card key={trip.travelPlanId} className="border border-purple-100">
              <div className="h-44 bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
                <Map className="h-16 w-16 text-white opacity-75" />
              </div>
              <CardHeader>
                <CardTitle>{trip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 text-sm">{trip.description}</p>
                <p className="text-sm mt-2">
                  <Compass className="inline h-4 w-4 mr-1" />
                  {trip.city}, {trip.state}, {trip.country}
                </p>
                <p className="text-sm mt-1">
                  <Calendar className="inline h-4 w-4 mr-1" /> {trip.noOfDays}{" "}
                  Days
                </p>
                <p className="text-sm mt-1">
                  <DollarSign className="inline h-4 w-4 mr-1" /> ${trip.price}
                </p>
                <p className="text-sm mt-1">
                  <Languages className="inline h-4 w-4 mr-1" />{" "}
                  {trip.languages.join(", ") || "N/A"}
                </p>
                <p className="text-sm mt-1">
                  <Sparkles className="inline h-4 w-4 mr-1" />{" "}
                  {trip.vibes.join(", ") || "N/A"}
                </p>
              </CardContent>
              <CardFooter>
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
        <div className="text-center py-12">
          <Compass className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-purple-900 mb-1">
            No travel plans found
          </h3>
          <p className="text-purple-600 mb-4">Try adjusting your filters</p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setPriceRange([0, Infinity]);
              setDaysFilter("all");
              setCountryFilter("all");
              setLanguageFilter([]);
              setVibeFilter([]);
            }}
            variant="outline"
            className="text-purple-600 border-purple-200 hover:bg-purple-100"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

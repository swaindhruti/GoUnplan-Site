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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Filter,
  X,
  ChevronDown,
  ChevronUp,
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
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

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
                vibes: safeFilters, // alias for UI
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

    // Count active filters
    let count = 0;
    if (searchTerm) count++;
    if (priceRange[0] > 0 || priceRange[1] < Infinity) count++;
    if (daysFilter !== "all") count++;
    if (countryFilter !== "all") count++;
    count += languageFilter.length > 0 ? 1 : 0;
    count += vibeFilter.length > 0 ? 1 : 0;
    setActiveFiltersCount(count);
  }, [
    searchTerm,
    priceRange,
    daysFilter,
    countryFilter,
    languageFilter,
    vibeFilter,
    trips,
  ]);

  const uniqueCountries = Array.from(
    new Set(trips.map((t) => t.country))
  ).sort();
  const uniqueLanguages = Array.from(
    new Set(trips.flatMap((t) => t.languages))
  ).sort();
  const uniqueVibes = Array.from(new Set(trips.flatMap((t) => t.vibes))).sort();

  const clearAllFilters = () => {
    setSearchTerm("");
    setPriceRange([0, Infinity]);
    setDaysFilter("all");
    setCountryFilter("all");
    setLanguageFilter([]);
    setVibeFilter([]);
  };

  const selectStyles: StylesConfig<SelectOption, true> = {
    control: (base) => ({
      ...base,
      backgroundColor: "#faf5ff",
      borderColor: "#d8b4fe",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#8b5cf6"
        : state.isFocused
        ? "#f3e8ff"
        : undefined,
      color: state.isSelected ? "white" : "#4c1d95",
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "#e9d5ff" }),
    multiValueLabel: (base) => ({ ...base, color: "#4c1d95" }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#4c1d95",
      ":hover": { backgroundColor: "#d8b4fe", color: "#6b21a8" },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero section with search */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Adventures
          </h1>
          <p className="text-lg md:text-xl mb-8 text-purple-100">
            Find and book unique travel experiences tailored to your interests
          </p>

          {/* Search bar in hero section */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 text-purple-300" />
            <Input
              placeholder="Search destinations, activities, or experiences..."
              className="pl-12 py-6 text-lg bg-white/10 backdrop-blur-sm border-purple-400/30 text-white placeholder:text-purple-200 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  showFilters ? "bg-purple-100 border-purple-300" : ""
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </span>
                )}
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-800"
                  onClick={clearAllFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {filteredTrips.length}{" "}
              {filteredTrips.length === 1 ? "trip" : "trips"} found
            </p>
          </div>

          {/* Collapsible filter panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <h3 className="font-medium text-purple-900 border-b border-purple-100 pb-2">
                  Trip Details
                </h3>

                <div>
                  <Label className="text-sm text-purple-700 mb-1 block">
                    Price Range
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="bg-purple-50 border-purple-200"
                      value={priceRange[0] === 0 ? "" : priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([+e.target.value || 0, priceRange[1]])
                      }
                    />
                    <span className="text-purple-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="bg-purple-50 border-purple-200"
                      value={priceRange[1] === Infinity ? "" : priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          +e.target.value || Infinity,
                        ])
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-purple-700 mb-1 block">
                    Duration
                  </Label>
                  <Select value={daysFilter} onValueChange={setDaysFilter}>
                    <SelectTrigger className="bg-purple-50 border-purple-200">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      <SelectItem value="1-3">Short Trip (1–3 Days)</SelectItem>
                      <SelectItem value="4-7">
                        Medium Trip (4–7 Days)
                      </SelectItem>
                      <SelectItem value="8">Extended Trip (8+ Days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Middle column */}
              <div className="space-y-4">
                <h3 className="font-medium text-purple-900 border-b border-purple-100 pb-2">
                  Location
                </h3>

                <div>
                  <Label className="text-sm text-purple-700 mb-1 block">
                    Country
                  </Label>
                  <Select
                    value={countryFilter}
                    onValueChange={setCountryFilter}
                  >
                    <SelectTrigger className="bg-purple-50 border-purple-200">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {uniqueCountries.map((c) => (
                        <SelectItem key={c} value={c.toLowerCase()}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <h3 className="font-medium text-purple-900 border-b border-purple-100 pb-2">
                  Preferences
                </h3>

                <div>
                  <Label className="text-sm text-purple-700 mb-1 block">
                    Languages
                  </Label>
                  <ReactSelect
                    isMulti
                    styles={selectStyles}
                    placeholder="Select languages"
                    options={uniqueLanguages.map((l) => ({
                      value: l,
                      label: l,
                    }))}
                    value={languageFilter.map((l) => ({ value: l, label: l }))}
                    onChange={(selected: MultiValue<SelectOption>) =>
                      setLanguageFilter(selected.map((opt) => opt.value))
                    }
                  />
                </div>

                <div>
                  <Label className="text-sm text-purple-700 mb-1 block">
                    Vibes
                  </Label>
                  <ReactSelect
                    isMulti
                    styles={selectStyles}
                    placeholder="Select vibes"
                    options={uniqueVibes.map((v) => ({ value: v, label: v }))}
                    value={vibeFilter.map((v) => ({ value: v, label: v }))}
                    onChange={(selected: MultiValue<SelectOption>) =>
                      setVibeFilter(selected.map((opt) => opt.value))
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
            <p className="text-purple-600 text-lg">
              Loading amazing experiences...
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.travelPlanId}
                className="overflow-hidden hover:shadow-lg transition-shadow border-purple-100 hover:border-purple-200"
              >
                <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <Map className="h-20 w-20 text-white opacity-75 group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader>
                  <CardTitle className="text-purple-900">
                    {trip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 text-sm line-clamp-2 mb-4">
                    {trip.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm flex items-center text-gray-700">
                      <Compass className="h-4 w-4 mr-2 text-purple-500" />
                      {trip.city}, {trip.state}, {trip.country}
                    </p>
                    <p className="text-sm flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                      {trip.noOfDays} {trip.noOfDays === 1 ? "Day" : "Days"}
                    </p>
                    <p className="text-sm flex items-center text-gray-700">
                      <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium text-purple-900">
                        ${trip.price.toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {trip.languages.length > 0 && (
                      <div className="flex items-center bg-purple-50 px-2 py-1 rounded text-xs text-purple-700">
                        <Languages className="h-3 w-3 mr-1" />
                        {trip.languages.join(", ")}
                      </div>
                    )}

                    {trip.vibes.map((vibe) => (
                      <span
                        key={vibe}
                        className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
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
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-purple-100 px-4">
            <Compass className="h-16 w-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-purple-900 mb-2">
              No travel plans match your filters
            </h3>
            <p className="text-purple-600 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any trips with your current filter settings.
              Try adjusting your criteria or check back soon for new adventures!
            </p>
            <Button
              onClick={clearAllFilters}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

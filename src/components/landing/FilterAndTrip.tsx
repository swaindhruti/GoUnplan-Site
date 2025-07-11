"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Calendar, Users, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const FilterAndTrip = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [travelers, setTravelers] = useState("1");
  const [vibe, setVibe] = useState("");
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (vibe) params.append("vibe", vibe);
    if (travelers) params.append("travelers", travelers);
    if (checkIn) params.append("checkIn", checkIn.toISOString());
    if (checkOut) params.append("checkOut", checkOut.toISOString());
    if (checkIn && checkOut) {
      const days = Math.max(
        1,
        Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      params.append("days", days.toString());
    }
    router.push(`/trips?${params.toString()}`);
  };

  return (
    <div
      id="filtertrip"
      className="min-h-screen py-10 relative flex items-center justify-center overflow-hidden"
    >
      <Image
        src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751847044/joshua-earle--87JyMb9ZfU-unsplash_accpod.jpg"
        alt="Filter and Trip"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />
      <div className="relative z-10 flex items-center justify-center h-full p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-playfair md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Plan Your Perfect
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Adventure
              </span>
            </h1>
            <p className="text-lg md:text-xl font-roboto text-white/95 max-w-2xl mx-auto drop-shadow-lg">
              Discover unique experiences tailored to your vibe. Let us handle
              the details while you focus on creating memories that last a
              lifetime.
            </p>
          </div>
          <div className="backdrop-blur-2xl bg-white/25 border border-white/40 rounded-3xl p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSearch} className="space-y-8">
              <div className="grid grid-cols-1 font-roboto md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <Label className="text-white font-semibold flex items-center gap-2 drop-shadow-md">
                    <MapPin className="w-4 h-4 text-purple-300" />
                    Where to?
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search destinations..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="bg-white/40 border-white/50 text-gray-900 placeholder:text-gray-600 rounded-xl h-12 pl-4 pr-10 focus:bg-white/60 focus:border-purple-400 transition-all duration-200 font-medium shadow-lg"
                    />
                    <Search className="absolute right-3 top-3 w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-white font-semibold flex items-center gap-2 drop-shadow-md">
                    <Calendar className="w-4 h-4 text-purple-300" />
                    Check-in
                  </Label>
                  <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 bg-white/40 border-white/50 text-gray-900 hover:bg-white/60 hover:border-purple-400 rounded-xl transition-all duration-200 font-medium shadow-lg"
                      >
                        {checkIn
                          ? format(checkIn, "MMM dd, yyyy")
                          : "Select date"}
                        <ChevronDown className="ml-auto w-4 h-4 text-gray-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl border-white/30">
                      <CalendarComponent
                        mode="single"
                        selected={checkIn}
                        onSelect={(date) => {
                          setCheckIn(date);
                          setIsCheckInOpen(false);
                        }}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-3">
                  <Label className="text-white font-semibold flex items-center gap-2 drop-shadow-md">
                    <Calendar className="w-4 h-4 text-purple-300" />
                    Check-out
                  </Label>
                  <Popover
                    open={isCheckOutOpen}
                    onOpenChange={setIsCheckOutOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 bg-white/40 border-white/50 text-gray-900 hover:bg-white/60 hover:border-purple-400 rounded-xl transition-all duration-200 font-medium shadow-lg"
                      >
                        {checkOut
                          ? format(checkOut, "MMM dd, yyyy")
                          : "Select date"}
                        <ChevronDown className="ml-auto w-4 h-4 text-gray-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl border-white/30">
                      <CalendarComponent
                        mode="single"
                        selected={checkOut}
                        onSelect={(date) => {
                          setCheckOut(date);
                          setIsCheckOutOpen(false);
                        }}
                        initialFocus
                        disabled={(date) => date < (checkIn || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-3 h-full">
                  <Label className="text-white font-semibold flex items-center gap-2 drop-shadow-md">
                    <Users className="w-4 h-4 text-purple-300" />
                    Who&apos;s going?
                  </Label>
                  <Select value={travelers} onValueChange={setTravelers}>
                    <SelectTrigger className="bg-white/40 w-full h-12 border-white/50 text-gray-900 rounded-xl focus:bg-white/60 focus:border-purple-400 transition-all duration-200 font-medium shadow-lg">
                      <SelectValue placeholder="Select travelers" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
                      <SelectItem value="1">1 Traveler</SelectItem>
                      <SelectItem value="2">2 Travelers</SelectItem>
                      <SelectItem value="3">3 Travelers</SelectItem>
                      <SelectItem value="4">4 Travelers</SelectItem>
                      <SelectItem value="5">5+ Travelers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-white font-semibold flex items-center gap-2 drop-shadow-md">
                    Vibe
                  </Label>
                  <Select value={vibe} onValueChange={setVibe}>
                    <SelectTrigger className="bg-white/40 w-full h-12 border-white/50 text-gray-900 rounded-xl focus:bg-white/60 focus:border-purple-400 transition-all duration-200 font-medium shadow-lg">
                      <SelectValue placeholder="Select vibe" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
                      <SelectItem value="Cultural">Cultural</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Relaxation">Relaxation</SelectItem>
                      <SelectItem value="Nature">Nature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-purple-700 transition"
                >
                  Go To Trips
                </Button>
              </div>
            </form>
            <div className="text-center mt-8 pt-6 border-t border-white/30">
              <p className="text-white font-medium drop-shadow-md">
                Not sure where to go?{" "}
                <button className="text-purple-300 hover:text-purple-200 font-semibold underline transition-colors duration-200 drop-shadow-sm">
                  Browse trips by vibe →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { PrimaryButton } from "./common";

export const FilterAndTrip = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [travelers, setTravelers] = useState("1");
  const [vibe, setVibe] = useState("");
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const router = useRouter();

  const fieldClass =
    "h-12 w-full bg-white/90 border border-white/30 text-gray-800 placeholder:font-roboto placeholder:text-gray-500 rounded-lg px-4 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium";

  const formFields = [
    {
      id: "destination",
      label: "Destination",
      icon: <MapPin className="w-4 h-4 text-purple-300" />,
      type: "input",
      placeholder: "Where to?"
    },
    {
      id: "checkIn",
      label: "Check-in",
      icon: <Calendar className="w-4 h-4 text-purple-300" />,
      type: "date"
    },
    {
      id: "checkOut",
      label: "Check-out",
      icon: <Calendar className="w-4 h-4 text-purple-300" />,
      type: "date"
    },
    {
      id: "travelers",
      label: "Travelers",
      icon: <Users className="w-4 h-4 text-purple-300" />,
      type: "select",
      options: [
        { value: "1", label: "1 Traveler" },
        { value: "2", label: "2 Travelers" },
        { value: "3", label: "3 Travelers" },
        { value: "4", label: "4 Travelers" },
        { value: "5", label: "5+ Travelers" }
      ],
      placeholder: "How many?"
    },
    {
      id: "vibe",
      label: "Vibe",
      icon: <Sparkles className="w-4 h-4 text-purple-300" />,
      type: "select",
      options: [
        { value: "Cultural", label: "Cultural" },
        { value: "Adventure", label: "Adventure" },
        { value: "Relaxation", label: "Relaxation" },
        { value: "Nature", label: "Nature" },
        { value: "Luxury", label: "Luxury" },
        { value: "Budget", label: "Budget-Friendly" }
      ],
      placeholder: "Your mood?"
    }
  ];

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
      className="min-h-screen relative flex items-center justify-center"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg"
          alt="Travel destination"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Left Sparkles with up-down motion */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl font-playfair md:text-6xl font-semibold text-white tracking-wide">
              Find Your Perfect
              <span className="block text-purple-400 mt-2">Journey</span>
            </h1>

            {/* Right Sparkles with same up-down motion */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                delay: 0.8,
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>
          </div>

          <p className="text-lg text-white  font-roboto max-w-2xl mx-auto font-normal leading-relaxed">
            Discover extraordinary destinations and create unforgettable
            memories
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {formFields.map((field) => {
                const label = (
                  <Label
                    key={`${field.id}-label`}
                    className="text-white/90 font-medium text-sm flex items-center gap-2"
                  >
                    {field.icon}
                    {field.label}
                  </Label>
                );

                switch (field.type) {
                  case "input":
                    return (
                      <div key={field.id} className="space-y-3 font-playfair">
                        {label}
                        <div className="relative">
                          <Input
                            placeholder={field.placeholder}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className={fieldClass}
                          />
                          <Search className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    );

                  case "date":
                    const isCheckIn = field.id === "checkIn";
                    const date = isCheckIn ? checkIn : checkOut;
                    const setDate = isCheckIn ? setCheckIn : setCheckOut;
                    const open = isCheckIn ? isCheckInOpen : isCheckOutOpen;
                    const setOpen = isCheckIn
                      ? setIsCheckInOpen
                      : setIsCheckOutOpen;
                    const disabledDate = isCheckIn
                      ? (date: Date) => date < new Date()
                      : (date: Date) => date < (checkIn || new Date());

                    return (
                      <div key={field.id} className="space-y-3 font-playfair">
                        {label}
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`${fieldClass} justify-start`}
                            >
                              {date ? format(date, "MMM dd") : "Select date"}
                              <ChevronDown className="ml-auto w-4 h-4 text-gray-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white rounded-xl shadow-xl border-0">
                            <CalendarComponent
                              mode="single"
                              selected={date}
                              onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                              }}
                              initialFocus
                              disabled={disabledDate}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    );

                  case "select":
                    const value = field.id === "vibe" ? vibe : travelers;
                    const setValue =
                      field.id === "vibe" ? setVibe : setTravelers;

                    return (
                      <div key={field.id} className="space-y-3 font-playfair">
                        {label}
                        <Select value={value} onValueChange={setValue}>
                          <SelectTrigger className={fieldClass}>
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl shadow-xl border-0">
                            {field.options &&
                              field?.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>

            <div className="flex justify-center pt-4">
              <button type="submit">
                <PrimaryButton label="Search Trips" />
              </button>
            </div>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-white/20">
            <p className="text-white/80 text-sm">
              Need inspiration?{" "}
              <button className="text-purple-300 hover:text-purple-200 font-medium underline transition-colors duration-200">
                Browse by destination
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

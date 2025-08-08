"use client";

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
  const [travelerType, setTravelerType] = useState("Solo");
  const [vibe, setVibe] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);

  const router = useRouter();

  const fieldClass =
    "h-9 w-full bg-white/90 border border-white/30 text-gray-800 placeholder:font-instrument placeholder:text-gray-500 rounded-md px-3 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 shadow-sm hover:shadow-md text-xs font-medium";

  const formFields = [
    {
      id: "destination",
      label: "Destination",
      icon: <MapPin className="w-4 h-4 text-purple-600" />,
      type: "input",
      placeholder: "Where to?"
    },
    {
      id: "startDate",
      label: "Start Date",
      icon: <Calendar className="w-4 h-4 text-purple-600" />,
      type: "date"
    },
    {
      id: "travelerType",
      label: "Who is Travelling?",
      icon: <Users className="w-4 h-4 text-purple-600" />,
      type: "select",
      options: [
        { value: "Solo", label: "Solo" },
        { value: "Couple", label: "Couple" },
        { value: "With Baby", label: "With Baby" },
        { value: "Friends", label: "Friends" },
        { value: "Family", label: "Family" },
        { value: "Group", label: "Group" },
        { value: "Pet Friendly", label: "Pet Friendly" },
        { value: "Senior", label: "Senior" },
        { value: "Business", label: "Business" },
        { value: "Backpackers", label: "Backpackers" }
      ],
      placeholder: "Select type"
    },
    {
      id: "vibe",
      label: "Vibe",
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      type: "select",
      options: [
        { value: "Culture", label: "Culture" },
        { value: "Adventure", label: "Adventure" },
        { value: "Relaxation", label: "Relaxation" },
        { value: "Nature", label: "Nature" },
        { value: "Nightlife", label: "Nightlife" },
        { value: "Foodie", label: "Foodie" },
        { value: "Luxury", label: "Luxury" },
        { value: "Budget", label: "Budget" },
        { value: "Wellness", label: "Wellness" },
        { value: "Family", label: "Family" }
      ],
      placeholder: "Your mood?"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (vibe) params.append("vibe", vibe);
    if (travelerType) params.append("travelerType", travelerType);
    if (startDate) params.append("startDate", startDate.toISOString());
    console.log("Search params:", params.toString());
    if (destination) params.append("destination", destination);

    router.push(`/trips?${params.toString()}`);
  };

  return (
    <div
      id="filtertrip"
      className="min-h-screen relative flex items-center justify-center px-6 md:px-20 bg-purple-100"
    >
      {/*    <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752787684/1534646_x5pzis.jpg"
          alt="Travel destination"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70" />
      </div> */}

      <div className="relative z-10 w-full max-w-3xl mx-auto py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hidden sm:block"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </motion.div>

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bricolage  font-semibold text-black leading-[1.05] tracking-tighter lowercase">
                find your perfect
                <span className="block text-purple-700 mt-1 sm:mt-2 lowercase">
                  journey
                </span>
              </h1>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                delay: 0.8,
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hidden sm:block"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </motion.div>
          </div>

          <p className="text-sm sm:text-base text-black font-instrument max-w-xl mx-auto font-normal leading-relaxed px-2">
            Discover extraordinary destinations and create unforgettable
            memories
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4 lg:p-6 shadow-2xl mx-1 sm:mx-0">
          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
            {/* Mobile: Stack vertically, Desktop: Grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {formFields.map((field) => {
                const label = (
                  <Label
                    key={`${field.id}-label`}
                    className="text-black/90 font-medium text-xs flex items-center gap-2 mb-2 font-instrument"
                  >
                    {field.icon}
                    {field.label}
                  </Label>
                );

                switch (field.type) {
                  case "input":
                    return (
                      <div
                        key={field.id}
                        className="space-y-2 font-bricolage font-instrument"
                      >
                        {label}
                        <div className="relative">
                          <Input
                            placeholder={field.placeholder}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className={fieldClass + " font-instrument"}
                          />
                          <Search className="absolute right-2 top-2 w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    );

                  case "date":
                    /*  const isStart = field.id === "startDate"; */
                    const date = startDate;
                    const setDate = setStartDate;
                    const open = isStartDateOpen;
                    const setOpen = setIsStartDateOpen;

                    return (
                      <div
                        key={field.id}
                        className="space-y-2 font-bricolage font-instrument"
                      >
                        {label}
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`${fieldClass} justify-start font-instrument`}
                            >
                              <span className="truncate">
                                {date ? format(date, "MMM dd") : "Select date"}
                              </span>
                              <ChevronDown className="ml-auto w-4 h-4 text-gray-500 flex-shrink-0" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-white rounded-xl shadow-xl border-0"
                            side="bottom"
                            align="start"
                            sideOffset={4}
                          >
                            <CalendarComponent
                              mode="single"
                              selected={date}
                              onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                              }}
                              initialFocus
                              disabled={(date: Date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    );

                  case "select":
                    let value = "";
                    let setValue: (v: string) => void = () => {};
                    if (field.id === "vibe") {
                      value = vibe;
                      setValue = setVibe;
                    } else if (field.id === "travelerType") {
                      value = travelerType;
                      setValue = setTravelerType;
                    }

                    return (
                      <div
                        key={field.id}
                        className="space-y-2 z-50 font-bricolage font-instrument"
                      >
                        {label}
                        <Select value={value} onValueChange={setValue}>
                          <SelectTrigger
                            className={fieldClass + " font-instrument"}
                          >
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-59 rounded-xl shadow-xl border-0 max-h-60 overflow-y-auto ">
                            {field.options &&
                              field.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="cursor-pointer font-instrument"
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

            <div className="flex justify-center pt-1 sm:pt-2">
              <div className="w-full flex justify-center sm:w-auto">
                <PrimaryButton label="search trips" type="submit" />
              </div>
            </div>
          </form>

          <div className="text-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20">
            <p className="text-black/80 text-xs font-instrument px-2">
              Need inspiration?{" "}
              <button className="text-purple-300 hover:text-purple-200 font-medium underline transition-colors font-instrument duration-200">
                Browse by vibe
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { MapPin, Calendar, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type DayWiseItinerary = {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string | null;
  accommodation?: string | null;
  travelPlanId: string;
  dayWiseImage?: string | null;
};

export default function TripItinerary({
  itinerary
}: {
  itinerary: DayWiseItinerary[];
}) {
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>(
    {}
  );

  const nextImage = (itemId: string, totalImages: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (itemId: string, totalImages: number) => {
    setImageIndexes((prev) => ({
      ...prev,
      [itemId]:
        prev[itemId] === 0 || !prev[itemId] ? totalImages - 1 : prev[itemId] - 1
    }));
  };

  const getCurrentImageIndex = (itemId: string) => imageIndexes[itemId] || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Trip Itinerary
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Your curated travel schedule at a glance
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <MapPin className="w-4 h-4 mr-2" />
              View Map
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mt-6 sm:mt-10">
        {/* Timeline line */}
        <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-red-500 to-blue-500"></div>

        {itinerary.map((item, index) => {
          const images = Array.isArray(item.dayWiseImage)
            ? item.dayWiseImage
            : [item.dayWiseImage || "https://avatar.iran.liara.run/public"];

          return (
            <div
              key={item.id}
              className="relative mb-10 sm:mb-16 last:mb-0 flex flex-col sm:flex-row"
            >
              <div className="hidden sm:block absolute left-[26px] w-4 h-4 rounded-full border-4 border-white shadow-md z-10 bg-purple-500"></div>

              <div className="sm:ml-20 flex-1">
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm bg-purple-500">
                        {item.dayNumber}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          {item.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs sm:text-sm"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Day {item.dayNumber}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Image Carousel */}
                  <div className="relative h-56 sm:h-80 overflow-hidden">
                    <Image
                      src={images[getCurrentImageIndex(item.id)]}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-500"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(item.id, images.length)}
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => nextImage(item.id, images.length)}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() =>
                                setImageIndexes((prev) => ({
                                  ...prev,
                                  [item.id]: imgIndex
                                }))
                              }
                              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                                imgIndex === getCurrentImageIndex(item.id)
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>

                    {item.activities.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                          Activities
                        </h5>
                        <ul className="space-y-1">
                          {item.activities.map((act) => (
                            <li
                              key={act}
                              className="flex items-center gap-2 text-gray-700 text-sm sm:text-base"
                            >
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.meals && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          Meals
                        </h5>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {item.meals}
                        </p>
                      </div>
                    )}

                    {item.accommodation && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          Accommodation
                        </h5>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {item.accommodation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transport icon */}
              {index < itinerary.length - 1 && (
                <div className="hidden sm:flex absolute left-4 -bottom-6 w-8 h-8 bg-white rounded-full border-2 border-purple-200 items-center justify-center shadow-sm z-10">
                  <Car className="w-4 h-4 text-purple-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

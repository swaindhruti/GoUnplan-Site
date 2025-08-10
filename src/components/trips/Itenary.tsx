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
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Trip Itinerary
              </h1>
              <p className="text-gray-600 mt-2">
                Your curated travel schedule at a glance
              </p>
            </div>
            <Button variant="outline" className="text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              View Map
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mt-10">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-red-500 to-blue-500"></div>

        {itinerary.map((item, index) => {
          const images = Array.isArray(item.dayWiseImage)
            ? item.dayWiseImage
            : [item.dayWiseImage || "https://avatar.iran.liara.run/public"];

          return (
            <div key={item.id} className="relative mb-16 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute left-[26px] w-4 h-4 rounded-full border-4 border-white shadow-md z-10 bg-purple-500"></div>

              {/* Card */}
              <div className="ml-20">
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Header */}
                  <div className="p-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm bg-purple-500">
                        {item.dayNumber}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          {item.title}
                        </h3>
                        <Badge variant="outline" className="mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Day {item.dayNumber}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Image Carousel */}
                  <div className="relative h-80 overflow-hidden">
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
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => nextImage(item.id, images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() =>
                                setImageIndexes((prev) => ({
                                  ...prev,
                                  [item.id]: imgIndex
                                }))
                              }
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
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
                  <div className="p-6 space-y-5">
                    <p className="text-gray-700 leading-relaxed">
                      {item.description}
                    </p>

                    {item.activities.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">
                          Activities
                        </h5>
                        <ul className="space-y-1">
                          {item.activities.map((act) => (
                            <li
                              key={act}
                              className="flex items-center gap-2 text-gray-700"
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
                        <h5 className="font-semibold text-gray-800 mb-1">
                          Meals
                        </h5>
                        <p className="text-gray-700">{item.meals}</p>
                      </div>
                    )}

                    {item.accommodation && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">
                          Accommodation
                        </h5>
                        <p className="text-gray-700">{item.accommodation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transport icon */}
              {index < itinerary.length - 1 && (
                <div className="absolute left-4 -bottom-6 w-8 h-8 bg-white rounded-full border-2 border-purple-200 flex items-center justify-center shadow-sm z-10">
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

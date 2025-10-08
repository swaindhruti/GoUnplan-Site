"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "../ui/button";
import MapViewer from "./MapViewer";

interface MapWrapperProps {
  stops: string[];
  startDate: Date;
}

export const MapWrapper = ({ stops, startDate }: MapWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMap = () => {
    setLoading(true);
    setIsOpen((prev) => !prev);
    
   if (!isOpen) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;

    return {
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayMonth: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      fullDate: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  return (
    <>
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
              {startDate && (
                <p className="text-purple-600 font-medium text-sm mt-1">
                  Starts {formatDate(new Date(startDate))?.fullDate}
                </p>
              )}
            </div>

            <Button
              disabled={loading}
              onClick={toggleMap}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              <MapPin className="w-4 h-4 mr-1" />
              {loading ? "Loading..." :isOpen?"Close Map":"View Map"}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && <MapViewer stops={stops} isOpen={isOpen} />}
    </>
  );
};
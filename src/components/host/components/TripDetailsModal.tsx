"use client";
import React from "react";
import { Trip } from "../types";
import {
  X,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  Map,
  Languages,
  Filter,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { formatDateRange } from "./common/utils";

type TripDetailsModalProps = {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
};

export const TripDetailsModal = ({
  trip,
  isOpen,
  onClose,
}: TripDetailsModalProps) => {
  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on both body and html
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // Prevent touch scrolling on mobile
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0";
    } else {
      // Restore scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen]);

  if (!isOpen || !trip) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <Clock className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Backdrop with blur - Ensure full coverage */}
      <div
        className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-50 transition-all duration-300"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: "100vh",
          minWidth: "100vw",
        }}
        onClick={onClose}
      />

      {/* Modal Container - Fixed positioning with proper scrolling */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        <div className="w-full max-w-4xl h-full flex items-center justify-center">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Image - Fixed height */}
            <div className="relative flex-shrink-0">
              <div className="relative h-56 w-full">
                <Image
                  src={trip.tripImage || "https://avatar.iran.liara.run/public"}
                  alt={trip.title}
                  fill
                  className="object-cover rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1.5 rounded-full border text-sm font-semibold flex items-center gap-1.5 ${getStatusColor(
                      trip.status
                    )}`}
                  >
                    {getStatusIcon(trip.status)}
                    {trip.status}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white font-bricolage mb-2">
                    {trip.title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    {trip.destination && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {trip.destination}
                      </span>
                    )}
                    {trip.noOfDays && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {trip.noOfDays} days
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                {/* Key Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-instrument">
                          Price per person
                        </p>
                        <p className="text-2xl font-bold text-purple-700 font-bricolage">
                          {formatCurrency(trip.price)}
                        </p>
                      </div>
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Participants Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-instrument">
                          Max Participants
                        </p>
                        <p className="text-2xl font-bold text-emerald-700 font-bricolage">
                          {trip.maxParticipants || "N/A"}
                        </p>
                      </div>
                      <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  {/* Rating Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-instrument">
                          Average Rating
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold text-amber-700 font-bricolage">
                            {trip.averageRating
                              ? trip.averageRating.toFixed(1)
                              : "0.0"}
                          </p>
                          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        </div>
                      </div>
                      <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-amber-700">
                          {trip.reviewCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 font-bricolage flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-instrument">
                    {trip.description || "No description available."}
                  </p>
                </div>

                {/* Location & Date Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 font-bricolage flex items-center gap-2">
                      <Map className="h-5 w-5 text-blue-600" />
                      Location Details
                    </h3>
                    <div className="space-y-2">
                      {trip.city && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium font-instrument">
                            City:
                          </span>
                          <span className="font-instrument">{trip.city}</span>
                        </div>
                      )}
                      {trip.state && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium font-instrument">
                            State:
                          </span>
                          <span className="font-instrument">{trip.state}</span>
                        </div>
                      )}
                      {trip.destination && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium font-instrument">
                            Destination:
                          </span>
                          <span className="font-instrument">
                            {trip.destination}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date Card */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 font-bricolage flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Trip Dates
                    </h3>
                    <div className="space-y-2">
                      {trip.startDate && trip.endDate ? (
                        <>
                          <div className="text-gray-700 font-instrument">
                            <span className="font-medium">Duration:</span>{" "}
                            {formatDateRange(trip.startDate, trip.endDate)}
                          </div>
                          <div className="text-gray-700 font-instrument">
                            <span className="font-medium">Total Days:</span>{" "}
                            {trip.noOfDays}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 font-instrument">
                          Dates not specified
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day-wise Itinerary */}
                {trip.dayWiseData && trip.dayWiseData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-bricolage flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Day-wise Itinerary
                    </h3>
                    <div className="space-y-4">
                      {trip.dayWiseData.map((day, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100"
                        >
                          <div className="flex items-start gap-4">
                            {/* Day Number Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {day.dayNumber}
                              </div>
                            </div>

                            {/* Day Content */}
                            <div className="flex-1 space-y-3">
                              {/* Day Title */}
                              <h4 className="text-lg font-semibold text-gray-900 font-bricolage">
                                {day.title || `Day ${day.dayNumber}`}
                              </h4>

                              {/* Day Description */}
                              {day.description && (
                                <p className="text-gray-700 font-instrument">
                                  {day.description}
                                </p>
                              )}

                              {/* Day Details Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Activities */}
                                {day.activities &&
                                  day.activities.length > 0 && (
                                    <div className="bg-white/60 rounded-lg p-3">
                                      <h5 className="font-medium text-gray-800 mb-2 text-sm font-instrument flex items-center gap-1.5">
                                        <Activity className="h-4 w-4 text-green-600" />
                                        Activities
                                      </h5>
                                      <div className="space-y-1">
                                        {day.activities.map(
                                          (activity, actIndex) => (
                                            <span
                                              key={actIndex}
                                              className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-instrument mr-1 mb-1"
                                            >
                                              {activity}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Meals */}
                                {day.meals && (
                                  <div className="bg-white/60 rounded-lg p-3">
                                    <h5 className="font-medium text-gray-800 mb-2 text-sm font-instrument flex items-center gap-1.5">
                                      <DollarSign className="h-4 w-4 text-orange-600" />
                                      Meals
                                    </h5>
                                    <p className="text-gray-700 text-sm font-instrument">
                                      {day.meals}
                                    </p>
                                  </div>
                                )}

                                {/* Accommodation */}
                                {day.accommodation && (
                                  <div className="bg-white/60 rounded-lg p-3">
                                    <h5 className="font-medium text-gray-800 mb-2 text-sm font-instrument flex items-center gap-1.5">
                                      <MapPin className="h-4 w-4 text-blue-600" />
                                      Stay
                                    </h5>
                                    <p className="text-gray-700 text-sm font-instrument">
                                      {day.accommodation}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Day Image */}
                              {day.dayWiseImage && (
                                <div className="mt-3">
                                  <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                    <Image
                                      src={day.dayWiseImage}
                                      alt={`Day ${day.dayNumber} image`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filters and Languages */}
                {((trip.filters && trip.filters.length > 0) ||
                  (trip.languages && trip.languages.length > 0)) && (
                  <div className="space-y-4">
                    {/* Filters */}
                    {trip.filters && trip.filters.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-bricolage flex items-center gap-2">
                          <Filter className="h-5 w-5 text-purple-600" />
                          Trip Filters
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {trip.filters.map((filter: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium font-instrument"
                            >
                              {filter}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {trip.languages && trip.languages.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-bricolage flex items-center gap-2">
                          <Languages className="h-5 w-5 text-blue-600" />
                          Languages Supported
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {trip.languages.map(
                            (language: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium font-instrument"
                              >
                                {language}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium font-instrument"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `/dashboard/host/create-new-task?tripId=${trip.travelPlanId}`;
                    }}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium font-instrument"
                  >
                    Edit Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

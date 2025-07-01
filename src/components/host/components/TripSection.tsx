"use client";
import { useState, useMemo } from "react";
import { Trip } from "../types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StatusBadge } from "./common/StatusBadge";
import { formatDateRange } from "./common/utils";
import {
  Plus,
  Map,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText,
} from "lucide-react";

type TripSectionProps = {
  trips: Trip[];
  loading: boolean;
  error: string | null;
};

export const TripSection = ({ trips, loading, error }: TripSectionProps) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const filteredTrips = useMemo(() => {
    if (statusFilter === "all") return trips;
    return trips.filter(
      (trip) => trip.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [trips, statusFilter]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-black uppercase tracking-tight -rotate-1">
            Your Trips
          </h2>
          <p className="mt-1 text-gray-700 font-bold">
            Create and manage your travel experiences
          </p>
        </div>
        <Link
          href="/dashboard/host/create-new-task"
          className="inline-flex items-center px-6 py-3 bg-green-500 text-black font-extrabold rounded-md hover:bg-green-400 transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-3 border-black hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Trip
        </Link>
      </div>

      <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden relative">
        {/* Decorative elements */}

        <div className="absolute bottom-4 left-8 h-8 w-8 bg-yellow-300 border-3 border-black rounded-lg -rotate-6"></div>

        <div className="border-b-4 border-black bg-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white uppercase">
                Trip Overview
              </h3>
              <p className="text-sm text-white font-bold">
                Manage all your trips and their details
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 text-sm font-extrabold uppercase border-3 border-black rounded-md transition-transform ${
                  statusFilter === "all"
                    ? "bg-yellow-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                    : "bg-white text-black hover:bg-gray-100 hover:-translate-y-1"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 text-sm font-extrabold uppercase border-3 border-black rounded-md transition-transform ${
                  statusFilter === "active"
                    ? "bg-green-500 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                    : "bg-white text-black hover:bg-gray-100 hover:-translate-y-1"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-4 py-2 text-sm font-extrabold uppercase border-3 border-black rounded-md transition-transform ${
                  statusFilter === "draft"
                    ? "bg-blue-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                    : "bg-white text-black hover:bg-gray-100 hover:-translate-y-1"
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-bounce bg-yellow-300 border-3 border-black rounded-lg h-16 w-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <Calendar className="h-8 w-8 text-black" />
            </div>
            <span className="text-xl font-bold text-black">
              Loading your trips...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-red-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3 mb-4">
                <AlertTriangle className="h-10 w-10 text-black" />
              </div>
              <p className="mt-2 text-xl font-bold text-black">{error}</p>
            </div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-blue-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3 mb-4">
                <FileText className="h-10 w-10 text-black" />
              </div>
              <p className="mt-2 text-xl font-bold text-black">
                {trips.length === 0
                  ? "No trips found. Start by creating a new one!"
                  : `No ${statusFilter} trips found.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-yellow-300 border-b-3 border-black">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                    Bookings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-black uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-black">
                {filteredTrips.map((trip, index) => (
                  <tr
                    key={trip.travelPlanId}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`h-12 w-12 rounded-md bg-${
                            [
                              "pink-500",
                              "blue-400",
                              "green-500",
                              "yellow-300",
                              "purple-400",
                            ][index % 5]
                          } border-2 border-black flex items-center justify-center text-black font-black text-lg mr-4 ${
                            index % 2 === 0 ? "rotate-2" : "-rotate-2"
                          }`}
                        >
                          {trip.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-black">
                            {trip.title}
                          </div>
                          <div className="text-sm text-gray-700 max-w-xs truncate">
                            {trip.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-black">
                        <Map className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          {trip.destination}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-black">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          {trip.startDate &&
                            trip.endDate &&
                            formatDateRange(trip.startDate, trip.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-green-500 border-2 border-black rounded px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          <span className="font-bold text-black">
                            ₹{trip.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-8 bg-blue-400 border-2 border-black rounded-full flex items-center justify-center font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                        {Math.floor(Math.random() * 10)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => {
                          router.push(`/dashboard/host/${trip.travelPlanId}`);
                        }}
                        className="bg-pink-500 text-black font-extrabold border-2 border-black hover:bg-pink-400 shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

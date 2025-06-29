"use client";
import { useState, useMemo } from "react";
import { Trip } from "../types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StatusBadge } from "./common/StatusBadge";
import { formatDateRange } from "./common/utils";

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
          <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
          <p className="mt-1 text-gray-600">
            Create and manage your travel experiences
          </p>
        </div>
        <Link
          href="/dashboard/host/create-new-task"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Trip
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Trip Overview
              </h3>
              <p className="text-sm text-gray-600">
                Manage all your trips and their details
              </p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === "all"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === "active"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === "draft"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading your trips...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.734-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="mt-2 text-red-600 font-medium">{error}</p>
            </div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mt-2 text-gray-600">
                {trips.length === 0
                  ? "No trips found. Start by creating a new one!"
                  : `No ${statusFilter} trips found.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Bookings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrips.map((trip) => (
                  <tr
                    key={trip.travelPlanId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-4">
                          {trip.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {trip.title}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {trip.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">
                          {trip.startDate &&
                            trip.endDate &&
                            formatDateRange(trip.startDate, trip.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        <span className="font-semibold">
                          ₹{trip.price.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-semibold text-gray-900">
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
                        className="text-purple-600 bg-white hover:text-purple-800 font-medium text-sm"
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

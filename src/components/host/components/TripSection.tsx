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
  TrendingUp,
  Users,
  Star,
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

  const stats = useMemo(() => {
    const totalTrips = trips.length;
    const activeTrips = trips.filter(
      (t) => t.status.toLowerCase() === "active"
    ).length;
    const draftTrips = trips.filter(
      (t) => t.status.toLowerCase() === "draft"
    ).length;
    const totalRevenue = trips.reduce((sum, trip) => sum + trip.price, 0);

    return { totalTrips, activeTrips, draftTrips, totalRevenue };
  }, [trips]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
            <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase">
              Experience Management
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Your Travel Experiences
          </h2>
          <p className="text-slate-600 font-medium">
            Create and manage your curated travel experiences with precision
          </p>
        </div>
        <Link
          href="/dashboard/host/create-new-task"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Experience
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-purple-600">
              {stats.totalTrips}
            </span>
          </div>
          <h3 className="text-slate-700 font-semibold text-lg mb-1">
            Total Experiences
          </h3>
          <p className="text-slate-500 text-base">All your created trips</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-3xl font-bold text-emerald-600">
              {stats.activeTrips}
            </span>
          </div>
          <h3 className="text-slate-700 font-semibold text-lg mb-1">
            Active Experiences
          </h3>
          <p className="text-slate-500 text-base">Currently available</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-blue-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
          </div>
          <h3 className="text-slate-700 font-semibold text-lg mb-1">
            Total Value
          </h3>
          <p className="text-slate-500 text-base">Combined trip value</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-orange-600">
              {stats.draftTrips}
            </span>
          </div>
          <h3 className="text-slate-700 font-semibold text-lg mb-1">
            Draft Experiences
          </h3>
          <p className="text-slate-500 text-base">In development</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Experience Overview
              </h3>
              <p className="text-slate-600 font-medium text-base">
                Manage all your trips and their performance metrics
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  statusFilter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  statusFilter === "active"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  statusFilter === "draft"
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <span className="text-xl font-semibold text-slate-900">
              Loading your experiences...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-xl font-semibold text-slate-900">{error}</p>
            </div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-purple-600" />
              </div>
              <p className="text-xl font-semibold text-slate-900">
                {trips.length === 0
                  ? "No experiences found. Start by creating your first one!"
                  : `No ${statusFilter} experiences found.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Bookings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredTrips.map((trip) => (
                  <tr
                    key={trip.travelPlanId}
                    className="hover:bg-slate-50 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-lg mr-4 shadow-lg">
                          {trip.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                            {trip.title}
                          </div>
                          <div className="text-slate-600 max-w-xs truncate text-base">
                            {trip.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-700">
                        <Map className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="text-base font-medium">
                          {trip.destination}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-700">
                        <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="text-base font-medium">
                          {trip.startDate &&
                            trip.endDate &&
                            formatDateRange(trip.startDate, trip.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-lg px-3 py-2 font-semibold border border-emerald-200 text-base">
                          <DollarSign className="w-4 h-4 inline mr-1" />₹
                          {trip.price.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center font-semibold text-purple-700 shadow-sm text-base">
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
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
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

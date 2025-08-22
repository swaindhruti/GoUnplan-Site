"use client";
import { useEffect, useState } from "react";
import { getAllTrips, getRevenueAnalytics } from "@/actions/host/action";
import { TripSection } from "./components/TripSection";
import { ProfileSection } from "./components/ProfileSection";
import { BookingsSection } from "./components/BookingsSection";
import { BookingsHistory } from "./components/BookingsHistory";
import { EarningsSection } from "./components/EarningsSection";
import { MessageSection } from "./components/MessageSection";
import { HostData, RevenueAnalytics, Trip, TabType } from "./types";

type HostLandingProps = {
  hostData: HostData;
};

export const HostLanding = ({ hostData }: HostLandingProps) => {
  // State management
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("trips");
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState<string | null>(null);

  // Fetch trips data
  useEffect(() => {
    const getTripData = async () => {
      try {
        const response = await getAllTrips();

        if ("error" in response) {
          setError(response?.error || null);
        } else {
          setTrips(response?.trips as Trip[]);
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Something went wrong while fetching trips.");
      } finally {
        setLoading(false);
      }
    };
    getTripData();
  }, []);

  // Load revenue data when earnings tab is selected
  useEffect(() => {
    if (activeTab === "earnings") {
      const fetchRevenueData = async () => {
        setRevenueLoading(true);
        setRevenueError(null);

        try {
          const response = await getRevenueAnalytics();
          if ("error" in response) {
            setRevenueError(response.error as string);
          } else if (response.success) {
            setRevenueData(response.revenueData as RevenueAnalytics);
          }
        } catch (err) {
          console.error("Error fetching revenue analytics:", err);
          setRevenueError("Failed to load revenue data");
        } finally {
          setRevenueLoading(false);
        }
      };

      fetchRevenueData();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-instrument">
            Loading host dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-instrument">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  Host Dashboard
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                Welcome back, {hostData.name}
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                Manage your travel experiences and grow your hosting business
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-4 rounded-full">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-2 overflow-x-auto py-4">
            {[
              {
                id: "trips",
                label: "TRIPS",
                icon: "🗺️",
                description: "Manage Experiences",
              },
              {
                id: "profile",
                label: "PROFILE",
                icon: "👤",
                description: "Personal Settings",
              },
              {
                id: "bookings",
                label: "BOOKINGS",
                icon: "📅",
                description: "Guest Management",
              },
              {
                id: "bookingsHistory",
                label: "HISTORY",
                icon: "📋",
                description: "All Bookings",
              },
              {
                id: "earnings",
                label: "EARNINGS",
                icon: "💰",
                description: "Revenue Analytics",
              },
              {
                id: "messages",
                label: "MESSAGES",
                icon: "💬",
                description: "Communication",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  px-6 py-3 rounded-full font-instrument font-semibold text-sm transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "trips" && (
          <TripSection trips={trips} loading={loading} error={error} />
        )}

        {activeTab === "profile" && <ProfileSection hostData={hostData} />}

        {activeTab === "bookings" && <BookingsSection />}

        {activeTab === "bookingsHistory" && <BookingsHistory />}

        {activeTab === "earnings" && (
          <EarningsSection
            revenueData={revenueData}
            revenueLoading={revenueLoading}
            revenueError={revenueError}
          />
        )}

        {activeTab === "messages" && (
          <MessageSection userSession={hostData.id || ""} />
        )}
      </div>
    </div>
  );
};

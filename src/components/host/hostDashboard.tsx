"use client";
import { useEffect, useState } from "react";
import { getAllTrips, getRevenueAnalytics } from "@/actions/host/action";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { TripSection } from "./components/TripSection";
import { ProfileSection } from "./components/ProfileSection";
import { BookingsSection } from "./components/BookingsSection";
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
          setTrips(response?.trips);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header hostData={hostData} />

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "trips" && (
          <TripSection trips={trips} loading={loading} error={error} />
        )}

        {activeTab === "profile" && <ProfileSection hostData={hostData} />}

        {activeTab === "bookings" && <BookingsSection />}

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

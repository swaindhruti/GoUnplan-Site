"use client";
import { RevenueAnalytics } from "../types";
import { StatCard } from "./common/StatCard";
import { DollarSign, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";

type EarningsSectionProps = {
  revenueData: RevenueAnalytics | null;
  revenueLoading: boolean;
  revenueError: string | null;
};

export const EarningsSection = ({
  revenueData,
  revenueLoading,
  revenueError,
}: EarningsSectionProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Revenue Analytics
          </h2>
          <p className="mt-1 text-gray-600">
            Track your earnings, bookings, and financial performance
          </p>
        </div>
      </div>

      {revenueLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading revenue data...</span>
        </div>
      ) : revenueError ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <p className="mt-2 text-red-600 font-medium">{revenueError}</p>
          </div>
        </div>
      ) : revenueData ? (
        <>
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Net Revenue"
              value={`₹${revenueData.summary.netRevenue.toLocaleString()}`}
              icon={<DollarSign size={20} />}
              color="green"
            />

            <StatCard
              title="Confirmed Bookings"
              value={revenueData.confirmed.bookingCount}
              icon={<BarChart3 size={20} />}
              subtitle={`₹${revenueData.confirmed.revenue.toLocaleString()} total revenue`}
              color="blue"
            />

            <StatCard
              title="Cancellation Rate"
              value={`${revenueData.summary.cancellationRate}%`}
              icon={<AlertCircle size={20} />}
              subtitle={`${revenueData.cancelled.bookingCount} cancelled bookings`}
              color={
                revenueData.summary.cancellationRate > 10 ? "red" : "yellow"
              }
            />

            <StatCard
              title="Revenue at Risk"
              value={`₹${revenueData.summary.revenueAtRisk.toLocaleString()}`}
              icon={<TrendingDown size={20} />}
              subtitle={`${revenueData.pending.bookingCount} pending bookings`}
              color="yellow"
            />
          </div>

          {/* Detailed Revenue Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confirmed Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmed Bookings
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-gray-900">
                      ₹{revenueData.confirmed.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Number of Bookings</span>
                    <span className="font-semibold text-gray-900">
                      {revenueData.confirmed.bookingCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Booking Value</span>
                    <span className="font-semibold text-gray-900">
                      ₹
                      {revenueData.confirmed.bookingCount > 0
                        ? Math.round(
                            revenueData.confirmed.revenue /
                              revenueData.confirmed.bookingCount
                          ).toLocaleString()
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancelled Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancelled Bookings
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Booking Value</span>
                    <span className="font-semibold text-gray-900">
                      ₹{revenueData.cancelled.bookingValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Refunds</span>
                    <span className="font-semibold text-red-600">
                      ₹{revenueData.cancelled.refundAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Number of Cancellations
                    </span>
                    <span className="font-semibold text-gray-900">
                      {revenueData.cancelled.bookingCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Monthly Revenue Analysis
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">
                    {revenueData.monthlyTrend.length === 0
                      ? "No monthly trend data available yet"
                      : "Monthly trend data available. Implement chart visualization here."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <p className="mt-2 text-gray-600">No revenue data available</p>
          </div>
        </div>
      )}
    </>
  );
};

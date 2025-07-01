"use client";
import { RevenueAnalytics } from "../types";
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
          <h2 className="text-3xl font-black text-black uppercase tracking-tight">
            Revenue Analytics
          </h2>
          <p className="mt-1 text-gray-700 font-bold">
            Track your earnings, bookings, and financial performance
          </p>
        </div>
      </div>

      {revenueLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-bounce bg-yellow-300 border-3 border-black rounded-lg h-16 w-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <DollarSign className="h-8 w-8 text-black" />
          </div>
          <span className="text-xl font-bold text-black">
            Loading revenue data...
          </span>
        </div>
      ) : revenueError ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <AlertCircle className="h-10 w-10 text-black" />
            </div>
            <p className="mt-2 text-xl font-bold text-black">{revenueError}</p>
          </div>
        </div>
      ) : revenueData ? (
        <>
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-500 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-black uppercase">
                  Net Revenue
                </h3>
                <div className="h-10 w-10 bg-white border-3 border-black rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-black" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-black text-black">
                ₹{revenueData.summary.netRevenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-blue-400 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-black uppercase">
                  Confirmed Bookings
                </h3>
                <div className="h-10 w-10 bg-white border-3 border-black rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-black" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-black text-black">
                {revenueData.confirmed.bookingCount}
              </p>
              <p className="mt-1 text-sm font-extrabold text-black">
                ₹{revenueData.confirmed.revenue.toLocaleString()} total revenue
              </p>
            </div>

            <div
              className={`${
                revenueData.summary.cancellationRate > 10
                  ? "bg-red-400"
                  : "bg-yellow-300"
              } rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden p-6`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-black uppercase">
                  Cancellation Rate
                </h3>
                <div className="h-10 w-10 bg-white border-3 border-black rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-black" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-black text-black">
                {revenueData.summary.cancellationRate}%
              </p>
              <p className="mt-1 text-sm font-extrabold text-black">
                {revenueData.cancelled.bookingCount} cancelled bookings
              </p>
            </div>

            <div className="bg-yellow-300 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-black uppercase">
                  Revenue at Risk
                </h3>
                <div className="h-10 w-10 bg-white border-3 border-black rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-black" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-black text-black">
                ₹{revenueData.summary.revenueAtRisk.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-extrabold text-black">
                {revenueData.pending.bookingCount} pending bookings
              </p>
            </div>
          </div>

          {/* Detailed Revenue Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confirmed Bookings */}
            <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
              <div className="border-b-4 border-black bg-purple-600 px-6 py-4">
                <h3 className="text-xl font-black text-white uppercase">
                  Confirmed Bookings
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold">Total Revenue</span>
                    <span className="font-extrabold text-black bg-green-500 border-2 border-black rounded-md px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      ₹{revenueData.confirmed.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold">
                      Number of Bookings
                    </span>
                    <span className="font-extrabold text-black bg-blue-400 border-2 border-black rounded-md px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      {revenueData.confirmed.bookingCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold">
                      Average Booking Value
                    </span>
                    <span className="font-extrabold text-black bg-yellow-300 border-2 border-black rounded-md px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
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
            <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
              <div className="border-b-4 border-black bg-pink-500 px-6 py-4">
                <h3 className="text-xl font-black text-black uppercase">
                  Cancelled Bookings
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold">
                      Total Booking Value
                    </span>
                    <span className="font-extrabold text-black bg-blue-400 border-2 border-black rounded-md px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      ₹{revenueData.cancelled.bookingValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold">Total Refunds</span>
                    <span className="font-extrabold text-black bg-red-400 border-2 border-black rounded-md px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      ₹{revenueData.cancelled.refundAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold">
                      Number of Cancellations
                    </span>
                    <span className="font-extrabold text-black bg-yellow-300 border-2 border-black rounded-md px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      {revenueData.cancelled.bookingCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Analysis */}
            <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden lg:col-span-2">
              <div className="border-b-4 border-black bg-blue-400 px-6 py-4">
                <h3 className="text-xl font-black text-black uppercase">
                  Monthly Revenue Analysis
                </h3>
              </div>
              <div className="p-6 relative">
                {/* Decorative elements */}
                <div className="absolute bottom-4 right-8 h-8 w-8 bg-yellow-300 border-3 border-black rounded-lg"></div>
                <div className="absolute top-4 left-8 h-6 w-6 bg-pink-500 border-2 border-black rounded-full"></div>

                <div className="flex items-center justify-center h-64">
                  <p className="text-black font-bold px-4 py-3 bg-gray-100 border-3 border-black rounded-md">
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
        <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-blue-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <DollarSign className="h-10 w-10 text-black" />
            </div>
            <p className="mt-2 text-xl font-bold text-black">
              No revenue data available
            </p>
          </div>
        </div>
      )}
    </>
  );
};

"use client";
import { RevenueAnalytics } from "../types";
import {
  DollarSign,
  TrendingDown,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";

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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" />
            <span className="text-emerald-600 text-sm font-semibold tracking-wide uppercase">
              Financial Analytics
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Revenue Analytics
          </h2>
          <p className="text-slate-600 font-medium">
            Track your earnings, bookings, and financial performance with
            precision
          </p>
        </div>
      </div>

      {revenueLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <DollarSign className="h-8 w-8 text-emerald-600" />
          </div>
          <span className="text-xl font-semibold text-slate-900">
            Loading revenue data...
          </span>
        </div>
      ) : revenueError ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {revenueError}
            </p>
          </div>
        </div>
      ) : revenueData ? (
        <>
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">
                    ₹{revenueData.summary.netRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-emerald-500 font-medium">
                    +12.5%
                  </div>
                </div>
              </div>
              <h3 className="text-slate-700 font-semibold text-lg mb-1">
                Net Revenue
              </h3>
              <p className="text-slate-500 text-base">
                Total earnings after fees
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    {revenueData.confirmed.bookingCount}
                  </div>
                  <div className="text-sm text-purple-500 font-medium">
                    +8.2%
                  </div>
                </div>
              </div>
              <h3 className="text-slate-700 font-semibold text-lg mb-1">
                Confirmed Bookings
              </h3>
              <p className="text-slate-500 text-base">
                Successful reservations
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">
                    {revenueData.summary.cancellationRate}%
                  </div>
                  <div className="text-sm text-orange-500 font-medium">
                    -2.1%
                  </div>
                </div>
              </div>
              <h3 className="text-slate-700 font-semibold text-lg mb-1">
                Cancellation Rate
              </h3>
              <p className="text-slate-500 text-base">Cancelled bookings</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">
                    ₹{revenueData.summary.revenueAtRisk.toLocaleString()}
                  </div>
                  <div className="text-sm text-red-500 font-medium">+5.3%</div>
                </div>
              </div>
              <h3 className="text-slate-700 font-semibold text-lg mb-1">
                Revenue at Risk
              </h3>
              <p className="text-slate-500 text-base">Pending confirmations</p>
            </div>
          </div>

          {/* Detailed Revenue Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Confirmed Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Confirmed Bookings
                    </h3>
                    <p className="text-slate-600 font-medium text-base">
                      Successful reservations and revenue
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div>
                      <span className="text-slate-700 font-semibold text-base">
                        Total Revenue
                      </span>
                      <p className="text-slate-500 text-base">
                        From confirmed bookings
                      </p>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-100 rounded-lg px-4 py-2 text-base">
                      ₹{revenueData.confirmed.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                    <div>
                      <span className="text-slate-700 font-semibold text-base">
                        Number of Bookings
                      </span>
                      <p className="text-slate-500 text-base">
                        Confirmed reservations
                      </p>
                    </div>
                    <span className="font-bold text-purple-700 bg-purple-100 rounded-lg px-4 py-2 text-base">
                      {revenueData.confirmed.bookingCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div>
                      <span className="text-slate-700 font-semibold text-base">
                        Average Booking Value
                      </span>
                      <p className="text-slate-500 text-base">
                        Per confirmed booking
                      </p>
                    </div>
                    <span className="font-bold text-blue-700 bg-blue-100 rounded-lg px-4 py-2 text-base">
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Cancelled Bookings
                    </h3>
                    <p className="text-slate-600 font-medium text-base">
                      Cancellations and refunds
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div>
                      <span className="text-slate-700 font-semibold text-base">
                        Total Booking Value
                      </span>
                      <p className="text-slate-500 text-base">
                        Before cancellation
                      </p>
                    </div>
                    <span className="font-bold text-blue-700 bg-blue-100 rounded-lg px-4 py-2 text-base">
                      ₹{revenueData.cancelled.bookingValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <div>
                      <span className="text-slate-700 font-semibold text-base">
                        Total Refunds
                      </span>
                      <p className="text-slate-500 text-base">
                        Processed refunds
                      </p>
                    </div>
                    <span className="font-bold text-red-700 bg-red-100 rounded-lg px-4 py-2 text-base">
                      ₹{revenueData.cancelled.refundAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                    <div>
                      <span className="text-slate-700 font-semibold text-base">
                        Number of Cancellations
                      </span>
                      <p className="text-slate-500 text-base">
                        Cancelled bookings
                      </p>
                    </div>
                    <span className="font-bold text-orange-700 bg-orange-100 rounded-lg px-4 py-2 text-base">
                      {revenueData.cancelled.bookingCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
              <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Monthly Revenue Analysis
                    </h3>
                    <p className="text-slate-600 font-medium text-base">
                      Revenue trends and performance insights
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl border border-slate-200">
                    <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium text-base">
                      {revenueData.monthlyTrend.length === 0
                        ? "No monthly trend data available yet"
                        : "Monthly trend data available. Implement chart visualization here."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <DollarSign className="h-10 w-10 text-emerald-600" />
            </div>
            <p className="text-xl font-semibold text-slate-900">
              No revenue data available
            </p>
          </div>
        </div>
      )}
    </>
  );
};

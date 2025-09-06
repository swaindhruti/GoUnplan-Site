"use client";
import { RevenueAnalytics } from "../types";
import {
  DollarSign,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
          {/* Simplified Earnings Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-emerald-100 rounded flex items-center justify-center">
                  <DollarSign className="h-3 w-3 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-emerald-600">
                  Fully Paid
                </span>
              </div>
              <div className="text-lg font-bold text-emerald-600">
                ₹{revenueData.fullyPaid.revenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {revenueData.fullyPaid.bookingCount} bookings
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600">
                  Partial
                </span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                ₹{revenueData.partiallyPaid.amountReceived.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {revenueData.partiallyPaid.bookingCount} bookings
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-orange-100 rounded flex items-center justify-center">
                  <Clock className="h-3 w-3 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600">
                  Pending
                </span>
              </div>
              <div className="text-lg font-bold text-orange-600">
                ₹{revenueData.pending.bookingValue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {revenueData.pending.bookingCount} bookings
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-red-100 rounded flex items-center justify-center">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-600">
                  Overdue
                </span>
              </div>
              <div className="text-lg font-bold text-red-600">
                ₹{revenueData.overdue.bookingValue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {revenueData.overdue.bookingCount} bookings
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Cancelled
                </span>
              </div>
              <div className="text-lg font-bold text-gray-600">
                ₹{revenueData.cancelled.bookingValue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {revenueData.cancelled.bookingCount} bookings
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-purple-100 rounded flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-600">
                  Total Collected
                </span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                ₹{revenueData.summary.receivedRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {revenueData.summary.collectionEfficiency}% efficiency
              </div>
            </div>
          </div>

          {/* Monthly Revenue Analysis Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Monthly Revenue Analytics
                  </h3>
                  <p className="text-slate-600 font-medium text-base">
                    Time vs Sales Performance
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="p-6">
              {(() => {
                const monthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];

                // Use actual monthly trend data from backend
                const chartData =
                  revenueData.monthlyTrend &&
                  revenueData.monthlyTrend.length > 0
                    ? revenueData.monthlyTrend.map((item) => ({
                        month: `${monthNames[item.monthNum]} ${item.year
                          .toString()
                          .slice(-2)}`,
                        fullyPaid: item.fullyPaidRevenue,
                        partiallyPaid: item.partiallyPaidRevenue,
                        pending: item.pendingRevenue,
                        totalRevenue:
                          item.fullyPaidRevenue +
                          item.partiallyPaidRevenue +
                          item.pendingRevenue,
                        bookings: item.totalBookings,
                      }))
                    : // Fallback to generated data if no actual data
                      (() => {
                        const data = [];
                        const currentMonth = new Date().getMonth();
                        const currentYear = new Date().getFullYear();

                        for (let i = 5; i >= 0; i--) {
                          const monthIndex = (currentMonth - i + 12) % 12;
                          const year =
                            currentMonth - i < 0
                              ? currentYear - 1
                              : currentYear;

                          data.push({
                            month: `${monthNames[monthIndex]} ${year
                              .toString()
                              .slice(-2)}`,
                            fullyPaid: 0,
                            partiallyPaid: 0,
                            pending: 0,
                            totalRevenue: 0,
                            bookings: 0,
                          });
                        }
                        return data;
                      })();

                // Calculate dynamic Y-axis domain
                const maxValue = Math.max(
                  ...chartData.map((item) => item.totalRevenue)
                );
                const dynamicDomain =
                  maxValue > 0 ? [0, Math.ceil(maxValue * 1.1)] : [0, 100000];

                // Custom tooltip
                const CustomTooltip = ({
                  active,
                  payload,
                  label,
                }: {
                  active?: boolean;
                  payload?: Array<{
                    value: number;
                    dataKey?: string;
                    color?: string;
                    payload: {
                      bookings: number;
                      fullyPaid: number;
                      partiallyPaid: number;
                      pending: number;
                      totalRevenue: number;
                    };
                  }>;
                  label?: string;
                }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0]?.payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 mb-2">
                          {label}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-emerald-600 font-medium">
                            Fully Paid: ₹
                            {data?.fullyPaid?.toLocaleString() || 0}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            Partially Paid: ₹
                            {data?.partiallyPaid?.toLocaleString() || 0}
                          </p>
                          <p className="text-sm text-orange-600 font-medium">
                            Pending: ₹{data?.pending?.toLocaleString() || 0}
                          </p>
                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <p className="text-sm text-purple-600 font-medium">
                              Total: ₹
                              {data?.totalRevenue?.toLocaleString() || 0}
                            </p>
                            <p className="text-sm text-indigo-600 font-medium">
                              Bookings: {data?.bookings || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                };

                return (
                  <div className="space-y-4">
                    {/* Main Revenue Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorFullyPaid"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorPartiallyPaid"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorPending"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f59e0b"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f59e0b"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="month"
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                          />
                          <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                            domain={dynamicDomain}
                            tickFormatter={(value) => {
                              if (value === 0) return "₹0";
                              if (value >= 100000)
                                return `₹${(value / 100000).toFixed(1)}L`;
                              if (value >= 1000)
                                return `₹${(value / 1000).toFixed(0)}k`;
                              return `₹${value}`;
                            }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            wrapperStyle={{ fontSize: "14px" }}
                            iconType="rect"
                          />
                          <Area
                            type="monotone"
                            dataKey="fullyPaid"
                            stackId="1"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={0.8}
                            fill="url(#colorFullyPaid)"
                            name="Fully Paid (₹)"
                          />
                          <Area
                            type="monotone"
                            dataKey="partiallyPaid"
                            stackId="1"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={0.8}
                            fill="url(#colorPartiallyPaid)"
                            name="Partially Paid (₹)"
                          />
                          <Area
                            type="monotone"
                            dataKey="pending"
                            stackId="1"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            fillOpacity={0.8}
                            fill="url(#colorPending)"
                            name="Pending (₹)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Monthly Booking Count Bars */}
                    <div className="grid grid-cols-6 gap-2">
                      {chartData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="bg-gradient-to-t from-indigo-100 to-indigo-50 rounded-lg p-3 border border-indigo-200">
                            <div className="text-2xl font-bold text-indigo-600">
                              {item.bookings}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Bookings
                            </div>
                            <div className="text-xs font-medium text-gray-700 mt-1">
                              {item.month}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
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

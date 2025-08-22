"use client";
import { RevenueAnalytics } from "../types";
import {
  DollarSign,
  TrendingDown,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Target,
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
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">
                    ₹{revenueData.confirmed.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-emerald-500 font-medium">
                    Confirmed
                  </div>
                </div>
              </div>
              <h3 className="text-slate-700 font-semibold text-lg mb-1">
                Net Revenue
              </h3>
              <p className="text-slate-500 text-base">
                Sum of confirmed bookings
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
                    {revenueData.cancelled.bookingCount}
                  </div>
                  <div className="text-sm text-orange-500 font-medium">
                    {revenueData.summary.cancellationRate}% rate
                  </div>
                </div>
              </div>
              <h3 className="text-slate-700 font-semibold text-lg mb-1">
                Cancelled Trips
              </h3>
              <p className="text-slate-500 text-base">
                Number of cancellations
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">
                    ₹{revenueData.pending.bookingValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-red-500 font-medium">
                    {revenueData.pending.bookingCount} pending
                  </div>
                </div>
              </div>
              <h3 className="text-slate-700 font-semibold text-lg mb-1">
                Revenue at Risk
              </h3>
              <p className="text-slate-500 text-base">
                Bookings pending payment
              </p>
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
                        revenue: item.revenue,
                        bookings: item.bookingCount,
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
                            revenue: 0,
                            bookings: 0,
                          });
                        }
                        return data;
                      })();

                // Custom tooltip
                const CustomTooltip = ({
                  active,
                  payload,
                  label,
                }: {
                  active?: boolean;
                  payload?: Array<{
                    value: number;
                    payload: { bookings: number };
                  }>;
                  label?: string;
                }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 mb-2">
                          {label}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-purple-600 font-medium">
                            Revenue: ₹{payload[0]?.value?.toLocaleString() || 0}
                          </p>
                          <p className="text-sm text-indigo-600 font-medium">
                            Bookings: {payload[0]?.payload?.bookings || 0}
                          </p>
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
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#8b5cf6"
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
                            domain={[0, 200000]}
                            ticks={[0, 50000, 100000, 150000, 200000]}
                            tickFormatter={(value) => {
                              if (value === 0) return "₹0";
                              return `₹${(value / 1000).toFixed(0)}k`;
                            }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            wrapperStyle={{ fontSize: "14px" }}
                            iconType="line"
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            name="Sales Revenue (₹)"
                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
                            activeDot={{
                              r: 7,
                              stroke: "#8b5cf6",
                              strokeWidth: 2,
                            }}
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

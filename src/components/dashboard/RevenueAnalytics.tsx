import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { getAnalyticsData } from '@/actions/admin/action';

interface AnalyticsData {
  monthlyRevenue: Array<{
    month: string;
    sales: number;
    refunds: number;
    netRevenue: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
    count: number;
  }>;
  dailyTransactions: Array<{
    date: string;
    transactions: number;
    revenue: number;
  }>;
  topDestinations: Array<{
    destination: string;
    bookings: number;
    revenue: number;
  }>;
  revenueByType: Array<{
    type: string;
    amount: number;
    bookings: number;
  }>;
  summary: {
    totalSales: number;
    totalRefunds: number;
    netRevenue: number;
    totalTransactions: number;
    confirmedBookings: number;
    refundedBookings: number;
    avgOrderValue: number;
    refundRate: number;
  };
  growth: {
    revenue: number;
    transactions: number;
    avgOrderValue: number;
    refundRate: number;
  };
  period: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

interface RevenueAnalyticsProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onClose: () => void;
  // Removed unused revenue prop
}

type ActiveChart = 'overview' | 'trends' | 'distribution';

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ dateRange, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<ActiveChart>('overview');

  // Fetch real analytics data instead of generating mock data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const response = await getAnalyticsData(dateRange.startDate, dateRange.endDate);

        if (response.success) {
          setAnalyticsData(response.data);
        } else {
          console.error('Error fetching analytics data:', response.error);
          // Set empty data structure
          setAnalyticsData({
            monthlyRevenue: [],
            statusDistribution: [],
            dailyTransactions: [],
            topDestinations: [],
            revenueByType: [],
            summary: {
              totalSales: 0,
              totalRefunds: 0,
              netRevenue: 0,
              totalTransactions: 0,
              confirmedBookings: 0,
              refundedBookings: 0,
              avgOrderValue: 0,
              refundRate: 0,
            },
            growth: {
              revenue: 0,
              transactions: 0,
              avgOrderValue: 0,
              refundRate: 0,
            },
            period: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
              totalDays: 0,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  /*  const exportCharts = () => {
    // Implementation for exporting charts as PDF/PNG
    // Exporting charts...
  }; */

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
            <p className="text-gray-600">
              {new Date(dateRange.startDate).toLocaleDateString()} -{' '}
              {new Date(dateRange.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/*  <button
              onClick={exportCharts}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button> */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'distribution', label: 'Distribution', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id as ActiveChart)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeChart === tab.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(analyticsData.summary.totalSales)}
                </p>
                <p
                  className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(
                    analyticsData.growth.revenue
                  )}`}
                >
                  {getGrowthIcon(analyticsData.growth.revenue)}
                  {analyticsData.growth.revenue >= 0 ? '+' : ''}
                  {analyticsData.growth.revenue.toFixed(1)}% vs last period
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Transactions</p>
                <p className="text-2xl font-bold text-blue-900">
                  {analyticsData.summary.totalTransactions}
                </p>
                <p
                  className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(
                    analyticsData.growth.transactions
                  )}`}
                >
                  {getGrowthIcon(analyticsData.growth.transactions)}
                  {analyticsData.growth.transactions >= 0 ? '+' : ''}
                  {analyticsData.growth.transactions.toFixed(1)}% vs last period
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(analyticsData.summary.avgOrderValue)}
                </p>
                <p
                  className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(
                    analyticsData.growth.avgOrderValue
                  )}`}
                >
                  {getGrowthIcon(analyticsData.growth.avgOrderValue)}
                  {analyticsData.growth.avgOrderValue >= 0 ? '+' : ''}
                  {analyticsData.growth.avgOrderValue.toFixed(1)}% vs last period
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-sm font-medium">Refund Rate</p>
                <p className="text-2xl font-bold text-orange-900">
                  {analyticsData.summary.refundRate.toFixed(1)}%
                </p>
                <p
                  className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(
                    -analyticsData.growth.refundRate
                  )}`}
                >
                  {getGrowthIcon(-analyticsData.growth.refundRate)}
                  {analyticsData.growth.refundRate <= 0 ? '+' : ''}
                  {(-analyticsData.growth.refundRate).toFixed(1)}% vs last period
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {activeChart === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Revenue Trend */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={value => `$${value / 1000}K`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="refunds"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyTransactions?.slice(-7) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: string | number) => {
                      if (!value) return '';
                      if (typeof value === 'number') {
                        return new Date(value < 1e12 ? value * 1000 : value).toLocaleDateString(
                          'en-US',
                          { weekday: 'short' }
                        );
                      }

                      const parsed = Date.parse(value);
                      if (!isNaN(parsed)) {
                        return new Date(parsed).toLocaleDateString('en-US', {
                          weekday: 'short',
                        });
                      }

                      return String(value);
                    }}
                  />
                  <YAxis tickFormatter={value => `${value / 1000}K`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={label => {
                      const parsed = Date.parse(label as string);
                      return !isNaN(parsed)
                        ? new Date(parsed).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })
                        : String(label);
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Type */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Travel Plan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.revenueByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) =>
                      `${
                        type.length > 20 ? type.substring(0, 20) + '...' : type
                      } ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {analyticsData.revenueByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'trends' && (
          <div className="space-y-8">
            {/* Daily Transactions Trend */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Transaction Trends (Last 30 Days)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.dailyTransactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={value => `$${value / 1000}K`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'transactions' ? 'Transactions' : 'Revenue',
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="transactions" fill="#8B5CF6" name="Transactions" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Comparison */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales vs Refunds</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={value => `$${value / 1000}K`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="sales" fill="#10B981" name="Sales" />
                  <Bar dataKey="refunds" fill="#EF4444" name="Refunds" />
                  <Line
                    type="monotone"
                    dataKey="netRevenue"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    name="Net Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Detailed Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Breakdown</h3>
              <div className="space-y-4">
                {analyticsData.statusDistribution.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{status.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{status.value}%</div>
                      <div className="text-sm text-gray-500">{status.count} bookings</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div>
                    <div className="font-medium text-green-900">Net Revenue</div>
                    <div className="text-sm text-green-700">Total - Refunds</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-900 text-xl">
                      {formatCurrency(analyticsData.summary.netRevenue)}
                    </div>
                    <div className="text-sm text-green-600">
                      vs {formatCurrency(analyticsData.summary.totalSales)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div>
                    <div className="font-medium text-blue-900">Conversion Rate</div>
                    <div className="text-sm text-blue-700">Confirmed Bookings</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-900 text-xl">
                      {(
                        (analyticsData.summary.confirmedBookings /
                          analyticsData.summary.totalTransactions) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-blue-600">
                      {analyticsData.summary.confirmedBookings} of{' '}
                      {analyticsData.summary.totalTransactions}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div>
                    <div className="font-medium text-purple-900">Daily Average</div>
                    <div className="text-sm text-purple-700">Revenue per day</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-900 text-xl">
                      {formatCurrency(
                        analyticsData.summary.totalSales / (analyticsData.period.totalDays || 1)
                      )}
                    </div>
                    <div className="text-sm text-purple-600">
                      Over {analyticsData.period.totalDays} days
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div>
                    <div className="font-medium text-orange-900">Revenue Growth</div>
                    <div className="text-sm text-orange-700">vs previous period</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-xl ${getGrowthColor(
                        analyticsData.growth.revenue
                      )}`}
                    >
                      {analyticsData.growth.revenue >= 0 ? '+' : ''}
                      {analyticsData.growth.revenue.toFixed(1)}%
                    </div>
                    <div className="text-sm text-orange-600 flex items-center justify-end gap-1">
                      {getGrowthIcon(analyticsData.growth.revenue)}
                      {analyticsData.growth.revenue >= 0 ? 'Increase' : 'Decrease'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;

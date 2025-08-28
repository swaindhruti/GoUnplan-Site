"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  DollarSign,
  RefreshCw,
  User,
  BarChart3,
  Shield,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  EyeIcon,
  AlertTriangle,
} from "lucide-react";
import {
  getAllUsers,
  getAllHosts,
  getHostApplications,
  approveHostApplication,
  rejectHostApplication,
  getTotalRevenue,
  updateUserRole,
  getAlltravelPlanApplications,
  approveTravelPlan,
  getAllBookings,
} from "@/actions/admin/action";
import TravelPlanModal from "@/components/dashboard/TravelPlanModal";
import { Role } from "@/types/auth";
import RevenueReport from "@/components/dashboard/RevenueReport";
import RevenueAnalytics from "@/components/dashboard/RevenueAnalytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { processRefund } from "@/actions/booking/actions";
import { PaymentStatus } from "@prisma/client";

// Define interfaces for your data types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: Date;
}

interface Host {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  role: Role;
}

interface TravelPlan {
  travelPlanId: string;
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  noOfDays: number;
  price: number;
  hostId: string;
  createdAt: Date;
}

interface Booking {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  participants: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  specialRequirements: string | null;
  pricePerPerson: number;
  refundAmount: number;
  paymentStatus: PaymentStatus;
  minPaymentAmount?: number | null;
  amountPaid?: number | null;
  remainingAmount?: number | null;
  paymentDeadline?: Date | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
  };
  travelPlan: {
    travelPlanId: string;
    title: string;
    destination: string | null;
    startDate: Date | null;
    endDate: Date | null;
    price: number;
    tripImage: string | null;
    host: {
      hostId: string;
      user: {
        name: string;
        email: string;
      };
    };
  };
  guests: {
    id: string;
    isteamLead: boolean;
    phone: string;
    firstName: string;
    lastName: string;
    memberEmail: string;
    createdAt: Date;
    updatedAt: Date;
    bookingId: string;
  }[];
}

interface BookingCounts {
  ALL: number;
  FULLY_PAID: number;
  PARTIALLY_PAID: number;
  CANCELLED: number;
  REFUNDED: number;
  PENDING: number;
  OVERDUE: number;
}

// Define the revenue data structure
interface RevenueData {
  totalSales: {
    _sum: { totalPrice: number | null };
    _count: { id: number };
  };
  refundAmount: {
    _sum: { refundAmount: number | null };
    _count: { id: number };
  };
}

export default function AdminDashboard() {
  // Helper function to get payment status display info
  const getPaymentStatusInfo = (status: PaymentStatus) => {
    const statusMap = {
      FULLY_PAID: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Fully Paid",
      },
      PARTIALLY_PAID: {
        icon: CheckCircle,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Partially Paid",
      },
      PENDING: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
      },
      OVERDUE: {
        icon: AlertTriangle,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Overdue",
      },
      CANCELLED: {
        icon: XCircle,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled",
      },
      REFUNDED: {
        icon: RefreshCw,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Refunded",
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  // State for all data
  const [users, setUsers] = useState<User[]>([]);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [revenueReportModal, setRevenueReportModal] = useState(false);
  const [bookingCounts, setBookingCounts] = useState<BookingCounts>({
    ALL: 0,
    FULLY_PAID: 0,
    PARTIALLY_PAID: 0,
    CANCELLED: 0,
    REFUNDED: 0,
    PENDING: 0,
    OVERDUE: 0,
  });
  const [revenue, setRevenue] = useState<RevenueData>({
    totalSales: { _sum: { totalPrice: 0 }, _count: { id: 0 } },
    refundAmount: { _sum: { refundAmount: 0 }, _count: { id: 0 } },
  });

  const [totalRevenue, setTotalRevenue] = useState<RevenueData>({
    totalSales: { _sum: { totalPrice: 0 }, _count: { id: 0 } },
    refundAmount: { _sum: { refundAmount: 0 }, _count: { id: 0 } },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHost, setSelectedHost] = useState<Host>();
  const [open, setOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("users");
  const [userFilter, setUserFilter] = useState<
    "all" | "users" | "hosts" | "admins"
  >("all");
  const [applicationFilter, setApplicationFilter] = useState<
    "all" | "hosts" | "travelplans"
  >("all");
  const [bookingFilter, setBookingFilter] = useState<string>("ALL");
  const [selectedTravelPlanId, setSelectedTravelPlanId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRevenueReportButton = () => {
    if (analyticsModal === true) setAnalyticsModal(false);

    setRevenueReportModal(true);
  };

  const handleBackRevenueModal = () => {
    setRevenueReportModal(false);
  };

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  // State for dashboard stats
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalHosts: 0,
    hostApplicants: 0,
    totalBookings: 0,
    totalSales: 0,
    pendingRefunds: 0,
  });

  // NEW: Set default dates (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setDateRange({
      startDate: thirtyDaysAgo.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  }, []);
  const handleAnalyticsModal = () => {
    if (revenueReportModal === true) setRevenueReportModal(false);
    setAnalyticsModal(true);
  };
  const handleCloseAnalyticsModal = () => setAnalyticsModal(false);

  const fetchRevenueData = async (startDate?: string, endDate?: string) => {
    try {
      const revenueResponse = await getTotalRevenue(startDate, endDate, false);
      if (revenueResponse.error) {
        setError(revenueResponse.error);
        return;
      }
      setRevenue(revenueResponse as RevenueData);

      setStatsData((prev) => ({
        ...prev,
        totalSales: revenueResponse.totalSales?._sum?.totalPrice || 0,
        pendingRefunds: revenueResponse.refundAmount?._sum?.refundAmount || 0,
      }));
    } catch (err) {
      setError("Failed to fetch revenue data");
      console.error(err);
    }
  };

  // NEW: Handle date change
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);

    // Only fetch data if both dates are selected and we're on revenue tab
    if (
      newDateRange.startDate &&
      newDateRange.endDate &&
      activeTab === "revenue"
    ) {
      setIsDateFilterActive(true);
      fetchRevenueData(newDateRange.startDate, newDateRange.endDate);
    }
  };

  // NEW: Reset date filter
  const resetDateFilter = () => {
    setIsDateFilterActive(false);
    fetchRevenueData();
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await getAllUsers();
        if (usersResponse.error) {
          setError(usersResponse.error);
          return;
        }
        setUsers(usersResponse.users || []);

        // Fetch hosts
        const hostsResponse = await getAllHosts();
        if (hostsResponse.error) {
          setError(hostsResponse.error);
          return;
        }
        setHosts(hostsResponse.hosts || []);

        // Fetch applicants
        const applicantsResponse = await getHostApplications();
        if (applicantsResponse.error) {
          setError(applicantsResponse.error);
          return;
        }
        setApplicants(applicantsResponse.hostApplicants || []);

        const travelPlansResponse = await getAlltravelPlanApplications();
        if (travelPlansResponse.error) {
          setError(travelPlansResponse.error);
          return;
        }
        setTravelPlans(travelPlansResponse.travelPlans || []);

        const bookingsResponse = await getAllBookings();
        if (bookingsResponse.error) {
          setError(bookingsResponse.error);
          return;
        }
        if (bookingsResponse.success) {
          setBookings(bookingsResponse?.bookings || []);
          setBookingCounts(
            bookingsResponse.counts || {
              ALL: 0,
              FULLY_PAID: 0,
              PARTIALLY_PAID: 0,
              CANCELLED: 0,
              REFUNDED: 0,
              PENDING: 0,
              OVERDUE: 0,
            }
          );
        }
        await fetchRevenueData();

        const revenueResponse = await getTotalRevenue();
        if (revenueResponse.error) {
          console.error(revenueResponse.error);
        } else {
          setTotalRevenue(revenueResponse as RevenueData);
        }

        // Update stats
        setStatsData({
          totalUsers: usersResponse.users?.length || 0,
          totalHosts: hostsResponse.hosts?.length || 0,
          hostApplicants:
            (applicantsResponse.hostApplicants?.length || 0) +
            (travelPlansResponse.travelPlans?.length || 0),
          totalBookings: bookingsResponse.counts?.ALL || 0,
          totalSales: totalRevenue.totalSales._sum.totalPrice || 0, // This will be updated by fetchRevenueData
          pendingRefunds: totalRevenue.refundAmount._sum.refundAmount || 0, // This will be updated by fetchRevenueData
        });
      } catch (err) {
        setError("Failed to fetch admin dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [
    totalRevenue.refundAmount._sum.refundAmount,
    totalRevenue.totalSales._sum.totalPrice,
  ]);

  const handleApproveHost = async (email: string) => {
    try {
      const response = await approveHostApplication(email);
      if (response?.error) {
        setError(response.error);
        return;
      }

      setApplicants(applicants.filter((app) => app.email !== email));
      const hostsResponse = await getAllHosts();
      if (hostsResponse.hosts) {
        setHosts(hostsResponse.hosts);
      }

      setStatsData({
        ...statsData,
        hostApplicants: statsData.hostApplicants - 1,
        totalHosts: statsData.totalHosts + 1,
      });
    } catch (err) {
      setError("Failed to approve host application");
      console.error(err);
    }
  };

  const handleRejectHost = async (email: string) => {
    try {
      const response = await rejectHostApplication(email);
      if (response && response.error) {
        setError(response.error);
        return;
      }
      setApplicants(applicants.filter((app) => app.email !== email));
      setStatsData({
        ...statsData,
        hostApplicants: statsData.hostApplicants - 1,
      });
    } catch (err) {
      setError("Failed to reject host application");
      console.error(err);
    }
  };

  const handleUpdateRole = async (email: string, role: Role) => {
    try {
      const response = await updateUserRole(email, role);
      if (response && response.error) {
        setError(response.error);
        return;
      }
      const updatedUsers = users.map((user) =>
        user.email === email ? { ...user, role } : user
      );
      setUsers(updatedUsers);
      if (role === "HOST") {
        const hostsResponse = await getAllHosts();
        if (hostsResponse.hosts) {
          setHosts(hostsResponse.hosts);
        }
      }
    } catch (err) {
      setError("Failed to update user role");
      console.error(err);
    }
  };

  const handleApproveTravelPlan = async (travelPlanId: string) => {
    try {
      const response = await approveTravelPlan(travelPlanId);
      if (response && response.error) {
        setError(response.error);
        return;
      }
      setTravelPlans(
        travelPlans.filter((plan) => plan.travelPlanId !== travelPlanId)
      );
    } catch (err) {
      setError("Failed to approve travel plan");
      console.error(err);
    }
  };

  const handleViewTravelPlanDetails = (travelPlanId: string) => {
    setSelectedTravelPlanId(travelPlanId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTravelPlanId(null);
  };

  const handleMarkAsRefunded = async (bookingId: string) => {
    try {
      const result = await processRefund(bookingId);
      if (result.success) {
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "REFUNDED" }
              : booking
          )
        );
        setBookingCounts((prev) => ({
          ...prev,
          CANCELLED: prev.CANCELLED - 1,
          REFUNDED: prev.REFUNDED + 1,
        }));
      } else {
        setError(result.error || "Failed to mark booking as refunded");
      }
    } catch (err) {
      setError("Failed to mark booking as refunded");
      console.error(err);
    }
  };
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) return "";

    const start = new Date(dateRange.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const end = new Date(dateRange.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${start} - ${end}`;
  };
  const getNetRevenue = () => {
    const totalSales = revenue.totalSales._sum.totalPrice || 0;
    const totalRefunds = revenue.refundAmount._sum.refundAmount || 0;
    return totalSales - totalRefunds;
  };
  const filteredUsers = users.filter((user) => {
    if (userFilter === "all") return true;
    if (userFilter === "users") return user.role === "USER";
    if (userFilter === "hosts") return user.role === "HOST";
    if (userFilter === "admins") return user.role === "ADMIN";
    return true;
  });
  const tabs = [
    {
      id: "users",
      label: "USERS",
      icon: <Users className="w-5 h-5" />,
      description: "User Management",
    },
    {
      id: "hosts",
      label: "HOSTS",
      icon: <UserCheck className="w-5 h-5" />,
      description: "Host Management",
    },
    {
      id: "applicants",
      label: "APPLICATIONS",
      icon: <UserPlus className="w-5 h-5" />,
      description: "Pending Reviews",
    },
    {
      id: "revenue",
      label: "REVENUE",
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Financial Analytics",
    },

    {
      id: "bookings",
      label: "BOOKINGS",
      icon: <Calendar className="w-5 h-5" />,
      description: "Booking Management",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-instrument">
            Loading admin dashboard...
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
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-instrument">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  Admin Dashboard
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                Platform Management
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                Oversee users, hosts, and platform operations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-4 rounded-full">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center space-x-2 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {statsData.totalUsers.toLocaleString()}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Total Users
            </p>
          </div>

          {/* Total Hosts Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-full">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {statsData.totalHosts}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Total Hosts
            </p>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-full">
                <UserPlus className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {statsData.hostApplicants}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Applications
            </p>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {statsData.totalBookings}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Total Bookings
            </p>
          </div>

          {/* Total Sales Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-full">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              ${statsData.totalSales.toLocaleString()}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Total Sales
            </p>
          </div>

          {/* Pending Refunds Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <RefreshCw className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              ${statsData.pendingRefunds.toLocaleString()}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Refunds
            </p>
          </div>
        </div>

        {/* Payment Status Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-green-600 text-sm font-medium">
                {bookingCounts.FULLY_PAID} bookings
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Fully Paid
            </h3>
            <div className="text-2xl font-bold text-green-600">
              {(
                (bookingCounts.FULLY_PAID / Math.max(bookingCounts.ALL, 1)) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-blue-600 text-sm font-medium">
                {bookingCounts.PARTIALLY_PAID} bookings
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Partially Paid
            </h3>
            <div className="text-2xl font-bold text-blue-600">
              {(
                (bookingCounts.PARTIALLY_PAID /
                  Math.max(bookingCounts.ALL, 1)) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-yellow-600 text-sm font-medium">
                {bookingCounts.PENDING} bookings
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Pending
            </h3>
            <div className="text-2xl font-bold text-yellow-600">
              {(
                (bookingCounts.PENDING / Math.max(bookingCounts.ALL, 1)) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-red-600 text-sm font-medium">
                {bookingCounts.OVERDUE} bookings
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Overdue
            </h3>
            <div className="text-2xl font-bold text-red-600">
              {(
                (bookingCounts.OVERDUE / Math.max(bookingCounts.ALL, 1)) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {bookingCounts.CANCELLED} bookings
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Cancelled
            </h3>
            <div className="text-2xl font-bold text-gray-600">
              {(
                (bookingCounts.CANCELLED / Math.max(bookingCounts.ALL, 1)) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-purple-600 text-sm font-medium">
                {bookingCounts.REFUNDED} bookings
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Refunded
            </h3>
            <div className="text-2xl font-bold text-purple-600">
              {(
                (bookingCounts.REFUNDED / Math.max(bookingCounts.ALL, 1)) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row overflow-x-auto md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-bricolage">
                    User Management
                  </h3>
                  <p className="text-gray-600 font-instrument mt-1">
                    View all users and manage their roles
                  </p>
                </div>
                <div className="flex flex-col md:flex-row w-full md:items-center gap-4">
                  <div className="flex w-full items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Filter:
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <button
                      onClick={() => setUserFilter("all")}
                      className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                        userFilter === "all"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All ({users.length})
                    </button>
                    <button
                      onClick={() => setUserFilter("users")}
                      className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                        userFilter === "users"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Users ({users.filter((u) => u.role === "USER").length})
                    </button>
                    <button
                      onClick={() => setUserFilter("hosts")}
                      className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                        userFilter === "hosts"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Hosts ({users.filter((u) => u.role === "HOST").length})
                    </button>
                    <button
                      onClick={() => setUserFilter("admins")}
                      className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                        userFilter === "admins"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Admins ({users.filter((u) => u.role === "ADMIN").length})
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Name
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Phone
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Role
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-slate-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900 font-instrument">
                                {user.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                            {user.phone}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge
                              className={
                                user.role === "ADMIN"
                                  ? "bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium font-instrument"
                                  : user.role === "HOST"
                                  ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium font-instrument"
                                  : "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium font-instrument"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex gap-2">
                              {user.role !== "ADMIN" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-purple-600 text-white hover:bg-purple-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                                    onClick={() =>
                                      handleUpdateRole(
                                        user.email,
                                        user.role === "USER" ? "HOST" : "USER"
                                      )
                                    }
                                  >
                                    {user.role === "USER"
                                      ? "Make Host"
                                      : "Make User"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-amber-600 text-white hover:bg-amber-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                                    onClick={() =>
                                      handleUpdateRole(user.email, "ADMIN")
                                    }
                                  >
                                    Make Admin
                                  </Button>
                                </>
                              )}
                              {user.role === "ADMIN" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gray-600 text-white hover:bg-gray-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                                  onClick={() =>
                                    handleUpdateRole(user.email, "USER")
                                  }
                                >
                                  Make User
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-600"
                        >
                          No users found with the selected filter
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "hosts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-bricolage">
                    Host Management
                  </h3>
                  <p className="text-gray-600 font-instrument mt-1">
                    View and manage all active hosts on the platform
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Name
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Phone
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Created At
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-slate-200">
                    {hosts.length > 0 ? (
                      hosts.map((host) => (
                        <TableRow
                          key={host.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm mr-3">
                                {host.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900 font-instrument">
                                {host.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                            {host.email}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                            {host.phone}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                            {formatDate(host.createdAt)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedHost(host as Host);
                                setOpen(true);
                              }}
                              className="bg-purple-600 text-white hover:text-white hover:bg-purple-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-600"
                        >
                          No hosts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-2xl p-6 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 font-bricolage">
                      Host Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 font-instrument">
                      View complete information about this host
                    </DialogDescription>
                  </DialogHeader>

                  {selectedHost && (
                    <div className="space-y-6 mt-4">
                      {/* Avatar + Name */}
                      <div className="flex items-center gap-4 border-b pb-4">
                        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                          {selectedHost.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 font-instrument">
                            {selectedHost.name}
                          </h4>
                          <p className="text-sm text-gray-500 font-instrument">
                            Active Host
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-500 font-medium">Email</p>
                          <p className="text-gray-900 font-instrument">
                            {selectedHost.email}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-gray-500 font-medium">Phone</p>
                          <p className="text-gray-900 font-instrument">
                            {selectedHost.phone}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-gray-500 font-medium">
                            Created At
                          </p>
                          <p className="text-gray-900 font-instrument">
                            {formatDate(selectedHost.createdAt)}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-gray-500 font-medium">Status</p>
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-bricolage">
                    Applications Review
                  </h3>
                  <p className="text-gray-600 font-instrument mt-1">
                    Review and manage pending host applications and travel plans
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Filter:
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setApplicationFilter("all")}
                      className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                        applicationFilter === "all"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All ({applicants.length + travelPlans.length})
                    </button>
                    <button
                      onClick={() => setApplicationFilter("hosts")}
                      className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                        applicationFilter === "hosts"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Host Applications ({applicants.length})
                    </button>
                    <button
                      onClick={() => setApplicationFilter("travelplans")}
                      className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                        applicationFilter === "travelplans"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Travel Plans ({travelPlans.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Host Applications Table */}
              {(applicationFilter === "all" ||
                applicationFilter === "hosts") && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 font-bricolage flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-purple-600" />
                    Host Applications
                  </h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 border-b border-gray-200">
                        <TableRow>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Name
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Email
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Phone
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Applied Date
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white divide-y divide-slate-200">
                        {applicants.length > 0 ? (
                          applicants.map((applicant) => (
                            <TableRow
                              key={applicant.id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <TableCell className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                                    {applicant.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-gray-900 font-instrument">
                                    {applicant.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                                {applicant.email}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                                {applicant.phone}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                                {formatDate(applicant.createdAt)}
                              </TableCell>
                              <TableCell className="px-6 py-4 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                                  onClick={() =>
                                    handleApproveHost(applicant.email)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-600 text-white hover:bg-red-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                                  onClick={() =>
                                    handleRejectHost(applicant.email)
                                  }
                                >
                                  Reject
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-gray-600"
                            >
                              No host applications found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Travel Plans Table */}
              {(applicationFilter === "all" ||
                applicationFilter === "travelplans") && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 font-bricolage flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Inactive Travel Plans
                  </h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 border-b border-gray-200">
                        <TableRow>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Title
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Location
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Duration
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Price
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Created Date
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white divide-y divide-slate-200">
                        {travelPlans.length > 0 ? (
                          travelPlans.map((plan) => (
                            <TableRow
                              key={plan.travelPlanId}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <TableCell className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
                                    {plan.title.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900 block font-instrument">
                                      {plan.title}
                                    </span>
                                    <span className="text-sm text-gray-500 font-instrument">
                                      {plan.description.substring(0, 50)}...
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                                <div>
                                  <div className="font-medium">
                                    {plan.city}, {plan.state}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {plan.country}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                                {plan.noOfDays} days
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                                ${plan.price}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600 font-instrument">
                                {formatDate(plan.createdAt)}
                              </TableCell>
                              <TableCell className="px-6 py-4 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-purple-600 text-white hover:bg-purple-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                                  onClick={() =>
                                    handleViewTravelPlanDetails(
                                      plan.travelPlanId
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-700 border-0 font-instrument font-medium text-sm transition-colors duration-200"
                                  onClick={() =>
                                    handleApproveTravelPlan(plan.travelPlanId)
                                  }
                                >
                                  Make Active
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-gray-600"
                            >
                              No inactive travel plans found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Empty state when no applications match filter */}
              {applicationFilter === "all" &&
                applicants.length === 0 &&
                travelPlans.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UserPlus className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-bricolage">
                      No Applications Found
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto font-instrument">
                      There are currently no pending host applications or
                      inactive travel plans to review.
                    </p>
                  </div>
                )}
            </div>
          )}

          {activeTab === "revenue" && (
            <div className="space-y-6">
              {/* Header with Date Selector */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-bricolage">
                    Revenue Overview
                  </h3>
                  <p className="text-gray-600 font-instrument mt-1">
                    Monitor platform revenue and refunds
                    {isDateFilterActive && formatDateRange() && (
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {formatDateRange()}
                      </span>
                    )}
                  </p>
                </div>

                {/* Date Range Selector */}
                <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <label className="text-sm font-medium text-gray-700">
                      From:
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        handleDateChange("startDate", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      To:
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        handleDateChange("endDate", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  {isDateFilterActive && (
                    <Button
                      variant="outline"
                      onClick={resetDateFilter}
                      className="text-xs px-3 py-1 h-8"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                      Total Sales
                    </h3>
                    <div className="p-3 bg-green-50 rounded-full">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 font-bricolage">
                    {formatCurrency(revenue.totalSales._sum.totalPrice || 0)}
                  </div>
                  <p className="text-gray-600 text-sm font-instrument">
                    {revenue.totalSales._count.id || 0} confirmed bookings
                  </p>
                </div>

                {/* Refund Amounts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                      Refund Amounts
                    </h3>
                    <div className="p-3 bg-red-50 rounded-full">
                      <RefreshCw className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 font-bricolage">
                    {formatCurrency(
                      revenue.refundAmount._sum.refundAmount || 0
                    )}
                  </div>
                  <p className="text-gray-600 text-sm font-instrument">
                    {revenue.refundAmount._count.id || 0} cancelled/refunded
                    bookings
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                      Net Revenue
                    </h3>
                    <div className="p-3 bg-blue-50 rounded-full">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 font-bricolage">
                    {formatCurrency(getNetRevenue())}
                  </div>
                  <p className="text-gray-600 text-sm font-instrument">
                    Total sales minus refunds
                  </p>
                </div>
              </div>

              {/* Revenue Management Section */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-bricolage">
                  Revenue Management
                </h3>
                <p className="mb-6 text-gray-600 font-instrument">
                  The admin dashboard allows you to track revenue from confirmed
                  bookings and manage refunds. Use the booking management
                  section to handle any pending refund requests.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleRevenueReportButton}
                    className="bg-purple-600 text-white hover:bg-purple-700 font-instrument font-semibold transition-colors duration-200 px-8 py-3 rounded-full flex items-center gap-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    See Revenue Report
                  </Button>
                  <Button
                    onClick={handleAnalyticsModal}
                    variant="outline"
                    className="text-purple-600 border-purple-600 hover:bg-purple-50 font-instrument font-semibold transition-colors duration-200 px-8 py-3 rounded-full flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Detailed Analytics
                  </Button>
                </div>
              </div>

              {/* Revenue Report Modal */}
              {revenueReportModal && (
                <RevenueReport
                  dateRange={dateRange}
                  onBack={handleBackRevenueModal}
                />
              )}

              {analyticsModal && (
                <RevenueAnalytics
                  dateRange={dateRange}
                  onClose={handleCloseAnalyticsModal}
                />
              )}

              {/* Quick Stats */}
              <div className="bg-gray-100 border-[1px] border-gray-400 rounded-2xl p-6 text-black">
                <h4 className="text-lg font-semibold mb-4">Quick Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="opacity-90">Average Booking Value</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(
                        (revenue.totalSales._sum.totalPrice || 0) /
                          (revenue.totalSales._count.id || 1)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-90">Refund Rate</p>
                    <p className="text-xl font-bold">
                      {(
                        (revenue.refundAmount._count.id /
                          (revenue.totalSales._count.id +
                            revenue.refundAmount._count.id)) *
                          100 || 0
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="opacity-90">Total Transactions</p>
                    <p className="text-xl font-bold">
                      {(revenue.totalSales._count.id || 0) +
                        (revenue.refundAmount._count.id || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-bricolage">
                    Booking Management
                  </h3>
                  <p className="text-gray-600 font-instrument mt-1">
                    View and manage all platform bookings
                  </p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Filter:
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    {[
                      "ALL",
                      "FULLY_PAID",
                      "PARTIALLY_PAID",
                      "CANCELLED",
                      "REFUNDED",
                      "PENDING",
                      "OVERDUE",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => setBookingFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-instrument font-medium transition-all duration-200 ${
                          bookingFilter === status
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {status} ({bookingCounts[status as keyof BookingCounts]}
                        )
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-4">
                {bookings.filter(
                  (booking) =>
                    bookingFilter === "ALL" ||
                    booking.paymentStatus === bookingFilter
                ).length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      No Bookings Found
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {bookingFilter === "ALL"
                        ? "There are no bookings in the system yet."
                        : `No ${bookingFilter.toLowerCase()} bookings found.`}
                    </p>
                  </div>
                ) : (
                  bookings
                    .filter(
                      (booking) =>
                        bookingFilter === "ALL" ||
                        booking.paymentStatus === bookingFilter
                    )
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Booking Details */}
                          <div className="flex-grow space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {booking.travelPlan.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {booking.travelPlan.destination ||
                                    "Destination not specified"}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(
                                      booking.startDate
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      booking.endDate
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {booking.participants}{" "}
                                    {booking.participants === 1
                                      ? "guest"
                                      : "guests"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col items-start sm:items-end gap-2">
                                {(() => {
                                  const statusInfo = getPaymentStatusInfo(
                                    booking.paymentStatus
                                  );
                                  const IconComponent = statusInfo.icon;
                                  return (
                                    <span
                                      className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}
                                    >
                                      <IconComponent className="h-4 w-4" />
                                      {statusInfo.label}
                                    </span>
                                  );
                                })()}
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900">
                                    ${booking.totalPrice.toLocaleString()}
                                  </p>
                                  {booking.paymentStatus === "PARTIALLY_PAID" &&
                                    booking.amountPaid && (
                                      <p className="text-sm text-blue-600">
                                        Paid: $
                                        {booking.amountPaid.toLocaleString()}
                                      </p>
                                    )}
                                  {booking.paymentStatus === "PARTIALLY_PAID" &&
                                    booking.remainingAmount && (
                                      <p className="text-sm text-orange-600">
                                        Remaining: $
                                        {booking.remainingAmount.toLocaleString()}
                                      </p>
                                    )}
                                  {(booking.paymentStatus === "PENDING" ||
                                    booking.paymentStatus === "OVERDUE") &&
                                    booking.paymentDeadline && (
                                      <p className="text-xs text-gray-500">
                                        Due:{" "}
                                        {new Date(
                                          booking.paymentDeadline
                                        ).toLocaleDateString()}
                                      </p>
                                    )}
                                  {booking.refundAmount > 0 && (
                                    <p className="text-sm text-red-600">
                                      Refunded: $
                                      {booking.refundAmount.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Customer & Host Info */}
                            <div className="border-t pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 mb-2">
                                    Customer Details
                                  </p>
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {booking.user.name}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {booking.user.email}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {booking.user.phone}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 mb-2">
                                    Host Details
                                  </p>
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <UserCheck className="h-4 w-4" />
                                      {booking.travelPlan.host.user.name}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {booking.travelPlan.host.user.email}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Special Requirements */}
                              {booking.specialRequirements && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700">
                                    Special Requirements:
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {booking.specialRequirements}
                                  </p>
                                </div>
                              )}

                              {/* Booking Metadata */}
                              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                  <span>Booking ID: {booking.id}</span>
                                  <span>
                                    Created:{" "}
                                    {new Date(
                                      booking.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>

                                {/* Admin Actions */}
                                {booking.paymentStatus === "CANCELLED" &&
                                  booking.refundAmount > 0 && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white font-instrument text-xs"
                                      onClick={() =>
                                        handleMarkAsRefunded(booking.id)
                                      }
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Mark as Refunded
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Travel Plan Details Modal */}
      {isModalOpen && selectedTravelPlanId && (
        <TravelPlanModal
          travelPlanId={selectedTravelPlanId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

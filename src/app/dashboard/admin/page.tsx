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
  MessageSquare,
  Crown,
  TrendingUp,
  Shield,
  Filter,
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
} from "@/actions/admin/action";
import TravelPlanModal from "@/components/dashboard/TravelPlanModal";
import { Role } from "@/types/auth";

// Define interfaces for your data types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: Date;
}

interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  // State for all data
  const [users, setUsers] = useState<User[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [revenue, setRevenue] = useState<RevenueData>({
    totalSales: { _sum: { totalPrice: 0 }, _count: { id: 0 } },
    refundAmount: { _sum: { refundAmount: 0 }, _count: { id: 0 } },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const [userFilter, setUserFilter] = useState<
    "all" | "users" | "hosts" | "admins"
  >("all");
  const [applicationFilter, setApplicationFilter] = useState<
    "all" | "hosts" | "travelplans"
  >("all");
  const [selectedTravelPlanId, setSelectedTravelPlanId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for dashboard stats
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalHosts: 0,
    hostApplicants: 0,
    totalBookings: 0,
    totalSales: 0,
    pendingRefunds: 0,
  });

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

        // Fetch travel plans
        const travelPlansResponse = await getAlltravelPlanApplications();
        if (travelPlansResponse.error) {
          setError(travelPlansResponse.error);
          return;
        }
        setTravelPlans(travelPlansResponse.travelPlans || []);

        // Fetch revenue data
        const revenueResponse = await getTotalRevenue();
        if (revenueResponse.error) {
          setError(revenueResponse.error);
          return;
        }
        setRevenue(revenueResponse as RevenueData);

        // Update stats
        setStatsData({
          totalUsers: usersResponse.users?.length || 0,
          totalHosts: hostsResponse.hosts?.length || 0,
          hostApplicants:
            (applicantsResponse.hostApplicants?.length || 0) +
            (travelPlansResponse.travelPlans?.length || 0),
          totalBookings:
            (revenueResponse.totalSales?._count?.id || 0) +
            (revenueResponse.refundAmount?._count?.id || 0),
          totalSales: revenueResponse.totalSales?._sum?.totalPrice || 0,
          pendingRefunds: revenueResponse.refundAmount?._sum?.refundAmount || 0,
        });
      } catch (err) {
        setError("Failed to fetch admin dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handlers for actions
  const handleApproveHost = async (email: string) => {
    try {
      const response = await approveHostApplication(email);
      if (response?.error) {
        setError(response.error);
        return;
      }

      // Remove from applicants and add to hosts
      setApplicants(applicants.filter((app) => app.email !== email));

      // Refetch hosts to get updated data
      const hostsResponse = await getAllHosts();
      if (hostsResponse.hosts) {
        setHosts(hostsResponse.hosts);
      }

      // Update stats
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

      // Remove from applicants
      setApplicants(applicants.filter((app) => app.email !== email));

      // Update stats
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

      // Update users list
      const updatedUsers = users.map((user) =>
        user.email === email ? { ...user, role } : user
      );
      setUsers(updatedUsers);

      // Refetch hosts if needed
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

      // Remove from travel plans
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

  // Format date helper function
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  // Filter users based on selected filter
  const filteredUsers = users.filter((user) => {
    if (userFilter === "all") return true;
    if (userFilter === "users") return user.role === "USER";
    if (userFilter === "hosts") return user.role === "HOST";
    if (userFilter === "admins") return user.role === "ADMIN";
    return true;
  });

  // Define tabs with sophisticated styling and descriptions
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
      id: "messages",
      label: "MESSAGES",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Communication",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-medium">
            Loading admin dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-purple-300 text-sm font-medium tracking-wide uppercase">
                  Admin Dashboard
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Platform Management
                <span className="block bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Control Center
                </span>
              </h1>
              <p className="text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                Manage users, hosts, monitor revenue, and oversee platform
                operations with precision and authority.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-1 rounded-2xl">
                  <div className="bg-slate-800 p-4 rounded-xl">
                    <Shield size={32} className="text-purple-300" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                  <Crown size={12} className="text-white" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-bold text-white">Admin</span>
                </div>
                <p className="text-slate-300 text-sm font-medium">
                  System Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-3 overflow-x-auto overflow-y-hidden scrollbar-hide py-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative group px-8 py-6 font-semibold text-sm uppercase tracking-wider
                  rounded-xl transition-all duration-300 flex flex-col items-center gap-3 min-w-[140px] flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:scale-102"
                  }
                `}
              >
                <div
                  className={`
                  p-3 rounded-lg transition-all duration-300 flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? "bg-white/20"
                      : "bg-slate-100 group-hover:bg-slate-200"
                  }
                `}
                >
                  {tab.icon}
                </div>
                <div className="text-center space-y-1 flex-shrink-0">
                  <div className="font-semibold text-sm whitespace-nowrap">
                    {tab.label}
                  </div>
                  <div
                    className={`text-xs font-medium whitespace-nowrap ${
                      activeTab === tab.id ? "text-white/80" : "text-slate-500"
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
          {/* Total Users Card */}
          <div className="relative group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">
                  Total Users
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {statsData.totalUsers.toLocaleString()}
              </div>
              <p className="text-blue-600 font-medium text-sm">
                Registered users
              </p>
            </div>
          </div>

          {/* Total Hosts Card */}
          <div className="relative group bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 shadow-lg border border-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wide">
                  Total Hosts
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {statsData.totalHosts}
              </div>
              <p className="text-emerald-600 font-medium text-sm">
                Active hosts
              </p>
            </div>
          </div>

          {/* Host Applicants Card */}
          <div className="relative group bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wide">
                  Applications
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {statsData.hostApplicants}
              </div>
              <p className="text-amber-600 font-medium text-sm">
                Host & travel plan applications
              </p>
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="relative group bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide">
                  Total Bookings
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {statsData.totalBookings}
              </div>
              <p className="text-purple-600 font-medium text-sm">
                All time bookings
              </p>
            </div>
          </div>

          {/* Total Sales Card */}
          <div className="relative group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">
                  Total Sales
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${statsData.totalSales.toLocaleString()}
              </div>
              <p className="text-green-600 font-medium text-sm">
                Platform revenue
              </p>
            </div>
          </div>

          {/* Pending Refunds Card */}
          <div className="relative group bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 shadow-lg border border-red-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide">
                  Pending Refunds
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${statsData.pendingRefunds.toLocaleString()}
              </div>
              <p className="text-red-600 font-medium text-sm">Refund amount</p>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      User Management
                    </h3>
                    <p className="text-gray-600 font-medium">
                      View all users and manage their roles
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        Filter:
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUserFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          userFilter === "all"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        All ({users.length})
                      </button>
                      <button
                        onClick={() => setUserFilter("users")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          userFilter === "users"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        Users ({users.filter((u) => u.role === "USER").length})
                      </button>
                      <button
                        onClick={() => setUserFilter("hosts")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          userFilter === "hosts"
                            ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        Hosts ({users.filter((u) => u.role === "HOST").length})
                      </button>
                      <button
                        onClick={() => setUserFilter("admins")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          userFilter === "admins"
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        Admins ({users.filter((u) => u.role === "ADMIN").length}
                        )
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Name
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Phone
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Role
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
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
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">
                                {user.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600">
                            {user.phone}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge
                              className={
                                user.role === "ADMIN"
                                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  : user.role === "HOST"
                                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                                  : "bg-gradient-to-r from-slate-600 to-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium"
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
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
                                  className="bg-gradient-to-r from-slate-600 to-gray-600 text-white hover:from-slate-700 hover:to-gray-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Host Management
                    </h3>
                    <p className="text-gray-600 font-medium">
                      View and manage all active hosts on the platform
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Name
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Phone
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Created At
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
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
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                                {host.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">
                                {host.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600">
                            {host.email}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600">
                            {host.phone}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600">
                            {formatDate(host.createdAt)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Applications Review
                    </h3>
                    <p className="text-gray-600 font-medium">
                      Review and manage pending host applications and travel
                      plans
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          applicationFilter === "all"
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        All ({applicants.length + travelPlans.length})
                      </button>
                      <button
                        onClick={() => setApplicationFilter("hosts")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          applicationFilter === "hosts"
                            ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        Host Applications ({applicants.length})
                      </button>
                      <button
                        onClick={() => setApplicationFilter("travelplans")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          applicationFilter === "travelplans"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        Travel Plans ({travelPlans.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Applications Table */}
              {(applicationFilter === "all" ||
                applicationFilter === "hosts") && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-emerald-600" />
                    Host Applications
                  </h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                        <TableRow>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Name
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Email
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Phone
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Applied Date
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
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
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                                    {applicant.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-gray-900">
                                    {applicant.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600">
                                {applicant.email}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600">
                                {applicant.phone}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600">
                                {formatDate(applicant.createdAt)}
                              </TableCell>
                              <TableCell className="px-6 py-4 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                  onClick={() =>
                                    handleApproveHost(applicant.email)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Inactive Travel Plans
                  </h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                        <TableRow>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Title
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Location
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Duration
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Price
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Created Date
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">
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
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                                    {plan.title.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900 block">
                                      {plan.title}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {plan.description.substring(0, 50)}...
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600">
                                <div>
                                  <div className="font-medium">
                                    {plan.city}, {plan.state}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {plan.country}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600">
                                {plan.noOfDays} days
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600">
                                ${plan.price}
                              </TableCell>
                              <TableCell className="px-6 py-4 text-gray-600">
                                {formatDate(plan.createdAt)}
                              </TableCell>
                              <TableCell className="px-6 py-4 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
                                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 border-0 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <UserPlus className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      No Applications Found
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                      There are currently no pending host applications or
                      inactive travel plans to review.
                    </p>
                  </div>
                )}
            </div>
          )}

          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Revenue Overview
                    </h3>
                    <p className="text-gray-600 font-medium">
                      Monitor platform revenue and refunds
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-16 translate-x-16" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-green-700">
                        Total Sales
                      </h3>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${revenue.totalSales._sum.totalPrice || 0}
                    </div>
                    <p className="text-green-600 font-medium text-sm">
                      {revenue.totalSales._count.id || 0} confirmed bookings
                    </p>
                  </div>
                </div>

                <div className="relative group bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 shadow-lg border border-red-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full -translate-y-16 translate-x-16" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-red-700">
                        Refund Amounts
                      </h3>
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <RefreshCw className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      ${revenue.refundAmount._sum.refundAmount || 0}
                    </div>
                    <p className="text-red-600 font-medium text-sm">
                      {revenue.refundAmount._count.id || 0} cancelled/refunded
                      bookings
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 border border-slate-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Revenue Management
                </h3>
                <p className="mb-6 text-gray-700 leading-relaxed">
                  The admin dashboard allows you to track revenue from confirmed
                  bookings and manage refunds. Use the booking management
                  section to handle any pending refund requests.
                </p>

                <div className="flex space-x-4">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl">
                    Download Revenue Report
                  </Button>
                  <Button
                    variant="outline"
                    className="text-purple-600 border-purple-300 hover:bg-purple-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl"
                  >
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Message Center
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                This section is coming soon! You&apos;ll be able to communicate
                with users and hosts directly from the admin dashboard.
              </p>
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

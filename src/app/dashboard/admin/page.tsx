"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import {
  getAllUsers,
  getAllHosts,
  getHostApplications,
  approveHostApplication,
  rejectHostApplication,
  getTotalRevenue,
  updateUserRole,
} from "@/actions/admin/action";
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
  const [revenue, setRevenue] = useState<RevenueData>({
    totalSales: { _sum: { totalPrice: 0 }, _count: { id: 0 } },
    refundAmount: { _sum: { refundAmount: 0 }, _count: { id: 0 } },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");

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
          hostApplicants: applicantsResponse.hostApplicants?.length || 0,
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

  // Format date helper function
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const TabButton = ({
    label,
    icon,
    isActive,
    onClick,
  }: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-purple-100 text-purple-700 border-b-2 border-purple-600"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.734-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="mt-2 text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage users, hosts, and monitor platform activity
            </p>
          </div>
          <div className="text-2xl gap-2 flex items-center font-bold text-gray-900">
            <User size={30} />
            Admin
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <TabButton
              label="Users"
              icon={<Users className="w-5 h-5" />}
              isActive={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            />
            <TabButton
              label="Hosts"
              icon={<UserCheck className="w-5 h-5" />}
              isActive={activeTab === "hosts"}
              onClick={() => setActiveTab("hosts")}
            />
            <TabButton
              label="Applications"
              icon={<UserPlus className="w-5 h-5" />}
              isActive={activeTab === "applicants"}
              onClick={() => setActiveTab("applicants")}
            />
            <TabButton
              label="Revenue"
              icon={<BarChart3 className="w-5 h-5" />}
              isActive={activeTab === "revenue"}
              onClick={() => setActiveTab("revenue")}
            />
            <TabButton
              label="Messages"
              icon={<MessageSquare className="w-5 h-5" />}
              isActive={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">Registered users</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalHosts}</div>
              <p className="text-xs text-gray-600">Active hosts</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Host Applicants
              </CardTitle>
              <UserPlus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.hostApplicants}
              </div>
              <p className="text-xs text-gray-600">Pending review</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.totalBookings}
              </div>
              <p className="text-xs text-gray-600">All time bookings</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${statsData.totalSales.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                Confirmed bookings revenue
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Refunds
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${statsData.pendingRefunds.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">Total refund amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    View all users and manage their roles
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 border-b border-gray-200">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Name
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Email
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Phone
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Role
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3">
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
                            variant={
                              user.role === "ADMIN"
                                ? "default"
                                : user.role === "HOST"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                                : user.role === "HOST"
                                ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                                : "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {user.role !== "ADMIN" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 bg-white hover:bg-purple-50 hover:text-purple-800 font-medium text-sm"
                              onClick={() =>
                                handleUpdateRole(
                                  user.email,
                                  user.role === "USER" ? "HOST" : "USER"
                                )
                              }
                            >
                              {user.role === "USER" ? "Make Host" : "Make User"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-600"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === "hosts" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Host Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    View and manage all active hosts on the platform
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 border-b border-gray-200">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Name
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Email
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Phone
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Created At
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {hosts.length > 0 ? (
                    hosts.map((host) => (
                      <TableRow
                        key={host.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3">
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
                            className="text-purple-600 bg-white hover:bg-purple-50 hover:text-purple-800 font-medium text-sm"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Host Applications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Review and manage pending host applications
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 border-b border-gray-200">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Name
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Email
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Phone
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Applied Date
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {applicants.length > 0 ? (
                    applicants.map((applicant) => (
                      <TableRow
                        key={applicant.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm mr-3">
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
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                            onClick={() => handleApproveHost(applicant.email)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                            onClick={() => handleRejectHost(applicant.email)}
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

        {activeTab === "revenue" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Revenue Overview
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monitor platform revenue and refunds
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Sales
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ${revenue.totalSales._sum.totalPrice || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {revenue.totalSales._count.id || 0} confirmed bookings
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Refund Amounts
                    </CardTitle>
                    <RefreshCw className="h-5 w-5 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      ${revenue.refundAmount._sum.refundAmount || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {revenue.refundAmount._count.id || 0} cancelled/refunded
                      bookings
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revenue Management
                </h3>
                <p className="mb-4 text-gray-700">
                  The admin dashboard allows you to track revenue from confirmed
                  bookings and manage refunds. Use the booking management
                  section to handle any pending refund requests.
                </p>

                <div className="flex space-x-4 mt-6">
                  <Button className="bg-purple-600 text-white hover:bg-purple-700">
                    Download Revenue Report
                  </Button>
                  <Button
                    variant="outline"
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Message Center
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                This section is coming soon! You&apos;ll be able to communicate
                with users and hosts directly from the admin dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

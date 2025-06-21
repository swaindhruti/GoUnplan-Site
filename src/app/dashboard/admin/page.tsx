"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      if (response.error) {
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
      if (response.error) {
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
      if (response.error) {
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">Loading admin dashboard...</div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-8">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Stats cards content unchanged */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalHosts}</div>
            <p className="text-xs text-muted-foreground">Active hosts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Host Applicants
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.hostApplicants}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${statsData.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmed bookings revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Refunds
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${statsData.pendingRefunds.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total refund amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Tables Section */}
      <Card>
        <CardHeader>
          <CardTitle>Management Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="hosts">All Hosts</TabsTrigger>
              <TabsTrigger value="applicants">Host Applicants</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "ADMIN"
                                ? "default"
                                : user.role === "HOST"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role !== "ADMIN" && (
                            <Button
                              variant="outline"
                              size="sm"
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
                      <TableCell colSpan={5} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="hosts" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hosts.length > 0 ? (
                    hosts.map((host) => (
                      <TableRow key={host.id}>
                        <TableCell className="font-medium">
                          {host.name}
                        </TableCell>
                        <TableCell>{host.email}</TableCell>
                        <TableCell>{host.phone}</TableCell>
                        <TableCell>{formatDate(host.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hosts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="applicants" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.length > 0 ? (
                    applicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="font-medium">
                          {applicant.name}
                        </TableCell>
                        <TableCell>{applicant.email}</TableCell>
                        <TableCell>{applicant.phone}</TableCell>
                        <TableCell>{formatDate(applicant.createdAt)}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveHost(applicant.email)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectHost(applicant.email)}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No host applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Sales
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${revenue.totalSales._sum.totalPrice || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {revenue.totalSales._count.id || 0} confirmed bookings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Refund Amounts
                    </CardTitle>
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${revenue.refundAmount._sum.refundAmount || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {revenue.refundAmount._count.id || 0} cancelled/refunded
                      bookings
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Revenue Management
                </h3>
                <p className="mb-4">
                  The admin dashboard allows you to track revenue from confirmed
                  bookings and manage refunds. Use the booking management
                  section to handle any pending refund requests.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

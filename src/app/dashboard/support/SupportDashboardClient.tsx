"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Users,
  MessageSquare,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  getAllTickets,
  getTicketStats,
  getAllSupportStaff,
  assignTicket,
} from "@/actions/support/actions";
import Link from "next/link";

// Safe date formatting to prevent hydration issues
const formatDate = (date: Date | string) => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

interface TicketData {
  id: string;
  userId: string;
  bookingId: string | null;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  user: {
    id: string;
    name: string;
    email: string | null;
    image: string | null;
  };
  booking: {
    id: string;
    travelPlan: {
      title: string;
      destination: string | null;
    };
    startDate: Date;
    endDate: Date;
  } | null;
  assignee: {
    id: string;
    name: string;
    email: string | null;
  } | null;
  messages: Array<{
    id: string;
    createdAt: Date;
  }>;
}

interface TicketStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  categoryStats: Array<{ category: string; _count: { category: number } }>;
  priorityStats: Array<{ priority: string; _count: { priority: number } }>;
}

interface SupportStaff {
  id: string;
  name: string;
  email: string | null;
  ticketCount: number;
  openTickets: number;
}

const SupportDashboardClient = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketsResult, statsResult, staffResult] = await Promise.all([
        getAllTickets(),
        getTicketStats(),
        getAllSupportStaff(),
      ]);

      if (ticketsResult.tickets) {
        setTickets(ticketsResult.tickets as TicketData[]);
      }
      if (statsResult && !statsResult.error) {
        setStats(statsResult as TicketStats);
      }
      if (staffResult.supportStaff) {
        setSupportStaff(staffResult.supportStaff as SupportStaff[]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignTicket = async (ticketId: string, assigneeId: string) => {
    try {
      const result = await assignTicket(ticketId, assigneeId);
      if (result.success) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false;
    if (filterPriority !== "all" && ticket.priority !== filterPriority)
      return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
      IN_PROGRESS: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      RESOLVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CLOSED: { color: "bg-gray-100 text-gray-800", icon: CheckCircle },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || AlertCircle;

    return (
      <Badge
        className={`${config?.color} flex items-center gap-1 font-instrument`}
      >
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-orange-100 text-orange-800",
      URGENT: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={`${
          priorityColors[priority as keyof typeof priorityColors]
        } font-instrument`}
      >
        {priority}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="ml-2 font-instrument">
              Loading support dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Prevent hydration mismatch by showing loading until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 font-bricolage">
            Support Dashboard
          </h1>
          <p className="text-gray-600 font-instrument">
            Manage support tickets and assist users with their inquiries
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-instrument">
                  Total Tickets
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-bricolage">
                  {stats.totalTickets}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-instrument">
                  Open Tickets
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 font-bricolage">
                  {stats.openTickets}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-instrument">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 font-bricolage">
                  {stats.inProgressTickets}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-instrument">
                  Resolved
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 font-bricolage">
                  {stats.resolvedTickets}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium font-instrument">
                  Filters:
                </span>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={fetchData}
              variant="outline"
              className="flex items-center gap-2 font-instrument"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Support Staff Overview */}
        {supportStaff.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bricolage">
                <Users className="h-5 w-5" />
                Support Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <h3 className="font-medium font-instrument">
                      {staff.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-instrument">
                      {staff.email}
                    </p>
                    <div className="mt-2 flex gap-4 text-sm font-instrument">
                      <span>Total: {staff.ticketCount}</span>
                      <span className="text-blue-600">
                        Open: {staff.openTickets}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-bricolage">
              All Tickets ({filteredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 font-instrument">
                  No tickets found
                </h3>
                <p className="text-gray-500 font-instrument">
                  No tickets match your current filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-instrument">Ticket</TableHead>
                      <TableHead className="font-instrument">User</TableHead>
                      <TableHead className="font-instrument">
                        Category
                      </TableHead>
                      <TableHead className="font-instrument">
                        Priority
                      </TableHead>
                      <TableHead className="font-instrument">Status</TableHead>
                      <TableHead className="font-instrument">
                        Assignee
                      </TableHead>
                      <TableHead className="font-instrument">
                        Messages
                      </TableHead>
                      <TableHead className="font-instrument">Created</TableHead>
                      <TableHead className="font-instrument">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium font-instrument">
                              {ticket.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs font-instrument">
                              {ticket.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium font-instrument">
                              {ticket.user.name}
                            </div>
                            <div className="text-sm text-gray-500 font-instrument">
                              {ticket.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="font-instrument"
                          >
                            {ticket.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(ticket.priority)}
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          {ticket.assignee ? (
                            <div className="text-sm font-instrument">
                              <div className="font-medium">
                                {ticket.assignee.name}
                              </div>
                              <div className="text-gray-500">
                                {ticket.assignee.email}
                              </div>
                            </div>
                          ) : (
                            <Select
                              onValueChange={(value) =>
                                handleAssignTicket(ticket.id, value)
                              }
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                {supportStaff.map((staff) => (
                                  <SelectItem key={staff.id} value={staff.id}>
                                    {staff.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-instrument">
                              {ticket.messages.length}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500 font-instrument">
                            {formatDate(ticket.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/chat/support/${ticket.id}`}
                            className="inline-block"
                          >
                            <Button size="sm" className="font-instrument">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportDashboardClient;

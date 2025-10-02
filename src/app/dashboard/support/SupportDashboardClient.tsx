"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MessageSquare,
  RefreshCw,
  Headphones,
  Search,
  Eye,
} from "lucide-react";
import {
  getAllTickets,
  getTicketStats,
  getAllSupportStaff,
  assignTicket,
} from "@/actions/support/actions";
import { getMyAssignedTickets } from "@/actions/support/getMyAssignedTickets";
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
  const [myAssignedTickets, setMyAssignedTickets] = useState<TicketData[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketsResult, statsResult, staffResult, myTicketsResult] =
        await Promise.all([
          getAllTickets(),
          getTicketStats(),
          getAllSupportStaff(),
          getMyAssignedTickets(),
        ]);

      if (ticketsResult.tickets) {
        setTickets(ticketsResult.tickets as TicketData[]);
      }
      if (myTicketsResult.tickets) {
        setMyAssignedTickets(myTicketsResult.tickets as TicketData[]);
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
    // Status filter
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false;

    // Priority filter
    if (filterPriority !== "all" && ticket.priority !== filterPriority)
      return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.user.name.toLowerCase().includes(searchLower) ||
        ticket.user.email?.toLowerCase().includes(searchLower) ||
        ticket.category.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

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
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16 lg:mt-20">
      {/* Header Section - Similar to Admin Dashboard */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  Support Dashboard
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                Customer Support
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                Manage tickets and assist customers efficiently
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-full">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <Button
                onClick={fetchData}
                disabled={loading}
                variant="outline"
                className="font-instrument"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {loading ? "..." : stats?.totalTickets ?? 0}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Total Tickets
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {loading ? "..." : stats?.openTickets ?? 0}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Open Tickets
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {loading ? "..." : stats?.inProgressTickets ?? 0}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              In Progress
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-bricolage">
              {loading ? "..." : stats?.resolvedTickets ?? 0}
            </div>
            <p className="text-gray-600 text-sm mt-1 font-instrument">
              Resolved
            </p>
          </div>
        </div>

        {/* My Assigned Tickets */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 rounded-t-2xl">
            <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
              My Assigned Tickets ({myAssignedTickets.length})
            </h3>
            <p className="text-sm text-gray-600 font-instrument mt-1">
              Tickets currently assigned to you
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-medium text-gray-700 w-24">
                    ID
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 min-w-[200px]">
                    Title
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 min-w-[150px]">
                    User
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 w-28">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 w-28">
                    Priority
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 w-32">
                    Last Update
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      Loading your assigned tickets...
                    </TableCell>
                  </TableRow>
                ) : myAssignedTickets.length > 0 ? (
                  myAssignedTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm">
                        <Link
                          href={`/support/tickets/${ticket.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          #{ticket.id.substring(0, 8)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 line-clamp-2">
                          {ticket.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-900">{ticket.user.name}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(ticket.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <CheckCircle className="h-12 w-12 mb-3 text-gray-300" />
                        <h3 className="font-medium text-gray-900 mb-1">
                          All caught up!
                        </h3>
                        <p className="text-sm">
                          No tickets are currently assigned to you.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* All Tickets Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                All Tickets ({filteredTickets.length})
              </h3>
              <p className="text-sm text-gray-600 font-instrument mt-1">
                Complete overview of all support tickets
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 font-instrument"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 font-instrument">
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
                <SelectTrigger className="w-40 font-instrument">
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
          </div>
        </div>
        <div className="overflow-x-auto">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-bricolage">
                No tickets found
              </h3>
              <p className="text-gray-500 font-instrument">
                {searchTerm ||
                filterStatus !== "all" ||
                filterPriority !== "all"
                  ? "No tickets match your current filters."
                  : "No tickets have been created yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Ticket Details
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Customer
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Category
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Priority
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Assignee
                  </TableHead>
                  <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-instrument">
                    Messages
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Created
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-instrument">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-slate-200">
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 font-instrument line-clamp-1">
                          {ticket.title}
                        </div>
                        <div className="text-sm text-gray-500 font-instrument line-clamp-2 max-w-xs">
                          {ticket.description}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          #{ticket.id.substring(0, 8)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {ticket.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-instrument">
                            {ticket.user.name}
                          </div>
                          <div className="text-sm text-gray-500 font-instrument">
                            {ticket.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className="px-3 py-1 rounded-full text-sm font-medium font-instrument bg-gray-100 text-gray-700"
                      >
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {getPriorityBadge(ticket.priority)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {ticket.assignee ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                            {ticket.assignee.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 font-instrument">
                              {ticket.assignee.name}
                            </div>
                            <div className="text-xs text-gray-500 font-instrument">
                              {ticket.assignee.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Select
                          onValueChange={(value) =>
                            handleAssignTicket(ticket.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs font-instrument">
                            <SelectValue placeholder="Assign..." />
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
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 font-instrument">
                          {ticket.messages.length}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-gray-500 font-instrument">
                        {formatDate(ticket.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Link
                        href={`/chat/support/${ticket.id}`}
                        className="inline-block"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs font-instrument bg-blue-600 text-white hover:bg-blue-700 border-0"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportDashboardClient;

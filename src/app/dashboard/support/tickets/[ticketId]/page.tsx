"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, User, MessageSquare, Send, Paperclip } from "lucide-react";
import {
  getTicketById,
  updateTicket,
  addTicketMessage,
  getAllSupportStaff,
} from "@/actions/support/actions";
import { UpdateTicketData, CreateTicketMessageData } from "@/types/support";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface TicketDetail {
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
    ticketId: string;
    senderId: string;
    message: string;
    isInternal: boolean;
    attachments: string[];
    createdAt: Date;
    sender: {
      id: string;
      name: string;
      email: string | null;
      role: string;
      image: string | null;
    };
  }>;
}

const TicketDetailPage = () => {
  const params = useParams();
  const { data: session } = useSession();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [supportStaff, setSupportStaff] = useState<
    Array<{ id: string; name: string; email: string | null }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isInternalMessage, setIsInternalMessage] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketResult, staffResult] = await Promise.all([
        getTicketById(ticketId),
        getAllSupportStaff(),
      ]);

      if (ticketResult.ticket) {
        setTicket(ticketResult.ticket as TicketDetail);
      }

      if (staffResult.supportStaff) {
        setSupportStaff(staffResult.supportStaff);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId, fetchTicket]);

  const handleUpdateTicket = async (data: UpdateTicketData) => {
    setUpdating(true);
    try {
      const result = await updateTicket(ticketId, data);
      if (result.success) {
        fetchTicket(); // Refresh ticket data
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData: CreateTicketMessageData = {
        ticketId,
        message: newMessage,
        isInternal: isInternalMessage,
      };

      const result = await addTicketMessage(messageData);
      if (result.success) {
        setNewMessage("");
        setIsInternalMessage(false);
        fetchTicket(); // Refresh to show new message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "OPEN":
        return "destructive";
      case "IN_PROGRESS":
        return "default";
      case "WAITING_FOR_USER":
        return "secondary";
      case "RESOLVED":
        return "outline";
      case "CLOSED":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "destructive";
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "default";
      case "LOW":
        return "secondary";
      default:
        return "default";
    }
  };

  const canModifyTicket =
    session?.user?.role === "SUPPORT" || session?.user?.role === "ADMIN";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading ticket...</span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Ticket not found</h2>
        <p className="text-gray-600 mt-2">
          The ticket you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <Link href="/dashboard/support">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/support">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <p className="text-gray-600">Ticket #{ticket.id.slice(-8)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
            {ticket.priority}
          </Badge>
          <Badge variant={getStatusBadgeVariant(ticket.status)}>
            {ticket.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-700 mt-1">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Category</h3>
                <p className="text-gray-700">{ticket.category}</p>
              </div>
              <div>
                <h3 className="font-semibold">Created</h3>
                <p className="text-gray-700">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {ticket.booking && (
              <div>
                <h3 className="font-semibold">Related Booking</h3>
                <div className="bg-gray-50 p-3 rounded-lg mt-1">
                  <p className="font-medium">
                    {ticket.booking.travelPlan.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ticket.booking.travelPlan.destination}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticket.booking.startDate).toLocaleDateString()} -
                    {new Date(ticket.booking.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {canModifyTicket && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Ticket Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    value={ticket.status}
                    onValueChange={(value) =>
                      handleUpdateTicket({
                        status: value as
                          | "OPEN"
                          | "IN_PROGRESS"
                          | "WAITING_FOR_USER"
                          | "RESOLVED"
                          | "CLOSED",
                      })
                    }
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="WAITING_FOR_USER">
                        Waiting for User
                      </SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={ticket.priority}
                    onValueChange={(value) =>
                      handleUpdateTicket({
                        priority: value as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
                      })
                    }
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={ticket.assignedTo || ""}
                    onValueChange={(value) =>
                      handleUpdateTicket({ assignedTo: value })
                    }
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {supportStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">{ticket.user.name}</p>
                <p className="text-sm text-gray-600">{ticket.user.email}</p>
              </div>
            </div>

            {ticket.assignee && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-2">Assigned To</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{ticket.assignee.name}</p>
                    <p className="text-sm text-gray-600">
                      {ticket.assignee.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Messages ({ticket.messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.isInternal
                    ? "bg-yellow-50 border-l-4 border-yellow-400"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{message.sender.name}</p>
                      <p className="text-xs text-gray-500">
                        {message.sender.role} •{" "}
                        {new Date(message.createdAt).toLocaleString()}
                        {message.isInternal && (
                          <span className="ml-2 text-yellow-600 font-medium">
                            Internal
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{message.message}</p>
              </div>
            ))}
          </div>

          {/* New Message Form */}
          <div className="mt-6 border-t pt-4">
            <div className="space-y-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[100px]"
              />

              {canModifyTicket && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="internal"
                    checked={isInternalMessage}
                    onChange={(e) => setIsInternalMessage(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="internal" className="text-sm text-gray-600">
                    Internal message (only visible to support team)
                  </label>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetailPage;

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  User,
  MessageSquare,
  Send,
  Calendar,
  MapPin,
} from "lucide-react";
import { getTicketById, addTicketMessage } from "@/actions/support/actions";
import { CreateTicketMessageData } from "@/types/support";
import Link from "next/link";

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

const UserTicketDetailPage = () => {
  const params = useParams();
  const { data: session, status } = useSession();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchTicket = useCallback(async () => {
    if (status === "loading" || !session) return;

    setLoading(true);
    try {
      const ticketResult = await getTicketById(ticketId);

      if (ticketResult.ticket) {
        setTicket(ticketResult.ticket as TicketDetail);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  }, [ticketId, session, status]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const messageData: CreateTicketMessageData = {
        ticketId,
        message: newMessage,
        isInternal: false, // Users can't send internal messages
      };

      const result = await addTicketMessage(messageData);
      if (result.success) {
        setNewMessage("");
        fetchTicket(); // Refresh to show new message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
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

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading ticket...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600">
          You need to be signed in to view your support tickets.
        </p>
        <Link href="/auth/signin">
          <Button className="mt-4">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Ticket not found</h2>
        <p className="text-gray-600 mt-2">
          The ticket you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <Link href="/support">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/support">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support
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
                <div className="bg-gray-50 p-4 rounded-lg mt-1">
                  <h4 className="font-medium">
                    {ticket.booking.travelPlan.title}
                  </h4>
                  {ticket.booking.travelPlan.destination && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {ticket.booking.travelPlan.destination}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(ticket.booking.startDate).toLocaleDateString()} -
                    {new Date(ticket.booking.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support Info */}
        <Card>
          <CardHeader>
            <CardTitle>Support Information</CardTitle>
          </CardHeader>
          <CardContent>
            {ticket.assignee ? (
              <div>
                <h3 className="font-semibold mb-2">Assigned Support Agent</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{ticket.assignee.name}</p>
                    <p className="text-sm text-gray-600">Support Agent</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No agent assigned yet</p>
                <p className="text-sm text-gray-500">
                  A support agent will be assigned to your ticket soon.
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Ticket Status</h3>
              <div className="space-y-2 text-sm">
                {ticket.status === "OPEN" && (
                  <p className="text-gray-600">
                    Your ticket is waiting to be assigned to a support agent.
                  </p>
                )}
                {ticket.status === "IN_PROGRESS" && (
                  <p className="text-gray-600">
                    A support agent is actively working on your ticket.
                  </p>
                )}
                {ticket.status === "WAITING_FOR_USER" && (
                  <p className="text-yellow-600">
                    We&apos;re waiting for your response to continue helping
                    you.
                  </p>
                )}
                {ticket.status === "RESOLVED" && (
                  <p className="text-green-600">
                    Your issue has been resolved. If you need further
                    assistance, please reply below.
                  </p>
                )}
                {ticket.status === "CLOSED" && (
                  <p className="text-gray-600">
                    This ticket has been closed. You can still view the
                    conversation history.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Conversation ({ticket.messages.filter((m) => !m.isInternal).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ticket.messages
              .filter((m) => !m.isInternal) // Hide internal messages from users
              .map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.sender.role === "USER"
                      ? "bg-blue-50 ml-8"
                      : "bg-gray-50 mr-8"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender.role === "USER"
                            ? "bg-blue-200"
                            : "bg-gray-200"
                        }`}
                      >
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{message.sender.name}</p>
                        <p className="text-xs text-gray-500">
                          {message.sender.role === "USER"
                            ? "You"
                            : "Support Team"}{" "}
                          • {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{message.message}</p>
                </div>
              ))}
          </div>

          {/* New Message Form */}
          {ticket.status !== "CLOSED" && (
            <div className="mt-6 border-t pt-4">
              <div className="space-y-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[100px]"
                  disabled={sending}
                />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {ticket.status === "CLOSED" && (
            <div className="mt-6 border-t pt-4 text-center">
              <p className="text-gray-600">
                This ticket has been closed. If you need further assistance,
                please create a new support ticket.
              </p>
              <Link href="/support">
                <Button variant="outline" className="mt-2">
                  Create New Ticket
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTicketDetailPage;

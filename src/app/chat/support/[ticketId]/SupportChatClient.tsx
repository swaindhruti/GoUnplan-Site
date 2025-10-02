"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Send,
  Calendar,
  MapPin,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import {
  getTicketById,
  addTicketMessage,
  updateTicket,
} from "@/actions/support/actions";
import { SupportTicketStatus } from "@/types/support";

interface SupportChatClientProps {
  ticketId: string;
}

const SupportChatClient = ({ ticketId }: SupportChatClientProps) => {
  const [ticket, setTicket] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const result = await getTicketById(ticketId);
      if (result.error) {
        console.error("Error fetching ticket:", result.error);
      } else if (result.ticket) {
        setTicket(result.ticket);
        setMessages(result.ticket.messages || []);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const result = await addTicketMessage({
        ticketId,
        message: newMessage.trim(),
        isInternal: false,
        attachments: [],
      });

      if (result.success) {
        setNewMessage("");
        // Refresh messages
        await fetchTicket();
      } else {
        console.error("Error sending message:", result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (newStatus: SupportTicketStatus) => {
    if (!ticket || updatingStatus) return;

    setUpdatingStatus(true);
    try {
      const result = await updateTicket(ticketId, { status: newStatus });
      if (result.success) {
        await fetchTicket();
      } else {
        console.error("Error updating status:", result.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
      IN_PROGRESS: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      WAITING_FOR_USER: { color: "bg-orange-100 text-orange-800", icon: Clock },
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="ml-2 font-instrument">Loading ticket...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 font-bricolage">
              Ticket Not Found
            </h1>
            <p className="text-gray-600 font-instrument mb-6">
              The support ticket you&apos;re looking for doesn&apos;t exist or
              you don&apos;t have access to it.
            </p>
            <Link href="/dashboard/support">
              <Button className="bg-purple-600 hover:bg-purple-700 font-instrument">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Support Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/support">
              <Button variant="outline" size="sm" className="font-instrument">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-bricolage">
                {ticket.title}
              </h1>
              <p className="text-gray-600 font-instrument">
                Ticket #{ticket.id.slice(-8)}
              </p>
            </div>
            {getStatusBadge(ticket.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 font-bricolage">
                  <MessageSquare className="h-5 w-5" />
                  Conversation
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 font-instrument">
                      No messages yet
                    </h3>
                    <p className="text-gray-500 font-instrument">
                      Start the conversation by sending a message below.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender.role === "SUPPORT" ||
                        message.sender.role === "ADMIN"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender.role === "SUPPORT" ||
                          message.sender.role === "ADMIN"
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                              {message.sender.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium font-instrument">
                              {message.sender.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                message.sender.role === "SUPPORT" ||
                                message.sender.role === "ADMIN"
                                  ? "bg-white/20 text-white border-white/30"
                                  : ""
                              }`}
                            >
                              {message.sender.role}
                            </Badge>
                          </div>
                        </div>
                        <p className="font-instrument">{message.message}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender.role === "SUPPORT" ||
                            message.sender.role === "ADMIN"
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 font-instrument"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700 font-instrument"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Ticket Details Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bricolage">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument">
                    Status
                  </label>
                  <Select
                    value={ticket.status}
                    onValueChange={handleStatusUpdate}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
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
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument">
                    Category
                  </label>
                  <Badge variant="outline" className="mt-1 font-instrument">
                    {ticket.category}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument">
                    Priority
                  </label>
                  <Badge
                    className={`mt-1 font-instrument ${
                      ticket.priority === "URGENT"
                        ? "bg-red-100 text-red-800"
                        : ticket.priority === "HIGH"
                        ? "bg-orange-100 text-orange-800"
                        : ticket.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ticket.priority}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument">
                    Created
                  </label>
                  <p className="text-sm text-gray-900 font-instrument">
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900 font-instrument">
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bricolage">
                  <User className="h-5 w-5" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {ticket.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium font-instrument">
                      {ticket.user.name}
                    </p>
                    <p className="text-sm text-gray-600 font-instrument">
                      {ticket.user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Info */}
            {ticket.booking && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bricolage">
                    <Calendar className="h-5 w-5" />
                    Related Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-instrument">
                      Trip
                    </label>
                    <p className="font-medium font-instrument">
                      {ticket.booking.travelPlan.title}
                    </p>
                  </div>
                  {ticket.booking.travelPlan.destination && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 font-instrument">
                        Destination
                      </label>
                      <p className="flex items-center gap-1 text-sm font-instrument">
                        <MapPin className="h-3 w-3" />
                        {ticket.booking.travelPlan.destination}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-instrument">
                      Dates
                    </label>
                    <p className="text-sm font-instrument">
                      {new Date(ticket.booking.startDate).toLocaleDateString()}{" "}
                      - {new Date(ticket.booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assigned Staff */}
            {ticket.assignee && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bricolage">
                    <User className="h-5 w-5" />
                    Assigned To
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {ticket.assignee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium font-instrument">
                        {ticket.assignee.name}
                      </p>
                      <p className="text-sm text-gray-600 font-instrument">
                        {ticket.assignee.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatClient;

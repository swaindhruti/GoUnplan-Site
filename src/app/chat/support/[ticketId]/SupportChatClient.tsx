"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Headphones,
  XCircle,
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchTicket = useCallback(async () => {
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
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Optimistic update
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      message: messageContent,
      createdAt: new Date(),
      sender: {
        name: "You",
        role: "SUPPORT",
      },
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const result = await addTicketMessage({
        ticketId,
        message: messageContent,
        isInternal: false,
        attachments: [],
      });

      if (result.success) {
        // Refresh to get the real message from server
        await fetchTicket();
      } else {
        console.error("Error sending message:", result.error);
        // Remove optimistic message on error
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticMessage.id)
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
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
        setTicket((prev: any) => ({ ...prev, status: newStatus })); // eslint-disable-line @typescript-eslint/no-explicit-any
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
      OPEN: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      IN_PROGRESS: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      WAITING_FOR_USER: { color: "bg-orange-100 text-orange-800", icon: Clock },
      RESOLVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CLOSED: { color: "bg-gray-100 text-gray-800", icon: XCircle },
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

  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleString();
  }, []);

  const formatTime = useCallback((date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-instrument">
            Loading ticket...
          </span>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4 font-bricolage">
            Ticket Not Found
          </h1>
          <p className="text-gray-600 font-instrument mb-6">
            The support ticket you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href="/dashboard/support">
            <Button className="bg-blue-600 hover:bg-blue-700 font-instrument">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/support">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-instrument border-slate-200 hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold font-bricolage text-gray-900">
                  {ticket.title}
                </h1>
                <p className="text-gray-600 font-instrument text-sm">
                  Ticket #{ticket.id.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${
                  ticket.priority === "URGENT"
                    ? "bg-red-100 text-red-800"
                    : ticket.priority === "HIGH"
                    ? "bg-orange-100 text-orange-800"
                    : ticket.priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                } font-instrument`}
              >
                {ticket.priority}
              </Badge>
              {getStatusBadge(ticket.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Messages - Main Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-col h-[calc(100vh-280px)] bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 bg-slate-100/60 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold font-bricolage text-gray-900">
                      Support Conversation
                    </h3>
                    <p className="text-sm text-gray-600 font-instrument">
                      {messages.length} message
                      {messages.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 bg-slate-100/80 border border-slate-200 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-bricolage">
                      No messages yet
                    </h3>
                    <p className="text-gray-600 font-instrument max-w-sm">
                      Start the conversation by sending a message below.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    // Customer message = message from the ticket creator (user who opened the ticket)
                    const isCustomerMessage =
                      message.sender.id === ticket.userId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isCustomerMessage ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div className="max-w-xs lg:max-w-md">
                          <div
                            className={`flex items-center gap-2 mb-1 ${
                              isCustomerMessage
                                ? "justify-start"
                                : "justify-end"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                isCustomerMessage
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {message.sender.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium text-gray-600 font-instrument">
                              {message.sender.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs border-slate-200"
                            >
                              {message.sender.role}
                            </Badge>
                          </div>
                          <div
                            className={`px-4 py-3 rounded-2xl border font-medium ${
                              isCustomerMessage
                                ? "bg-orange-100 text-gray-900 border-orange-200 shadow-sm"
                                : "bg-green-600 text-white border-green-700 shadow-md"
                            }`}
                          >
                            <p className="font-instrument">{message.message}</p>
                          </div>
                          <div
                            className={`text-xs text-gray-400 mt-1 ${
                              isCustomerMessage ? "text-left" : "text-right"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-slate-200/60 bg-slate-100/60 px-6 py-4 rounded-b-2xl">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end space-x-3"
                >
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full border border-slate-200 rounded-full px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      disabled={sending}
                      maxLength={1000}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 border border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
                    size="sm"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Details */}
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold font-bricolage mb-4 text-gray-900">
                Ticket Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument block mb-2">
                    Status
                  </label>
                  <Select
                    value={ticket.status}
                    onValueChange={handleStatusUpdate}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-full border-slate-200">
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
                  <label className="text-sm font-medium text-gray-600 font-instrument block mb-2">
                    Category
                  </label>
                  <Badge
                    variant="outline"
                    className="font-instrument border-slate-200"
                  >
                    {ticket.category}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument block mb-2">
                    Created
                  </label>
                  <p className="text-sm text-gray-900 font-instrument flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 font-instrument block mb-2">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900 font-instrument flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold font-bricolage mb-4 flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5 text-blue-600" />
                Customer
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                  <span className="text-purple-600 font-semibold text-lg">
                    {ticket.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold font-instrument text-gray-900">
                    {ticket.user.name}
                  </p>
                  <p className="text-sm text-gray-600 font-instrument">
                    {ticket.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            {ticket.booking && (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold font-bricolage mb-4 flex items-center gap-2 text-gray-900">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Related Booking
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-instrument block mb-1">
                      Trip
                    </label>
                    <p className="font-semibold font-instrument text-gray-900">
                      {ticket.booking.travelPlan.title}
                    </p>
                  </div>
                  {ticket.booking.travelPlan.destination && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 font-instrument block mb-1">
                        Destination
                      </label>
                      <p className="flex items-center gap-2 text-sm font-instrument text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {ticket.booking.travelPlan.destination}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-instrument block mb-1">
                      Dates
                    </label>
                    <p className="text-sm font-instrument text-gray-900">
                      {new Date(ticket.booking.startDate).toLocaleDateString()}{" "}
                      - {new Date(ticket.booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Assigned Staff */}
            {ticket.assignee && (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold font-bricolage mb-4 flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5 text-blue-600" />
                  Assigned To
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    <span className="text-blue-600 font-semibold text-lg">
                      {ticket.assignee.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold font-instrument text-gray-900">
                      {ticket.assignee.name}
                    </p>
                    <p className="text-sm text-gray-600 font-instrument">
                      {ticket.assignee.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatClient;

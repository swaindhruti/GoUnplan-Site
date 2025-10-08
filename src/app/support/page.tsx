"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  HelpCircle,
  MessageSquare,
  Calendar,
  MapPin,
  Plus,
  Clock,
} from "lucide-react";
import {
  getUserBookingsForSupport,
  getUserTickets,
  createTicket,
} from "@/actions/support/actions";
import Link from "next/link";

interface Booking {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  participants: number;
  status: string;
  travelPlan: {
    title: string;
    destination: string | null;
    city: string;
    country: string;
  };
}

interface UserTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: Date;
  booking?: {
    id: string;
    startDate: Date;
    endDate: Date;
    travelPlan: {
      title: string;
      destination: string | null;
    };
  } | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  messages: Array<{
    id: string;
    createdAt: Date;
  }>;
}

const SupportPage = () => {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneralTicketOpen, setIsGeneralTicketOpen] = useState(false);
  const [isBookingTicketOpen, setIsBookingTicketOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [generalTicketForm, setGeneralTicketForm] = useState({
    title: "",
    description: "",
  });
  const [bookingTicketForm, setBookingTicketForm] = useState({
    title: "",
    description: "",
  });

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const [bookingsResult, ticketsResult] = await Promise.all([
        getUserBookingsForSupport(),
        getUserTickets(),
      ]);

      if (bookingsResult.bookings) {
        setBookings(bookingsResult.bookings);
      }

      if (ticketsResult.tickets) {
        setTickets(ticketsResult.tickets as UserTicket[]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session, fetchData]);

  const handleCreateGeneralTicket = async () => {
    if (
      !generalTicketForm.title.trim() ||
      !generalTicketForm.description.trim()
    )
      return;

    try {
      const result = await createTicket({
        title: generalTicketForm.title,
        description: generalTicketForm.description,
        category: "GENERAL",
        priority: "MEDIUM",
        bookingId: undefined,
      });

      if (result.ticket) {
        setIsGeneralTicketOpen(false);
        setGeneralTicketForm({ title: "", description: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating general ticket:", error);
    }
  };

  const handleCreateBookingTicket = async () => {
    if (
      !bookingTicketForm.title.trim() ||
      !bookingTicketForm.description.trim() ||
      !selectedBookingId
    )
      return;

    try {
      const result = await createTicket({
        title: bookingTicketForm.title,
        description: bookingTicketForm.description,
        category: "BOOKING",
        priority: "MEDIUM",
        bookingId: selectedBookingId,
      });

      if (result.ticket) {
        setIsBookingTicketOpen(false);
        setBookingTicketForm({ title: "", description: "" });
        setSelectedBookingId("");
        fetchData();
      }
    } catch (error) {
      console.error("Error creating booking ticket:", error);
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="ml-2 font-instrument">
              Loading support center...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-purple-50 p-4 rounded-full w-fit mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4 font-bricolage">
              Please Sign In
            </h1>
            <p className="text-gray-600 font-instrument mb-6">
              You need to be signed in to access the support center.
            </p>
            <Link href="/auth/signin">
              <Button className="bg-purple-600 hover:bg-purple-700 font-instrument">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  Support Center
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                How can we <span className="text-purple-600">help</span> you?
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                Get assistance with your bookings and travel plans
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-4 rounded-full">
                <HelpCircle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* General Support */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-50 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-bricolage">
                  General Support
                </h3>
                <p className="text-gray-600 font-instrument">
                  Get help with general questions and issues
                </p>
              </div>
            </div>

            <Dialog
              open={isGeneralTicketOpen}
              onOpenChange={setIsGeneralTicketOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 font-instrument">
                  <Plus className="h-4 w-4 mr-2" />
                  Create General Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-bricolage">
                    Create General Support Ticket
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="general-title" className="font-instrument">
                      Subject
                    </Label>
                    <Input
                      id="general-title"
                      value={generalTicketForm.title}
                      onChange={(e) =>
                        setGeneralTicketForm({
                          ...generalTicketForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="Brief description of your issue"
                      className="font-instrument"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="general-description"
                      className="font-instrument"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="general-description"
                      value={generalTicketForm.description}
                      onChange={(e) =>
                        setGeneralTicketForm({
                          ...generalTicketForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Provide detailed information about your issue"
                      className="min-h-[100px] font-instrument"
                    />
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsGeneralTicketOpen(false)}
                      className="flex-1 font-instrument"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateGeneralTicket}
                      disabled={
                        !generalTicketForm.title.trim() ||
                        !generalTicketForm.description.trim()
                      }
                      className="flex-1 bg-purple-600 hover:bg-purple-700 font-instrument"
                    >
                      Create Ticket
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Booking Support */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-50 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-bricolage">
                  Booking Support
                </h3>
                <p className="text-gray-600 font-instrument">
                  Get help with your specific bookings
                </p>
              </div>
            </div>

            <Dialog
              open={isBookingTicketOpen}
              onOpenChange={setIsBookingTicketOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 font-instrument"
                  disabled={bookings.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {bookings.length === 0
                    ? "No Bookings Available"
                    : "Create Booking Ticket"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-bricolage">
                    Create Booking Support Ticket
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="booking" className="font-instrument">
                      Select Booking
                    </Label>
                    <Select
                      value={selectedBookingId}
                      onValueChange={setSelectedBookingId}
                    >
                      <SelectTrigger className="font-instrument">
                        <SelectValue placeholder="Choose your booking" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookings.map((booking) => (
                          <SelectItem key={booking.id} value={booking.id}>
                            <div className="font-instrument">
                              {booking.travelPlan.title} -{" "}
                              {booking.travelPlan.destination ||
                                booking.travelPlan.city}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="booking-title" className="font-instrument">
                      Subject
                    </Label>
                    <Input
                      id="booking-title"
                      value={bookingTicketForm.title}
                      onChange={(e) =>
                        setBookingTicketForm({
                          ...bookingTicketForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="Brief description of your booking issue"
                      className="font-instrument"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="booking-description"
                      className="font-instrument"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="booking-description"
                      value={bookingTicketForm.description}
                      onChange={(e) =>
                        setBookingTicketForm({
                          ...bookingTicketForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Provide detailed information about your booking issue"
                      className="min-h-[100px] font-instrument"
                    />
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsBookingTicketOpen(false)}
                      className="flex-1 font-instrument"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateBookingTicket}
                      disabled={
                        !bookingTicketForm.title.trim() ||
                        !bookingTicketForm.description.trim() ||
                        !selectedBookingId
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 font-instrument"
                    >
                      Create Ticket
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {bookings.length === 0 && (
              <p className="text-sm text-gray-500 mt-3 font-instrument">
                You need to have bookings to create booking-specific support
                tickets.
              </p>
            )}
          </div>
        </div>

        {/* Ticket History */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="bg-white rounded-t-2xl border-b border-gray-200">
            <CardTitle className="flex items-center font-bricolage">
              <Clock className="h-5 w-5 mr-2 text-gray-600" />
              Your Ticket History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/support/tickets/${ticket.id}`}
                          className="text-lg font-semibold hover:text-purple-600 transition-colors font-bricolage"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-gray-600 mt-1 font-instrument">
                          {ticket.description.slice(0, 150)}
                          {ticket.description.length > 150 && "..."}
                        </p>
                        {ticket.booking && (
                          <p className="text-sm text-blue-600 mt-2 font-instrument">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            Related to: {ticket.booking.travelPlan.title}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center font-instrument">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          {ticket.assignee && (
                            <span className="font-instrument">
                              Assigned to: {ticket.assignee.name}
                            </span>
                          )}
                          {ticket.messages.length > 0 && (
                            <span className="font-instrument">
                              {ticket.messages.length} messages
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusBadgeVariant(ticket.status)}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 p-4 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-bricolage">
                  No support tickets yet
                </h3>
                <p className="text-gray-600 font-instrument">
                  When you create a support ticket, it will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;

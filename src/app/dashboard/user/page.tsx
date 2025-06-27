"use client";

import { useEffect, useState, useMemo } from "react";
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
  User,
  Calendar,
  Clock,
  ShoppingBag,
  BookOpen,
  Settings,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { getUserProfile, getUserBookings } from "@/actions/user/action";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define interfaces for your data types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  bookingCounts: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
}

interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  pricePerPerson: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  travelPlan: {
    title: string;
    description: string;
    country: string | null;
    state: string | null;
    city: string | null;
    noOfDays: number;
    price: number;
    host: {
      user: {
        name: string;
        email: string;
        image: string | null;
      };
    };
  };
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [bookingFilter, setBookingFilter] = useState("all");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (session?.user?.email) {
          // Fetch user profile
          const profileResponse = await getUserProfile(session.user.email);
          if (profileResponse.error) {
            setError(profileResponse.error);
            return;
          }

          if (!profileResponse.user) {
            setError("User profile not found");
            return;
          }

          setProfile(profileResponse.user || null);

          // Fetch bookings
          const bookingsResponse = await getUserBookings(
            profileResponse.user.id
          );
          if (bookingsResponse.error) {
            setError(bookingsResponse.error);
            return;
          }
          setBookings(bookingsResponse.bookings || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

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

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (bookingFilter === "all") return true;
    return booking.status.toLowerCase() === bookingFilter.toLowerCase();
  });

  // Function to format date range
  const formatDateRange = (start: Date, end: Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startMonth = startDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  // Get badge class for booking status
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      confirmed:
        "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium",
      pending:
        "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium",
      completed:
        "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium",
      cancelled:
        "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium",
    };

    const statusKey = status.toLowerCase() as keyof typeof statusStyles;
    const className = statusStyles[statusKey] || statusStyles.pending;

    return (
      <span className={className}>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };

  // Memoize the profile content
  const profileContent = useMemo(
    () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                User Profile
              </h3>
              <p className="text-sm text-gray-600">Your personal information</p>
            </div>
            <Button
              variant="outline"
              className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              onClick={() => setActiveTab("settings")}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-full sm:w-1/3">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {profile?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {profile?.name}
                </h3>
                <p className="text-gray-600 mt-1">{profile?.email}</p>
                <Badge className="mt-3 bg-purple-100 text-purple-700 px-4 py-1">
                  {profile?.role || "USER"}
                </Badge>
              </div>
            </div>

            <div className="w-full sm:w-2/3 mt-8 sm:mt-0">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Contact Information
                  </h4>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-800 mt-1">
                        {profile?.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-800 mt-1">
                        {profile?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    About Me
                  </h4>
                  <div className="mt-2 bg-gray-50 rounded-md p-4">
                    <p className="text-gray-800">
                      {profile?.bio ||
                        "No bio information provided. Update your profile to add your bio."}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Account Information
                  </h4>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium text-gray-800 mt-1">
                        {profile?.role || "User"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-800 mt-1">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [profile]
  ); // Only re-render when profile changes

  // Memoize the bookings content
  const bookingsContent = useMemo(
    () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Your Bookings
              </h3>
              <p className="text-sm text-gray-600">
                Manage your travel bookings
              </p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setBookingFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  bookingFilter === "all"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setBookingFilter("confirmed")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  bookingFilter === "confirmed"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setBookingFilter("pending")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  bookingFilter === "pending"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredBookings.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Trip
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Destination
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Dates
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Price
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Participants
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                          {booking.travelPlan.title.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {booking.travelPlan.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {[
                        booking.travelPlan.city,
                        booking.travelPlan.state,
                        booking.travelPlan.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {formatDateRange(booking.startDate, booking.endDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        ${booking.totalPrice.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 text-center">
                      {booking.participants}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Button
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                        className="text-purple-600 bg-white hover:text-purple-800 font-medium text-sm"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="mt-2 text-gray-600">
                  {bookings.length === 0
                    ? "No bookings found. Start by booking your first trip!"
                    : `No ${bookingFilter} bookings found.`}
                </p>
                <div className="mt-6">
                  <Link href="/explore">
                    <Button className="bg-purple-600 text-white hover:bg-purple-700">
                      Explore Trips
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    [bookingFilter, filteredBookings, bookings.length, router]
  ); // Only re-render when these change

  // Memoize the placeholder content for other tabs
  const placeholderContent = useMemo(
    () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          {activeTab === "explore" && (
            <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          )}
          {activeTab === "messages" && (
            <MessageSquare className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          )}
          {activeTab === "settings" && (
            <Settings className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          )}

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            This section is coming soon! We&apos;re working to make your
            experience even better.
          </p>

          {activeTab === "explore" && (
            <div className="mt-6">
              <Link href="/explore">
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  Browse Available Trips
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    ),
    [activeTab]
  ); // Re-render only when active tab changes

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading your dashboard...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage your profile, bookings, and travel plans
            </p>
          </div>
          <div className="text-2xl gap-2 flex items-center font-bold text-gray-900">
            <User size={30} />
            {profile?.name || "User"}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            <TabButton
              label="Profile"
              icon={<User className="w-5 h-5" />}
              isActive={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <TabButton
              label="Bookings"
              icon={<Calendar className="w-5 h-5" />}
              isActive={activeTab === "bookings"}
              onClick={() => setActiveTab("bookings")}
            />
            <TabButton
              label="Explore"
              icon={<BookOpen className="w-5 h-5" />}
              isActive={activeTab === "explore"}
              onClick={() => setActiveTab("explore")}
            />
            <TabButton
              label="Messages"
              icon={<MessageSquare className="w-5 h-5" />}
              isActive={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
            />
            <TabButton
              label="Settings"
              icon={<Settings className="w-5 h-5" />}
              isActive={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.bookingCounts.total || 0}
              </div>
              <p className="text-xs text-gray-600">All time bookings</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Trips
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.bookingCounts.confirmed || 0}
              </div>
              <p className="text-xs text-gray-600">Confirmed bookings</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Trips
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.bookingCounts.completed || 0}
              </div>
              <p className="text-xs text-gray-600">Travel memories</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Spent on Travel
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {bookings
                  .reduce((sum, booking) => sum + booking.totalPrice, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">Total expenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content - Use memoized components */}
        {activeTab === "profile" && profileContent}
        {activeTab === "bookings" && bookingsContent}
        {(activeTab === "explore" ||
          activeTab === "messages" ||
          activeTab === "settings") &&
          placeholderContent}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import { getHostBookings } from '@/actions/host/action';
import { BookingStatus, TeamMemberInput } from '@/types/booking';
import { PaymentStatus } from '@prisma/client';

type Booking = {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  participants: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  specialRequirements: string | null;
  pricePerPerson: number;
  refundAmount: number;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    image: string | null;
  };
  travelPlan: {
    travelPlanId: string;
    title: string;
    destination: string | null;
    startDate: Date | null;
    endDate: Date | null;
    price: number;
    tripImage: string | null;
    maxParticipants: number | null;
  };
  guests: TeamMemberInput[];
};

type BookingCounts = {
  ALL: number;
  CONFIRMED: number;
  PENDING: number;
  PARTIALLY_PAID: number;
  FULLY_PAID: number;
  OVERDUE: number;
  CANCELLED: number;
  REFUNDED: number;
};

export const BookingsHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState<BookingCounts>({
    ALL: 0,
    CONFIRMED: 0,
    PENDING: 0,
    PARTIALLY_PAID: 0,
    FULLY_PAID: 0,
    OVERDUE: 0,
    CANCELLED: 0,
    REFUNDED: 0,
  });

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all bookings without trip filter, using payment status filtering
      const response = await getHostBookings(undefined, undefined, 'payment');

      if ('error' in response) {
        setError(response.error as string);
      } else if (response.success) {
        setBookings(response.bookings || []);
        // Calculate payment status counts from the bookings data
        const paymentCounts = (response.bookings || []).reduce(
          (acc: BookingCounts, booking: Booking) => {
            acc.ALL++;

            // Count by booking status
            if (booking.status === 'CONFIRMED') {
              acc.CONFIRMED++;
            } else if (booking.status === 'PENDING') {
              acc.PENDING++;
            } else if (booking.status === 'CANCELLED') {
              acc.CANCELLED++;
            }

            // Count by payment status
            if (booking.paymentStatus === 'PARTIALLY_PAID') {
              acc.PARTIALLY_PAID++;
            } else if (booking.paymentStatus === 'FULLY_PAID') {
              acc.FULLY_PAID++;
            } else if (booking.paymentStatus === 'OVERDUE') {
              acc.OVERDUE++;
            } else if (booking.paymentStatus === 'REFUNDED') {
              acc.REFUNDED++;
            }

            return acc;
          },
          {
            ALL: 0,
            CONFIRMED: 0,
            PENDING: 0,
            PARTIALLY_PAID: 0,
            FULLY_PAID: 0,
            OVERDUE: 0,
            CANCELLED: 0,
            REFUNDED: 0,
          }
        );
        setCounts(paymentCounts);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterBookings = useCallback(() => {
    let filtered = bookings;

    // Filter by payment status only
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(booking => booking.paymentStatus === selectedStatus);
    }

    // Filter by search term (only use activeSearchTerm)
    if (activeSearchTerm) {
      const term = activeSearchTerm.toLowerCase();
      filtered = filtered.filter(
        booking =>
          booking.user.name.toLowerCase().includes(term) ||
          (booking.user.email && booking.user.email.toLowerCase().includes(term)) ||
          booking.travelPlan.title.toLowerCase().includes(term) ||
          booking.travelPlan.destination?.toLowerCase().includes(term) ||
          booking.id.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, selectedStatus, activeSearchTerm]);

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const copyBookingId = async (bookingId: string) => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setCopiedId(bookingId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy booking ID:', err);
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'REFUNDED':
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPaymentStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'FULLY_PAID':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PARTIALLY_PAID':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'OVERDUE':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'REFUNDED':
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'FULLY_PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PARTIALLY_PAID':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookings History</h2>
          <p className="text-gray-600 font-medium">View and manage all your booking history</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookings History</h2>
          <p className="text-gray-600 font-medium">View and manage all your booking history</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookings History</h2>
        <p className="text-gray-600 font-medium">
          View and manage all your booking history across all trips
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, trip title, or booking ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Search
          </button>
          {activeSearchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveSearchTerm('');
              }}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Payment Status Filter Tabs - Updated to match user dashboard style */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 font-instrument">
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'All', color: 'purple' },
              { key: 'PENDING', label: 'Pending', color: 'yellow' },
              { key: 'FULLY_PAID', label: 'Fully Paid', color: 'green' },
              {
                key: 'PARTIALLY_PAID',
                label: 'Partial Payment',
                color: 'orange',
              },
              { key: 'OVERDUE', label: 'Payment Due', color: 'red' },
              { key: 'CANCELLED', label: 'Cancelled', color: 'gray' },
              { key: 'REFUNDED', label: 'Refunded', color: 'purple' },
            ].map(status => (
              <button
                key={status.key}
                onClick={() => setSelectedStatus(status.key)}
                className={`
                  inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 font-instrument
                  ${
                    selectedStatus === status.key
                      ? status.color === 'purple'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : status.color === 'green'
                          ? 'bg-green-500 text-white shadow-sm'
                          : status.color === 'orange'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : status.color === 'yellow'
                              ? 'bg-yellow-500 text-white shadow-sm'
                              : status.color === 'red'
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'bg-gray-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }
                `}
              >
                {status.label}
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    selectedStatus === status.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {status.key === 'ALL'
                    ? counts.ALL
                    : counts[status.key as keyof BookingCounts] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredBookings.length} of {bookings.length} bookings
          </span>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No bookings match your search "${searchTerm}"`
                : selectedStatus === 'ALL'
                  ? "You don't have any bookings yet."
                  : `No ${selectedStatus.toLowerCase()} bookings found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map(booking => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {booking.id}
                        </div>
                        <button
                          onClick={() => copyBookingId(booking.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy Booking ID"
                        >
                          {copiedId === booking.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 mr-3">
                          <Image
                            src={
                              booking.travelPlan.tripImage || 'https://avatar.iran.liara.run/public'
                            }
                            alt={booking.travelPlan.title}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-32 truncate">
                            {booking.travelPlan.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.travelPlan.destination || 'Destination TBA'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.participants}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                      {booking.refundAmount > 0 && (
                        <div className="text-red-600">
                          Refunded: {formatCurrency(booking.refundAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                          booking.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusIcon(booking.paymentStatus)}
                        {booking.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking ID and Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Booking ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-lg font-mono font-semibold text-gray-900">
                        {selectedBooking.id}
                      </p>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          copyBookingId(selectedBooking.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedId === selectedBooking.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Booked On</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {formatDate(selectedBooking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Trip Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {selectedBooking.travelPlan.tripImage && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={selectedBooking.travelPlan.tripImage}
                          alt={selectedBooking.travelPlan.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <h5 className="text-xl font-bold text-gray-900">
                        {selectedBooking.travelPlan.title}
                      </h5>
                      <p className="text-gray-600">
                        {selectedBooking.travelPlan.destination || 'Destination TBA'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedBooking.startDate &&
                            formatDate(selectedBooking.startDate)} -{' '}
                          {selectedBooking.endDate && formatDate(selectedBooking.endDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {selectedBooking.participants} participants
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(selectedBooking.totalPrice)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Price Per Person</label>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(selectedBooking.pricePerPerson)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Booking Status</label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            selectedBooking.status
                          )}`}
                        >
                          {getStatusIcon(selectedBooking.status)}
                          {selectedBooking.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Status</label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                            selectedBooking.paymentStatus
                          )}`}
                        >
                          {getPaymentStatusIcon(selectedBooking.paymentStatus)}
                          {selectedBooking.paymentStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedBooking.refundAmount > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <label className="text-sm font-medium text-red-700">Refund Amount</label>
                      <p className="text-xl font-bold text-red-600 mt-1">
                        {formatCurrency(selectedBooking.refundAmount)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guest Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Guest Information ({selectedBooking.guests.length}{' '}
                  {selectedBooking.guests.length === 1 ? 'Guest' : 'Guests'})
                </h4>
                <div className="space-y-3">
                  {selectedBooking.guests.map((guest, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <h5 className="text-lg font-semibold text-gray-900">
                              {guest.firstName} {guest.lastName}
                              {guest.isteamLead && (
                                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                  Team Lead
                                </span>
                              )}
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-10">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Email</label>
                              <p className="text-sm text-gray-900">{guest.memberEmail}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Phone</label>
                              <p className="text-sm text-gray-900">{guest.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Contact */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Primary Contact</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {selectedBooking.user.image && (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={selectedBooking.user.image}
                          alt={selectedBooking.user.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <h5 className="text-lg font-semibold text-gray-900">
                        {selectedBooking.user.name}
                      </h5>
                      <div className="space-y-1 text-sm text-gray-600">
                        {selectedBooking.user.email && <p>Email: {selectedBooking.user.email}</p>}
                        {selectedBooking.user.phone && <p>Phone: {selectedBooking.user.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {selectedBooking.specialRequirements && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Special Requirements</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedBooking.specialRequirements}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

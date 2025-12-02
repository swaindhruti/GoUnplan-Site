'use client';

import { useEffect, useState } from 'react';
import { getHostWallet } from '@/actions/wallet/wallet-actions';
import { WalletData } from '@/types/wallet';
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  MapPin,
  IndianRupee,
  AlertCircle,
  Filter,
  Download,
} from 'lucide-react';
import { PayoutStatus } from '@prisma/client';
import { format } from 'date-fns';

export const WalletSection = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'transactions' | 'bookings'>('summary');
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await getHostWallet();

      if ('error' in response) {
        setError(response.error as string);
      } else if (response.success && response.walletData) {
        setWalletData(response.walletData);
      }
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return format(new Date(date), 'dd MMM yyyy');
  };

  const getStatusIcon = (status: PayoutStatus) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'FAILED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: PayoutStatus) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'PAID':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'CANCELLED':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'FAILED':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const filteredTransactions = walletData?.transactions.filter(
    transaction => statusFilter === 'ALL' || transaction.status === statusFilter
  );

  const filteredBookingPayouts = walletData?.bookingPayouts.filter(payout => {
    if (statusFilter === 'ALL') return true;
    return (
      payout.firstPayment.status === statusFilter || payout.secondPayment.status === statusFilter
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-instrument">Loading wallet...</span>
        </div>
      </div>
    );
  }

  if (error || !walletData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-instrument">{error || 'Failed to load wallet'}</p>
        </div>
      </div>
    );
  }

  const { summary } = walletData;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Wallet className="h-6 w-6" />
            </div>
            <TrendingUp className="h-5 w-5 opacity-70" />
          </div>
          <p className="text-sm opacity-90 font-instrument mb-1">Total Earnings</p>
          <p className="text-3xl font-bold font-bricolage">
            {formatCurrency(summary.totalEarnings)}
          </p>
          <p className="text-xs opacity-75 mt-2 font-instrument">
            From {summary.totalBookings} bookings
          </p>
        </div>

        {/* Received Amount */}
        <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-instrument mb-1">Received</p>
          <p className="text-3xl font-bold text-green-600 font-bricolage">
            {formatCurrency(summary.receivedAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-2 font-instrument">Successfully paid out</p>
        </div>

        {/* Pending Amount */}
        <div className="bg-white rounded-2xl p-6 border-2 border-yellow-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-instrument mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 font-bricolage">
            {formatCurrency(summary.pendingAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-2 font-instrument">Awaiting payment</p>
        </div>

        {/* Upcoming Amount */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-instrument mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-blue-600 font-bricolage">
            {formatCurrency(summary.upcomingAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-2 font-instrument">Scheduled payouts</p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center p-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('summary')}
                className={`px-4 py-2 rounded-lg font-instrument font-semibold text-sm transition-all ${
                  viewMode === 'summary'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setViewMode('transactions')}
                className={`px-4 py-2 rounded-lg font-instrument font-semibold text-sm transition-all ${
                  viewMode === 'transactions'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setViewMode('bookings')}
                className={`px-4 py-2 rounded-lg font-instrument font-semibold text-sm transition-all ${
                  viewMode === 'bookings'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                By Booking
              </button>
            </div>

            {viewMode !== 'summary' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as PayoutStatus | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-instrument focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-instrument font-semibold text-sm">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Summary View */}
          {viewMode === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 font-bricolage mb-4">
                    Earnings Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-instrument">Total Earnings:</span>
                      <span className="font-bold text-purple-700 font-instrument">
                        {formatCurrency(summary.totalEarnings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-instrument">Received:</span>
                      <span className="font-bold text-green-600 font-instrument">
                        {formatCurrency(summary.receivedAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-instrument">Pending:</span>
                      <span className="font-bold text-yellow-600 font-instrument">
                        {formatCurrency(summary.pendingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-instrument">Upcoming:</span>
                      <span className="font-bold text-blue-600 font-instrument">
                        {formatCurrency(summary.upcomingAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 font-bricolage mb-4">
                    Booking Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-instrument">Total Bookings:</span>
                      <span className="font-bold text-gray-900 font-instrument">
                        {summary.totalBookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-instrument">Completed Trips:</span>
                      <span className="font-bold text-green-600 font-instrument">
                        {summary.completedBookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-instrument">Avg per Booking:</span>
                      <span className="font-bold text-gray-900 font-instrument">
                        {summary.totalBookings > 0
                          ? formatCurrency(summary.totalEarnings / summary.totalBookings)
                          : formatCurrency(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 font-instrument">
                      Payment Schedule
                    </p>
                    <p className="text-sm text-blue-700 mt-1 font-instrument">
                      Payouts are processed in two installments:{' '}
                      <strong>20% is paid 15 days before the trip start date</strong> and{' '}
                      <strong>80% is paid on the trip start date</strong> or as per the agreement.
                      Payments are typically processed within 2-3 business days of the scheduled
                      date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions View */}
          {viewMode === 'transactions' && (
            <div className="space-y-4">
              {filteredTransactions && filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(transaction.status)}
                          <h4 className="font-bold text-gray-900 font-instrument">
                            {transaction.tripTitle}
                          </h4>
                          <span className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 font-instrument">
                              {transaction.userName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 font-instrument">
                              {formatDate(transaction.tripStartDate)} -{' '}
                              {formatDate(transaction.tripEndDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 font-instrument">
                              {transaction.paymentType === 'first'
                                ? 'First Payment'
                                : 'Second Payment'}{' '}
                              - {formatDate(transaction.paymentDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-gray-400" />
                            <span className="font-bold text-gray-900 font-instrument">
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        </div>
                        {transaction.paidAt && (
                          <div className="mt-2 text-xs text-green-600 font-instrument">
                            ✓ Paid on {formatDate(transaction.paidAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-instrument">No transactions found</p>
                </div>
              )}
            </div>
          )}

          {/* Bookings View */}
          {viewMode === 'bookings' && (
            <div className="space-y-4">
              {filteredBookingPayouts && filteredBookingPayouts.length > 0 ? (
                filteredBookingPayouts.map(payout => (
                  <div
                    key={payout.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <h4 className="font-bold text-lg text-gray-900 font-bricolage">
                          {payout.tripTitle}
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-instrument">Total Amount</p>
                        <p className="text-2xl font-bold text-purple-600 font-bricolage">
                          {formatCurrency(payout.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 font-instrument">
                          Guest: {payout.userName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 font-instrument">
                          {formatDate(payout.tripStartDate)} - {formatDate(payout.tripEndDate)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Payment */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payout.firstPayment.status)}
                            <span className="font-semibold text-gray-900 font-instrument">
                              First Payment ({payout.firstPayment.percent}%)
                            </span>
                          </div>
                          <span className={getStatusBadge(payout.firstPayment.status)}>
                            {payout.firstPayment.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-instrument">Amount:</span>
                            <span className="font-bold text-gray-900 font-instrument">
                              {formatCurrency(payout.firstPayment.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-instrument">Due Date:</span>
                            <span className="text-gray-900 font-instrument">
                              {formatDate(payout.firstPayment.date)}
                            </span>
                          </div>
                          {payout.firstPayment.paidAt && (
                            <div className="flex justify-between text-green-600">
                              <span className="font-instrument">Paid On:</span>
                              <span className="font-instrument">
                                {formatDate(payout.firstPayment.paidAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Second Payment */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payout.secondPayment.status)}
                            <span className="font-semibold text-gray-900 font-instrument">
                              Second Payment ({payout.secondPayment.percent}%)
                            </span>
                          </div>
                          <span className={getStatusBadge(payout.secondPayment.status)}>
                            {payout.secondPayment.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-instrument">Amount:</span>
                            <span className="font-bold text-gray-900 font-instrument">
                              {formatCurrency(payout.secondPayment.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-instrument">Due Date:</span>
                            <span className="text-gray-900 font-instrument">
                              {formatDate(payout.secondPayment.date)}
                            </span>
                          </div>
                          {payout.secondPayment.paidAt && (
                            <div className="flex justify-between text-green-600">
                              <span className="font-instrument">Paid On:</span>
                              <span className="font-instrument">
                                {formatDate(payout.secondPayment.paidAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {payout.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900 font-instrument">
                          <strong>Note:</strong> {payout.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-instrument">No booking payouts found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

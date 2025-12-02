import { PayoutStatus } from '@prisma/client';

/**
 * Wallet summary for host dashboard
 */
export interface WalletSummary {
  totalEarnings: number;
  receivedAmount: number;
  pendingAmount: number;
  upcomingAmount: number;
  totalBookings: number;
  completedBookings: number;
}

/**
 * Individual payout transaction details
 */
export interface WalletTransaction {
  id: string;
  bookingId: string;
  tripTitle: string;
  tripStartDate: Date;
  tripEndDate: Date;
  userName: string;
  userEmail: string;
  totalAmount: number;
  paymentType: 'first' | 'second';
  amount: number;
  paymentDate: Date;
  status: PayoutStatus;
  paidAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
}

/**
 * Grouped payout details by booking
 */
export interface BookingPayout {
  id: string;
  bookingId: string;
  tripTitle: string;
  tripStartDate: Date;
  tripEndDate: Date;
  userName: string;
  userEmail: string;
  totalAmount: number;
  firstPayment: {
    amount: number;
    date: Date;
    status: PayoutStatus;
    paidAt?: Date | null;
    percent: number;
  };
  secondPayment: {
    amount: number;
    date: Date;
    status: PayoutStatus;
    paidAt?: Date | null;
    percent: number;
  };
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Wallet data response
 */
export interface WalletData {
  summary: WalletSummary;
  transactions: WalletTransaction[];
  bookingPayouts: BookingPayout[];
}

/**
 * Filter options for wallet transactions
 */
export interface WalletFilter {
  status?: PayoutStatus;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

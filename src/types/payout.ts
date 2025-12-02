import { PayoutStatus } from "@prisma/client";

export interface PayoutDetails {
  id: string;
  bookingId: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  tripTitle: string;
  tripStartDate: Date;
  tripEndDate: Date;
  totalAmount: number;
  firstPaymentAmount: number;
  firstPaymentDate: Date;
  firstPaymentStatus: PayoutStatus;
  firstPaymentPaidAt?: Date | null;
  secondPaymentAmount: number;
  secondPaymentDate: Date;
  secondPaymentStatus: PayoutStatus;
  secondPaymentPaidAt?: Date | null;
  firstPaymentPercent: number;
  secondPaymentPercent: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userEmail: string;
}

export interface PayoutSummary {
  totalPayouts: number;
  pendingPayouts: number;
  paidPayouts: number;
  totalPendingAmount: number;
  totalPaidAmount: number;
  upcomingPayments: number;
}

export interface CreatePayoutInput {
  bookingId: string;
  firstPaymentPercent?: number;
  secondPaymentPercent?: number;
  notes?: string;
}

export interface UpdatePayoutInput {
  payoutId: string;
  firstPaymentPercent?: number;
  secondPaymentPercent?: number;
  firstPaymentDate?: Date;
  secondPaymentDate?: Date;
  notes?: string;
}

export interface MarkPayoutPaidInput {
  payoutId: string;
  paymentType: 'first' | 'second';
}

export interface PayoutFilter {
  status?: PayoutStatus;
  hostId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface PayoutEmailPayload {
  hostName?: string;
  bookingId?: string;
  travelTitle?: string;
  amount?: number;
  paymentDate?: string;
  totalAmount?: number;
  notes?: string;
}

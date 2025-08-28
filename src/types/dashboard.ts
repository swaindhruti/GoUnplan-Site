import { PaymentStatus } from "@prisma/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  image: string | null;
  role: string;
  isEmailVerified: boolean;
  createdAt: Date;
  bookingCounts: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  paymentCounts: {
    fullyPaid: number;
    partiallyPaid: number;
    paymentPending: number;
    overdue: number;
    cancelled: number;
    refunded: number;
  };
}

export interface Booking {
  id: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  pricePerPerson: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  paymentStatus: PaymentStatus;
  minPaymentAmount?: number | null;
  amountPaid?: number | null;
  remainingAmount?: number | null;
  paymentDeadline?: Date | null;
  refundAmount?: number;
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

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  booking: {
    startDate: Date;
    endDate: Date;
  };
  travelPlan: {
    title: string;
    travelPlanId: string;
    destination: string | null;
    host: {
      hostId: string;
      user: {
        name: string;
        image: string | null;
      };
    };
  };
}

export interface PendingReview {
  id: string;
  startDate: Date;
  endDate: Date;
  travelPlan: {
    title: string;
    travelPlanId: string;
    destination: string | null;
    host: {
      user: {
        name: string;
      };
    };
  };
}

export interface ReviewFormState {
  bookingId: string;
  rating: number;
  comment: string;
  isSubmitting: boolean;
  success: string | null;
  error: string | null;
}

export interface ReviewStats {
  count: number;
  averageRating: number;
}

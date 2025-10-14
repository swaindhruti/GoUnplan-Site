export type RevenueAnalytics = {
  // Payment Status Based Data
  fullyPaid: {
    revenue: number;
    bookingCount: number;
  };
  partiallyPaid: {
    revenue: number;
    amountReceived: number;
    remainingAmount: number;
    bookingCount: number;
  };
  pending: {
    bookingValue: number;
    bookingCount: number;
  };
  overdue: {
    bookingValue: number;
    bookingCount: number;
  };
  cancelled: {
    bookingValue: number;
    refundAmount: number;
    bookingCount: number;
  };
  refunded: {
    refundAmount: number;
    bookingCount: number;
  };
  summary: {
    totalRevenue: number; // All fully paid + partially paid amounts
    receivedRevenue: number; // Actual money received
    pendingRevenue: number; // Money still to be collected
    revenueAtRisk: number; // Overdue + cancelled bookings
    collectionEfficiency: number; // Percentage of money collected vs expected
  };
  monthlyTrend: Array<{
    month: string;
    year: number;
    monthNum: number;
    fullyPaidRevenue: number;
    partiallyPaidRevenue: number;
    pendingRevenue: number;
    totalBookings: number;
  }>;
};

export type Trip = {
  travelPlanId: string;
  title: string;
  description: string;
  price: number;
  destination: string | null;
  status: string;
  noOfDays: number;
  startDate?: Date | null;
  endDate?: Date | null;
  tripImage?: string | null;
  city?: string | null;
  state?: string | null;
  maxParticipants?: number;
  reviewCount?: number;
  averageRating?: number;
  filters?: string[];
  languages?: string[];
  includedActivities?: string[];
  restrictions?: string[];
  special?: string[];
  notIncludedActivities?: string[];
  genderPreference?: "MALE_ONLY" | "FEMALE_ONLY" | "MIX";
  dayWiseData?: Array<{
    dayNumber: number;
    title: string;
    description: string;
    activities: string[];
    meals: string;
    accommodation: string;
    dayWiseImage: string;
  }>;
};

export type HostData = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: "HOST" | "ADMIN" | "USER";
};

export type TabType =
  | "trips"
  | "profile"
  | "bookings"
  | "bookingsHistory"
  | "earnings"
  | "messages";

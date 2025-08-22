export type RevenueAnalytics = {
  confirmed: {
    revenue: number;
    bookingCount: number;
  };
  cancelled: {
    bookingValue: number;
    refundAmount: number;
    bookingCount: number;
  };
  pending: {
    bookingValue: number;
    bookingCount: number;
  };
  summary: {
    netRevenue: number;
    revenueAtRisk: number;
    cancellationRate: number;
  };
  monthlyTrend: Array<{
    month: string;
    year: number;
    monthNum: number;
    revenue: number;
    bookingCount: number;
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

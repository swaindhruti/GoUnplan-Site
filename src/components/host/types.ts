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
    status: string;
    _sum: {
      totalPrice: number;
    };
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
  | "earnings"
  | "messages";

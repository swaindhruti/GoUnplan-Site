import { Role, PaymentStatus } from "@prisma/client";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "NOTPAID"
  // | "COMPLETED"
  | "REFUNDED";

// Use the PaymentStatus enum from Prisma
export type PaymentSt = PaymentStatus;
export type TravelPlanStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface TeamMemberInput {
  isteamLead: boolean;
  phone: string;
  firstName: string;
  lastName: string;
  memberEmail: string;
}

export interface BookingFormData {
  participants: number;
  guests: TeamMemberInput[];
  specialRequirements?: string;
}

export interface BookingData {
  id?: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  participants: number;
  status: BookingStatus;
  pricePerPerson: number;
  refundAmount?: number;
  specialRequirements?: string | null;
  guests?: TeamMemberInput[];
  formSubmitted: boolean;
  submissionType?: "individual" | "team";
  updatedAt?: Date;
  createdAt?: Date;
  paymentStatus?:
    | PaymentStatus
    | "PENDING"
    | "PARTIALLY_PAID"
    | "FULLY_PAID"
    | "OVERDUE"
    | "REFUNDED"
    | "CANCELLED";
  paymentDeadline?: Date | null;
  minPaymentAmount?: number | null;
  amountPaid?: number | null;
  remainingAmount?: number | null;
}

export interface User {
  id: string;
  email?: string;
  name: string;
  bio?: string | null;
  phone?: string | null;
  password?: string | null;
  role: Role;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  appliedForHost?: boolean;
}

export interface HostProfile {
  hostId: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  hostEmail: string;
  hostMobile: string | null;
  user: User;
}

export interface TravelPlan {
  tripImage?: string | null;
  travelPlanId: string;
  title: string;
  description: string;
  includedActivities?: string[];
  restrictions?: string[];
  noOfDays?: number;
  hostId?: string;
  price?: number;
  country?: string;
  state?: string;
  city?: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  maxParticipants?: number;
  destination?: string | null;
  filters?: string[];
  languages: string[];
  endDate?: Date | null;
  startDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  host?: HostProfile;
  dayWiseItinerary?: {
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    meals: string | null;
    accommodation: string | null;
    travelPlanId: string;
  }[];
}

export interface DateSelectorUpdate {
  startDate: Date;
  endDate: Date;
}

export interface GuestInfoUpdate {
  participants: number;
  guests: TeamMemberInput[];
  specialRequirements?: string;
  // submissionType: "individual" | "team";
}

export interface PaymentUpdate {
  totalPrice: number;
  status: BookingStatus;
}

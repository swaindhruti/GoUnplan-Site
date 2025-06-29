// types/booking.ts
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface BookingData {
  id?: string;
  userId?: string;
  travelPlanId?: string;
  startDate?: Date;
  endDate?: Date;
  totalPrice?: number;
  participants?: number;
  status?: BookingStatus;
  // pricePerPerson?: number;
  refundAmount?: number;
  specialRequirements?: string;
  guests?: GuestInfo[];
  submissionType?: "individual" | "team";
  title?: string;
  destination?: string;
  description?: string;
  includedActivities?: string[];
  restrictions?: string[];
  noOfDays?: number;
  price?: number;
  startDate: Date;
  endDate: Date;
  filters: string[];
  maxParticipants?: number;
  country: string;
  state: string;
  city: string;
  languages: string[];
}

export interface DateSelectorUpdate {
  startDate: Date;
  endDate: Date;
}

export interface GuestInfoUpdate {
  participants: number;
  guests: GuestInfo[];
  specialRequirements?: string;
  submissionType: "individual" | "team";
}

export interface PaymentUpdate {
  totalPrice: number;
  status: BookingStatus;
}

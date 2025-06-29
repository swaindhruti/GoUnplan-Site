export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type TravelPlanStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export type BookingFormData = {
  guests: GuestInfo[];
  submissionType: "individual" | "team";
  numberOfGuests: number;
  participants: number; // Required!
  specialRequirements?: string;
};

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
  specialRequirements?: string;
  guests?: GuestInfo[];
  submissionType?: "individual" | "team";
}

export interface TravelPlan {
  travelPlanId: string;
  title: string;
  description: string;
  includedActivities: string[];
  restrictions: string[];
  noOfDays: number;
  hostId: string;
  price: number;
  country: string;
  state: string;
  city: string;
  status: TravelPlanStatus;
  maxParticipants: number;
  destination?: string | null;
  filters: string[];
  languages: string[];
  endDate?: Date;
  startDate?: Date;
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

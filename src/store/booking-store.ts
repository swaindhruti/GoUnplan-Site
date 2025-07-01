import { create } from "zustand";
import type {
  BookingData,
  DateSelectorUpdate,
  GuestInfoUpdate,
  PaymentUpdate,
} from "@/types/booking";
import {
  createBooking,
  updateBookingDates,
  updateBookingGuestInfo,
  updateBookingStatus,
} from "@/actions/booking/actions";

interface BookingStoreState {
  bookingData: Partial<BookingData>;
  isLoading: boolean;
  error: string | null;
  updateBookingData: (update: Partial<BookingData>) => void;
  updateDateSelection: (update: DateSelectorUpdate) => Promise<boolean>;
  updateGuestInfo: (update: GuestInfoUpdate) => Promise<boolean>;
  updatePaymentInfo: (update: PaymentUpdate) => Promise<boolean>;
  createNewBooking: (data: Partial<BookingData>) => Promise<BookingData | null>;
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  bookingData: {
    status: "PENDING",
    participants: 1,
    refundAmount: 0,
  },
  isLoading: false,
  error: null,

  updateBookingData: (update) => {
    set((state) => ({ bookingData: { ...state.bookingData, ...update } }));
  },

  updateDateSelection: async (update) => {
    set({ isLoading: true, error: null });
    const { bookingData, updateBookingData } = get();

    try {
      updateBookingData(update);
      if (bookingData.id) {
        const result = await updateBookingDates(
          bookingData.id,
          update.startDate,
          update.endDate
        );
        if (result.error) {
          set({ error: result.error });
          return false;
        }
        if (result.booking) {
          updateBookingData(result.booking);
        }
      }
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update dates",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGuestInfo: async (update) => {
    set({ isLoading: true, error: null });
    const { bookingData, updateBookingData } = get();

    try {
      updateBookingData(update);
      if (bookingData.id) {
        const result = await updateBookingGuestInfo(bookingData.id, {
          participants: update.participants,
          guests: update.guests,
          specialRequirements: update.specialRequirements,
        });
        if (result.error) {
          set({ error: result.error });
          return false;
        }
        if (result.booking) {
          updateBookingData(result.booking);
        }
      }
      return true;
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to update guest info",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePaymentInfo: async (update) => {
    set({ isLoading: true, error: null });
    const { bookingData, updateBookingData } = get();

    try {
      updateBookingData(update);
      if (bookingData.id) {
        const result = await updateBookingStatus(bookingData.id, update.status);
        if (result.error) {
          set({ error: result.error });
          return false;
        }
        if (result.booking) {
          updateBookingData(result.booking);
        }
      }
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to process payment",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  createNewBooking: async (data) => {
    set({ isLoading: true, error: null });
    const { bookingData, updateBookingData } = get();

    try {
      const payload = {
        userId: data.userId || bookingData.userId!,
        travelPlanId: data.travelPlanId || bookingData.travelPlanId!,
        startDate: data.startDate || bookingData.startDate!,
        endDate: data.endDate || bookingData.endDate!,
        participants: data.participants || bookingData.participants || 1,
        specialRequirements: data.specialRequirements ?? undefined,
        guests: data.guests,
        submissionType: data.submissionType,
      };

      const result = await createBooking(payload);

      if (result.error) {
        set({ error: result.error });
        return null;
      }

      if (result.booking) {
        updateBookingData(result.booking);
        return result.booking;
      }

      return null;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create booking",
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// 👇 Export type for use elsewhere
export type { BookingStoreState };

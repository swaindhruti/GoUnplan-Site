"use client";

import { useState, useCallback } from "react";
import {
  createBooking,
  updateBookingDates,
  updateBookingGuestInfo,
  updateBookingStatus
} from "@/actions/booking/actions";
import type {
  BookingData,
  DateSelectorUpdate,
  GuestInfoUpdate,
  PaymentUpdate
} from "@/types/booking";

interface UseBookingStateProps {
  userId?: string;
  travelPlanId?: string;
  initialData?: Partial<BookingData>;
}

interface UseBookingStateReturn {
  bookingData: Partial<BookingData>;
  isLoading: boolean;
  error: string | null;
  updateDateSelection: (update: DateSelectorUpdate) => Promise<boolean>;
  updateGuestInfo: (update: GuestInfoUpdate) => Promise<boolean>;
  updatePaymentInfo: (update: PaymentUpdate) => Promise<boolean>;
  createNewBooking: (data: Partial<BookingData>) => Promise<BookingData | null>;
}

export function useBookingState({
  userId,
  travelPlanId,
  initialData = {}
}: UseBookingStateProps): UseBookingStateReturn {
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    userId,
    travelPlanId,
    status: "PENDING",
    participants: 1,
    refundAmount: 0,
    ...initialData
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }));
  }, []);
  const convertPrismaBookingToBookingData = useCallback(
    (prismaBooking: any): Partial<BookingData> => {
      const { status, ...rest } = prismaBooking;

      let mappedStatus: BookingData["status"] | undefined;
      if (
        status === "PENDING" ||
        status === "CONFIRMED" ||
        status === "CANCELLED"
      ) {
        mappedStatus = status;
      }

      return {
        ...rest,
        ...(mappedStatus && { status: mappedStatus })
      };
    },
    []
  );

  const updateDateSelection = useCallback(
    async (update: DateSelectorUpdate): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        updateBookingData(update);

        // If booking exists, update it on server
        if (bookingData.id) {
          const result = await updateBookingDates(
            bookingData.id,
            update.startDate,
            update.endDate
          );
          if (result.error) {
            setError(result.error);
            return false;
          }
          if (result.booking) {
            const convertedBooking = convertPrismaBookingToBookingData(
              result.booking
            );
            updateBookingData(convertedBooking);
          }
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update dates");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bookingData.id, updateBookingData, convertPrismaBookingToBookingData]
  );

  const updateGuestInfo = useCallback(
    async (update: GuestInfoUpdate): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        updateBookingData(update);

        // If booking exists, update it on server
        if (bookingData.id) {
          const result = await updateBookingGuestInfo(bookingData.id, {
            participants: update.participants,
            specialRequirements: update.specialRequirements,
            submissionType: update.submissionType
          });

          if (result.error) {
            setError(result.error);
            return false;
          }
          if (result.booking) {
            const convertedBooking = convertPrismaBookingToBookingData(
              result.booking
            );
            updateBookingData(convertedBooking);
          }
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update guest information"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bookingData.id, updateBookingData, convertPrismaBookingToBookingData]
  );

  const updatePaymentInfo = useCallback(
    async (update: PaymentUpdate): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        updateBookingData(update);

        // Update booking status on server
        if (bookingData.id) {
          const result = await updateBookingStatus(
            bookingData.id,
            update.status
          );
          if (result.error) {
            setError(result.error);
            return false;
          }
          if (result.booking) {
            const convertedBooking = convertPrismaBookingToBookingData(
              result.booking
            );
            updateBookingData(convertedBooking);
          }
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process payment"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bookingData.id, updateBookingData, convertPrismaBookingToBookingData]
  );

  const createNewBooking = useCallback(
    async (data: Partial<BookingData>): Promise<BookingData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const bookingPayload = {
          userId: userId || bookingData.userId!,
          travelPlanId: travelPlanId || bookingData.travelPlanId!,
          startDate: data.startDate || bookingData.startDate!,
          endDate: data.endDate || bookingData.endDate!,
          participants: data.participants || bookingData.participants || 1,
          specialRequirements: data.specialRequirements,
          guests: data.guests,
          submissionType: data.submissionType
        };

        const result = await createBooking(bookingPayload);

        if (result.error) {
          setError(result.error);
          return null;
        }

        if (result.booking) {
          const convertedBooking = convertPrismaBookingToBookingData(
            result.booking
          );
          updateBookingData(convertedBooking);
          return convertedBooking as BookingData;
        }

        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create booking"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [
      bookingData,
      userId,
      travelPlanId,
      updateBookingData,
      convertPrismaBookingToBookingData
    ]
  );

  return {
    bookingData,
    isLoading,
    error,
    updateDateSelection,
    updateGuestInfo,
    updatePaymentInfo,
    createNewBooking
  };
}

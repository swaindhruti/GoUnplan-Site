"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/roleGaurd";
import { revalidatePath } from "next/cache";
import type { BookingStatus } from "@/types/booking";

export const createBooking = async (bookingData: {
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  participants?: number;
  specialRequirements?: string;
  guests?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }>;
  submissionType?: "individual" | "team";
}) => {
  const session = await requireUser();
  if (!session || session.user.id !== bookingData.userId)
    return { error: "Unauthorized" };

  try {
    const travelPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: bookingData.travelPlanId }
    });

    if (!travelPlan || travelPlan.status !== "ACTIVE") {
      return {
        error: "This travel plan is not currently available for booking"
      };
    }

    const participants = bookingData.participants || 1;
    if (participants <= 0)
      return { error: "Number of participants must be at least 1" };
    if (participants > travelPlan.maxParticipants) {
      return {
        error: `Maximum ${travelPlan.maxParticipants} participants allowed for this plan`
      };
    }

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const today = new Date();

    if (startDate < today) return { error: "Start date cannot be in the past" };
    if (endDate < startDate)
      return { error: "End date cannot be before start date" };

    const pricePerPerson = travelPlan.price;
    const totalPrice = pricePerPerson * participants;

    const booking = await prisma.booking.create({
      data: {
        userId: bookingData.userId,
        travelPlanId: bookingData.travelPlanId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        participants,
        pricePerPerson,
        totalPrice,
        status: "PENDING"
      }
    });

    revalidatePath(`/booking/${bookingData.travelPlanId}`);
    console.log(booking);
    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { error: "Failed to create booking" };
  }
};

export const updateBookingDates = async (
  bookingId: string,
  startDate: Date,
  endDate: Date
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking || booking.userId !== session.user.id)
      return { error: "Unauthorized" };

    const today = new Date();
    if (startDate < today) return { error: "Start date cannot be in the past" };
    if (endDate < startDate)
      return { error: "End date cannot be before start date" };

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { startDate, endDate }
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error updating booking dates:", error);
    return { error: "Failed to update booking dates" };
  }
};

export const updateBookingGuestInfo = async (
  bookingId: string,
  guestData: {
    participants: number;
    specialRequirements?: string;
    submissionType: "individual" | "team";
  }
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { travelPlan: true }
    });

    if (!booking || booking.userId !== session.user.id)
      return { error: "Unauthorized" };

    if (guestData.participants <= 0)
      return { error: "Number of participants must be at least 1" };
    if (guestData.participants > booking.travelPlan.maxParticipants) {
      return {
        error: `Maximum ${booking.travelPlan.maxParticipants} participants allowed for this plan`
      };
    }

    const totalPrice = booking.pricePerPerson * guestData.participants;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        participants: guestData.participants,
        totalPrice
      }
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error updating booking guest info:", error);
    return { error: "Failed to update booking guest information" };
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking || booking.userId !== session.user.id)
      return { error: "Unauthorized" };

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: { set: status },
        ...(status === "CANCELLED" && { cancelledAt: new Date() })
      }
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { error: "Failed to update booking status" };
  }
};

export const getBookingById = async (bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelPlan: true,
        user: { select: { id: true, email: true, name: true } }
      }
    });

    if (!booking || booking.userId !== session.user.id)
      return { error: "Unauthorized" };
    return { success: true, booking };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { error: "Failed to fetch booking" };
  }
};

export const getUserBookings = async (userId: string) => {
  const session = await requireUser();
  if (!session || session.user.id !== userId) return { error: "Unauthorized" };

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        travelPlan: {
          select: {
            travelPlanId: true,
            title: true,
            description: true,
            destination: true,
            country: true,
            state: true,
            city: true,
            noOfDays: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return { error: "Failed to fetch bookings" };
  }
};

export const cancelBooking = async (bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking || booking.userId !== session.user.id)
      return { error: "Unauthorized" };

    if (booking.status === "CANCELLED")
      return { error: "Booking is already cancelled" };
    if (booking.status === "REFUNDED")
      return { error: "Cannot cancel a refunded booking" };

    const now = new Date();
    const startDate = new Date(booking.startDate);
    const daysUntilTrip = Math.ceil(
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let refundAmount = 0;
    if (daysUntilTrip >= 14) {
      refundAmount = booking.totalPrice;
    } else if (daysUntilTrip >= 7) {
      refundAmount = Math.floor(booking.totalPrice * 0.5);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: { set: "CANCELLED" },
        cancelledAt: new Date(),
        refundAmount
      }
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking, refundAmount };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { error: "Failed to cancel booking" };
  }
};

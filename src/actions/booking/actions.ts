"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/roleGaurd";
import { TeamMemberInput } from "@/types/booking";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
// import type { BookingStatus } from "@/types/booking";

export const createBooking = async (bookingData: {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  participants?: number;
  specialRequirements?: string;
  guests?: Array<TeamMemberInput>;
  // submissionType?: "individual" | "team";
}) => {
  const session = await requireUser();

  console.log("hello from server side");
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

    console.log("tt", bookingData);

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
        id: bookingData.id,
        userId: bookingData.userId,
        travelPlanId: bookingData.travelPlanId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        guests: { create: bookingData.guests },
        participants,
        pricePerPerson,
        totalPrice,
        status: "PENDING"
      }
    });

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        formSubmitted: true
      }
    });

    revalidatePath(`/booking/${bookingData.travelPlanId}`);
    console.log("ttt:,", booking);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { error: "Failed to create booking" };
  }
};

export const updateBookingGuestInfo = async (
  bookingId: string,
  guestData: {
    participants: number;
    specialRequirements?: string;
    guests: TeamMemberInput[];
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
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        participants: guestData.participants,
        totalPrice,
        specialRequirements: guestData.specialRequirements || undefined
      }
    });
    await prisma.teamMember.deleteMany({
      where: { bookingId }
    });

    await prisma.teamMember.createMany({
      data: guestData.guests.map((guest) => ({
        ...guest,
        bookingId
      }))
    });

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        formSubmitted: true
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
        status: status as BookingStatus,
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
            noOfDays: true,
            tripImage: true
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

    if (daysUntilTrip < 4) {
      return {
        error: "Cancellation not allowed less than 4 days prior to the trip"
      };
    }

    let refundAmount = 0;
    if (daysUntilTrip >= 4) {
      refundAmount = booking.totalPrice;
    }

    // Use transaction to ensure atomicity and prevent race conditions
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // First, verify the booking still exists and hasn't been modified
      const currentBooking = await tx.booking.findUnique({
        where: { id: bookingId }
      });

      if (!currentBooking) {
        throw new Error("Booking not found during update");
      }

      if (currentBooking.status === "CANCELLED") {
        throw new Error("Booking is already cancelled");
      }

      // Update the booking
      return await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          refundAmount
        }
      });
    });

    revalidatePath("/my-trips");
    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking, refundAmount };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { error: "Failed to cancel booking" };
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
      where: { id: bookingId },
      include: { travelPlan: true }
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    // Optional: Add a check to ensure dates are valid (e.g., endDate after startDate)
    if (startDate >= endDate) {
      return { error: "End date must be after start date" };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        startDate,
        endDate
      }
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error updating booking dates:", error);
    return { error: "Failed to update booking dates" };
  }
};

// Updated function with better naming and error handling
export const setFormSubmissionStatus = async (
  bookingId: string,
  status: boolean
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { travelPlan: true }
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: "Booking not found or unauthorized access" };
    }
    if (status === false) {
      console.log("hii");
      await prisma.booking.delete({
        where: { id: bookingId }
      });
    }
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        formSubmitted: status,
        updatedAt: new Date()
      }
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    revalidatePath(`/trips/booking/${booking.travelPlanId}`);

    return {
      success: true,
      booking: updatedBooking,
      message: `Form submission status updated to ${status}`
    };
  } catch (error) {
    console.error("Error updating form submission status:", error);
    return { error: "Failed to update form submission status" };
  }
};

export const enableBookingEdit = async (bookingId: string) => {
  return await setFormSubmissionStatus(bookingId, false);
};

export const completeBookingForm = async (bookingId: string) => {
  return await setFormSubmissionStatus(bookingId, true);
};

// Keep the old function name for backward compatibility but with improved implementation
export const unCompleteBookingForm = async (bookingId: string) => {
  return await enableBookingEdit(bookingId);
};

export const editBookingAction = async (bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { travelPlan: true }
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    // Update the form submitted status to false
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        formSubmitted: false,
        updatedAt: new Date()
      }
    });

    // Return the travel plan ID for navigation
    return { success: true, travelPlanId: booking.travelPlanId };
  } catch (error) {
    console.error("Error updating booking for edit:", error);
    return { error: "Failed to update booking" };
  }
};

// Server action for completing payment
export const completePaymentAction = async (
  travelPlanId: string,
  amount: number,
  numberOfGuests: number
) => {
  const session = await requireUser();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        travelPlanId: travelPlanId,
        userId: session.user.id
      },
      include: {
        travelPlan: true
      }
    });

    if (!booking) {
      return { error: "Booking not found" };
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: booking.id
      },
      data: {
        status: "CONFIRMED",
        totalPrice: amount,
        participants: numberOfGuests,
        updatedAt: new Date()
      }
    });

    revalidatePath(`/trips/booking/${travelPlanId}`);
    revalidatePath(`/dashboard/user`);

    return {
      success: true,
      message: "Payment completed successfully",
      booking: updatedBooking
    };
  } catch (error) {
    console.error("Payment completion error:", error);
    return { error: "Failed to complete payment" };
  }
};

export const markBookingAsRefunded = async (bookingId: string) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return { error: "Booking not found" };
    }

    if (booking.status !== "CANCELLED") {
      return { error: "Only cancelled bookings can be marked as refunded" };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "REFUNDED",
        updatedAt: new Date()
      }
    });

    revalidatePath("/dashboard/admin");
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error marking booking as refunded:", error);
    return { error: "Failed to mark booking as refunded" };
  }
};

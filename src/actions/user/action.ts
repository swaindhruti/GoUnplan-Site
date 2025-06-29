"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/roleGaurd";
import { BookingStatus } from "@prisma/client";

export const getUserProfile = async (email: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        bio: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!user) return { error: "User not found" };

    const bookingStats = await prisma.booking.groupBy({
      by: ["status"],
      where: {
        userId: user.id,
      },
      _count: {
        id: true,
      },
    });

    const bookingCounts = {
      total: user._count.bookings,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };

    bookingStats.forEach((stat) => {
      const status = stat.status.toLowerCase() as keyof typeof bookingCounts;
      if (status in bookingCounts) {
        bookingCounts[status] = stat._count.id;
      }
    });

    return {
      user: {
        ...user,
        bookingCounts,
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { error: "Failed to fetch user profile" };
  }
};

export const updateUserProfile = async (
  email: string,
  data: {
    name?: string;
    phone?: string;
    bio?: string;
    newEmail?: string;
    image?: string;
  } = {}
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };

    const newEmail = data.newEmail ? data.newEmail.trim() : null;
    if (newEmail && newEmail !== email) {
      const existingUserWithNewMail = await prisma.user.findUnique({
        where: { email: newEmail },
      });
      if (existingUserWithNewMail) return { error: "Email already in use" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name ? data.name.trim() : user.name,
        phone: data.phone ? data.phone.trim() : user.phone,
        email: newEmail || user.email,
        bio: data.bio ? data.bio.trim() : user.bio,
        image: data.image || user.image,
      },
    });

    if (!updatedUser) return { error: "Failed to update user profile" };

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { error: "Failed to update user profile" };
  }
};

// In actions/user/action.ts
export const applyForHost = async (
  email: string,
  hostData?: {
    description?: string;
    image?: string;
    hostMobile?: string;
  }
) => {
  const session = await requireUser();
  if (!session) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        appliedForHost: true,
        hostProfile: {
          create: {
            description: hostData?.description || "",
            hostEmail: email,
            hostMobile: hostData?.hostMobile || "",
          },
        },
      },
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Error applying for host:", error);
    return {
      success: false,
      error: "Failed to apply for host status",
    };
  }
};

export const hasAppliedForHost = async (email: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { appliedForHost: true },
    });

    if (!user) return { error: "User not found" };

    return { success: true, hasApplied: user.appliedForHost };
  } catch (error) {
    console.error("Error checking host application status:", error);
    return { error: "Failed to check host application status" };
  }
};

export const bookTravelPlan = async (
  userId: string,
  travelPlanId: string,
  bookingData: {
    startDate: Date;
    endDate: Date;
    participants: number;
  }
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };
  if (session.user.id !== userId) return { error: "Unauthorized" };

  try {
    // Get travel plan details
    const travelPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId },
    });

    if (!travelPlan) {
      return { error: "Travel plan not found" };
    }

    if (travelPlan.status !== "ACTIVE") {
      return {
        error: "This travel plan is not currently available for booking",
      };
    }

    // Validate participants
    if (bookingData.participants <= 0) {
      return { error: "Number of participants must be at least 1" };
    }

    if (bookingData.participants > travelPlan.maxParticipants) {
      return {
        error: `Maximum ${travelPlan.maxParticipants} participants allowed for this plan`,
      };
    }

    // Validate dates
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const today = new Date();

    if (startDate < today) {
      return { error: "Start date cannot be in the past" };
    }

    if (endDate < startDate) {
      return { error: "End date cannot be before start date" };
    }

    // Calculate pricing
    const pricePerPerson = travelPlan.price;
    const totalPrice = pricePerPerson * bookingData.participants;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        travelPlanId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        participants: bookingData.participants,
        pricePerPerson,
        totalPrice,
        status: "PENDING",
      },
    });

    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { error: "Failed to create booking" };
  }
};

export const getUserBookings = async (
  userId: string,
  status?: BookingStatus
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };
  if (session.user.id !== userId) return { error: "Unauthorized" };

  try {
    const whereClause: { userId: string; status?: BookingStatus } = { userId };
    if (status) {
      whereClause.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        participants: true,
        pricePerPerson: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        cancelledAt: true,
        refundAmount: true,
        travelPlan: {
          select: {
            title: true,
            description: true,
            country: true,
            state: true,
            city: true,
            noOfDays: true,
            price: true,
            host: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: status ? { startDate: "desc" } : { createdAt: "desc" },
    });

    const statusMessage = status
      ? `Found ${bookings.length} ${status.toLowerCase()} bookings`
      : undefined;

    return {
      success: true,
      bookings,
      message: statusMessage,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      error: status
        ? `Failed to fetch ${status} bookings`
        : "Failed to fetch bookings",
    };
  }
};

export const getBookingsByStatus = async (
  userId: string,
  status: BookingStatus
) => {
  return getUserBookings(userId, status);
};

export const getBookingDetails = async (userId: string, bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };
  if (session.user.id !== userId) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        travelPlan: {
          select: {
            title: true,
            description: true,
            includedActivities: true,
            restrictions: true,
            noOfDays: true,
            country: true,
            state: true,
            city: true,
            price: true,
            host: {
              select: {
                description: true,
                image: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return { error: "Booking not found" };
    }

    if (booking.userId !== userId) {
      return { error: "You do not have permission to view this booking" };
    }

    return { success: true, booking };
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return { error: "Failed to fetch booking details" };
  }
};

export const cancelBooking = async (userId: string, bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };
  if (session.user.id !== userId) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelPlan: true,
      },
    });

    if (!booking) {
      return { error: "Booking not found" };
    }

    if (booking.userId !== userId) {
      return { error: "You do not have permission to cancel this booking" };
    }

    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      return {
        error: `Cannot cancel a booking that is already ${booking.status}`,
      };
    }

    const now = new Date();
    const startDate = new Date(booking.startDate);
    const daysDifference = Math.ceil(
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let refundAmount = 0;
    let refundMessage = "";

    if (daysDifference > 7) {
      refundAmount = booking.totalPrice;
      refundMessage = "Full refund processed";
    } else if (daysDifference > 3) {
      refundAmount = Math.floor(booking.totalPrice * 0.5);
      refundMessage = "50% refund processed";
    } else {
      refundAmount = 0;
      refundMessage =
        "No refund available for cancellations less than 3 days before trip";
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelledAt: now,
        refundAmount,
      },
    });

    return {
      success: true,
      booking: updatedBooking,
      message: refundMessage,
    };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { error: "Failed to cancel booking" };
  }
};

export const getAllActiveTrips = async () => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const activeTrips = await prisma.travelPlans.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        travelPlanId: true,
        title: true,
        description: true,
        country: true,
        state: true,
        city: true,
        languages: true,
        filters: true,
        noOfDays: true,
        price: true,
        hostId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, trips: activeTrips };
  } catch (error) {
    console.error("Error fetching active trips:", error);
    return { error: "Failed to fetch active trips" };
  }
};

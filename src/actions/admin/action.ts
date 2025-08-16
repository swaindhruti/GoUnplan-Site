"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/roleGaurd";
import { Role } from "@/types/auth";
import { TravelPlanStatus, BookingStatus, Prisma } from "@prisma/client";

export const getAllUsers = async () => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
    if (!users || users.length === 0) {
      return { message: "No users found" };
    }
    return { users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
};

export const deleteUser = async (email: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };

    await prisma.user.delete({ where: { id: email } });
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
};

export const updateUserRole = async (email: string, role: Role) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };
    console.log("mm", role);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: role },
    });
    console.log("mm", updatedUser);
    const host = await prisma.hostProfile.findUnique({
      where: { hostEmail: email },
    });
    if (host) return;
    await prisma.hostProfile.create({
      data: {
        hostEmail: user.email,
        hostMobile: user.phone,
        hostId: user.id,
        image: user.image,
        description: "",
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update user role" };
  }
};

export const getHostApplications = async () => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostApplicants = await prisma.user.findMany({
      where: { appliedForHost: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        role: true,
      },
    });

    if (!hostApplicants || hostApplicants.length === 0) {
      return { message: "No host applications found" };
    }

    return { hostApplicants };
  } catch (error) {
    console.error("Error fetching host applications:", error);
    return { error: "Failed to fetch host applications" };
  }
};

export const approveHostApplication = async (email: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "HOST", appliedForHost: false },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error approving host application:", error);
    return { error: "Failed to approve host application" };
  }
};

export const rejectHostApplication = async (email: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { appliedForHost: false },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error rejecting host application:", error);
    return { error: "Failed to reject host application" };
  }
};

export const getAllHosts = async () => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const hosts = await prisma.user.findMany({
      where: { role: "HOST" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
    return { hosts };
  } catch (error) {
    console.error("Error fetching hosts:", error);
    return { error: "Failed to fetch hosts" };
  }
};

export const getTotalRevenue = async () => {
  try {
    const totalSales = await prisma.booking.aggregate({
      where: { status: "CONFIRMED" },
      _sum: { totalPrice: true },
      _count: { id: true },
    });

    const refundAmount = await prisma.booking.aggregate({
      where: { status: "CANCELLED" },
      _sum: { refundAmount: true },
      _count: { id: true },
    });

    return {
      totalSales,
      refundAmount,
    };
  } catch (error) {
    console.error("Error fetching total sales:", error);
    return { error: "Failed to fetch sales data" };
  }
};

export const getAllBookings = async (statusFilter?: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    // Build where clause for bookings
    const whereClause: Prisma.BookingWhereInput = {};
    
    // Add status filter if provided
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter as BookingStatus;
    }

    // Fetch bookings with related data
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        travelPlan: {
          select: {
            travelPlanId: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            price: true,
            tripImage: true,
            host: {
              select: {
                hostId: true,
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        guests: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Get booking counts by status
    const bookingCounts = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        id: true
      }
    });

    const counts = {
      ALL: 0,
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
      REFUNDED: 0
    };

    bookingCounts.forEach((count) => {
      counts[count.status] = count._count.id;
      counts.ALL += count._count.id;
    });

    return {
      success: true,
      bookings,
      counts
    };
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return { error: "Failed to fetch bookings" };
  }
};

export const refundBooking = async (bookingId: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) return { error: "Booking not found" };

    if (booking.status !== "CONFIRMED") {
      return { error: "Only completed bookings can be refunded" };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "REFUNDED", refundAmount: booking.totalPrice },
    });

    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error processing refund:", error);
    return { error: "Failed to process refund" };
  }
};

export const getAlltravelPlanApplications = async () => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const travelPlans = await prisma.travelPlans.findMany({
      where: { status: TravelPlanStatus.INACTIVE },
      select: {
        travelPlanId: true,
        title: true,
        description: true,
        country: true,
        state: true,
        city: true,
        noOfDays: true,
        price: true,
        hostId: true,
        createdAt: true,
      },
    });

    if (!travelPlans || travelPlans.length === 0) {
      return { message: "No travel plan applications found" };
    }

    return { travelPlans };
  } catch (error) {
    console.error("Error fetching travel plan applications:", error);
    return { error: "Failed to fetch travel plan applications" };
  }
};

export const approveTravelPlan = async (travelPlanId: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const updatedTravelPlan = await prisma.travelPlans.update({
      where: { travelPlanId: travelPlanId },
      data: { status: TravelPlanStatus.ACTIVE },
    });

    return { success: true, travelPlan: updatedTravelPlan };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return { error: "Travel plan not found" };
    }
    console.error("Error approving travel plan:", error);
    return { error: "Failed to approve travel plan" };
  }
};

export const getTravelPlanDetails = async (travelPlanId: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const travelPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: travelPlanId },
      include: {
        host: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                image: true,
                createdAt: true,
              },
            },
          },
        },
        dayWiseItinerary: {
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!travelPlan) {
      return { error: "Travel plan not found" };
    }

    return { success: true, travelPlan };
  } catch (error) {
    console.error("Error fetching travel plan details:", error);
    return { error: "Failed to fetch travel plan details" };
  }
};

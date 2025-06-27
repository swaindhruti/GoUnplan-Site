"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/roleGaurd";
import { Role } from "@/types/auth";

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
        createdAt: true
      }
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
      data: { role: role }
    });
    console.log("mm", updatedUser);
    const host = await prisma.hostProfile.findUnique({
      where: { hostEmail: email }
    });
    if (host) return;
    await prisma.hostProfile.create({
      data: {
        hostEmail: user.email,
        hostMobile: user.phone,
        hostId: user.id,
        image: user.image,
        description: ""
      }
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
        role: true
      }
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
      data: { role: "HOST", appliedForHost: false }
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
      data: { appliedForHost: false }
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
        createdAt: true
      }
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
      _count: { id: true }
    });

    const refundAmount = await prisma.booking.aggregate({
      where: { status: "CANCELLED" },
      _sum: { refundAmount: true },
      _count: { id: true }
    });

    return {
      totalSales,
      refundAmount
    };
  } catch (error) {
    console.error("Error fetching total sales:", error);
    return { error: "Failed to fetch sales data" };
  }
};

export const refundBooking = async (bookingId: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) return { error: "Booking not found" };

    if (booking.status !== "CONFIRMED") {
      return { error: "Only completed bookings can be refunded" };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "REFUNDED", refundAmount: booking.totalPrice }
    });

    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error processing refund:", error);
    return { error: "Failed to process refund" };
  }
};

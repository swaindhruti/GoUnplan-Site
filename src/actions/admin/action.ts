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
        hostEmail: user.email || "",
        hostMobile: user.phone || "",
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

export const getTotalRevenue = async (
  startDate?: string,
  endDate?: string,
  totalrevenue?: boolean
) => {
  try {
    const dateFilter =
      !totalrevenue && startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate + "T00:00:00.000Z"), // Start of the start date
              lte: new Date(endDate + "T23:59:59.999Z") // End of the end date
            }
          }
        : {};

    console.log("DAte:", dateFilter);

    const totalSales = await prisma.booking.aggregate({
      where: {
        paymentStatus: {
          in: ["CANCELLED", "REFUNDED", "FULLY_PAID", "PARTIALLY_PAID"]
        },
        ...dateFilter
      },
      _sum: { totalPrice: true },
      _count: { id: true }
    });

    const refundAmount = await prisma.booking.aggregate({
      where: {
        paymentStatus: { in: ["CANCELLED", "REFUNDED"] },
        ...dateFilter
      },
      _sum: { refundAmount: true },
      _count: { id: true }
    });
    console.log("totalSales", totalSales);
    return {
      totalSales,
      refundAmount
    };
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return { error: "Failed to fetch revenue data" };
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
      by: ["paymentStatus"],
      _count: {
        id: true
      }
    });

    const counts = {
      ALL: 0,
      FULLY_PAID: 0,
      PARTIALLY_PAID: 0,
      CANCELLED: 0,
      REFUNDED: 0,
      PENDING: 0,
      OVERDUE: 0
    };

    bookingCounts.forEach((count) => {
      counts[count.paymentStatus] = count._count.id;
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
        createdAt: true
      }
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
      data: { status: TravelPlanStatus.ACTIVE }
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
                createdAt: true
              }
            }
          }
        },
        dayWiseItinerary: {
          orderBy: { dayNumber: "asc" }
        }
      }
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

export const getTransactionsByDateRange = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const dateFilter =
      startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate + "T00:00:00.000Z"),
              lte: new Date(endDate + "T23:59:59.999Z")
            }
          }
        : {};

    const salesTransactions = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        ...dateFilter
      },
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

    const refundTransactions = await prisma.booking.findMany({
      where: {
        status: { in: ["CANCELLED", "REFUNDED"] },
        ...dateFilter
      },
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

    const salesData = salesTransactions.map((booking) => ({
      id: `sale-${booking.id}`,
      bookingId: booking.id,
      userId: booking.userId,
      travelPlanId: booking.travelPlanId,
      amount: booking.totalPrice,
      type: "SALE" as const,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      user: {
        name: booking.user.name || "Unknown",
        email: booking.user.email,
        phone: booking.user.phone
      },
      travelPlan: {
        title: booking.travelPlan.title,
        destination: booking.travelPlan.destination || "Unknown",
        host: {
          name: booking.travelPlan.host.user.name || "Unknown Host"
        }
      },
      participants: booking.participants,
      specialRequirements: booking.specialRequirements,
      pricePerPerson: booking.pricePerPerson
    }));

    const refundData = refundTransactions.map((booking) => ({
      id: `refund-${booking.id}`,
      bookingId: booking.id,
      userId: booking.userId,
      travelPlanId: booking.travelPlanId,
      amount: booking.refundAmount || booking.totalPrice,
      type: "REFUND" as const,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      user: {
        name: booking.user.name || "Unknown",
        email: booking.user.email,
        phone: booking.user.phone
      },
      travelPlan: {
        title: booking.travelPlan.title,
        destination: booking.travelPlan.destination || "Unknown",
        host: {
          name: booking.travelPlan.host.user.name || "Unknown Host"
        }
      },
      participants: booking.participants,
      refundAmount: booking.refundAmount || booking.totalPrice,
      specialRequirements: booking.specialRequirements,
      pricePerPerson: booking.pricePerPerson
    }));

    const allTransactions = [...salesData, ...refundData].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      transactions: allTransactions,
      summary: {
        totalSales: salesData.reduce((sum, t) => sum + t.amount, 0),
        totalRefunds: refundData.reduce((sum, t) => sum + t.amount, 0),
        salesCount: salesData.length,
        refundsCount: refundData.length,
        netRevenue:
          salesData.reduce((sum, t) => sum + t.amount, 0) -
          refundData.reduce((sum, t) => sum + t.amount, 0)
      }
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      success: false,
      error: "Failed to fetch transaction data",
      transactions: [],
      summary: {
        totalSales: 0,
        totalRefunds: 0,
        salesCount: 0,
        refundsCount: 0,
        netRevenue: 0
      }
    };
  }
};

export const getAnalyticsData = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const dateFilter =
      startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate + "T00:00:00.000Z"),
              lte: new Date(endDate + "T23:59:59.999Z")
            }
          }
        : {};

    // Get all bookings for the period
    const allBookings = await prisma.booking.findMany({
      where: dateFilter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        travelPlan: {
          select: {
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            price: true,
            host: {
              select: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Monthly Revenue Data
    const monthlyData = new Map();

    allBookings.forEach((booking) => {
      const monthKey = new Date(booking.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short"
      });

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthKey,
          sales: 0,
          refunds: 0,
          netRevenue: 0
        });
      }

      const monthStats = monthlyData.get(monthKey);

      if (booking.paymentStatus === "FULLY_PAID") {
        monthStats.sales += booking.totalPrice;
      } else if (
        booking.paymentStatus === "CANCELLED" ||
        booking.paymentStatus === "REFUNDED"
      ) {
        monthStats.refunds += booking.refundAmount || booking.totalPrice;
      }

      monthStats.netRevenue = monthStats.sales - monthStats.refunds;
    });

    const monthlyRevenue = Array.from(monthlyData.values()).sort(
      (a, b) =>
        new Date(a.month + " 1").getTime() - new Date(b.month + " 1").getTime()
    );

    // Status Distribution
    const statusCounts = {
      FULLY_PAID: 0,
      PARTIALLY_PAID: 0,
      CANCELLED: 0,
      REFUNDED: 0,
      PENDING: 0,
      OVERDUE: 0
    };

    allBookings.forEach((booking) => {
      statusCounts[booking.paymentStatus]++;
    });

    const totalBookings = allBookings.length;
    const statusDistribution = [
      {
        name: "Fully Paid",
        value:
          totalBookings > 0
            ? Math.round((statusCounts.FULLY_PAID / totalBookings) * 100)
            : 0,
        color: "#10B981",
        count: statusCounts.FULLY_PAID
      },
      {
        name: "Partially Paid",
        value:
          totalBookings > 0
            ? Math.round((statusCounts.PARTIALLY_PAID / totalBookings) * 100)
            : 0,
        color: "#10B981",
        count: statusCounts.PARTIALLY_PAID
      },
      {
        name: "Cancelled",
        value:
          totalBookings > 0
            ? Math.round((statusCounts.CANCELLED / totalBookings) * 100)
            : 0,
        color: "#EF4444",
        count: statusCounts.CANCELLED
      },
      {
        name: "Refunded",
        value:
          totalBookings > 0
            ? Math.round((statusCounts.REFUNDED / totalBookings) * 100)
            : 0,
        color: "#F59E0B",
        count: statusCounts.REFUNDED
      },
      {
        name: "Pending",
        value:
          totalBookings > 0
            ? Math.round((statusCounts.PENDING / totalBookings) * 100)
            : 0,
        color: "#6B7280",
        count: statusCounts.PENDING
      }
    ];

    const last30Days = [];
    const now = endDate ? new Date(endDate) : new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayBookings = allBookings.filter(
        (booking) => booking.createdAt.toISOString().split("T")[0] === dateStr
      );

      const dayRevenue = dayBookings
        .filter((b) => b.paymentStatus === "FULLY_PAID")
        .reduce((sum, b) => sum + b.totalPrice, 0);

      last30Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        transactions: dayBookings.length,
        revenue: dayRevenue
      });
    }

    // Top Destinations
    const destinationData = new Map();

    allBookings
      .filter((b) => b.paymentStatus === "FULLY_PAID")
      .forEach((booking) => {
        const dest = booking.travelPlan.destination || "Unknown";

        if (!destinationData.has(dest)) {
          destinationData.set(dest, {
            destination: dest,
            bookings: 0,
            revenue: 0
          });
        }

        const destStats = destinationData.get(dest);
        destStats.bookings++;
        destStats.revenue += booking.totalPrice;
      });

    const topDestinations = Array.from(destinationData.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Revenue by Travel Plan (as proxy for travel type)
    const travelPlanRevenue = new Map();

    allBookings
      .filter((b) => b.paymentStatus === "FULLY_PAID")
      .forEach((booking) => {
        const planTitle = booking.travelPlan.title;

        if (!travelPlanRevenue.has(planTitle)) {
          travelPlanRevenue.set(planTitle, {
            type: planTitle,
            amount: 0,
            bookings: 0
          });
        }

        const planStats = travelPlanRevenue.get(planTitle);
        planStats.amount += booking.totalPrice;
        planStats.bookings++;
      });

    const revenueByType = Array.from(travelPlanRevenue.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Top 8 travel plans

    const confirmedBookings = allBookings.filter(
      (b) =>
        b.paymentStatus === "FULLY_PAID" ||
        b.paymentStatus === "CANCELLED" ||
        b.paymentStatus === "REFUNDED"
    );
    const refundedBookings = allBookings.filter(
      (b) => b.paymentStatus === "CANCELLED" || b.paymentStatus === "REFUNDED"
    );

    const totalSales = confirmedBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0
    );
    const totalRefunds = refundedBookings.reduce(
      (sum, b) => sum + (b.refundAmount || b.totalPrice),
      0
    );

    const periodDays =
      startDate && endDate
        ? Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 30;

    const previousPeriodStart = new Date();
    const previousPeriodEnd = new Date();

    if (startDate && endDate) {
      previousPeriodEnd.setTime(new Date(startDate).getTime() - 1);
      previousPeriodStart.setTime(
        previousPeriodEnd.getTime() - periodDays * 24 * 60 * 60 * 1000
      );
    } else {
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 60);
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 30);
    }

    const previousBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd
        }
      }
    });

    const prevConfirmedBookings = previousBookings.filter(
      (b) =>
        b.paymentStatus === "FULLY_PAID" ||
        b.paymentStatus === "CANCELLED" ||
        b.paymentStatus === "REFUNDED"
    );
    const prevTotalSales = prevConfirmedBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0
    );
    const prevRefundedBookings = previousBookings.filter(
      (b) => b.paymentStatus === "CANCELLED" || b.paymentStatus === "REFUNDED"
    );
    /*   const prevTotalRefunds = prevRefundedBookings.reduce(
      (sum, b) => sum + (b.refundAmount || b.totalPrice),
      0
    ); */

    const revenueGrowth =
      prevTotalSales > 0
        ? ((totalSales - prevTotalSales) / prevTotalSales) * 100
        : 0;
    const transactionGrowth =
      previousBookings.length > 0
        ? ((allBookings.length - previousBookings.length) /
            previousBookings.length) *
          100
        : 0;
    const avgOrderValueGrowth =
      prevConfirmedBookings.length > 0
        ? ((totalSales / confirmedBookings.length -
            prevTotalSales / prevConfirmedBookings.length) /
            (prevTotalSales / prevConfirmedBookings.length)) *
          100
        : 0;
    const refundRateChange =
      previousBookings.length > 0
        ? (refundedBookings.length / allBookings.length -
            prevRefundedBookings.length / previousBookings.length) *
          100
        : 0;
    console.log("Revenue Growth:", topDestinations);
    return {
      success: true,
      data: {
        monthlyRevenue,
        statusDistribution,
        dailyTransactions: last30Days,
        topDestinations,
        revenueByType,
        summary: {
          totalSales,
          totalRefunds,
          netRevenue: totalSales - totalRefunds,
          totalTransactions: allBookings.length,
          confirmedBookings: confirmedBookings.length,
          refundedBookings: refundedBookings.length,
          avgOrderValue:
            confirmedBookings.length > 0
              ? totalSales / confirmedBookings.length
              : 0,
          refundRate:
            allBookings.length > 0
              ? (refundedBookings.length / allBookings.length) * 100
              : 0
        },
        growth: {
          revenue: revenueGrowth,
          transactions: transactionGrowth,
          avgOrderValue: avgOrderValueGrowth,
          refundRate: refundRateChange
        },
        period: {
          startDate:
            startDate ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          endDate: endDate || new Date().toISOString().split("T")[0],
          totalDays: periodDays
        }
      }
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      success: false,
      error: "Failed to fetch analytics data",
      data: {
        monthlyRevenue: [],
        statusDistribution: [],
        dailyTransactions: [],
        topDestinations: [],
        revenueByType: [],
        summary: {
          totalSales: 0,
          totalRefunds: 0,
          netRevenue: 0,
          totalTransactions: 0,
          confirmedBookings: 0,
          refundedBookings: 0,
          avgOrderValue: 0,
          refundRate: 0
        },
        growth: {
          revenue: 0,
          transactions: 0,
          avgOrderValue: 0,
          refundRate: 0
        },
        period: {
          startDate: startDate || new Date().toISOString().split("T")[0],
          endDate: endDate || new Date().toISOString().split("T")[0],
          totalDays: 0
        }
      }
    };
  }
};

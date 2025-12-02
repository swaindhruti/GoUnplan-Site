'use server';

import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/roleGaurd';
import {
  WalletData,
  WalletSummary,
  WalletTransaction,
  BookingPayout,
  WalletFilter,
} from '@/types/wallet';

/**
 * Get wallet data for the authenticated host
 */
export const getHostWallet = async (filter?: WalletFilter) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  const hostId = session.user.id;

  try {
    // Fetch all payouts for the host
    const payouts = await prisma.payout.findMany({
      where: {
        hostId,
        ...(filter?.status && {
          OR: [{ firstPaymentStatus: filter.status }, { secondPaymentStatus: filter.status }],
        }),
        ...(filter?.dateFrom &&
          filter?.dateTo && {
            OR: [
              {
                firstPaymentDate: {
                  gte: filter.dateFrom,
                  lte: filter.dateTo,
                },
              },
              {
                secondPaymentDate: {
                  gte: filter.dateFrom,
                  lte: filter.dateTo,
                },
              },
            ],
          }),
      },
      include: {
        booking: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            travelPlan: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate summary
    let totalEarnings = 0;
    let receivedAmount = 0;
    let pendingAmount = 0;
    let upcomingAmount = 0;

    const transactions: WalletTransaction[] = [];
    const bookingPayouts: BookingPayout[] = [];

    payouts.forEach(payout => {
      totalEarnings += payout.totalAmount;

      // First payment
      if (payout.firstPaymentStatus === 'PAID') {
        receivedAmount += payout.firstPaymentAmount;
      } else if (payout.firstPaymentStatus === 'PENDING') {
        if (new Date(payout.firstPaymentDate) <= new Date()) {
          pendingAmount += payout.firstPaymentAmount;
        } else {
          upcomingAmount += payout.firstPaymentAmount;
        }
      }

      // Second payment
      if (payout.secondPaymentStatus === 'PAID') {
        receivedAmount += payout.secondPaymentAmount;
      } else if (payout.secondPaymentStatus === 'PENDING') {
        if (new Date(payout.secondPaymentDate) <= new Date()) {
          pendingAmount += payout.secondPaymentAmount;
        } else {
          upcomingAmount += payout.secondPaymentAmount;
        }
      }

      // Add transactions
      transactions.push({
        id: `${payout.id}-first`,
        bookingId: payout.bookingId,
        tripTitle: payout.booking.travelPlan.title,
        tripStartDate: payout.booking.startDate,
        tripEndDate: payout.booking.endDate,
        userName: payout.booking.user.name,
        userEmail: payout.booking.user.email || '',
        totalAmount: payout.totalAmount,
        paymentType: 'first',
        amount: payout.firstPaymentAmount,
        paymentDate: payout.firstPaymentDate,
        status: payout.firstPaymentStatus,
        paidAt: payout.firstPaymentPaidAt,
        notes: payout.notes,
        createdAt: payout.createdAt,
      });

      transactions.push({
        id: `${payout.id}-second`,
        bookingId: payout.bookingId,
        tripTitle: payout.booking.travelPlan.title,
        tripStartDate: payout.booking.startDate,
        tripEndDate: payout.booking.endDate,
        userName: payout.booking.user.name,
        userEmail: payout.booking.user.email || '',
        totalAmount: payout.totalAmount,
        paymentType: 'second',
        amount: payout.secondPaymentAmount,
        paymentDate: payout.secondPaymentDate,
        status: payout.secondPaymentStatus,
        paidAt: payout.secondPaymentPaidAt,
        notes: payout.notes,
        createdAt: payout.createdAt,
      });

      // Add booking payout
      bookingPayouts.push({
        id: payout.id,
        bookingId: payout.bookingId,
        tripTitle: payout.booking.travelPlan.title,
        tripStartDate: payout.booking.startDate,
        tripEndDate: payout.booking.endDate,
        userName: payout.booking.user.name,
        userEmail: payout.booking.user.email || '',
        totalAmount: payout.totalAmount,
        firstPayment: {
          amount: payout.firstPaymentAmount,
          date: payout.firstPaymentDate,
          status: payout.firstPaymentStatus,
          paidAt: payout.firstPaymentPaidAt,
          percent: payout.firstPaymentPercent,
        },
        secondPayment: {
          amount: payout.secondPaymentAmount,
          date: payout.secondPaymentDate,
          status: payout.secondPaymentStatus,
          paidAt: payout.secondPaymentPaidAt,
          percent: payout.secondPaymentPercent,
        },
        notes: payout.notes,
        createdAt: payout.createdAt,
        updatedAt: payout.updatedAt,
      });
    });

    // Get booking counts
    const totalBookings = await prisma.booking.count({
      where: {
        travelPlan: {
          hostId,
        },
        paymentStatus: {
          in: ['FULLY_PAID', 'PARTIALLY_PAID'],
        },
      },
    });

    const completedBookings = await prisma.booking.count({
      where: {
        travelPlan: {
          hostId,
        },
        status: 'CONFIRMED',
        paymentStatus: 'FULLY_PAID',
        endDate: {
          lt: new Date(),
        },
      },
    });

    const summary: WalletSummary = {
      totalEarnings,
      receivedAmount,
      pendingAmount,
      upcomingAmount,
      totalBookings,
      completedBookings,
    };

    // Sort transactions by payment date (most recent first)
    transactions.sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());

    const walletData: WalletData = {
      summary,
      transactions,
      bookingPayouts,
    };

    return { success: true, walletData };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return { error: 'Failed to fetch wallet data' };
  }
};

/**
 * Get wallet summary only (for quick overview)
 */
export const getWalletSummary = async () => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  const hostId = session.user.id;

  try {
    const payouts = await prisma.payout.findMany({
      where: { hostId },
      select: {
        totalAmount: true,
        firstPaymentAmount: true,
        firstPaymentStatus: true,
        firstPaymentDate: true,
        secondPaymentAmount: true,
        secondPaymentStatus: true,
        secondPaymentDate: true,
      },
    });

    let totalEarnings = 0;
    let receivedAmount = 0;
    let pendingAmount = 0;
    let upcomingAmount = 0;

    payouts.forEach(payout => {
      totalEarnings += payout.totalAmount;

      // First payment
      if (payout.firstPaymentStatus === 'PAID') {
        receivedAmount += payout.firstPaymentAmount;
      } else if (payout.firstPaymentStatus === 'PENDING') {
        if (new Date(payout.firstPaymentDate) <= new Date()) {
          pendingAmount += payout.firstPaymentAmount;
        } else {
          upcomingAmount += payout.firstPaymentAmount;
        }
      }

      // Second payment
      if (payout.secondPaymentStatus === 'PAID') {
        receivedAmount += payout.secondPaymentAmount;
      } else if (payout.secondPaymentStatus === 'PENDING') {
        if (new Date(payout.secondPaymentDate) <= new Date()) {
          pendingAmount += payout.secondPaymentAmount;
        } else {
          upcomingAmount += payout.secondPaymentAmount;
        }
      }
    });

    const totalBookings = await prisma.booking.count({
      where: {
        travelPlan: {
          hostId,
        },
        paymentStatus: {
          in: ['FULLY_PAID', 'PARTIALLY_PAID'],
        },
      },
    });

    const completedBookings = await prisma.booking.count({
      where: {
        travelPlan: {
          hostId,
        },
        status: 'CONFIRMED',
        paymentStatus: 'FULLY_PAID',
        endDate: {
          lt: new Date(),
        },
      },
    });

    const summary: WalletSummary = {
      totalEarnings,
      receivedAmount,
      pendingAmount,
      upcomingAmount,
      totalBookings,
      completedBookings,
    };

    return { success: true, summary };
  } catch (error) {
    console.error('Error fetching wallet summary:', error);
    return { error: 'Failed to fetch wallet summary' };
  }
};

/**
 * Get upcoming payouts for the host
 */
export const getUpcomingPayouts = async () => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  const hostId = session.user.id;

  try {
    const payouts = await prisma.payout.findMany({
      where: {
        hostId,
        OR: [
          {
            firstPaymentStatus: 'PENDING',
            firstPaymentDate: {
              gte: new Date(),
            },
          },
          {
            secondPaymentStatus: 'PENDING',
            secondPaymentDate: {
              gte: new Date(),
            },
          },
        ],
      },
      include: {
        booking: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            travelPlan: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        firstPaymentDate: 'asc',
      },
    });

    const upcomingPayments: WalletTransaction[] = [];

    payouts.forEach(payout => {
      // Check first payment
      if (
        payout.firstPaymentStatus === 'PENDING' &&
        new Date(payout.firstPaymentDate) >= new Date()
      ) {
        upcomingPayments.push({
          id: `${payout.id}-first`,
          bookingId: payout.bookingId,
          tripTitle: payout.booking.travelPlan.title,
          tripStartDate: payout.booking.startDate,
          tripEndDate: payout.booking.endDate,
          userName: payout.booking.user.name,
          userEmail: payout.booking.user.email || '',
          totalAmount: payout.totalAmount,
          paymentType: 'first',
          amount: payout.firstPaymentAmount,
          paymentDate: payout.firstPaymentDate,
          status: payout.firstPaymentStatus,
          paidAt: payout.firstPaymentPaidAt,
          notes: payout.notes,
          createdAt: payout.createdAt,
        });
      }

      // Check second payment
      if (
        payout.secondPaymentStatus === 'PENDING' &&
        new Date(payout.secondPaymentDate) >= new Date()
      ) {
        upcomingPayments.push({
          id: `${payout.id}-second`,
          bookingId: payout.bookingId,
          tripTitle: payout.booking.travelPlan.title,
          tripStartDate: payout.booking.startDate,
          tripEndDate: payout.booking.endDate,
          userName: payout.booking.user.name,
          userEmail: payout.booking.user.email || '',
          totalAmount: payout.totalAmount,
          paymentType: 'second',
          amount: payout.secondPaymentAmount,
          paymentDate: payout.secondPaymentDate,
          status: payout.secondPaymentStatus,
          paidAt: payout.secondPaymentPaidAt,
          notes: payout.notes,
          createdAt: payout.createdAt,
        });
      }
    });

    // Sort by payment date
    upcomingPayments.sort((a, b) => a.paymentDate.getTime() - b.paymentDate.getTime());

    return { success: true, upcomingPayments };
  } catch (error) {
    console.error('Error fetching upcoming payouts:', error);
    return { error: 'Failed to fetch upcoming payouts' };
  }
};

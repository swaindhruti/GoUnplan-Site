'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/roleGaurd';
import { PayoutStatus } from '@prisma/client';
import {
  CreatePayoutInput,
  UpdatePayoutInput,
  MarkPayoutPaidInput,
  PayoutFilter,
  PayoutDetails,
  PayoutSummary,
} from '@/types/payout';
import { revalidatePath } from 'next/cache';

/**
 * Get all payouts with detailed information
 */
export const getAllPayouts = async (filter?: PayoutFilter) => {
  const session = await requireAdmin();
  if (!session) return { error: 'Unauthorized' };

  try {
    const where: Record<string, unknown> = {};

    // Apply filters
    if (filter?.status) {
      where.OR = [{ firstPaymentStatus: filter.status }, { secondPaymentStatus: filter.status }];
    }

    if (filter?.hostId) {
      where.hostId = filter.hostId;
    }

    if (filter?.dateFrom || filter?.dateTo) {
      where.OR = [
        {
          firstPaymentDate: {
            ...(filter.dateFrom && { gte: filter.dateFrom }),
            ...(filter.dateTo && { lte: filter.dateTo }),
          },
        },
        {
          secondPaymentDate: {
            ...(filter.dateFrom && { gte: filter.dateFrom }),
            ...(filter.dateTo && { lte: filter.dateTo }),
          },
        },
      ];
    }

    const payouts = await prisma.payout.findMany({
      where,
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
                host: {
                  select: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const payoutDetails: PayoutDetails[] = payouts.map(payout => ({
      id: payout.id,
      bookingId: payout.bookingId,
      hostId: payout.hostId,
      hostName: payout.booking.travelPlan.host.user.name,
      hostEmail: payout.booking.travelPlan.host.user.email || '',
      tripTitle: payout.booking.travelPlan.title,
      tripStartDate: payout.booking.startDate,
      tripEndDate: payout.booking.endDate,
      totalAmount: payout.totalAmount,
      firstPaymentAmount: payout.firstPaymentAmount,
      firstPaymentDate: payout.firstPaymentDate,
      firstPaymentStatus: payout.firstPaymentStatus,
      firstPaymentPaidAt: payout.firstPaymentPaidAt,
      secondPaymentAmount: payout.secondPaymentAmount,
      secondPaymentDate: payout.secondPaymentDate,
      secondPaymentStatus: payout.secondPaymentStatus,
      secondPaymentPaidAt: payout.secondPaymentPaidAt,
      firstPaymentPercent: payout.firstPaymentPercent,
      secondPaymentPercent: payout.secondPaymentPercent,
      notes: payout.notes,
      createdAt: payout.createdAt,
      updatedAt: payout.updatedAt,
      userName: payout.booking.user.name,
      userEmail: payout.booking.user.email || '',
    }));

    return { payouts: payoutDetails };
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return { error: 'Failed to fetch payouts' };
  }
};

/**
 * Get payout summary statistics
 */
export const getPayoutSummary = async () => {
  const session = await requireAdmin();
  if (!session) return { error: 'Unauthorized' };

  try {
    const allPayouts = await prisma.payout.findMany({
      select: {
        firstPaymentAmount: true,
        firstPaymentStatus: true,
        firstPaymentDate: true,
        secondPaymentAmount: true,
        secondPaymentStatus: true,
        secondPaymentDate: true,
      },
    });

    const summary: PayoutSummary = {
      totalPayouts: allPayouts.length,
      pendingPayouts: 0,
      paidPayouts: 0,
      totalPendingAmount: 0,
      totalPaidAmount: 0,
      upcomingPayments: 0,
    };

    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);

    allPayouts.forEach(payout => {
      // First payment stats
      if (payout.firstPaymentStatus === PayoutStatus.PENDING) {
        summary.pendingPayouts++;
        summary.totalPendingAmount += payout.firstPaymentAmount;
        if (payout.firstPaymentDate <= next7Days) {
          summary.upcomingPayments++;
        }
      } else if (payout.firstPaymentStatus === PayoutStatus.PAID) {
        summary.paidPayouts++;
        summary.totalPaidAmount += payout.firstPaymentAmount;
      }

      // Second payment stats
      if (payout.secondPaymentStatus === PayoutStatus.PENDING) {
        summary.pendingPayouts++;
        summary.totalPendingAmount += payout.secondPaymentAmount;
        if (payout.secondPaymentDate <= next7Days) {
          summary.upcomingPayments++;
        }
      } else if (payout.secondPaymentStatus === PayoutStatus.PAID) {
        summary.paidPayouts++;
        summary.totalPaidAmount += payout.secondPaymentAmount;
      }
    });

    return { summary };
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    return { error: 'Failed to fetch payout summary' };
  }
};

/**
 * Create payout for a booking
 */
export const createPayout = async (input: CreatePayoutInput) => {
  const session = await requireAdmin();
  if (!session) return { error: 'Unauthorized' };

  try {
    // Check if payout already exists for this booking
    const existingPayout = await prisma.payout.findUnique({
      where: { bookingId: input.bookingId },
    });

    if (existingPayout) {
      return { error: 'Payout already exists for this booking' };
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      include: {
        travelPlan: {
          select: {
            title: true,
            hostId: true,
            host: {
              select: {
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
      return { error: 'Booking not found' };
    }

    // Calculate payment amounts and dates
    const firstPaymentPercent = input.firstPaymentPercent ?? 20;
    const secondPaymentPercent = input.secondPaymentPercent ?? 80;

    const firstPaymentAmount = Math.round((booking.totalPrice * firstPaymentPercent) / 100);
    const secondPaymentAmount = Math.round((booking.totalPrice * secondPaymentPercent) / 100);

    // Calculate payment dates
    const tripStartDate = new Date(booking.startDate);
    const firstPaymentDate = new Date(tripStartDate);
    firstPaymentDate.setDate(tripStartDate.getDate() - 15); // 15 days before trip

    const secondPaymentDate = new Date(tripStartDate); // On trip start date

    // Create payout
    const payout = await prisma.payout.create({
      data: {
        bookingId: input.bookingId,
        hostId: booking.travelPlan.hostId,
        totalAmount: booking.totalPrice,
        firstPaymentAmount,
        firstPaymentDate,
        firstPaymentStatus: PayoutStatus.PENDING,
        firstPaymentPercent,
        secondPaymentAmount,
        secondPaymentDate,
        secondPaymentStatus: PayoutStatus.PENDING,
        secondPaymentPercent,
        notes: input.notes,
      },
    });

    // Send email notification to host
    const hostEmail = booking.travelPlan.host.user.email;
    if (hostEmail) {
      try {
        const { sendEmailAction } = await import('@/actions/email/action');
        await sendEmailAction({
          to: hostEmail,
          type: 'payout_created',
          payload: {
            hostName: booking.travelPlan.host.user.name,
            bookingId: booking.id,
            travelTitle: booking.travelPlan.title,
            amount: firstPaymentAmount,
            paymentDate: firstPaymentDate?.toLocaleDateString('en-IN') || new Date().toLocaleDateString('en-IN'),
            totalAmount: booking.totalPrice,
            notes: input.notes,
          },
        });
      } catch (emailError) {
        console.error('Failed to send payout creation email:', emailError);
        // Don't fail the payout creation if email fails
      }
    }

    revalidatePath('/dashboard/admin/payouts');
    return { success: true, payout };
  } catch (error) {
    console.error('Error creating payout:', error);
    return { error: 'Failed to create payout' };
  }
};

/**
 * Update payout details (percentages, dates, notes)
 */
export const updatePayout = async (input: UpdatePayoutInput) => {
  const session = await requireAdmin();
  if (!session) return { error: 'Unauthorized' };

  try {
    const payout = await prisma.payout.findUnique({
      where: { id: input.payoutId },
      include: {
        booking: true,
      },
    });

    if (!payout) {
      return { error: 'Payout not found' };
    }

    const updateData: Record<string, unknown> = {};

    // Update percentages and recalculate amounts if provided
    if (input.firstPaymentPercent !== undefined) {
      updateData.firstPaymentPercent = input.firstPaymentPercent;
      updateData.firstPaymentAmount = Math.round(
        (payout.booking.totalPrice * input.firstPaymentPercent) / 100
      );
    }

    if (input.secondPaymentPercent !== undefined) {
      updateData.secondPaymentPercent = input.secondPaymentPercent;
      updateData.secondPaymentAmount = Math.round(
        (payout.booking.totalPrice * input.secondPaymentPercent) / 100
      );
    }

    // Update dates if provided
    if (input.firstPaymentDate) {
      updateData.firstPaymentDate = input.firstPaymentDate;
    }

    if (input.secondPaymentDate) {
      updateData.secondPaymentDate = input.secondPaymentDate;
    }

    // Update notes if provided
    if (input.notes !== undefined) {
      updateData.notes = input.notes;
    }

    const updatedPayout = await prisma.payout.update({
      where: { id: input.payoutId },
      data: updateData,
    });

    revalidatePath('/dashboard/admin/payouts');
    return { success: true, payout: updatedPayout };
  } catch (error) {
    console.error('Error updating payout:', error);
    return { error: 'Failed to update payout' };
  }
};

/**
 * Mark a payment as paid (first or second payment)
 */
export const markPayoutPaid = async (input: MarkPayoutPaidInput) => {
  const session = await requireAdmin();
  if (!session) return { error: 'Unauthorized' };

  try {
    // First, get the payout with related data for email
    const existingPayout = await prisma.payout.findUnique({
      where: { id: input.payoutId },
      include: {
        booking: {
          include: {
            travelPlan: {
              select: {
                title: true,
                host: {
                  select: {
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
        },
      },
    });

    if (!existingPayout) {
      return { error: 'Payout not found' };
    }

    const updateData: Record<string, unknown> = {};

    if (input.paymentType === 'first') {
      updateData.firstPaymentStatus = PayoutStatus.PAID;
      updateData.firstPaymentPaidAt = new Date();
    } else {
      updateData.secondPaymentStatus = PayoutStatus.PAID;
      updateData.secondPaymentPaidAt = new Date();
    }

    const payout = await prisma.payout.update({
      where: { id: input.payoutId },
      data: updateData,
    });

    // Send email notification to host
    const hostEmail = existingPayout.booking.travelPlan.host.user.email;
    if (hostEmail) {
      try {
        const { sendEmailAction } = await import('@/actions/email/action');
        const emailType = input.paymentType === 'first' ? 'payout_first_payment' : 'payout_second_payment';
        const amount = input.paymentType === 'first' ? existingPayout.firstPaymentAmount : existingPayout.secondPaymentAmount;
        const paymentDate = input.paymentType === 'first' ? existingPayout.firstPaymentDate : existingPayout.secondPaymentDate;
        
        await sendEmailAction({
          to: hostEmail,
          type: emailType,
          payload: {
            hostName: existingPayout.booking.travelPlan.host.user.name,
            bookingId: existingPayout.booking.id,
            travelTitle: existingPayout.booking.travelPlan.title,
            amount,
            paymentDate: paymentDate?.toLocaleDateString('en-IN') || new Date().toLocaleDateString('en-IN'),
            totalAmount: existingPayout.totalAmount,
            notes: existingPayout.notes,
          },
        });
      } catch (emailError) {
        console.error('Failed to send payout payment email:', emailError);
        // Don't fail the payout update if email fails
      }
    }

    revalidatePath('/dashboard/admin/payouts');
    return { success: true, payout };
  } catch (error) {
    console.error('Error marking payout as paid:', error);
    return { error: 'Failed to mark payout as paid' };
  }
};

/**
 * Get bookings that need payouts (confirmed bookings without payouts)
 */
export const getBookingsNeedingPayouts = async () => {
  const session = await requireAdmin();
  if (!session) return { error: 'Unauthorized' };

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        payouts: {
          none: {},
        },
      },
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
            hostId: true,
            host: {
              select: {
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
      orderBy: {
        startDate: 'asc',
      },
    });

    return { bookings };
  } catch (error) {
    console.error('Error fetching bookings needing payouts:', error);
    return { error: 'Failed to fetch bookings' };
  }
};

/**
 * Auto-create payouts for all confirmed bookings without payouts
 */
export const autoCreatePayouts = async () => {
  const session = await requireAdmin();
  if (!session) return { error: 'Unauthorized' };

  try {
    const result = await getBookingsNeedingPayouts();

    if ('error' in result || !result.bookings) {
      return { error: result.error || 'Failed to get bookings' };
    }

    const createdPayouts = [];
    const errors = [];

    for (const booking of result.bookings) {
      try {
        const createResult = await createPayout({
          bookingId: booking.id,
        });

        if ('error' in createResult) {
          errors.push({ bookingId: booking.id, error: createResult.error });
        } else {
          createdPayouts.push(createResult.payout);
        }
      } catch {
        errors.push({ bookingId: booking.id, error: 'Unexpected error' });
      }
    }

    revalidatePath('/dashboard/admin/payouts');
    return {
      success: true,
      created: createdPayouts.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Error auto-creating payouts:', error);
    return { error: 'Failed to auto-create payouts' };
  }
};

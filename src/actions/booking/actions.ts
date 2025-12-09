'use server';

import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/roleGaurd';
import { TeamMemberInput } from '@/types/booking';
import { BookingStatus, PaymentStatus, PaymentType, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { sendEmailAction } from '../email/action';

export const createBooking = async (bookingData: {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  participants?: number;
  specialRequirements?: string;
  guests?: Array<TeamMemberInput>;
  allowPartialPayment?: boolean;
}) => {
  const session = await requireUser();

  if (!session || session.user.id !== bookingData.userId) return { error: 'Unauthorized' };

  try {
    const travelPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: bookingData.travelPlanId },
    });

    if (!travelPlan || travelPlan.status !== 'ACTIVE') {
      return {
        error: 'This travel plan is not currently available for booking',
      };
    }

    const participants = bookingData.participants || 1;
    if (participants <= 0) return { error: 'Number of participants must be at least 1' };
    if (participants > travelPlan.maxParticipants) {
      return {
        error: `Maximum ${travelPlan.maxParticipants} participants allowed for this plan`,
      };
    }

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const today = new Date();

    if (startDate < today) return { error: 'Start date cannot be in the past' };
    if (endDate < startDate) return { error: 'End date cannot be before start date' };

    const pricePerPerson = travelPlan.price;
    const totalPrice = pricePerPerson * participants;

    const paymentDeadline = new Date(
      Math.min(
        startDate.getTime() - 10 * 24 * 60 * 60 * 1000,
        today.getTime() + 7 * 24 * 60 * 60 * 1000
      )
    );

    const minPaymentAmount = totalPrice * 0.2;

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
        remainingAmount: totalPrice,
        minPaymentAmount: minPaymentAmount,
        paymentDeadline: bookingData.allowPartialPayment ? paymentDeadline : null,
        paymentStatus: 'PENDING',
      },
    });

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        formSubmitted: true,
      },
    });

    revalidatePath(`/booking/${bookingData.travelPlanId}`);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { error: 'Failed to create booking' };
  }
};

export const processPartialPayment = async (
  bookingId: string,
  amount: number,
  paymentType: PaymentType = 'PARTIAL'
) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelPlan: true,
        partialPayments: true,
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: 'Booking not found or unauthorized' };
    }

    if (booking.paymentStatus === 'FULLY_PAID') {
      return { error: 'Booking is already fully paid' };
    }

    if (amount <= 0) {
      return { error: 'Payment amount must be greater than 0' };
    }

    if (amount > booking.remainingAmount) {
      return { error: 'Payment amount exceeds remaining balance' };
    }

    if (paymentType === 'PARTIAL' && booking.partialPayments.length === 0) {
      if (booking.minPaymentAmount && amount < booking.minPaymentAmount) {
        return {
          error: `Minimum payment amount is ${booking.minPaymentAmount}`,
        };
      }
    }

    const result = await prisma.$transaction(async tx => {
      const partialPayment = await tx.partialPayment.create({
        data: {
          bookingId,
          amount,
          paymentType,
        },
      });

      const newAmountPaid = booking.amountPaid + amount;
      const newRemainingAmount = booking.remainingAmount - newAmountPaid;

      // Determine new payment status
      let newPaymentStatus: PaymentStatus;
      let newBookingStatus: BookingStatus = booking.status;

      if (newRemainingAmount === 0) {
        newPaymentStatus = 'FULLY_PAID';
        newBookingStatus = 'CONFIRMED';
      } else {
        newPaymentStatus = 'PARTIALLY_PAID';
      }

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          amountPaid: newAmountPaid,
          remainingAmount: newRemainingAmount,
          paymentStatus: newPaymentStatus,
          status: newBookingStatus,
          updatedAt: new Date(),
        },
        include: {
          partialPayments: true,
          travelPlan: true,
        },
      });

      return { partialPayment, booking: updatedBooking };
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    revalidatePath('/my-trips');

    return {
      success: true,
      payment: result.partialPayment,
      booking: result.booking,
      message:
        result.booking.paymentStatus === 'FULLY_PAID'
          ? 'Payment completed successfully!'
          : `Partial payment of ${amount} processed. Remaining: ${result.booking.remainingAmount}`,
    };
  } catch (error) {
    console.error('Error processing partial payment:', error);
    return { error: 'Failed to process payment' };
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
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { travelPlan: true },
    });

    if (!booking || booking.userId !== session.user.id) return { error: 'Unauthorized' };

    if (guestData.participants <= 0) return { error: 'Number of participants must be at least 1' };

    if (guestData.participants > booking.travelPlan.maxParticipants) {
      return {
        error: `Maximum ${booking.travelPlan.maxParticipants} participants allowed for this plan`,
      };
    }

    const totalPrice = booking.pricePerPerson * guestData.participants;
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        participants: guestData.participants,
        totalPrice,
        specialRequirements: guestData.specialRequirements || undefined,
      },
    });
    await prisma.teamMember.deleteMany({
      where: { bookingId },
    });

    await prisma.teamMember.createMany({
      data: guestData.guests.map(guest => ({
        ...guest,
        bookingId,
      })),
    });

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        formSubmitted: true,
      },
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error('Error updating booking guest info:', error);
    return { error: 'Failed to update booking guest information' };
  }
};
export const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking || booking.userId !== session.user.id) return { error: 'Unauthorized' };

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: status as BookingStatus,
        ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
      },
    });

    revalidatePath(`/booking/${booking.travelPlanId}`);
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { error: 'Failed to update booking status' };
  }
};
export const getPaymentSummary = async (bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        partialPayments: {
          orderBy: { paymentDate: 'desc' },
        },
        travelPlan: {
          select: {
            title: true,
            destination: true,
          },
        },
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: 'Booking not found or unauthorized' };
    }

    const paymentSummary = {
      totalAmount: booking.totalPrice,
      amountPaid: booking.amountPaid,
      remainingAmount: booking.remainingAmount,
      paymentStatus: booking.paymentStatus,
      minPaymentAmount: booking.minPaymentAmount,
      paymentDeadline: booking.paymentDeadline,
      isOverdue: booking.paymentDeadline ? new Date() > booking.paymentDeadline : false,
      payments: booking.partialPayments,
    };

    return { success: true, paymentSummary, booking };
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    return { error: 'Failed to fetch payment summary' };
  }
};

export const markOverdueBookings = async () => {
  try {
    const overdueBookings = await prisma.booking.updateMany({
      where: {
        paymentDeadline: {
          lt: new Date(),
        },
        paymentStatus: {
          in: ['PENDING', 'PARTIALLY_PAID'],
        },
      },
      data: {
        paymentStatus: 'OVERDUE',
      },
    });

    return {
      success: true,
      updatedCount: overdueBookings.count,
      message: `${overdueBookings.count} bookings marked as overdue`,
    };
  } catch (error) {
    console.error('Error marking overdue bookings:', error);
    return { error: 'Failed to mark overdue bookings' };
  }
};

// Complete remaining payment
export const completeRemainingPayment = async (bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: 'Booking not found or unauthorized' };
    }

    if (booking.remainingAmount === 0) {
      return { error: 'No remaining amount to pay' };
    }

    return await processPartialPayment(bookingId, booking.remainingAmount, 'FULL');
  } catch (error) {
    console.error('Error completing remaining payment:', error);
    return { error: 'Failed to complete remaining payment' };
  }
};
export const getUserBookings = async (userId: string) => {
  const session = await requireUser();
  if (!session || session.user.id !== userId) return { error: 'Unauthorized' };

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
            tripImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, bookings };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return { error: 'Failed to fetch bookings' };
  }
};

export const cancelBooking = async (bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        partialPayments: true,
        travelPlan: { include: { host: true } },
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: 'Unauthorized' };
    }

    if (booking.paymentStatus === 'CANCELLED') {
      return { error: 'Booking is already cancelled' };
    }

    if (booking.paymentStatus === 'REFUNDED') {
      return { error: 'Cannot cancel a refunded booking' };
    }

    const now = new Date();
    const bookingDate = new Date(booking.createdAt);
    const startDate = new Date(booking.startDate);
    const daysFromBookingToTrip = Math.ceil(
      (startDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysUntilTrip = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isFullPayment = booking.amountPaid >= booking.totalPrice;
    const isPartialPayment = !isFullPayment && daysFromBookingToTrip > 20;

    let refundAmount = 0;
    let refundPercentage = 0;
    let policyApplied = '';

    if (isFullPayment) {
      let freeCancellationDays = 0;

      if (daysFromBookingToTrip > 40) {
        freeCancellationDays = 10;
      } else if (daysFromBookingToTrip >= 20 && daysFromBookingToTrip <= 40) {
        freeCancellationDays = 7;
      }

      const daysFromBooking = Math.ceil(
        (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (freeCancellationDays > 0 && daysFromBooking <= freeCancellationDays) {
        refundPercentage = 1.0;
        policyApplied = `Full refund (within ${freeCancellationDays}-day free cancellation window)`;
      } else {
        if (daysUntilTrip >= 15 && daysUntilTrip <= 20) {
          refundPercentage = 0.5;
          policyApplied = 'Cancellation 15-20 days before trip';
        } else if (daysUntilTrip < 15) {
          refundPercentage = 0;
          policyApplied = 'Cancellation less than 15 days before trip';
        } else {
          refundPercentage = 0.5;
          policyApplied = 'Standard cancellation policy';
        }
      }
    } else if (isPartialPayment) {
      const partialPaymentAmount = booking.amountPaid;
      const daysFromBooking = Math.ceil(
        (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysFromBooking <= 7) {
        const hasRemainingPayment = booking.amountPaid >= booking.totalPrice;

        if (hasRemainingPayment) {
          if (daysUntilTrip >= 15 && daysUntilTrip <= 20) {
            refundPercentage = 0.5;
            refundAmount = Math.floor(booking.totalPrice * refundPercentage);
            policyApplied = 'Cancellation after full payment (15-20 days before trip)';
          } else if (daysUntilTrip < 15) {
            refundPercentage = 0;
            refundAmount = 0;
            policyApplied = 'Cancellation after full payment (less than 15 days)';
          }
        } else {
          refundPercentage = 1.0;
          refundAmount = Math.floor(partialPaymentAmount);
          policyApplied = 'Cancellation within 7 days of partial payment';
        }
      } else {
        if (daysUntilTrip >= 15) {
          refundPercentage = 0.5;
          refundAmount = Math.floor(booking.totalPrice * refundPercentage);
          policyApplied = 'Cancellation 15+ days before trip';
        } else {
          refundPercentage = 0;
          refundAmount = 0;
          policyApplied = 'Cancellation less than 15 days before trip';
        }
      }
    } else {
      return {
        error:
          'Partial payment bookings are only available for trips booked more than 20 days in advance',
      };
    }

    if (refundAmount === 0 && refundPercentage > 0) {
      refundAmount = Math.floor(booking.amountPaid * refundPercentage);
    }

    const updatedBooking = await prisma.$transaction(async tx => {
      const currentBooking = await tx.booking.findUnique({
        where: { id: bookingId },
      });

      if (!currentBooking || currentBooking.paymentStatus === 'CANCELLED') {
        throw new Error('Booking not found or already cancelled');
      }

      if (refundAmount > 0) {
        await tx.partialPayment.create({
          data: {
            bookingId,
            amount: -refundAmount,
            paymentType: 'REFUND',
          },
        });
      }

      // Update booking status
      return await tx.booking.update({
        where: { id: bookingId },
        data: {
          cancelledAt: new Date(),
          refundAmount,
          paymentStatus: 'CANCELLED',
        },
      });
    });

    await prisma.travelPlans.update({
      where: { travelPlanId: booking.travelPlanId },
      data: {
        maxParticipants: {
          increment: booking.participants,
        },
      },
    });
    revalidatePath('/my-trips');
    revalidatePath(`/booking/${booking.travelPlanId}`);

    await sendEmailAction({
      to: 'mayan6378@gmail.com',
      type: 'booking_cancelled',
      payload: {
        userName: session.user.name || 'Customer',
        bookingId: booking.id,
        travelName: booking.travelPlanId,
        refundAmount,
        refundPercentage: Math.round(refundPercentage * 100),
        policyApplied,
      },
    });

    await sendEmailAction({
      to: booking.travelPlan.host.hostEmail,
      type: 'booking_cancelled',
      payload: {
        userName: session.user.name || 'Customer',
        bookingId: booking.id,
        travelName: booking.travelPlanId,
        refundAmount,
        refundPercentage: Math.round(refundPercentage * 100),
        policyApplied,
      },
    });

    return {
      success: true,
      booking: updatedBooking,
      refundAmount,
      refundPercentage: Math.round(refundPercentage * 100),
      policyApplied,
      message:
        refundAmount > 0
          ? `Booking cancelled successfully. Refund of ₹${refundAmount} (${Math.round(
              refundPercentage * 100
            )}%) will be processed. Policy: ${policyApplied}`
          : `Booking cancelled. No refund available. Policy: ${policyApplied}`,
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { error: 'Failed to cancel booking' };
  }
};

export const getBookingsWithPayments = async (filters?: {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
}) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const whereClause: Prisma.BookingWhereInput = {};

    if (filters?.status) whereClause.status = filters.status;
    if (filters?.paymentStatus) whereClause.paymentStatus = filters.paymentStatus;
    if (filters?.userId) whereClause.userId = filters.userId;

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        travelPlan: {
          select: {
            title: true,
            destination: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        partialPayments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, bookings };
  } catch (error) {
    console.error('Error fetching bookings with payments:', error);
    return { error: 'Failed to fetch bookings' };
  }
};

export const processRefund = async (bookingId: string, refundAmount?: number) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { error: 'Booking not found' };
    }

    if (booking.paymentStatus === 'REFUNDED') {
      return { error: 'Booking has already been refunded' };
    }

    if (booking.paymentStatus !== 'CANCELLED') {
      return { error: 'Only cancelled bookings can be refunded' };
    }

    const finalRefundAmount = refundAmount || booking.refundAmount;

    const updatedBooking = await prisma.$transaction(async tx => {
      if (finalRefundAmount > 0) {
        await tx.partialPayment.create({
          data: {
            bookingId,
            amount: -finalRefundAmount,
            paymentType: 'REFUND',
          },
        });
      }

      return await tx.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'REFUNDED',
          refundAmount: finalRefundAmount,
          updatedAt: new Date(),
        },
      });
    });

    revalidatePath('/dashboard/admin');
    return {
      success: true,
      booking: updatedBooking,
      message: `Refund of ${finalRefundAmount} processed successfully`,
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    return { error: 'Failed to process refund' };
  }
};

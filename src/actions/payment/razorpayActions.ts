"use server";

import { prisma } from "@/lib/shared";
import { requireUser } from "@/lib/roleGaurd";
import { PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const processRazorpayPayment = async (
  bookingId: string,
  paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  },
  amount: number
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelPlan: true,
        partialPayments: true,
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: "Booking not found or unauthorized" };
    }

    // Update booking with Razorpay payment details
    const result = await prisma.$transaction(async (tx) => {
      // Add partial payment record
      const partialPayment = await tx.partialPayment.create({
        data: {
          bookingId,
          amount,
          paymentType: "PARTIAL",
        },
      });

      const newAmountPaid = booking.amountPaid + amount;
      const newRemainingAmount = booking.totalPrice - newAmountPaid;

      // Determine new payment status
      let newPaymentStatus: PaymentStatus;
      let newBookingStatus = booking.status;

      if (newRemainingAmount <= 0) {
        newPaymentStatus = "FULLY_PAID";
        newBookingStatus = "CONFIRMED";
      } else {
        newPaymentStatus = "PARTIALLY_PAID";
      }

      // Update booking
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          amountPaid: newAmountPaid,
          remainingAmount: Math.max(0, newRemainingAmount),
          paymentStatus: newPaymentStatus,
          status: newBookingStatus,
          razorpayPaymentId: paymentData.razorpay_payment_id,
          razorpayOrderId: paymentData.razorpay_order_id,
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
    revalidatePath("/my-trips");

    return {
      success: true,
      payment: result.partialPayment,
      booking: result.booking,
      message:
        result.booking.paymentStatus === "FULLY_PAID"
          ? "Payment completed successfully! Your booking is confirmed."
          : `Payment of ₹${amount} processed successfully. Remaining: ₹${result.booking.remainingAmount}`,
    };
  } catch (error) {
    console.error("Error processing Razorpay payment:", error);
    return { error: "Failed to process payment" };
  }
};

export const handlePaymentFailure = async (
  bookingId: string,
  reason: string
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== session.user.id) {
      return { error: "Booking not found or unauthorized" };
    }

    // Log the payment failure for admin reference
    console.log(`Payment failed for booking ${bookingId}: ${reason}`);

    // You could also store payment failure logs in the database if needed
    // For now, we'll just return the error message to the frontend

    return {
      success: false,
      message:
        "Payment failed. Please try again or contact support if the issue persists.",
    };
  } catch (error) {
    console.error("Error handling payment failure:", error);
    return { error: "Failed to handle payment failure" };
  }
};

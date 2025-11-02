import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentCaptured(payment: {
  id: string;
  order_id: string;
  amount: number;
  notes?: { bookingId?: string };
}) {
  try {
    const bookingId = payment.notes?.bookingId;
    if (!bookingId) {
      console.error('No booking ID found in payment notes');
      return;
    }

    // Update booking payment status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'FULLY_PAID',
        amountPaid: payment.amount / 100, // Convert from paisa to rupees
        razorpayPaymentId: payment.id,
        razorpayOrderId: payment.order_id,
      },
    });

    console.log(`Payment captured for booking: ${bookingId}`);
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment: {
  id: string;
  order_id: string;
  notes?: { bookingId?: string };
}) {
  try {
    const bookingId = payment.notes?.bookingId;
    if (!bookingId) {
      console.error('No booking ID found in payment notes');
      return;
    }

    // Log payment failure but don't update booking status immediately
    // Let the frontend handle retry logic
    console.log(`Payment failed for booking: ${bookingId}, payment ID: ${payment.id}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

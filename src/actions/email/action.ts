'use server';

import { transporter } from '@/lib/email/transporter';

import { welcomeTemplate } from '@/lib/email/templates/welcome';
import { otpTemplate } from '@/lib/email/otp';

import { userBookingConfirmationTemplate } from '@/lib/email/templates/booking/userConfirmation';
import { hostBookingNotificationTemplate } from '@/lib/email/templates/booking/hostNotification';
import { bookingCancellationTemplate } from '@/lib/email/templates/booking/cancellation';
import { paymentReminderTemplate } from '@/lib/email/templates/booking/paymentReminder';

const FROM_EMAIL = process.env.FROM_EMAIL as string;

export async function sendEmailAction({
  to,
  type,
  payload,
}: {
  to: string;
  type:
    | 'welcome'
    | 'otp'
    | 'booking_user_confirmation'
    | 'booking_host_notification'
    | 'booking_cancelled'
    | 'booking_payment_reminder';
  payload: unknown;
}) {
  let subject = '';
  let text = '';
  let html = '';

  if (type === 'welcome') {
    const p = payload as { name?: string };
    const tpl = welcomeTemplate(p.name || '');
    subject = 'Welcome to Our Platform';
    text = tpl.text;
    html = tpl.html;
  }

  if (type === 'otp') {
    const p = payload as { code?: string };
    const tpl = otpTemplate(p.code || '');
    subject = 'Your OTP Code';
    text = tpl.text;
    html = tpl.html;
  }

  if (type === 'booking_user_confirmation') {
    const p = payload as {
      userName?: string;
      bookingId?: string;
      travelName?: string;
      totalPrice?: number;
      amountPaid?: number;
      participants?: number;
      startDate?: string;
      endDate?: string;
      remainingAmount?: number;
      paymentStatus?: 'PARTIAL' | 'PAID';
    };
    const tpl = userBookingConfirmationTemplate({
      userName: p.userName || '',
      bookingId: p.bookingId || '',
      travelTitle: p.travelName || '',
      totalPrice: p.totalPrice || 0,
      amountPaid: p.amountPaid || 0,
      participants: p.participants || 0,
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      remainingAmount: p.remainingAmount || 0,
      paymentStatus: p.paymentStatus || 'PARTIAL',
    });
    subject = 'Your Booking is Confirmed';
    text = tpl.text;
    html = tpl.html;
  }

  if (type === 'booking_host_notification') {
    const p = payload as {
      hostName?: string;
      userName?: string;
      bookingId?: string;
      travelName?: string;
      participants?: number;
      amountPaid?: number;
      paymentStatus?: 'PARTIAL' | 'PAID';
    };
    const tpl = hostBookingNotificationTemplate({
      hostName: p.hostName || '',
      userName: p.userName || '',
      bookingId: p.bookingId || '',
      travelTitle: p.travelName || '',
      participants: p.participants || 0,
      amountPaid: p.amountPaid || 0,
      paymentStatus: p.paymentStatus || 'PARTIAL',
    });
    subject = 'New Booking Received';
    text = tpl.text;
    html = tpl.html;
  }

  if (type === 'booking_cancelled') {
    const p = payload as {
      userName?: string;
      bookingId?: string;
      travelName?: string;
      refundAmount?: number;
    };
    const tpl = bookingCancellationTemplate({
      userName: p.userName || '',
      bookingId: p.bookingId || '',
      travelTitle: p.travelName || '',
      refundAmount: p.refundAmount || 0,
    });
    subject = 'Your Booking Has Been Cancelled';
    text = tpl.text;
    html = tpl.html;
  }

  if (type === 'booking_payment_reminder') {
    const p = payload as {
      userName?: string;
      bookingId?: string;
      travelName?: string;
      remainingAmount?: number;
      paymentDeadline?: string;
    };
    const tpl = paymentReminderTemplate({
      userName: p.userName || '',
      bookingId: p.bookingId || '',
      travelTitle: p.travelName || '',
      remainingAmount: p.remainingAmount || 0,
      paymentDeadline: p.paymentDeadline || '',
    });
    subject = 'Payment Reminder – Important';
    text = tpl.text;
    html = tpl.html;
  }

  try {
    const res = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: res.messageId };
  } catch (error: unknown) {
    console.error('Email error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: msg };
  }
}

export function paymentReminderTemplate({
  userName,
  bookingId,
  travelTitle,
  remainingAmount,
  paymentDeadline,
}: {
  userName: string;
  bookingId: string;
  travelTitle: string;
  remainingAmount: number;
  paymentDeadline: string;
}) {
  const text = `
Hi ${userName},

This is a reminder that your remaining payment for booking ${bookingId} (${travelTitle}) is due.

Remaining Amount: ₹${remainingAmount}
Payment Deadline: ${paymentDeadline}

Please complete the payment to avoid cancellation.
`;

  const html = `
<div style="font-family:Arial; line-height:1.5;">
  <h2>Payment Reminder</h2>

  <p>Hi ${userName},</p>

  <p>This is a reminder to complete your pending payment for <strong>${travelTitle}</strong>.</p>

  <p><strong>Booking ID:</strong> ${bookingId}</p>
  <p><strong>Remaining Amount:</strong> ₹${remainingAmount}</p>
  <p><strong>Payment Deadline:</strong> ${paymentDeadline}</p>

  <p>Please complete the payment to avoid automatic cancellation.</p>
</div>
`;

  return { text, html };
}

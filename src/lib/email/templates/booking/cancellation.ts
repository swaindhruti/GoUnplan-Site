export function bookingCancellationTemplate({
  userName,
  bookingId,
  travelTitle,
  refundAmount,
}: {
  userName: string;
  bookingId: string;
  travelTitle: string;
  refundAmount: number;
}) {
  const text = `
Hi ${userName},

Your booking (${bookingId}) for "${travelTitle}" has been cancelled.

Refund Amount: ₹${refundAmount}

We hope to serve you again soon.
`;

  const html = `
<div style="font-family:Arial; line-height:1.5;">
  <h2>Booking Cancelled</h2>

  <p>Hi ${userName},</p>
  <p>Your booking <strong>${bookingId}</strong> for <strong>${travelTitle}</strong> has been cancelled.</p>

  <p><strong>Refund Amount:</strong> ₹${refundAmount}</p>

  <p>We hope to see you again soon.</p>
</div>
`;

  return { text, html };
}

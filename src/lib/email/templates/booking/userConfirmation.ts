export function userBookingConfirmationTemplate({
  userName,
  bookingId,
  travelTitle,
  totalPrice,
  amountPaid,
  participants,
  startDate,
  endDate,
  remainingAmount,
  paymentStatus,
}: {
  userName: string;
  bookingId: string;
  travelTitle: string;
  totalPrice: number;
  amountPaid: number;
  participants: number;
  startDate: string;
  remainingAmount: number;
  endDate: string;
  paymentStatus: 'PARTIAL' | 'PAID';
}) {
  const remaining = remainingAmount;

  const text = `
Hi ${userName},

Your booking for "${travelTitle}" is confirmed.

Booking ID: ${bookingId}
Participants: ${participants}
Start Date: ${startDate}
End Date: ${endDate}

Total Price: ₹${totalPrice}
Amount Paid: ₹${amountPaid}
Remaining: ₹${remaining}

Status: ${paymentStatus === 'PAID' ? 'Fully Paid' : 'Partially Paid'}

Thank you for choosing us!
`;

  const html = `
<div style="font-family:Arial; line-height:1.5;">
  <h2>Booking Confirmed, ${userName}</h2>

  <p>Your booking for <strong>${travelTitle}</strong> is successfully confirmed.</p>

  <div style="margin-top:12px;">
    <p><strong>Booking ID:</strong> ${bookingId}</p>
    <p><strong>Participants:</strong> ${participants}</p>
    <p><strong>Trip Dates:</strong> ${startDate} → ${endDate}</p>
  </div>

  <h3>Payment Details</h3>
  <p><strong>Total Price:</strong> ₹${totalPrice}</p>
  <p><strong>Paid:</strong> ₹${amountPaid}</p>
  <p><strong>Remaining:</strong> ₹${remaining}</p>
  <p><strong>Status:</strong> ${paymentStatus === 'PAID' ? 'Fully Paid' : 'Partially Paid'}</p>

  <p style="margin-top:20px;">We’re excited to have you on this journey!</p>
</div>
`;

  return { text, html };
}

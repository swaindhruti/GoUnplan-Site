export function hostBookingNotificationTemplate({
  hostName,
  userName,
  bookingId,
  travelTitle,
  participants,
  amountPaid,
  paymentStatus,
}: {
  hostName: string;
  userName: string;
  bookingId: string;
  travelTitle: string;
  participants: number;
  amountPaid: number;
  paymentStatus: 'PARTIAL' | 'PAID';
}) {
  const text = `
Hello ${hostName},

A new booking has been made.

Booking ID: ${bookingId}
User: ${userName}
Travel Plan: ${travelTitle}
Participants: ${participants}
Amount Paid: ₹${amountPaid}
Payment Status: ${paymentStatus}

Please log in to the admin dashboard for more details.
`;

  const html = `
<div style="font-family:Arial; line-height:1.5;">
  <h2>New Booking Received</h2>

  <p><strong>User:</strong> ${userName}</p>
  <p><strong>Booking ID:</strong> ${bookingId}</p>
  <p><strong>Travel Plan:</strong> ${travelTitle}</p>
  <p><strong>Participants:</strong> ${participants}</p>
  <p><strong>Amount Paid:</strong> ₹${amountPaid}</p>
  <p><strong>Payment Status:</strong> ${paymentStatus}</p>

  <p>Please check the admin dashboard for details.</p>
</div>
`;

  return { text, html };
}

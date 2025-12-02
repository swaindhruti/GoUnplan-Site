export function hostPayoutNotificationTemplate({
  hostName,
  payoutType,
  bookingId,
  travelTitle,
  amount,
  paymentDate,
  totalAmount,
  notes,
}: {
  hostName: string;
  payoutType: 'created' | 'first_payment' | 'second_payment';
  bookingId: string;
  travelTitle: string;
  amount: number;
  paymentDate: string;
  totalAmount: number;
  notes?: string;
}) {
  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  let title = '';
  let message = '';

  if (payoutType === 'created') {
    title = 'Payout Schedule Created';
    message = `A payout schedule has been created for your trip "${travelTitle}".`;
  } else if (payoutType === 'first_payment') {
    title = 'First Payment Processed';
    message = `The first payment for your trip "${travelTitle}" has been processed.`;
  } else {
    title = 'Second Payment Processed';
    message = `The second payment for your trip "${travelTitle}" has been processed.`;
  }

  const text = `
Hello ${hostName},

${message}

Booking ID: ${bookingId}
Travel Plan: ${travelTitle}
Payment Amount: ${formatCurrency(amount)}
Payment Date: ${paymentDate}
Total Payout Amount: ${formatCurrency(totalAmount)}
${notes ? `Notes: ${notes}` : ''}

${payoutType === 'created' ? 'Payments will be processed according to the schedule.' : 'The payment has been credited to your account.'}

Thank you for being a host with us!
`;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">💰</span>
      </div>
    </div>

    <!-- Main Content -->
    <h1 style="color: #10b981; text-align: center; font-size: 24px; margin-bottom: 20px;">
      ${title}
    </h1>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151; text-align: center; margin-bottom: 30px;">
      Hello ${hostName},
    </p>

    <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
        ${message}
      </p>
    </div>

    <!-- Payment Details -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">Payment Details</h3>
      <div style="color: #6b7280; font-size: 14px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><strong>Booking ID:</strong></span>
          <span>${bookingId}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><strong>Travel Plan:</strong></span>
          <span>${travelTitle}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><strong>Payment Amount:</strong></span>
          <span style="color: #10b981; font-weight: bold;">${formatCurrency(amount)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><strong>Payment Date:</strong></span>
          <span>${paymentDate}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><strong>Total Payout Amount:</strong></span>
          <span>${formatCurrency(totalAmount)}</span>
        </div>
        ${notes ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <span><strong>Notes:</strong></span>
          <p style="margin: 5px 0 0 0; color: #6b7280;">${notes}</p>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Status Message -->
    <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
      <p style="font-size: 14px; color: #374151; margin: 0;">
        ${payoutType === 'created' 
          ? '✓ Payments will be processed according to the schedule.' 
          : '✓ The payment has been credited to your account.'}
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gounplan.com'}/dashboard/host" 
         style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
        View Dashboard →
      </a>
    </div>

    <!-- Support Section -->
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">
        <strong>Need Help?</strong>
      </p>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        If you have any questions about this payout, please contact our support team.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        Thank you for being a host with us!
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 5px 0 0 0;">
        © ${new Date().getFullYear()} GoUnplan. All rights reserved.
      </p>
    </div>
  </div>
</div>
`;

  return { text, html };
}

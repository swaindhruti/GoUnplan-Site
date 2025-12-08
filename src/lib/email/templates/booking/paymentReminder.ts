export interface PaymentReminderParams {
  userName: string;
  bookingId: string;
  travelTitle: string;
  remainingAmount: number;
  paymentDeadline: string;
}

export function paymentReminderTemplate(params: PaymentReminderParams) {
  const { userName, bookingId, travelTitle, remainingAmount, paymentDeadline } = params;

  const text = `
Hello ${userName},

This is a friendly reminder about your pending payment.

Booking Details:
- Booking ID: ${bookingId}
- Travel Plan: ${travelTitle}
- Remaining Amount: ₹${remainingAmount.toLocaleString('en-IN')}
- Payment Deadline: ${paymentDeadline}

Please complete your payment before the deadline to avoid automatic cancellation of your booking.

If you have any questions or concerns, please contact our support team.

Best regards,
GoUnplan Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">⏰ Payment Reminder</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                This is a friendly reminder about your pending payment for <strong>${travelTitle}</strong>.
              </p>
              
              <!-- Warning Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #856404; font-size: 16px; font-weight: bold;">⚠️ Payment Pending</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Payment Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #fda085; font-size: 18px;">Payment Details</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Booking ID:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${bookingId}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Travel Plan:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${travelTitle}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Payment Deadline:</td>
                        <td style="color: #dc3545; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${paymentDeadline}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-top: 2px solid #fda085;">Remaining Amount:</td>
                        <td style="color: #fda085; font-size: 20px; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #fda085;">₹${remainingAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Alert Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; color: #721c24; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ Important:</strong> Please complete your payment before <strong>${paymentDeadline}</strong> to avoid automatic cancellation of your booking. Your spot will not be guaranteed until full payment is received.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions or concerns regarding this payment, please don't hesitate to contact our support team. We're here to help!
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 14px; line-height: 1.6;">
                Thank you for your prompt attention to this matter.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://gounplan.com/my-trips" style="display: inline-block; background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(253, 160, 133, 0.3);">
                      View My Trips
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">Best regards,</p>
              <p style="margin: 0; color: #fda085; font-size: 16px; font-weight: bold;">GoUnplan Team</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { text, html };
}

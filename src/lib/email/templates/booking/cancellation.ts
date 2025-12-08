export interface BookingCancellationParams {
  userName: string;
  bookingId: string;
  travelTitle: string;
  refundAmount: number;
}

export function bookingCancellationTemplate(params: BookingCancellationParams) {
  const { userName, bookingId, travelTitle, refundAmount } = params;

  const text = `
Hello ${userName},

We're writing to confirm that your booking has been cancelled.

Cancellation Details:
- Booking ID: ${bookingId}
- Travel Plan: ${travelTitle}
- Refund Amount: ₹${refundAmount.toLocaleString('en-IN')}

Your refund will be processed within 5-7 business days and credited to your original payment method.

We're sorry to see you go, but we hope to serve you again in the future!

If you have any questions about this cancellation or the refund process, please contact our support team.

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
            <td style="background: linear-gradient(135deg, #868f96 0%, #596164 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Booking Cancelled</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                We're writing to confirm that your booking for <strong>${travelTitle}</strong> has been cancelled.
              </p>
              
              <!-- Info Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #e2e3e5; border: 2px solid #6c757d; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #383d41; font-size: 16px; font-weight: bold;">✕ Booking Cancelled</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Cancellation Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #596164; font-size: 18px;">Cancellation Details</h3>
                    
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
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-top: 2px solid #596164;">Refund Amount:</td>
                        <td style="color: #596164; font-size: 20px; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #596164;">₹${refundAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; color: #0c5460; font-size: 14px; line-height: 1.6;">
                      <strong>ℹ️ Refund Processing:</strong> Your refund of <strong>₹${refundAmount.toLocaleString('en-IN')}</strong> will be processed within 5-7 business days and credited to your original payment method.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                We're sorry to see you go, but we hope to serve you again in the future!
              </p>
              
              <p style="margin: 0 0 30px; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions about this cancellation or the refund process, please contact our support team.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://gounplan.com/my-trips" style="display: inline-block; background: linear-gradient(135deg, #868f96 0%, #596164 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(89, 97, 100, 0.3);">
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
              <p style="margin: 0; color: #596164; font-size: 16px; font-weight: bold;">GoUnplan Team</p>
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

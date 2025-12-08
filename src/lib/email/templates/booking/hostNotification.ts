export interface HostBookingNotificationParams {
  hostName: string;
  userName: string;
  bookingId: string;
  travelTitle: string;
  participants: number;
  amountPaid: number;
  paymentStatus: 'PARTIAL' | 'PAID';
}

export function hostBookingNotificationTemplate(params: HostBookingNotificationParams) {
  const { hostName, userName, bookingId, travelTitle, participants, amountPaid, paymentStatus } =
    params;

  const statusLabel = paymentStatus === 'PAID' ? 'Fully Paid' : 'Partially Paid';

  const text = `
Hello ${hostName},

You have received a new booking!

Booking Details:
- Booking ID: ${bookingId}
- Guest Name: ${userName}
- Travel Plan: ${travelTitle}
- Participants: ${participants}
- Amount Paid: ₹${amountPaid.toLocaleString('en-IN')}
- Payment Status: ${statusLabel}

Please log in to your admin dashboard to view more details and manage this booking.

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
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔔 New Booking Received!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${hostName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                Great news! You have received a new booking for <strong>${travelTitle}</strong>.
              </p>
              
              <!-- Success Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #d4edda; border: 2px solid #28a745; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #155724; font-size: 16px; font-weight: bold;">✓ New Booking</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Booking Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #f5576c; font-size: 18px;">Booking Details</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Booking ID:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${bookingId}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Guest Name:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Travel Plan:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${travelTitle}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Participants:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${participants}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-top: 2px solid #f5576c;">Amount Paid:</td>
                        <td style="color: #f5576c; font-size: 20px; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #f5576c;">₹${amountPaid.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Payment Status:</td>
                        <td style="text-align: right; padding: 8px 0;">
                          <span style="display: inline-block; background-color: ${paymentStatus === 'PAID' ? '#d4edda' : '#fff3cd'}; color: ${paymentStatus === 'PAID' ? '#155724' : '#856404'}; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">${statusLabel}</span>
                        </td>
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
                      <strong>ℹ️ Next Steps:</strong> Please log in to your admin dashboard to view complete booking details, manage availability, and communicate with your guest.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; color: #666666; font-size: 14px; line-height: 1.6;">
                Thank you for being a valued host on GoUnplan!
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://gounplan.com/my-trips" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(245, 87, 108, 0.3);">
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
              <p style="margin: 0; color: #f5576c; font-size: 16px; font-weight: bold;">GoUnplan Team</p>
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

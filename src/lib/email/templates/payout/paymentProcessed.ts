export interface PaymentProcessedParams {
  hostName: string;
  tripTitle: string;
  paymentAmount: number;
  paymentType: 'first' | 'second';
  bookingId: string;
  paidAt: string;
}

export function paymentProcessedTemplate(params: PaymentProcessedParams) {
  const { hostName, tripTitle, paymentAmount, paymentType, bookingId, paidAt } = params;

  const paymentLabel = paymentType === 'first' ? 'First Payment' : 'Second Payment';

  const text = `
Hello ${hostName},

Great news! Your ${paymentLabel.toLowerCase()} has been processed.

Payment Details:
- Booking ID: ${bookingId}
- Trip: ${tripTitle}
- Payment Type: ${paymentLabel}
- Amount Paid: ₹${paymentAmount.toLocaleString('en-IN')}
- Processed On: ${paidAt}

The payment has been credited to your account. Please allow 2-3 business days for the amount to reflect in your bank account.

If you have any questions or concerns, please contact our support team.

Thank you for being a valued host!

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
            <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">💰 Payment Processed!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${hostName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                Great news! Your <strong>${paymentLabel.toLowerCase()}</strong> has been processed.
              </p>
              
              <!-- Success Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #d4edda; border: 2px solid #28a745; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #155724; font-size: 16px; font-weight: bold;">✓ Payment Successful</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Payment Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #11998e; font-size: 18px;">Payment Details</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Booking ID:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${bookingId}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Trip:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${tripTitle}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Payment Type:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${paymentLabel}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Processed On:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${paidAt}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-top: 2px solid #11998e;">Amount Paid:</td>
                        <td style="color: #11998e; font-size: 20px; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #11998e;">₹${paymentAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                      <strong>ℹ️ Note:</strong> Please allow 2-3 business days for the amount to reflect in your bank account.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions or concerns, please contact our support team.
              </p>
              
              <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                Thank you for being a valued host!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">Best regards,</p>
              <p style="margin: 0; color: #11998e; font-size: 16px; font-weight: bold;">GoUnplan Team</p>
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

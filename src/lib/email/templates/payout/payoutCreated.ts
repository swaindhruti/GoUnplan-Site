export interface PayoutCreatedParams {
  hostName: string;
  tripTitle: string;
  totalAmount: number;
  firstPaymentAmount: number;
  firstPaymentDate: string;
  secondPaymentAmount: number;
  secondPaymentDate: string;
  bookingId: string;
}

export function payoutCreatedTemplate(params: PayoutCreatedParams) {
  const {
    hostName,
    tripTitle,
    totalAmount,
    firstPaymentAmount,
    firstPaymentDate,
    secondPaymentAmount,
    secondPaymentDate,
    bookingId,
  } = params;

  const text = `
Hello ${hostName},

Great news! A payout schedule has been created for your trip "${tripTitle}".

Payout Details:
- Booking ID: ${bookingId}
- Trip: ${tripTitle}
- Total Payout Amount: ₹${totalAmount.toLocaleString('en-IN')}

Payment Schedule:
1. First Payment: ₹${firstPaymentAmount.toLocaleString('en-IN')} on ${firstPaymentDate}
2. Second Payment: ₹${secondPaymentAmount.toLocaleString('en-IN')} on ${secondPaymentDate}

You will receive email notifications when each payment is processed.

If you have any questions about your payout, please contact our support team.

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
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Payout Schedule Created</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${hostName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                Great news! A payout schedule has been created for your trip <strong>"${tripTitle}"</strong>.
              </p>
              
              <!-- Payout Summary Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #667eea; font-size: 18px;">Payout Details</h3>
                    
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
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-top: 2px solid #667eea;">Total Payout Amount:</td>
                        <td style="color: #667eea; font-size: 18px; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #667eea;">₹${totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Payment Schedule -->
              <h3 style="margin: 0 0 20px; color: #333333; font-size: 18px;">Payment Schedule</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background-color: #e8f5e9; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin: 0 0 5px; color: #2e7d32; font-size: 14px; font-weight: bold;">First Payment</p>
                          <p style="margin: 0; color: #666666; font-size: 13px;">${firstPaymentDate}</p>
                        </td>
                        <td style="text-align: right;">
                          <p style="margin: 0; color: #2e7d32; font-size: 18px; font-weight: bold;">₹${firstPaymentAmount.toLocaleString('en-IN')}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #e3f2fd; padding: 15px; border-radius: 6px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin: 0 0 5px; color: #1565c0; font-size: 14px; font-weight: bold;">Second Payment</p>
                          <p style="margin: 0; color: #666666; font-size: 13px;">${secondPaymentDate}</p>
                        </td>
                        <td style="text-align: right;">
                          <p style="margin: 0; color: #1565c0; font-size: 18px; font-weight: bold;">₹${secondPaymentAmount.toLocaleString('en-IN')}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                You will receive email notifications when each payment is processed.
              </p>
              
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions about your payout, please contact our support team.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">Best regards,</p>
              <p style="margin: 0; color: #667eea; font-size: 16px; font-weight: bold;">GoUnplan Team</p>
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

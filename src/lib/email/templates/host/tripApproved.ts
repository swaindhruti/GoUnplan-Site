export interface TripApprovedParams {
  hostName: string;
  tripTitle: string;
  tripId: string;
  destination: string;
  approvedAt: string;
}

export function tripApprovedTemplate(params: TripApprovedParams) {
  const { hostName, tripTitle, tripId, destination, approvedAt } = params;

  const text = `
Hello ${hostName},

Great news! Your trip has been approved!

Trip Details:
- Trip ID: ${tripId}
- Title: ${tripTitle}
- Destination: ${destination}
- Approved At: ${approvedAt}

Your trip "${tripTitle}" has been reviewed and approved by our team. It is now active and visible to travelers on GoUnplan!

What This Means:
- Your trip is now live on the platform
- Travelers can view and book your trip
- You'll receive notifications when bookings are made
- You can manage bookings from your host dashboard

Next Steps:
1. Monitor your bookings in the host dashboard
2. Respond promptly to traveler inquiries
3. Prepare for your upcoming trips
4. Keep your availability calendar updated

Thank you for creating amazing travel experiences on GoUnplan!

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
              <div style="font-size: 60px; margin-bottom: 10px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Trip Approved!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${hostName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 18px; line-height: 1.6; font-weight: bold; text-align: center;">
                Great news! Your trip has been approved! 🎉
              </p>
              
              <!-- Success Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #d4edda; border: 2px solid #28a745; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #155724; font-size: 16px; font-weight: bold;">✓ Trip Activated</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Trip Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #667eea; font-size: 18px;">Trip Details</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Trip ID:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${tripId}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Title:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${tripTitle}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Destination:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${destination}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-top: 2px solid #667eea;">Approved At:</td>
                        <td style="color: #667eea; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #667eea;">${approvedAt}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Success Message Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #065f46; font-size: 15px; line-height: 1.6;">
                      Your trip <strong>"${tripTitle}"</strong> has been reviewed and approved by our team. It is now active and visible to travelers on GoUnplan!
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- What This Means Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #667eea; font-size: 18px;">What This Means</h3>
                    
                    <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                      <li>Your trip is now live on the platform</li>
                      <li>Travelers can view and book your trip</li>
                      <li>You'll receive notifications when bookings are made</li>
                      <li>You can manage bookings from your host dashboard</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- Next Steps Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="margin: 0 0 10px; color: #1e40af; font-size: 16px;">Next Steps:</h4>
                    <ol style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
                      <li>Monitor your bookings in the host dashboard</li>
                      <li>Respond promptly to traveler inquiries</li>
                      <li>Prepare for your upcoming trips</li>
                      <li>Keep your availability calendar updated</li>
                    </ol>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://gounplan.com/host/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                      View in Host Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for creating amazing travel experiences on GoUnplan!
              </p>
              
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions, our support team is here to help.
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

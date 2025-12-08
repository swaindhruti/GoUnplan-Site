export interface TripSubmittedAdminParams {
  hostName: string;
  hostEmail: string;
  hostId: string;
  tripTitle: string;
  tripId: string;
  destination: string;
  price: number;
  noOfDays: number;
  maxParticipants: number;
  submittedAt: string;
  startDate?: string;
  endDate?: string;
}

export function tripSubmittedAdminTemplate(params: TripSubmittedAdminParams) {
  const {
    hostName,
    hostEmail,
    hostId,
    tripTitle,
    tripId,
    destination,
    price,
    noOfDays,
    maxParticipants,
    submittedAt,
    startDate,
    endDate,
  } = params;

  const text = `
New Trip Submission - Action Required

A host has submitted a new trip for verification on GoUnplan.

Host Information:
- Name: ${hostName}
- Email: ${hostEmail}
- Host ID: ${hostId}

Trip Details:
- Trip ID: ${tripId}
- Title: ${tripTitle}
- Destination: ${destination}
- Duration: ${noOfDays} days
- Price: ₹${price.toLocaleString('en-IN')}
- Max Participants: ${maxParticipants}
${startDate ? `- Start Date: ${startDate}` : ''}
${endDate ? `- End Date: ${endDate}` : ''}
- Submitted At: ${submittedAt}

Please review this trip in the admin dashboard and approve or request changes.

Admin Dashboard: https://gounplan.com/admin/trips

Best regards,
GoUnplan System
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
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔔 New Trip Submission</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                <strong>Action Required:</strong> A host has submitted a new trip for verification.
              </p>
              
              <!-- Alert Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #856404; font-size: 16px; font-weight: bold;">⚠️ Pending Review</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Host Information Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #f5576c; font-size: 18px;">Host Information</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Host Name:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${hostName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Email:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${hostEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Host ID:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${hostId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Trip Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #f5576c; font-size: 18px;">Trip Details</h3>
                    
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
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Duration:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${noOfDays} days</td>
                      </tr>
                      ${
                        startDate
                          ? `
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Start Date:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${startDate}</td>
                      </tr>
                      `
                          : ''
                      }
                      ${
                        endDate
                          ? `
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">End Date:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${endDate}</td>
                      </tr>
                      `
                          : ''
                      }
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Price:</td>
                        <td style="color: #f5576c; font-size: 18px; font-weight: bold; text-align: right; padding: 8px 0;">₹${price.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Max Participants:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${maxParticipants}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-top: 2px solid #f5576c;">Submitted At:</td>
                        <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #f5576c;">${submittedAt}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://gounplan.com/admin/trips" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(245, 87, 108, 0.3);">
                      Review Trip in Admin Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Please review this trip submission and take appropriate action.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">GoUnplan Admin System</p>
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

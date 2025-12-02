export function supportTicketCreatedTemplate({
  ticketId,
  userName,
  userEmail,
  category,
  priority,
  title,
  description,
  bookingId,
  bookingDetails,
}: {
  ticketId: string;
  userName: string;
  userEmail: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  bookingId?: string;
  bookingDetails?: string;
}) {
  const text = `
New Support Ticket Created

Ticket ID: ${ticketId}
Category: ${category}
Priority: ${priority}

Customer Information:
Name: ${userName}
Email: ${userEmail}

Subject: ${title}

Description:
${description}

${bookingId ? `Booking ID: ${bookingId}` : ''}
${bookingDetails ? `Booking Details: ${bookingDetails}` : ''}

Please log in to the support dashboard to view and respond to this ticket.
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                    🎫 New Support Ticket
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <!-- Alert Box -->
                  <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                      <strong>Action Required:</strong> A new support ticket requires attention.
                    </p>
                  </div>

                  <!-- Ticket Info -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6c757d; font-size: 14px; width: 30%;">Ticket ID:</td>
                        <td style="padding: 8px 0; color: #212529; font-weight: 600; font-size: 14px;">
                          <code style="background-color: #e9ecef; padding: 4px 8px; border-radius: 4px;">${ticketId}</code>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">Category:</td>
                        <td style="padding: 8px 0;">
                          <span style="background-color: #e7f3ff; color: #0066cc; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">
                            ${category}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">Priority:</td>
                        <td style="padding: 8px 0;">
                          <span style="background-color: ${priority === 'HIGH' ? '#fee' : priority === 'MEDIUM' ? '#fff3cd' : '#d4edda'}; color: ${priority === 'HIGH' ? '#c00' : priority === 'MEDIUM' ? '#856404' : '#155724'}; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">
                            ${priority}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Customer Info -->
                  <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #212529; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
                      👤 Customer Information
                    </h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6c757d; font-size: 14px; width: 30%;">Name:</td>
                        <td style="padding: 8px 0; color: #212529; font-size: 14px; font-weight: 500;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0;">
                          <a href="mailto:${userEmail}" style="color: #0066cc; text-decoration: none; font-size: 14px;">${userEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Ticket Details -->
                  <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #212529; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
                      📋 Ticket Details
                    </h3>
                    <div style="margin-bottom: 15px;">
                      <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                      <p style="margin: 0; color: #212529; font-size: 16px; font-weight: 600;">${title}</p>
                    </div>
                    <div>
                      <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Description</p>
                      <p style="margin: 0; color: #212529; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${description}</p>
                    </div>
                  </div>

                  ${
                    bookingId
                      ? `
                  <!-- Booking Info -->
                  <div style="background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                    <h4 style="margin: 0 0 10px 0; color: #0066cc; font-size: 14px; font-weight: 600;">
                      🎫 Related Booking
                    </h4>
                    <p style="margin: 0; color: #212529; font-size: 14px;">
                      <strong>Booking ID:</strong> <code style="background-color: #fff; padding: 2px 6px; border-radius: 3px;">${bookingId}</code>
                    </p>
                    ${bookingDetails ? `<p style="margin: 10px 0 0 0; color: #212529; font-size: 14px;">${bookingDetails}</p>` : ''}
                  </div>
                  `
                      : ''
                  }

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gounplan.com'}/dashboard/support/tickets/${ticketId}" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      View Ticket in Dashboard →
                    </a>
                  </div>

                  <!-- Note -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 15px; margin-top: 25px;">
                    <p style="margin: 0; color: #6c757d; font-size: 13px; line-height: 1.5;">
                      <strong>Note:</strong> Please respond to this ticket as soon as possible to ensure customer satisfaction.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 12px;">
                    This is an automated notification from GoUnplan Support System
                  </p>
                  <p style="margin: 0; color: #6c757d; font-size: 12px;">
                    © ${new Date().getFullYear()} GoUnplan. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { text, html };
}

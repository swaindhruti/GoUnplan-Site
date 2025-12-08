/**
 * Email template for notifying host about a new chat/question from a user
 */

interface NewChatNotificationProps {
  hostName: string;
  userName: string;
  tripTitle?: string;
  chatUrl: string;
}

export function newChatNotificationTemplate({
  hostName,
  userName,
  tripTitle,
  chatUrl,
}: NewChatNotificationProps) {
  const text = `
Hello ${hostName},

Great news! ${userName} has sent you a question${tripTitle ? ` about your trip "${tripTitle}"` : ''}.

They're interested in learning more from you. Please respond at your earliest convenience to help them plan their adventure.

Click here to view and respond to their message:
${chatUrl}

Quick responses help build trust and increase booking conversions!

Best regards,
The GoUnplan Team

---
This is an automated notification. You can manage your notification preferences in your account settings.
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Question from ${userName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                💬 New Question!
              </h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 16px;">
                You have a message from a traveler
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hello <strong>${hostName}</strong>,
              </p>
              
              <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                  <strong style="color: #667eea;">${userName}</strong> has sent you a question${tripTitle ? ` about your trip <strong>"${tripTitle}"</strong>` : ''}.
                </p>
              </div>

              <p style="margin: 20px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                They're interested in learning more from you. Please respond at your earliest convenience to help them plan their adventure.
              </p>

              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  💡 Pro Tip
                </p>
                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
                  Quick responses help build trust and increase booking conversions!
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${chatUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25); transition: all 0.3s ease;">
                      View & Respond to Message →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 25px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; color: #667eea; font-size: 13px; word-break: break-all;">
                ${chatUrl}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #1f2937; font-size: 16px; font-weight: 600;">
                Best regards,
              </p>
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px;">
                The GoUnplan Team
              </p>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                  This is an automated notification. You can manage your notification preferences in your account settings.
                </p>
              </div>
            </td>
          </tr>

        </table>

        <!-- Social Links (Optional) -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td align="center" style="padding: 20px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px;">
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
  `.trim();

  return { text, html };
}

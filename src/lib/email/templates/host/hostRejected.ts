export interface HostRejectedParams {
  hostName: string;
  reason?: string;
}

export function hostRejectedTemplate(params: HostRejectedParams) {
  const { hostName, reason } = params;

  const text = `
Hello ${hostName},

Thank you for your interest in becoming a host on GoUnplan.

Application Status: Not Approved

After careful review, we regret to inform you that we are unable to approve your host application at this time.

${reason ? `Reason: ${reason}` : ''}

What You Can Do:
- Review our host requirements and guidelines
- Ensure your profile meets all our criteria
- Reapply after addressing any concerns

We encourage you to review our host guidelines and consider reapplying in the future. We appreciate your interest in GoUnplan and hope to work with you soon.

If you have any questions or would like feedback on your application, please don't hesitate to contact our support team.

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
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Host Application Update</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${hostName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in becoming a host on GoUnplan.
              </p>
              
              <!-- Status Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #fee2e2; border: 2px solid #ef4444; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #991b1b; font-size: 16px; font-weight: bold;">Application Not Approved</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Message Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #7f1d1d; font-size: 15px; line-height: 1.6;">
                      After careful review, we regret to inform you that we are unable to approve your host application at this time.
                    </p>
                    ${
                      reason
                        ? `
                    <p style="margin: 15px 0 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                      <strong>Reason:</strong> ${reason}
                    </p>
                    `
                        : ''
                    }
                  </td>
                </tr>
              </table>
              
              <!-- What You Can Do Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #596164; font-size: 18px;">What You Can Do</h3>
                    
                    <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                      <li>Review our host requirements and guidelines carefully</li>
                      <li>Ensure your profile meets all our criteria</li>
                      <li>Address any concerns mentioned in the feedback</li>
                      <li>Consider reapplying after making necessary improvements</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                      <strong>ℹ️ Note:</strong> We encourage you to review our host guidelines and consider reapplying in the future. We appreciate your interest in GoUnplan and hope to work with you soon.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                If you have any questions or would like feedback on your application, please don't hesitate to contact our support team.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="https://gounplan.com/support" style="display: inline-block; background: linear-gradient(135deg, #868f96 0%, #596164 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(89, 97, 100, 0.3);">
                      Contact Support
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6; text-align: center;">
                Thank you for your understanding.
              </p>
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

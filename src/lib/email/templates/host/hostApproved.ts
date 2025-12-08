export interface HostApprovedParams {
  hostName: string;
}

export function hostApprovedTemplate(params: HostApprovedParams) {
  const { hostName } = params;

  const text = `
Congratulations ${hostName}!

Your Host Application Has Been Approved!

We're thrilled to inform you that your application to become a host on GoUnplan has been approved! You can now start creating amazing travel experiences for adventurers around the world.

What's Next?
1. Access Your Host Dashboard: Log in to your account and navigate to the Host Dashboard to get started.
2. Create Your First Trip: Design unique travel plans, set pricing, and share your local expertise.
3. Build Your Profile: Complete your host profile to attract more travelers.
4. Start Earning: Once your trips are published, travelers can book and you'll start earning!

Resources:
- Host Dashboard: https://gounplan.com/host/dashboard
- Host Guidelines: https://gounplan.com/host/guidelines
- Support Center: https://gounplan.com/support

We're excited to have you on board and can't wait to see the incredible experiences you'll create!

If you have any questions, our support team is here to help.

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
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
              <div style="font-size: 60px; margin-bottom: 10px;">🎉</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Congratulations!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${hostName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 18px; line-height: 1.6; font-weight: bold; text-align: center;">
                Your Host Application Has Been Approved! 🌟
              </p>
              
              <!-- Success Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #d1fae5; border: 2px solid #10b981; border-radius: 50px; padding: 10px 30px;">
                      <p style="margin: 0; color: #065f46; font-size: 16px; font-weight: bold;">✓ Application Approved</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #065f46; font-size: 15px; line-height: 1.6;">
                      We're thrilled to inform you that your application to become a host on <strong>GoUnplan</strong> has been approved! You can now start creating amazing travel experiences for adventurers around the world.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- What's Next Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #10b981; font-size: 18px;">What's Next?</h3>
                    
                    <div style="margin-bottom: 15px;">
                      <p style="margin: 0 0 5px; color: #333333; font-size: 14px; font-weight: bold;">1. Access Your Host Dashboard</p>
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">Log in to your account and navigate to the Host Dashboard to get started.</p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                      <p style="margin: 0 0 5px; color: #333333; font-size: 14px; font-weight: bold;">2. Create Your First Trip</p>
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">Design unique travel plans, set pricing, and share your local expertise.</p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                      <p style="margin: 0 0 5px; color: #333333; font-size: 14px; font-weight: bold;">3. Build Your Profile</p>
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">Complete your host profile to attract more travelers.</p>
                    </div>
                    
                    <div>
                      <p style="margin: 0 0 5px; color: #333333; font-size: 14px; font-weight: bold;">4. Start Earning</p>
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">Once your trips are published, travelers can book and you'll start earning!</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://gounplan.com/host/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                      Go to Host Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Resources Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px; font-weight: bold;">Helpful Resources:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
                      <li><a href="https://gounplan.com/host/guidelines" style="color: #1e40af;">Host Guidelines</a></li>
                      <li><a href="https://gounplan.com/support" style="color: #1e40af;">Support Center</a></li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                We're excited to have you on board and can't wait to see the incredible experiences you'll create!
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
              <p style="margin: 0; color: #10b981; font-size: 16px; font-weight: bold;">GoUnplan Team</p>
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

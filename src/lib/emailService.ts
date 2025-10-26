import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendHostApprovalEmail(
  email: string,
  name: string
): Promise<EmailResponse> {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with Logo/Icon -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">🎉</span>
            </div>
          </div>

          <!-- Main Content -->
          <h1 style="color: #10b981; text-align: center; font-size: 28px; margin-bottom: 20px;">
            Congratulations, ${name}!
          </h1>
          
          <h2 style="color: #374151; text-align: center; font-size: 20px; font-weight: normal; margin-bottom: 30px;">
            Your Host Application Has Been Approved! 🌟
          </h2>

          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
              We're thrilled to inform you that your application to become a host on <strong>GoUnplan</strong> has been approved! You can now start creating amazing travel experiences for adventurers around the world.
            </p>
          </div>

          <!-- What's Next Section -->
          <div style="margin: 30px 0;">
            <h3 style="color: #7c3aed; font-size: 18px; margin-bottom: 15px;">
              What's Next?
            </h3>
            <ul style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px;">
              <li><strong>Access Your Host Dashboard:</strong> Log in to your account and navigate to the Host Dashboard to get started.</li>
              <li><strong>Create Your First Trip:</strong> Design unique travel plans, set pricing, and share your local expertise.</li>
              <li><strong>Build Your Profile:</strong> Complete your host profile to attract more travelers.</li>
              <li><strong>Start Earning:</strong> Once your trips are published, travelers can book and you'll start earning!</li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/dashboard/host" 
               style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
              Go to Host Dashboard →
            </a>
          </div>

          <!-- Support Section -->
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">
              <strong>Need Help?</strong>
            </p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              Check out our <a href="${
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
              }/support" style="color: #7c3aed; text-decoration: none;">Help Center</a> or contact our support team if you have any questions.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Welcome to the GoUnplan hosting community!
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 5px 0 0 0;">
              © ${new Date().getFullYear()} GoUnplan. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "GoUnplan <noreply@gounplan.com>",
      to: [email],
      subject: "🎉 Congratulations! Your Host Application Has Been Approved",
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send host approval email:", error);
      return {
        success: false,
        error: `Failed to send approval email: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Approval email sent successfully to ${email}`,
    };
  } catch (error) {
    console.error("Error in sendHostApprovalEmail:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending approval email",
    };
  }
}

export async function sendHostRejectionEmail(
  email: string,
  name: string
): Promise<EmailResponse> {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: #fef2f2; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 3px solid #fecaca;">
              <span style="font-size: 40px; color: #ef4444;">📋</span>
            </div>
          </div>

          <!-- Main Content -->
          <h1 style="color: #374151; text-align: center; font-size: 24px; margin-bottom: 20px;">
            Thank You for Your Interest, ${name}
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #6b7280; text-align: center; margin-bottom: 30px;">
            Host Application Status Update
          </p>

          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
              Thank you for your interest in becoming a host on <strong>GoUnplan</strong>. After careful review, we regret to inform you that we are unable to approve your host application at this time.
            </p>
          </div>

          <!-- Why Section -->
          <div style="margin: 30px 0;">
            <h3 style="color: #374151; font-size: 18px; margin-bottom: 15px;">
              Why This Happened?
            </h3>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.8; margin-bottom: 15px;">
              Our review process ensures that all hosts meet certain criteria to provide the best experience for our travelers. Some common reasons include:
            </p>
            <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li>Incomplete application information</li>
              <li>Insufficient experience or qualifications</li>
              <li>Profile doesn't align with our platform guidelines</li>
              <li>Current capacity limitations in your region</li>
            </ul>
          </div>

          <!-- Next Steps -->
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; font-size: 16px; margin: 0 0 10px 0;">
              Don't Give Up! 💪
            </h3>
            <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0;">
              You can reapply in the future after addressing the areas that need improvement. In the meantime, you can still enjoy GoUnplan as a traveler and explore amazing trips created by our host community.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/trips" 
               style="background-color: #7c3aed; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 14px; margin: 0 8px;">
              Explore Trips
            </a>
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/support" 
               style="background-color: white; color: #7c3aed; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 14px; border: 2px solid #7c3aed; margin: 0 8px;">
              Contact Support
            </a>
          </div>

          <!-- Support Section -->
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">
              <strong>Have Questions?</strong>
            </p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              If you have questions about your application or would like feedback, please don't hesitate to contact our support team at <a href="mailto:support@gounplan.com" style="color: #7c3aed; text-decoration: none;">support@gounplan.com</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Thank you for your understanding.
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 5px 0 0 0;">
              © ${new Date().getFullYear()} GoUnplan. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "GoUnplan <noreply@gounplan.com>",
      to: [email],
      subject: "Update on Your Host Application - GoUnplan",
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send host rejection email:", error);
      return {
        success: false,
        error: `Failed to send rejection email: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Rejection email sent successfully to ${email}`,
    };
  } catch (error) {
    console.error("Error in sendHostRejectionEmail:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending rejection email",
    };
  }
}

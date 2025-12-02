export function passwordResetTemplate(name: string, resetLink: string) {
  const text = `Hi ${name},

We received a request to reset your password. Click the link below to create a new password:

${resetLink}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #7c3aed; text-align: center;">Reset Your Password</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #374151;">
        Hi ${name}, we received a request to reset your password. Click the button below to create a new password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;

  return { text, html };
}

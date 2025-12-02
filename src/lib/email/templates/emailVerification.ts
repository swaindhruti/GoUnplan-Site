export function emailVerificationTemplate(name: string, verificationLink: string) {
  const text = `Hi ${name},

Thank you for signing up! Please verify your email address by clicking the link below:

${verificationLink}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #7c3aed; text-align: center;">Welcome, ${name}!</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #374151;">
        Thank you for signing up! Please verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" 
           style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        This link will expire in 24 hours.
      </p>
      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
  `;

  return { text, html };
}

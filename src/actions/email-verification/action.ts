"use server";

import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { requireAuth } from "@/lib/roleGaurd";
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail() {
  const session = await requireAuth();
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  console.log("User details:", user);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.isEmailVerified) {
    throw new Error("Email is already verified");
  }

  const verificationLink = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/verify-email`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #7c3aed; text-align: center;">Welcome, ${
        user.name || "User"
      }!</h1>
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
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: "Gounplan <onboarding@resend.dev>",
    to: [user.email],
    subject: "Verify Your Email - GoUnplan",
    html: emailHtml,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  return {
    success: true,
    message: `Verification email sent successfully ${data}`,
  };
}

export async function verifyEmail() {
  const session = await requireAuth();
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }
  if (user.isEmailVerified) {
    return {
      success: true,
      message: "Email is already verified",
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  });

  return {
    success: true,
    message: "Email verified successfully",
  };
}

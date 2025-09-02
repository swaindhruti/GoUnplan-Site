"use server";

import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import bcrypt from "bcrypt";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPasswordResetEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether user exists or not for security
      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save the reset token to the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Create the reset link
    const resetLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/auth/reset-password?token=${resetToken}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed; text-align: center;">Reset Your Password</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #374151;">
          Hi ${
            user.name || "User"
          }, we received a request to reset your password. Click the button below to create a new password:
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

    const { error } = await resend.emails.send({
      from: "Gounplan <noreply@gounplan.com>",
      to: [user.email],
      subject: "Reset Your Password - GoUnplan",
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    return {
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error("Failed to send password reset email. Please try again.");
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    if (!token) {
      throw new Error("Invalid or missing reset token.");
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    // Find user with the reset token that hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token.");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      success: true,
      message:
        "Password has been reset successfully. You can now sign in with your new password.",
    };
  } catch (error) {
    console.error("Password reset confirmation error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to reset password. Please try again."
    );
  }
}

export async function verifyResetToken(token: string) {
  try {
    if (!token) {
      throw new Error("Invalid or missing reset token.");
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token.");
    }

    return { success: true, user };
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Invalid or expired reset token."
    );
  }
}

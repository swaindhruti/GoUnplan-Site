'use server';

import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/roleGaurd';
import crypto from 'crypto';
import { sendEmailAction } from '@/actions/email/action';

export async function sendVerificationEmail() {
  const session = await requireAuth();
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }
  if (user.isEmailVerified) {
    throw new Error('Email is already verified');
  }

  // Generate a secure random token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  // Store token in database
  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationToken,
      verificationTokenExpiry,
    },
  });

  // Create magic link with token
  const verificationLink = `${
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }/verify-email?token=${verificationToken}`;

  // Send verification email using our email action
  const result = await sendEmailAction({
    to: user.email || '',
    type: 'email_verification',
    payload: {
      name: user.name || 'User',
      verificationLink,
    },
  });

  if (!result.success) {
    throw new Error(`Failed to send verification email: ${result.error}`);
  }

  return {
    success: true,
    message: 'Verification email sent successfully',
  };
}

export async function verifyEmailWithToken(token: string) {
  if (!token) {
    return {
      success: false,
      error: 'Verification token is required',
    };
  }

  try {
    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid verification token',
      };
    }

    // Check if token has expired
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      return {
        success: false,
        error: 'Verification token has expired. Please request a new verification email.',
      };
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return {
        success: true,
        message: 'Email is already verified',
        alreadyVerified: true,
      };
    }

    // Verify the email and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully!',
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      success: false,
      error: 'Failed to verify email. Please try again.',
    };
  }
}

export async function verifyEmail() {
  const session = await requireAuth();
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }
  if (user.isEmailVerified) {
    return {
      success: true,
      message: 'Email is already verified',
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  });

  return {
    success: true,
    message: 'Email verified successfully',
  };
}

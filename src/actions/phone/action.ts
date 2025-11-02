'use server';

import prisma from '@/lib/prisma';
import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

function generateOtp(length: number = 6) {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, length);
}

export async function sendOtp(phone: string) {
  try {
    const code = generateOtp(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    });

    await twilioClient.messages.create({
      body: `Your verification code is ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Failed to send OTP' };
  }
}

export async function verifyOtp(phone: string, code: string) {
  try {
    const otpRecord = await prisma.otp.findFirst({
      where: { phone, code },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return { success: false, error: 'Invalid OTP' };
    }

    if (otpRecord.expiresAt < new Date()) {
      return { success: false, error: 'OTP expired' };
    }

    await prisma.otp.delete({ where: { id: otpRecord.id } });

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Failed to verify OTP' };
  }
}

'use server';

import { auth } from '@/config/auth';
import prisma from '@/lib/prisma';

export async function testSupportServerAction() {
  try {
    // Direct auth check
    const session = await auth();

    if (!session?.user?.email) {
      return { error: 'No session', step: 'auth_check' };
    }

    // Database check
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, email: true, id: true },
    });

    if (!dbUser) {
      return { error: 'User not found in database', step: 'db_check' };
    }

    if (dbUser.role !== 'SUPPORT' && dbUser.role !== 'ADMIN') {
      return { error: 'Invalid role', role: dbUser.role, step: 'role_check' };
    }

    return {
      success: true,
      session: {
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      dbUser: {
        email: dbUser.email,
        role: dbUser.role,
        id: dbUser.id,
      },
    };
  } catch (error) {
    console.error('🧪 Server action test error:', error);
    return { error: String(error), step: 'exception' };
  }
}

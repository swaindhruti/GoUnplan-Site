import { auth } from '@/config/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import SupportDashboardClient from './SupportDashboardClient';

export default async function SupportDashboard() {
  // Get current session
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Always check role directly from database to avoid JWT cache issues
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  // Check if user has SUPPORT or ADMIN role in database
  if (!dbUser || (dbUser.role !== 'SUPPORT' && dbUser.role !== 'ADMIN')) {
    redirect('/unauthorized');
  }

  // If we reach here, the user has proper SUPPORT or ADMIN role
  return (
    <div className="mt-20">
      <SupportDashboardClient />
    </div>
  );
}

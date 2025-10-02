import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function SimpleSupportDashboard() {
  // Direct inline auth check without role guard
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Get user role from database
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, email: true, name: true },
  });

  if (!dbUser || (dbUser.role !== "SUPPORT" && dbUser.role !== "ADMIN")) {
    redirect("/unauthorized");
  }

  // Get some basic data directly here instead of using server actions
  const ticketCount = await prisma.supportTicket.count();
  const openTickets = await prisma.supportTicket.count({
    where: { status: "OPEN" },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Support Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Tickets</h3>
          <p className="text-3xl font-bold text-blue-600">{ticketCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Open Tickets</h3>
          <p className="text-3xl font-bold text-orange-600">{openTickets}</p>
        </div>
      </div>

      <div className="bg-green-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Authentication Success!</h2>
        <div className="text-sm space-y-1">
          <p>
            <strong>User:</strong> {dbUser.name} ({dbUser.email})
          </p>
          <p>
            <strong>Role:</strong> {dbUser.role}
          </p>
          <p>
            <strong>Session Role:</strong> {session.user.role}
          </p>
          <p>
            <strong>Access:</strong> ✅ Granted via direct database check
          </p>
        </div>
      </div>
    </div>
  );
}

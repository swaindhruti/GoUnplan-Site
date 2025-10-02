import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function SupportSimpleTest() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!dbUser || (dbUser.role !== "SUPPORT" && dbUser.role !== "ADMIN")) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Support Dashboard - Simple Test
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            ✅ Access Granted!
          </h2>
          <p className="text-gray-700 mb-4">
            You have successfully accessed the support dashboard. Your role (
            {dbUser.role}) allows access.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Session Info:</h3>
              <p className="text-blue-700">Email: {session.user.email}</p>
              <p className="text-blue-700">
                Name: {session.user.name || "Not set"}
              </p>
              <p className="text-blue-700">Session Role: {session.user.role}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Database Info:</h3>
              <p className="text-green-700">Database Role: {dbUser.role}</p>
              <p className="text-green-700">
                Access Level:{" "}
                {dbUser.role === "ADMIN" ? "Full Admin" : "Support Staff"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="/dashboard/support"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Full Support Dashboard
            </a>
            <a
              href="/dashboard/admin"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SupportAccessTest() {
  const session = await auth();

  // If no session, redirect to sign in
  if (!session) {
    redirect("/auth/signin");
  }

  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
      },
    });
  }

  const sessionRole = session?.user?.role;
  const dbRole = dbUser?.role;
  const hasAccess = sessionRole === "SUPPORT" || sessionRole === "ADMIN";
  const dbHasAccess = dbRole === "SUPPORT" || dbRole === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Support Access Diagnostic
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Current Session
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">
                  {session?.user?.name || "Not set"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">
                  {session?.user?.email || "Not set"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Role:</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    sessionRole === "SUPPORT"
                      ? "bg-blue-100 text-blue-800"
                      : sessionRole === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {sessionRole || "Not set"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">User ID:</span>
                <span className="ml-2 text-gray-900 text-sm">
                  {session?.user?.id || "Not set"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Database Record
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">
                  {dbUser?.name || "Not found"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">
                  {dbUser?.email || "Not found"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Role:</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    dbRole === "SUPPORT"
                      ? "bg-blue-100 text-blue-800"
                      : dbRole === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {dbRole || "Not found"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">User ID:</span>
                <span className="ml-2 text-gray-900 text-sm">
                  {dbUser?.id || "Not found"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-900 text-sm">
                  {dbUser?.createdAt
                    ? new Date(dbUser.createdAt).toLocaleDateString()
                    : "Not found"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Diagnostic Results
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <span className="font-medium">
                Session and Database roles match:
              </span>
              <span
                className={`font-bold ${
                  sessionRole === dbRole ? "text-green-600" : "text-red-600"
                }`}
              >
                {sessionRole === dbRole ? "✅ YES" : "❌ NO"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <span className="font-medium">Session has support access:</span>
              <span
                className={`font-bold ${
                  hasAccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {hasAccess ? "✅ YES" : "❌ NO"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <span className="font-medium">Database has support access:</span>
              <span
                className={`font-bold ${
                  dbHasAccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {dbHasAccess ? "✅ YES" : "❌ NO"}
              </span>
            </div>
          </div>
        </div>

        {sessionRole !== dbRole && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Role Mismatch Detected
            </h3>
            <p className="text-yellow-700 mb-4">
              Your session role ({sessionRole}) doesn&apos;t match your database
              role ({dbRole}). This means your JWT token needs to be refreshed.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-yellow-600">
                <strong>Quick Fix:</strong> Sign out and sign back in to refresh
                your session.
              </p>
              <div className="flex gap-3 mt-4">
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Sign Out Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {dbHasAccess && hasAccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ All Good!
            </h3>
            <p className="text-green-700 mb-4">
              You have proper support access. You should be able to access the
              support dashboard.
            </p>
            <a
              href="/dashboard/support"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Support Dashboard
            </a>
          </div>
        )}

        {!dbHasAccess && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ❌ No Support Access
            </h3>
            <p className="text-red-700 mb-4">
              Your database record shows role: {dbRole}. You need SUPPORT or
              ADMIN role to access the support dashboard.
            </p>
            <p className="text-sm text-red-600">
              <strong>Solution:</strong> Ask an admin to assign you the SUPPORT
              role in the admin dashboard.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Troubleshooting Steps
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              Check if you have SUPPORT or ADMIN role in the database (shown
              above)
            </li>
            <li>
              If you have the role but session doesn&apos;t match, sign out and
              back in
            </li>
            <li>If you don&apos;t have the role, ask an admin to assign it</li>
            <li>Clear browser cache/cookies if the issue persists</li>
            <li>
              Try accessing /dashboard/support after fixing the role mismatch
            </li>
          </ol>

          <div className="mt-6 flex gap-3">
            <a
              href="/dashboard/admin"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Admin Dashboard
            </a>
            <a
              href="/debug-role"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Full Debug Info
            </a>
            <a
              href="/support-access-test"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

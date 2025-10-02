import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";

export default async function SupportDirectTest() {
  const session = await auth();

  let dbUser = null;
  let error: string | null = null;

  try {
    if (session?.user?.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true, email: true, id: true, name: true },
      });
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }
  const sessionRole = session?.user?.role;
  const dbRole = dbUser?.role;
  const shouldHaveAccess = dbRole === "SUPPORT" || dbRole === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-8">
          🚨 Support Dashboard Debug
        </h1>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Current Session
            </h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                Session exists:{" "}
                <span className="font-bold">
                  {session ? "✅ YES" : "❌ NO"}
                </span>
              </div>
              <div>
                Email:{" "}
                <span className="font-bold">
                  {session?.user?.email || "None"}
                </span>
              </div>
              <div>
                Name:{" "}
                <span className="font-bold">
                  {session?.user?.name || "None"}
                </span>
              </div>
              <div>
                Role: <span className="font-bold">{sessionRole || "None"}</span>
              </div>
              <div>
                User ID:{" "}
                <span className="font-bold">{session?.user?.id || "None"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Database User
            </h2>
            {error ? (
              <div className="text-red-600 font-mono text-sm">
                <div>❌ Database Error: {error}</div>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-sm">
                <div>
                  User found:{" "}
                  <span className="font-bold">
                    {dbUser ? "✅ YES" : "❌ NO"}
                  </span>
                </div>
                <div>
                  Email:{" "}
                  <span className="font-bold">{dbUser?.email || "None"}</span>
                </div>
                <div>
                  Name:{" "}
                  <span className="font-bold">{dbUser?.name || "None"}</span>
                </div>
                <div>
                  Role: <span className="font-bold">{dbRole || "None"}</span>
                </div>
                <div>
                  User ID:{" "}
                  <span className="font-bold">{dbUser?.id || "None"}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-4">
              Access Analysis
            </h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                Session role:{" "}
                <span className="font-bold text-blue-600">
                  {sessionRole || "NONE"}
                </span>
              </div>
              <div>
                Database role:{" "}
                <span className="font-bold text-green-600">
                  {dbRole || "NONE"}
                </span>
              </div>
              <div>
                Roles match:{" "}
                <span className="font-bold">
                  {sessionRole === dbRole ? "✅ YES" : "❌ NO"}
                </span>
              </div>
              <div>
                Should have access:{" "}
                <span className="font-bold">
                  {shouldHaveAccess ? "✅ YES" : "❌ NO"}
                </span>
              </div>
              <div>
                Access logic:{" "}
                <span className="font-bold">
                  role === &apos;SUPPORT&apos; || role === &apos;ADMIN&apos;
                </span>
              </div>
            </div>
          </div>

          {shouldHaveAccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ ACCESS SHOULD BE GRANTED
              </h3>
              <p className="text-green-700 mb-4">
                Based on your database role ({dbRole}), you should have access
                to the support dashboard.
              </p>
              <div className="space-y-3">
                <div>
                  <a
                    href="/dashboard/support"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mr-3"
                  >
                    🎯 Try Support Dashboard Again
                  </a>
                  <a
                    href="/support-simple-test"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🧪 Simple Test
                  </a>
                </div>
                <div className="text-sm text-green-600">
                  <strong>If it still redirects to unauthorized:</strong> There
                  may be a caching issue or middleware problem.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ❌ ACCESS DENIED
              </h3>
              <p className="text-red-700 mb-4">
                Your current role ({dbRole || "NONE"}) does not allow access to
                the support dashboard.
              </p>
              <div className="text-sm text-red-600">
                <strong>Required:</strong> SUPPORT or ADMIN role
                <br />
                <strong>Current:</strong> {dbRole || "No role assigned"}
                <br />
                <strong>Solution:</strong> Ask an admin to assign you the
                SUPPORT role.
              </div>
              <div className="mt-4">
                <a
                  href="/dashboard/admin"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Go to Admin Dashboard
                </a>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔧 Debug Raw Data
            </h3>
            <div className="font-mono text-xs bg-gray-100 p-4 rounded overflow-auto">
              <div>
                <strong>Session:</strong>
              </div>
              <pre>{JSON.stringify(session, null, 2)}</pre>
              <div className="mt-4">
                <strong>Database User:</strong>
              </div>
              <pre>{JSON.stringify(dbUser, null, 2)}</pre>
              {error && (
                <>
                  <div className="mt-4">
                    <strong>Error:</strong>
                  </div>
                  <pre className="text-red-600">{error.toString()}</pre>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

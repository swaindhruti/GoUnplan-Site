import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";

export default async function SupportMinimalTest() {
  console.log("🔍 Starting minimal support test...");

  const session = await auth();
  console.log("Session:", session?.user);

  if (!session?.user?.email) {
    return <div className="p-8">❌ No session found</div>;
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  console.log("DB User:", dbUser);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔬 Minimal Support Test</h1>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-bold">Session Data:</h3>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <h3 className="font-bold">Database Data:</h3>
          <p>Role: {dbUser?.role || "NOT FOUND"}</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded">
          <h3 className="font-bold">Access Check:</h3>
          <p>DB Role is SUPPORT: {dbUser?.role === "SUPPORT" ? "✅" : "❌"}</p>
          <p>DB Role is ADMIN: {dbUser?.role === "ADMIN" ? "✅" : "❌"}</p>
          <p>
            Should have access:{" "}
            {dbUser?.role === "SUPPORT" || dbUser?.role === "ADMIN"
              ? "✅ YES"
              : "❌ NO"}
          </p>
        </div>

        {dbUser?.role === "SUPPORT" || dbUser?.role === "ADMIN" ? (
          <div className="p-4 bg-green-100 border border-green-300 rounded">
            <h3 className="font-bold text-green-800">✅ Access Should Work</h3>
            <p className="text-green-700">
              Based on this test, you should have access to the support
              dashboard.
            </p>
            <a
              href="/dashboard/support"
              className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🎯 Try Support Dashboard
            </a>
          </div>
        ) : (
          <div className="p-4 bg-red-100 border border-red-300 rounded">
            <h3 className="font-bold text-red-800">❌ No Access</h3>
            <p className="text-red-700">
              Your role ({dbUser?.role || "NONE"}) does not allow support
              access.
            </p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p>
            <strong>Next steps:</strong>
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>
              If access should work but doesn&apos;t, check browser console for
              errors
            </li>
            <li>
              Try the detailed debug page:{" "}
              <a
                href="/support-direct-test"
                className="text-blue-600 underline"
              >
                Support Direct Test
              </a>
            </li>
            <li>Check server logs for any database or authentication errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

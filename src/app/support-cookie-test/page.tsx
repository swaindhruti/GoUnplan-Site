import { auth } from "@/config/auth";
import { headers, cookies } from "next/headers";
import prisma from "@/lib/prisma";

export default async function SupportCookieTest() {
  // Get authentication info
  const session = await auth();

  // Get headers and cookies
  const headersList = await headers();
  const cookieStore = await cookies();

  // Get database user if session exists
  let dbUser = null;
  if (session?.user?.email) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error("Database error:", error);
    }
  }

  // Get all cookies
  const allCookies = cookieStore.getAll();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Support Access Cookie & Environment Test
      </h1>

      <div className="space-y-6">
        {/* Session Info */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Session Info</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {/* Database User */}
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Database User</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(dbUser, null, 2)}
          </pre>
        </div>

        {/* All Cookies */}
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">All Cookies</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(allCookies, null, 2)}
          </pre>
        </div>

        {/* Headers */}
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Request Headers</h2>
          <div className="text-sm space-y-1">
            <p>
              <strong>User-Agent:</strong> {headersList.get("user-agent")}
            </p>
            <p>
              <strong>Host:</strong> {headersList.get("host")}
            </p>
            <p>
              <strong>Referer:</strong> {headersList.get("referer")}
            </p>
            <p>
              <strong>X-Forwarded-For:</strong>{" "}
              {headersList.get("x-forwarded-for")}
            </p>
            <p>
              <strong>X-Real-IP:</strong> {headersList.get("x-real-ip")}
            </p>
            <p>
              <strong>Authorization:</strong> {headersList.get("authorization")}
            </p>
          </div>
        </div>

        {/* Environment */}
        <div className="bg-purple-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Environment</h2>
          <div className="text-sm space-y-1">
            <p>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
            </p>
            <p>
              <strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL}
            </p>
            <p>
              <strong>NEXTAUTH_SECRET:</strong>{" "}
              {process.env.NEXTAUTH_SECRET ? "Set" : "Not Set"}
            </p>
            <p>
              <strong>DATABASE_URL:</strong>{" "}
              {process.env.DATABASE_URL ? "Set" : "Not Set"}
            </p>
          </div>
        </div>

        {/* Role Check */}
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Role Analysis</h2>
          <div className="text-sm space-y-1">
            <p>
              <strong>Session Role:</strong> {session?.user?.role || "None"}
            </p>
            <p>
              <strong>Database Role:</strong> {dbUser?.role || "None"}
            </p>
            <p>
              <strong>Roles Match:</strong>{" "}
              {session?.user?.role === dbUser?.role ? "Yes" : "No"}
            </p>
            <p>
              <strong>Has Support Access (Session):</strong>{" "}
              {session?.user?.role === "SUPPORT" ||
              session?.user?.role === "ADMIN"
                ? "Yes"
                : "No"}
            </p>
            <p>
              <strong>Has Support Access (Database):</strong>{" "}
              {dbUser?.role === "SUPPORT" || dbUser?.role === "ADMIN"
                ? "Yes"
                : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

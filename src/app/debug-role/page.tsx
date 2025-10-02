import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";

export default async function DebugRolePage() {
  const session = await auth();

  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true, name: true },
    });
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Role Debug Information</h1>

      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold text-lg mb-2">Session Data:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold text-lg mb-2">Database User:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(dbUser, null, 2)}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold text-lg mb-2">Role Comparison:</h2>
          <p>
            Session Role:{" "}
            <span className="font-mono">
              {session?.user?.role || "undefined"}
            </span>
          </p>
          <p>
            Database Role:{" "}
            <span className="font-mono">{dbUser?.role || "undefined"}</span>
          </p>
          <p>
            Match:{" "}
            <span className="font-mono">
              {session?.user?.role === dbUser?.role ? "YES" : "NO"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

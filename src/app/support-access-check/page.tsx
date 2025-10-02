import { checkSupportAccess } from "@/lib/roleGaurd";

export default async function SupportAccessCheck() {
  const result = await checkSupportAccess();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Support Access Check (Non-Redirecting)
      </h1>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Access Check Result</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>

      <div className="mt-4 space-y-2">
        <p>
          <strong>Status:</strong>{" "}
          {result.success ? "✅ Access Granted" : "❌ Access Denied"}
        </p>
        {result.error && (
          <p>
            <strong>Error:</strong> {result.error}
          </p>
        )}
        {result.code && (
          <p>
            <strong>Code:</strong> {result.code}
          </p>
        )}
        {result.session && (
          <p>
            <strong>User Role:</strong> {result.session.user.role}
          </p>
        )}
      </div>
    </div>
  );
}

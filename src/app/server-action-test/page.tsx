"use client";

import { useState } from "react";
import { testSupportServerAction } from "@/actions/test-support-action";

export default function ServerActionTest() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const result = await testSupportServerAction();
      setResult(result);
    } catch (error) {
      setResult({ error: String(error), step: "client_error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Server Action Authorization Test
      </h1>

      <div className="space-y-4">
        <button
          onClick={handleTest}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Server Action Auth"}
        </button>

        {result && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Server Action Result</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

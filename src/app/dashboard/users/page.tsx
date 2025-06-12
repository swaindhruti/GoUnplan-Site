import { requireHost } from "@/lib/roleGaurd";

export default async function HostDashboard() {
  // This redirects users who aren't hosts or admins
  const session = await requireHost();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Host Dashboard</h1>
      <p>Welcome, {session.user.name}</p>

      {/* Host dashboard content */}
    </div>
  );
}

// import { requireHost } from "@/lib/roleGaurd";
import Link from "next/link";

export default async function HostDashboard() {
  // This redirects users who aren't hosts or admins
  // const session = await requireHost();

  return (
    <div className="container mx-auto min-h-screen flex flex-col gap-5 justify-center items-center py-8">
      <h1 className="text-3xl font-bold mb-6">Host Dashboard</h1>
      <p>Welcome,{/*  {session.user.name} */}</p>
      <div className="  bg-black py-2 px-4 text-white">
        <Link href="/dashboard/host/create-new-task">create new task</Link>
      </div>
    </div>
  );
}

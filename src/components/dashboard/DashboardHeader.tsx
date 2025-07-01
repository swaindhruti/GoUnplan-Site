import { User } from "lucide-react";
import { UserProfile } from "@/types/dashboard";

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <div className="bg-purple-600 border-black relative overflow-hidden">
      {/* Yellow accent shape */}
      <div className="absolute -left-8 -top-8 w-32 h-32 bg-yellow-300 rounded-3xl z-0"></div>

      <div className="max-w-7xl mx-auto flex justify-between px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="py-2 relative">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase">
            User Dashboard
          </h1>
          <p className="mt-2 text-white font-bold">
            Manage your profile, bookings, and travel plans
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-16 w-16 bg-green-500 border-3 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <User size={30} className="text-black" />
          </div>
          <div className="bg-yellow-300 border-3 border-black rounded-md px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xl font-black text-black">
              {profile?.name || "User"}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 right-2/4 h-10 w-10 bg-orange-500 rounded-full border-3 border-black"></div>
      <div className="absolute bottom-3 left-1/3 h-6 w-6 bg-blue-400 rounded-lg border-2 border-black"></div>
      <div className="absolute top-1/2 right-10 h-8 w-8 bg-green-400 border-2 border-black rounded-full"></div>
    </div>
  );
}

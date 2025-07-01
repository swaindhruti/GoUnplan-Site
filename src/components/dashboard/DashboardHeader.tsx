import { User } from "lucide-react";
import { UserProfile } from "@/types/dashboard";

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <div className="bg-purple-600 border-b-4 border-black">
      <div className="max-w-7xl mx-auto flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-black text-white uppercase">
            User Dashboard
          </h1>
          <p className="mt-1 text-white font-bold">
            Manage your profile, bookings, and travel plans
          </p>
        </div>
        <div className="text-2xl gap-2 flex items-center font-black text-white bg-blue-400 px-4 py-2 border-b-4 border-l-4 border-r-4 border-black rounded-b-lg">
          <div className="bg-white h-8 w-8 rounded-full border-2 border-black flex items-center justify-center">
            <User size={20} className="text-black" />
          </div>
          {profile?.name || "User"}
        </div>
      </div>
    </div>
  );
}

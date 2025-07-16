import { User } from "lucide-react";
import { UserProfile } from "@/types/dashboard";

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              User Dashboard
            </h1>
            <p className="text-xl text-slate-300 font-medium">
              Manage your profile, bookings, and travel plans
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-slate-700 p-4 rounded-2xl">
              <User size={32} className="text-slate-300" />
            </div>
            <div className="bg-slate-700 px-6 py-4 rounded-2xl">
              <span className="text-2xl font-bold text-white">
                {profile?.name || "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

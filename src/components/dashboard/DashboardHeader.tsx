import { User, Crown, TrendingUp } from "lucide-react";
import { UserProfile } from "@/types/dashboard";

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.15),transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-purple-300 text-sm font-medium tracking-wide uppercase">
                User Dashboard
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Welcome back,
              <span className="block bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                {profile?.name || "Traveler"}
              </span>
            </h1>
            <p className="text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
              Manage your profile, track your bookings, and discover amazing
              travel experiences with precision and style.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-1 rounded-2xl">
                <div className="bg-slate-800 p-4 rounded-xl">
                  <User size={32} className="text-purple-300" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                <Crown size={12} className="text-white" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-bold text-white">
                  {profile?.name || "User"}
                </span>
              </div>
              <p className="text-slate-300 text-sm font-medium">
                Premium Traveler
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

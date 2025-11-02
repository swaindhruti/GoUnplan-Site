import { User } from 'lucide-react';
import { UserProfile } from '@/types/dashboard';

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
              <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                User Dashboard
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
              Welcome back,
              <br />
              {profile?.name || 'Traveler'}
            </h1>
            <p className="text-lg text-gray-600 font-instrument mt-2">
              Manage your profile, track bookings, and explore travel experiences
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-4 rounded-full">
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

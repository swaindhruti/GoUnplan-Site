import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/dashboard";
import { User, Mail, Phone, Calendar, Crown } from "lucide-react";

interface ProfileTabProps {
  profile: UserProfile | null;
  setActiveTab: (tab: string) => void;
}

export function ProfileTab({ profile, setActiveTab }: ProfileTabProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              User Profile
            </h3>
            <p className="text-gray-600 font-medium text-lg">
              Your personal information and preferences
            </p>
          </div>
          <Button
            onClick={() => setActiveTab("settings")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Avatar Section */}
        <div className="w-full lg:w-1/3">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {profile?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                <Crown size={16} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {profile?.name}
            </h3>
            <p className="text-gray-600 mb-4 font-medium flex items-center gap-2">
              <Mail size={16} />
              {profile?.email}
            </p>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="w-full lg:w-2/3 mt-8 lg:mt-0">
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-white" />
                </div>
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail size={20} className="text-blue-600" />
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                      Email Address
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {profile?.email}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone size={20} className="text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                      Phone Number
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                About Me
              </h4>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <p className="text-gray-900 font-medium text-lg leading-relaxed">
                  {profile?.bio ||
                    "No bio information provided. Update your profile to add your bio and tell us about your travel preferences."}
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-white" />
                </div>
                Account Information
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-slate-600" />
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Member Since
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

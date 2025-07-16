import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/dashboard";

interface ProfileTabProps {
  profile: UserProfile | null;
  setActiveTab: (tab: string) => void;
}

export function ProfileTab({ profile, setActiveTab }: ProfileTabProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="bg-slate-50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              User Profile
            </h3>
            <p className="text-gray-600 font-medium">
              Your personal information
            </p>
          </div>
          <Button
            onClick={() => setActiveTab("settings")}
            className="bg-slate-700 text-white hover:bg-slate-800 font-semibold shadow-sm"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <div className="flex flex-col items-center">
            <div className="h-32 w-32 rounded-full bg-slate-700 flex items-center justify-center text-white text-4xl font-bold mb-6">
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {profile?.name}
            </h3>
            <p className="text-gray-600 mb-4 font-medium">{profile?.email}</p>
            <Badge className="bg-slate-700 text-white font-semibold px-6 py-2">
              {profile?.role || "USER"}
            </Badge>
          </div>
        </div>

        <div className="w-full lg:w-2/3 mt-8 lg:mt-0">
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </p>
                  <p className="font-semibold text-gray-900">
                    {profile?.email}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Phone Number
                  </p>
                  <p className="font-semibold text-gray-900">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">About Me</h4>
              <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-900 font-medium">
                  {profile?.bio ||
                    "No bio information provided. Update your profile to add your bio."}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Account Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Account Type
                  </p>
                  <p className="font-semibold text-gray-900">
                    {profile?.role || "User"}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Member Since
                  </p>
                  <p className="font-semibold text-gray-900">
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

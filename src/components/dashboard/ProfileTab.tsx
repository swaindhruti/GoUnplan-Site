import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/dashboard";

interface ProfileTabProps {
  profile: UserProfile | null;
  setActiveTab: (tab: string) => void;
}

export function ProfileTab({ profile, setActiveTab }: ProfileTabProps) {
  return (
    <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
      <div className="border-b-4 border-black bg-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white uppercase">
              User Profile
            </h3>
            <p className="text-sm text-white font-bold">
              Your personal information
            </p>
          </div>
          <Button
            onClick={() => setActiveTab("settings")}
            className="bg-yellow-300 text-black hover:bg-yellow-400 border-3 border-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-1/3">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black text-4xl font-black mb-4">
                {profile?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h3 className="text-2xl font-black text-black">
                {profile?.name}
              </h3>
              <p className="text-gray-700 mt-1 font-bold">{profile?.email}</p>
              <Badge className="mt-3 bg-purple-600 border-2 border-black text-white font-extrabold px-4 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {profile?.role || "USER"}
              </Badge>
            </div>
          </div>

          <div className="w-full sm:w-2/3 mt-8 sm:mt-0">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-black uppercase mb-2">
                  Contact Information
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-blue-400 rounded-lg border-3 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-sm font-bold text-black">
                      Email Address
                    </p>
                    <p className="font-extrabold text-black mt-1">
                      {profile?.email}
                    </p>
                  </div>
                  <div className="bg-green-500 rounded-lg border-3 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-sm font-bold text-black">Phone Number</p>
                    <p className="font-extrabold text-black mt-1">
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-black uppercase mb-2">
                  About Me
                </h4>
                <div className="mt-2 bg-yellow-300 rounded-lg border-3 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black font-bold">
                    {profile?.bio ||
                      "No bio information provided. Update your profile to add your bio."}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-black uppercase mb-2">
                  Account Information
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-pink-500 rounded-lg border-3 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-sm font-bold text-black">Account Type</p>
                    <p className="font-extrabold text-black mt-1">
                      {profile?.role || "User"}
                    </p>
                  </div>
                  <div className="bg-purple-400 rounded-lg border-3 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-sm font-bold text-black">Member Since</p>
                    <p className="font-extrabold text-black mt-1">
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
    </div>
  );
}

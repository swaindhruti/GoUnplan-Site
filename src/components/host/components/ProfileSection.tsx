"use client";
import { useState, useEffect } from "react";
import { getHostDetails, updateHostProfile } from "@/actions/host/action";
import { User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HostData } from "../types";

// Define proper interfaces based on the actual API response structure
interface HostDetails {
  hostId?: string;
  description?: string | null;
  image?: string | null;
  hostMobile?: string;
  createdAt?: string | Date;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface ProfileUpdateData {
  description: string;
  image: string;
  hostMobile: string;
}

type ProfileSectionProps = {
  hostData: HostData;
};

export const ProfileSection = ({ hostData }: ProfileSectionProps) => {
  const [hostDetails, setHostDetails] = useState<HostDetails | null>(null);
  const [hostLoading, setHostLoading] = useState(true);
  const [hostError, setHostError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({
    description: "",
    image: "",
    hostMobile: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch host details on component mount
  useEffect(() => {
    const fetchHostDetails = async () => {
      setHostLoading(true);
      setHostError(null);

      try {
        const response = await getHostDetails();
        if ("error" in response) {
          setHostError(response.error as string);
        } else if (response.host) {
          setHostDetails(response.host);
          // Populate form data with current values
          setFormData({
            description: response.host?.description || "",
            image: response.host?.image || "",
            hostMobile: response.host?.user?.phone || "",
          });
        }
      } catch (err) {
        console.error("Error fetching host details:", err);
        setHostError("Failed to load host profile");
      } finally {
        setHostLoading(false);
      }
    };

    fetchHostDetails();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateSuccess(false);

    try {
      const response = await updateHostProfile(formData);
      if ("error" in response) {
        setHostError(response.error as string);
      } else {
        setUpdateSuccess(true);
        // Refresh host details
        const updatedDetails = await getHostDetails();
        if (!("error" in updatedDetails) && updatedDetails.host) {
          setHostDetails(updatedDetails.host);
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setHostError("Failed to update profile");
    } finally {
      setIsSubmitting(false);
      // Reset success message after 3 seconds
      if (updateSuccess) {
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Host Profile</h2>
          <p className="mt-1 text-gray-600">
            Manage your personal information and host settings
          </p>
        </div>
      </div>

      {hostLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading profile data...</span>
        </div>
      ) : hostError ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <p className="mt-2 text-red-600 font-medium">{hostError}</p>
          </div>
        </div>
      ) : hostDetails ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Profile
              </h3>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-purple-100 mb-4 overflow-hidden">
                {hostDetails.image ? (
                  <img
                    src={hostDetails.image}
                    alt={hostData.name || "Host"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-4 text-purple-500" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {hostData.name || hostDetails.user?.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {hostData.email || hostDetails.user?.email}
              </p>
              <div className="w-full border-t border-gray-100 pt-4 mt-2">
                <p className="text-sm text-gray-500 mb-1">Host Since</p>
                <p className="font-medium text-gray-900">
                  {hostDetails.createdAt &&
                    new Date(hostDetails.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Host Information
              </h3>
            </div>
            <div className="p-6">
              {updateSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image URL
                    </label>
                    <Input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="hostMobile"
                      value={formData.hostMobile}
                      onChange={handleFormChange}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio / Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={4}
                      placeholder="Tell travelers about yourself and your expertise as a host..."
                    />
                  </div>

                  <div className="pt-3">
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{" "}
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Host Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-3">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Host Statistics
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="border border-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Profile Views</p>
                  <p className="text-2xl font-bold text-purple-700">127</p>
                </div>

                <div className="border border-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Response Rate</p>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                </div>

                <div className="border border-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-blue-600">100%</p>
                </div>

                <div className="border border-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Host Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">4.8 ★</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600">No profile data available</p>
          </div>
        </div>
      )}
    </>
  );
};

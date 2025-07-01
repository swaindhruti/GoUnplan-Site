"use client";
import { useState, useEffect } from "react";
import { getHostDetails, updateHostProfile } from "@/actions/host/action";
import {
  User,
  AlertCircle,
  Star,
  Calendar,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HostData } from "../types";
import Image from "next/image";

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
  // Use null as initial state to prevent hydration mismatches
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
  // Add this to prevent hydration mismatch during initial render
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch host details on component mount
  useEffect(() => {
    // Only run if component is mounted
    if (!isMounted) return;

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
  }, [isMounted]);

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

  // Return a loading state if not yet mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-bounce bg-yellow-300 border-3 border-black rounded-lg h-16 w-16 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
          <User className="h-8 w-8 text-black" />
        </div>
        <span className="ml-3 text-xl font-black tracking-wide">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-black uppercase tracking-wide -rotate-1">
            Host Profile
          </h2>
          <p className="mt-1 text-gray-700 font-bold text-lg tracking-wide">
            Manage your personal information and host settings
          </p>
        </div>
      </div>

      {hostLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-bounce bg-yellow-300 border-3 border-black rounded-lg h-16 w-16 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
            <User className="h-8 w-8 text-black" />
          </div>
          <span className="text-2xl font-bold text-black tracking-wide">
            Loading profile data...
          </span>
        </div>
      ) : hostError ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-3 mb-4">
              <AlertCircle className="h-10 w-10 text-black" />
            </div>
            <p className="mt-2 text-2xl font-bold text-black tracking-wide">
              {hostError}
            </p>
          </div>
        </div>
      ) : hostDetails ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] overflow-hidden">
            <div className="border-b-4 border-black bg-purple-600 px-6 py-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                Your Profile
              </h3>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-yellow-300 mb-4 overflow-hidden border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {hostDetails.image ? (
                  // Use key to force re-render when image changes
                  <Image
                    key={hostDetails.image}
                    height={112}
                    width={112}
                    src={hostDetails.image}
                    alt={hostData.name || "Host"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-4 text-black" />
                )}
              </div>
              <h3 className="text-3xl font-black text-black tracking-wide">
                {hostData.name || hostDetails.user?.name || ""}
              </h3>
              <p className="text-gray-700 mb-4 font-bold text-lg tracking-wide">
                {hostData.email || hostDetails.user?.email || ""}
              </p>
              <div className="w-full border-t-3 border-black pt-4 mt-2">
                <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">
                  Host Since
                </p>
                <p className="font-bold text-black text-xl tracking-wide">
                  {hostDetails.createdAt
                    ? new Date(hostDetails.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] overflow-hidden lg:col-span-2">
            <div className="border-b-4 border-black bg-blue-400 px-6 py-4">
              <h3 className="text-2xl font-black text-black uppercase tracking-wide">
                Edit Host Information
              </h3>
            </div>
            <div className="p-6">
              {updateSuccess && (
                <div className="mb-4 p-4 bg-green-500 text-black rounded-md border-3 border-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="text-lg tracking-wide">
                    Profile updated successfully!
                  </span>
                </div>
              )}

              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-base font-extrabold text-black mb-2 uppercase tracking-wide">
                      Profile Image URL
                    </label>
                    <Input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="https://example.com/your-image.jpg"
                      className="bg-gray-100 border-3 border-black rounded-md text-lg font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 py-3 h-auto"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-extrabold text-black mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="hostMobile"
                      value={formData.hostMobile}
                      onChange={handleFormChange}
                      placeholder="+91 9876543210"
                      className="bg-gray-100 border-3 border-black rounded-md text-lg font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 py-3 h-auto"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-extrabold text-black mb-2 uppercase tracking-wide">
                      Bio / Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={4}
                      placeholder="Tell travelers about yourself and your expertise as a host..."
                      className="bg-gray-100 border-3 border-black rounded-md text-lg font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 py-3"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="bg-green-500 text-black hover:bg-green-400 border-3 border-black text-xl font-extrabold py-6 w-full rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all tracking-wide"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>{" "}
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
          <div className="bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] overflow-hidden lg:col-span-3">
            <div className="border-b-4 border-black bg-pink-500 px-6 py-4">
              <h3 className="text-2xl font-black text-black uppercase tracking-wide">
                Host Statistics
              </h3>
            </div>
            <div className="p-8 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="border-3 border-black bg-blue-400 rounded-lg p-5 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-center mb-3">
                    <Eye className="h-7 w-7 text-black" />
                  </div>
                  <p className="text-base font-extrabold text-black mb-1 uppercase tracking-wide">
                    Profile Views
                  </p>
                  <p className="text-3xl font-black text-black tracking-wide">
                    127
                  </p>
                </div>

                <div className="border-3 border-black bg-green-500 rounded-lg p-5 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-center mb-3">
                    <CheckCircle className="h-7 w-7 text-black" />
                  </div>
                  <p className="text-base font-extrabold text-black mb-1 uppercase tracking-wide">
                    Response Rate
                  </p>
                  <p className="text-3xl font-black text-black tracking-wide">
                    98%
                  </p>
                </div>

                <div className="border-3 border-black bg-purple-400 rounded-lg p-5 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-center mb-3">
                    <Calendar className="h-7 w-7 text-black" />
                  </div>
                  <p className="text-base font-extrabold text-black mb-1 uppercase tracking-wide">
                    Completion Rate
                  </p>
                  <p className="text-3xl font-black text-black tracking-wide">
                    100%
                  </p>
                </div>

                <div className="border-3 border-black bg-yellow-300 rounded-lg p-5 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-center mb-3">
                    <Star className="h-7 w-7 text-black" fill="black" />
                  </div>
                  <p className="text-base font-extrabold text-black mb-1 uppercase tracking-wide">
                    Host Rating
                  </p>
                  <p className="text-3xl font-black text-black tracking-wide">
                    4.8 ★
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] p-12">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-blue-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
              <User className="h-12 w-12 text-black" />
            </div>
            <p className="mt-2 text-2xl font-bold text-black tracking-wide">
              No profile data available
            </p>
          </div>
        </div>
      )}
    </>
  );
};

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Calendar,
  AlertCircle,
  CheckCircle,
  Crown,
  UserCog,
  Edit,
  Camera,
  Send,
  Save,
  User,
  Mail,
  Phone,
  Activity,
  Briefcase,
  Globe,
  X,
} from "lucide-react";
import { sendVerificationEmail } from "@/actions/email-verification/action";
import { getUserProfile, updateUserProfile } from "@/actions/user/action";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    bio: string | null;
    image: string | null;
    isEmailVerified: boolean;
    createdAt: Date;
    bookingCounts: {
      total: number;
      pending: number;
      confirmed: number;
      cancelled: number;
      completed: number;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    bio: "",
  });

  const fetchUserProfile = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      const result = await getUserProfile(session.user.email);
      if (result.user) {
        setProfile(result.user);
        setEditForm({
          name: result.user.name || "",
          phone: result.user.phone || "",
          bio: result.user.bio || "",
        });
      }
    } catch {
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserProfile();
    }
  }, [session?.user?.email, fetchUserProfile]);

  const handleSendVerificationEmail = async () => {
    setIsSendingVerification(true);
    try {
      const result = await sendVerificationEmail();
      if (result.success) {
        toast.success("Verification email sent! Check your inbox.");
      }
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!session?.user?.email) return;

    setIsUpdating(true);
    try {
      const result = await updateUserProfile(session.user.email, {
        name: editForm.name,
        phone: editForm.phone || undefined,
        bio: editForm.bio || undefined,
        image: imagePreview || undefined,
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsEditMode(false);
        fetchUserProfile();
        setImagePreview(null);
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setImagePreview(null);
    if (profile) {
      setEditForm({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      case "HOST":
        return <Crown className="h-4 w-4" />;
      default:
        return <UserCog className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "HOST":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-instrument">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-instrument">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header Section - Admin Dashboard Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  User Profile
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                {isEditMode ? "Edit Profile" : `Welcome, ${profile.name}`}
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                {isEditMode
                  ? "Update your personal information"
                  : "Manage your account information"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!isEditMode && (
                <Button
                  onClick={() => setIsEditMode(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-instrument"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              <div className="bg-purple-50 p-4 rounded-full">
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {isEditMode ? (
            // Edit Mode
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-bricolage">
                    Edit Profile
                  </h3>
                  <p className="text-gray-600 font-instrument mt-1">
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Image Section */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 font-bricolage">
                      Profile Picture
                    </h4>
                    <div className="space-y-4">
                      <div className="relative mx-auto w-32 h-32">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                          {imagePreview || profile.image ? (
                            <Image
                              src={
                                imagePreview ||
                                profile.image ||
                                "/default-avatar.png"
                              }
                              alt="Profile"
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                              <User className="h-16 w-16 text-purple-600" />
                            </div>
                          )}
                        </div>
                        <Label
                          htmlFor="image-upload"
                          className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-purple-700 transition-colors"
                        >
                          <Camera className="h-5 w-5" />
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 text-center font-instrument">
                        Click the camera icon to upload a new photo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="h-12 rounded-xl bg-gray-50 border-gray-300"
                      />
                      <Badge
                        variant={
                          profile.isEmailVerified ? "default" : "secondary"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {profile.isEmailVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px] rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="font-instrument"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-instrument"
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info Card */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-lg overflow-hidden">
                        {profile.image ? (
                          <Image
                            src={profile.image}
                            alt={profile.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                            <span className="text-3xl font-bold text-purple-600 font-bricolage">
                              {profile.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-gray-900 font-bricolage">
                          {profile.name}
                        </h2>
                        <Badge className={`mt-2 ${getRoleColor(profile.role)}`}>
                          {getRoleIcon(profile.role)}
                          <span className="ml-1 font-instrument">
                            {profile.role}
                          </span>
                        </Badge>
                      </div>

                      {profile.bio && (
                        <p className="text-sm text-gray-600 font-instrument">
                          {profile.bio}
                        </p>
                      )}

                      <div className="pt-4 border-t border-purple-200 text-sm text-gray-600 font-instrument">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Member since{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Statistics */}
                  <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 font-bricolage mb-4">
                      Booking Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-instrument">
                          Total Bookings
                        </span>
                        <span className="font-semibold text-gray-900">
                          {profile.bookingCounts?.total || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-instrument">
                          Completed
                        </span>
                        <span className="font-semibold text-green-600">
                          {profile.bookingCounts?.completed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-instrument">
                          Confirmed
                        </span>
                        <span className="font-semibold text-blue-600">
                          {profile.bookingCounts?.confirmed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-instrument">
                          Pending
                        </span>
                        <span className="font-semibold text-yellow-600">
                          {profile.bookingCounts?.pending || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-instrument">
                          Cancelled
                        </span>
                        <span className="font-semibold text-red-600">
                          {profile.bookingCounts?.cancelled || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information and Actions */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 font-bricolage mb-6">
                      Contact Information
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-lg">
                          <Mail className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 font-instrument">
                            Email
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900 font-medium">
                              {profile.email}
                            </p>
                            {profile.isEmailVerified && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        {!profile.isEmailVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSendVerificationEmail}
                            disabled={isSendingVerification}
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            <Send className="h-3 w-3 mr-2" />
                            {isSendingVerification ? "Sending..." : "Verify"}
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-lg">
                          <Phone className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 font-instrument">
                            Phone
                          </p>
                          <p className="text-gray-900 font-medium">
                            {profile.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!profile.isEmailVerified && (
                      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-900">
                              Email verification required
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                              Verify your email to access all features and
                              secure your account.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 font-bricolage mb-6">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-20 p-4 border-gray-300 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
                        onClick={() => router.push("/my-trips")}
                      >
                        <Briefcase className="h-6 w-6 mb-2 text-purple-600 group-hover:text-purple-700" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                          View My Trips
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-20 p-4 border-gray-300 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
                        onClick={() => router.push("/trips")}
                      >
                        <Globe className="h-6 w-6 mb-2 text-purple-600 group-hover:text-purple-700" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                          Browse Trips
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-20 p-4 border-gray-300 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
                        onClick={() => router.push("/dashboard/user")}
                      >
                        <Activity className="h-6 w-6 mb-2 text-purple-600 group-hover:text-purple-700" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                          View Dashboard
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

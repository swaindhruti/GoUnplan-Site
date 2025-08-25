"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Calendar,
  AlertCircle,
  CheckCircle,
  Crown,
  UserCog,
  Edit,
  Camera,
  ArrowLeft,
  Send,
  Save,
  User,
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
        setIsEditDialogOpen(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your personal information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                        {imagePreview || profile.image ? (
                          <Image
                            src={
                              imagePreview ||
                              profile.image ||
                              "/default-avatar.png"
                            }
                            alt="Profile"
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                            <User className="h-12 w-12 text-purple-600" />
                          </div>
                        )}
                      </div>
                      <Label
                        htmlFor="image-upload"
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Camera className="h-4 w-4 text-gray-600" />
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </Label>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      placeholder="+1234567890"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="bg-purple-600 hover:bg-purple-700"
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
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {profile.image ? (
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        width={96}
                        height={96}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-gray-600">
                        {profile.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {profile.name}
                    </h2>
                    <Badge variant="secondary" className="mt-2">
                      {getRoleIcon(profile.role)}
                      <span className="ml-1">{profile.role}</span>
                    </Badge>
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-gray-600 mt-4">{profile.bio}</p>
                  )}

                  <div className="pt-4 border-t text-sm text-gray-500">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="bg-white">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h3>

                {/* Email Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.email}
                      </p>
                    </div>
                    <Badge
                      variant={
                        profile.isEmailVerified ? "default" : "secondary"
                      }
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

                  {/* Email Verification */}
                  {!profile.isEmailVerified && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-900">
                            Email verification required
                          </p>
                          <p className="text-sm text-amber-700 mt-1">
                            Verify your email to access all features.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSendVerificationEmail}
                            disabled={isSendingVerification}
                            className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            <Send className="h-3 w-3 mr-2" />
                            {isSendingVerification
                              ? "Sending..."
                              : "Send Verification Email"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Section */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Booking Statistics */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Booking Statistics
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {profile.bookingCounts?.total || 0}
                    </p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>

                  <div>
                    <p className="text-2xl font-semibold text-yellow-600">
                      {profile.bookingCounts?.pending || 0}
                    </p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>

                  <div>
                    <p className="text-2xl font-semibold text-green-600">
                      {profile.bookingCounts?.confirmed || 0}
                    </p>
                    <p className="text-xs text-gray-500">Confirmed</p>
                  </div>

                  <div>
                    <p className="text-2xl font-semibold text-blue-600">
                      {profile.bookingCounts?.completed || 0}
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>

                  <div>
                    <p className="text-2xl font-semibold text-red-600">
                      {profile.bookingCounts?.cancelled || 0}
                    </p>
                    <p className="text-xs text-gray-500">Cancelled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

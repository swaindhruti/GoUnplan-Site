import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types/dashboard";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { updateUserProfile } from "@/actions/user/action";
import { sendVerificationEmail } from "@/actions/email-verification/action";

interface ProfileTabProps {
  profile: UserProfile | null;
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
}

export function ProfileTab({ profile, onProfileUpdate }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setSaving] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      email: profile?.email || "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      email: profile?.email || "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!profile?.email) return;
    setSaving(true);
    setError(null);

    try {
      const result = await updateUserProfile(profile.email, {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        newEmail: formData.email !== profile.email ? formData.email : undefined,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.success && result.user) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);

        // Update the profile data
        const updatedProfile = {
          ...profile,
          name: result.user.name,
          phone: result.user.phone,
          bio: result.user.bio,
          email: result.user.email,
        };

        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingVerification(true);
    setVerificationMessage(null);

    try {
      const result = await sendVerificationEmail();
      if (result.success) {
        setVerificationMessage(
          "Verification email sent successfully! Please check your inbox."
        );
        setTimeout(() => setVerificationMessage(null), 5000);
      }
    } catch {
      setVerificationMessage(
        "Failed to send verification email. Please try again."
      );
      setTimeout(() => setVerificationMessage(null), 5000);
    } finally {
      setIsSendingVerification(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 font-bricolage">
            User Profile
          </h3>
          <p className="text-gray-600 font-instrument mt-1">
            Your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-instrument">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 font-instrument">
          {success}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Avatar Section */}
        <div className="w-full lg:w-1/3">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <div className="h-32 w-32 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-4xl font-bold">
                {(isEditing ? formData.name : profile?.name)
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>
            </div>
            {isEditing ? (
              <div className="w-full max-w-sm space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-instrument">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="font-instrument"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-instrument">
                    Email
                  </label>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="font-instrument"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-bricolage">
                  {profile?.name}
                </h3>
                <p className="text-gray-600 mb-4 font-instrument flex items-center gap-2">
                  <Mail size={16} />
                  {profile?.email}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="w-full lg:w-2/3 mt-8 lg:mt-0">
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 font-bricolage">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Mail size={16} className="text-blue-600" />
                </div>
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Mail size={16} className="text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 font-instrument">
                      Email Address
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 font-instrument">
                    {isEditing ? formData.email : profile?.email}
                  </p>

                  {/* Email Verification Status */}
                  {!isEditing && (
                    <div className="mt-4">
                      {profile?.isEmailVerified ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-instrument">
                            Email verified
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-amber-600">
                            <AlertCircle size={16} />
                            <span className="text-sm font-instrument">
                              Email not verified
                            </span>
                          </div>
                          <Button
                            onClick={handleSendVerificationEmail}
                            disabled={isSendingVerification}
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white font-instrument text-sm"
                          >
                            {isSendingVerification
                              ? "Sending..."
                              : "Send Verification Email"}
                          </Button>
                          {verificationMessage && (
                            <p
                              className={`text-sm font-instrument mt-2 ${
                                verificationMessage.includes("successfully")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {verificationMessage}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 font-instrument">
                      Phone Number
                    </p>
                  </div>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="font-instrument mt-2"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900 font-instrument">
                      {profile?.phone || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* About Me */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 font-bricolage">
                <div className="p-2 bg-purple-50 rounded-full">
                  <User size={16} className="text-purple-600" />
                </div>
                About Me
              </h4>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-instrument">
                      Bio
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="font-instrument min-h-[120px]"
                      placeholder="Tell us about yourself and your travel preferences..."
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-instrument leading-relaxed">
                    {profile?.bio ||
                      "No bio information provided. Click edit to add your bio and tell us about your travel preferences."}
                  </p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 font-bricolage">
                <div className="p-2 bg-gray-50 rounded-full">
                  <Calendar size={16} className="text-gray-600" />
                </div>
                Account Information
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-50 rounded-full">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 font-instrument">
                      Member Since
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 font-instrument">
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

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Mail,
  Loader2,
  ArrowLeft,
  User,
  Phone,
} from "lucide-react";
import { verifyEmail } from "@/actions/email-verification/action";
import { getUserProfile } from "@/actions/user/action";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserProfile();
    }
  });

  const fetchUserProfile = async () => {
    if (!session?.user?.email) return;

    try {
      const result = await getUserProfile(session.user.email);
      if (result.user) {
        setUserProfile(result.user);
        setIsVerified(result.user.isEmailVerified || false);
      }
    } catch {
      toast.error("Failed to fetch user profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyEmail();
      if (result.success) {
        setIsVerified(true);
        toast.success(result.message);
        // Redirect to profile page after successful verification
        setTimeout(() => {
          router.push("/profile");
        }, 2000); // 2 second delay to show success message
      }
    } catch {
      toast.error("Failed to verify email");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoToProfile = () => {
    router.push("/profile");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-white/50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
          {/* Header with Gradient Background */}
          <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 px-8 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white font-bricolage mb-2">
                Email Verification
              </h1>
              <p className="text-purple-100 font-instrument">
                Secure your account with email verification
              </p>
            </div>
          </div>
          <CardContent className="p-0">
            {/* User Details Section */}
            {userProfile && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-8 border-b border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center shadow-md">
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-bricolage">
                        {userProfile.name}
                      </h3>
                      <p className="text-gray-600 font-instrument flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4" />
                        {userProfile.email}
                        <Badge
                          className={
                            userProfile.isEmailVerified
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }
                        >
                          {userProfile.isEmailVerified
                            ? "Verified"
                            : "Unverified"}
                        </Badge>
                      </p>
                    </div>
                    {userProfile.phone && (
                      <p className="text-gray-600 font-instrument flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {userProfile.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-8 space-y-8">
              {!isVerified ? (
                <>
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900 font-bricolage">
                        Verify Your Email
                      </h2>
                      <p className="text-gray-600 font-instrument text-lg">
                        Complete your account setup by verifying your email
                        address
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 justify-center text-amber-700">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="font-medium font-instrument">
                          Email verification required
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleVerifyEmail}
                      disabled={isVerifying}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-14 px-12 font-instrument shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      size="lg"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                          Verifying Email...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-3" />
                          Verify My Email
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : userProfile?.isEmailVerified ? (
                <>
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-green-900 font-bricolage">
                        Email Already Verified!
                      </h2>
                      <p className="text-gray-600 font-instrument text-lg">
                        Your email is already verified. You have access to all
                        features.
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 justify-center text-green-700">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <span className="font-medium font-instrument">
                          Email verification completed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      disabled={true}
                      className="w-full bg-gray-300 text-gray-500 h-12 font-instrument cursor-not-allowed shadow-sm"
                      size="lg"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Email Already Verified
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={handleGoToProfile}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 font-instrument shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        Go to Profile
                      </Button>
                      <Button
                        onClick={handleGoHome}
                        variant="outline"
                        className="h-12 font-instrument border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                        size="lg"
                      >
                        Go Home
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-green-900 font-bricolage">
                        Email Verified Successfully!
                      </h2>
                      <p className="text-gray-600 font-instrument text-lg">
                        Your email has been verified. You now have access to all
                        features.
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 justify-center text-green-700">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <span className="font-medium font-instrument">
                          Email successfully verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleGoToProfile}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 font-instrument shadow-lg hover:shadow-xl transition-all duration-200"
                      size="lg"
                    >
                      Go to Profile
                    </Button>
                    <Button
                      onClick={handleGoHome}
                      variant="outline"
                      className="h-12 font-instrument border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                      size="lg"
                    >
                      Go Home
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        {!isVerified && (
          <div className="mt-8 text-center">
            <div className="bg-white/50 backdrop-blur rounded-xl p-6 border border-white/20 shadow-sm">
              <p className="text-gray-600 font-instrument">
                Having trouble? You can also verify your email from your{" "}
                <button
                  onClick={handleGoToProfile}
                  className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-300 hover:decoration-purple-500 transition-colors duration-200"
                >
                  profile page
                </button>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useCallback, useState } from "react";
import {
  Home,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Clock,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { applyForHost, hasAppliedForHost } from "@/actions/user/action";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Link from "next/link";

export const HostRegistration = ({ userEmail }: { userEmail: string }) => {
  const router = useRouter();

  const [step, setStep] = useState(1); // Step 1: Info page, Step 2: Application form
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [formData, setFormData] = useState({
    description: "",
    hostEmail: userEmail,
    hostMobile: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
  });

  const [state, setState] = useState({
    isRegistering: false,
    successMessage: null as string | null,
    errorMessage: null as string | null,
  });

  // Check if user has already applied to be a host
  useEffect(() => {
    const checkHostApplicationStatus = async () => {
      if (userEmail === "no session") {
        router.push("/auth/signin");
        return;
      }

      try {
        setIsChecking(true);
        const result = await hasAppliedForHost(userEmail);

        if (result.success && result.hasApplied) {
          setAlreadyApplied(true);
        }
      } catch (error) {
        console.error("Error checking host application status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkHostApplicationStatus();

    // Update the email in formData when userEmail changes
    setFormData((prev) => ({
      ...prev,
      hostEmail: userEmail,
    }));
  }, [userEmail, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRegistering: true,
    }));

    try {
      // Pass the full host profile data to the applyForHost function
      const register = await applyForHost(userEmail, formData);

      if (register.success) {
        setState((prev) => ({
          ...prev,
          successMessage: "Successfully submitted your host application!",
        }));
        console.log("Request success:", register.user);

        // Wait 2 seconds before refreshing to show success message
        setTimeout(() => {
          router.refresh();
          router.push("/dashboard/user");
        }, 2000);
      } else {
        setState((prev) => ({
          ...prev,
          errorMessage: "Failed to submit host application.",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errorMessage: "Something went wrong. Please try again.",
      }));
      console.error(error);
    } finally {
      setState((prev) => ({ ...prev, isRegistering: false }));
    }
  }, [userEmail, formData, router]);

  // Show loading state while checking application status
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-2xl font-bold text-purple-700">
              Unplan
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/user">
                <Button
                  variant="outline"
                  className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full inline-block mb-4"></div>
            <p className="text-gray-600">Checking application status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/user">
              <Button
                variant="outline"
                className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Home className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="p-8">
            {alreadyApplied ? (
              // Application Already Submitted View
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Application{" "}
                  <span className="text-purple-700">Under Review</span>
                </h1>

                <div className="mx-auto h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center mb-8">
                  <Clock className="h-12 w-12 text-amber-600" />
                </div>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Your application to become a host is currently being reviewed
                  by our team. We&apos;ll notify you by email once your
                  application is approved.
                </p>

                <div className="bg-amber-50 rounded-lg p-6 max-w-lg mx-auto mb-8 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-left text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mr-2 mt-1" />
                      <span>
                        Our team will review your application within 1-3
                        business days
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mr-2 mt-1" />
                      <span>
                        You&apos;ll receive an email notification once approved
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mr-2 mt-1" />
                      <span>
                        After approval, you&apos;ll have access to host features
                      </span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => router.push("/dashboard/user")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  Return to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            ) : step === 1 ? (
              // Step 1: Initial Info Page
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Want to be a <span className="text-purple-700">Host?</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of hosts who share their unique spaces and
                  create unforgettable experiences for travelers around the
                  world.
                </p>

                <div className="bg-gray-50 rounded-lg p-8 max-w-lg mx-auto mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Benefits of being a host
                  </h3>
                  <ul className="text-left text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                      <span>Share your local knowledge and experiences</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                      <span>Earn money by creating unique travel plans</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                      <span>Connect with travelers from around the world</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                      <span>Flexibility to manage your own schedule</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  Apply to be a Host
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-sm text-gray-500 mt-6">
                  Already a host?{" "}
                  <button
                    className="text-purple-600 font-medium hover:underline"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            ) : (
              // Step 2: Application Form
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  Complete Your Host Profile
                </h2>

                <p className="text-gray-600 mb-8 text-center">
                  Tell us more about yourself and your experience as a potential
                  host.
                </p>

                {state.successMessage && (
                  <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{state.successMessage}</AlertDescription>
                  </Alert>
                )}

                {state.errorMessage && (
                  <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      Host Bio/Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell travelers about yourself, your experience, and what makes your travel plans special..."
                      className="h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      A good description helps travelers trust you as a host
                      (minimum 100 characters).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="hostEmail"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      Contact Email
                    </label>
                    <Input
                      type="email"
                      id="hostEmail"
                      name="hostEmail"
                      value={formData.hostEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your contact email"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      disabled
                    />
                    <p className="text-xs text-gray-500">
                      This is your account email. Travelers will contact you
                      through this email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="hostMobile"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      Contact Phone
                    </label>
                    <Input
                      type="tel"
                      id="hostMobile"
                      name="hostMobile"
                      value={formData.hostMobile}
                      onChange={handleInputChange}
                      placeholder="Enter your contact phone number"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="instagramUrl"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Instagram className="h-4 w-4 text-gray-500 mr-2" />
                      Instagram URL
                    </label>
                    <Input
                      type="url"
                      id="instagramUrl"
                      name="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={handleInputChange}
                      placeholder="Enter your Instagram profile URL"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="twitterUrl"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Twitter className="h-4 w-4 text-gray-500 mr-2" />
                      Twitter URL
                    </label>
                    <Input
                      type="url"
                      id="twitterUrl"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleInputChange}
                      placeholder="Enter your Twitter profile URL"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="linkedinUrl"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Linkedin className="h-4 w-4 text-gray-500 mr-2" />
                      LinkedIn URL
                    </label>
                    <Input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="Enter your LinkedIn profile URL"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="websiteUrl"
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      Website URL
                    </label>
                    <Input
                      type="url"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="Enter your personal website or blog URL"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Before you submit:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <span>
                          Your application will be reviewed by our team
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <span>
                          You&apos;ll receive an email when your application is
                          approved
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <span>
                          After approval, you can start creating travel plans
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleRegister}
                      disabled={
                        state.isRegistering ||
                        !formData.description ||
                        !formData.hostMobile
                      }
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      {state.isRegistering
                        ? "Submitting..."
                        : "Submit Application"}
                      {!state.isRegistering && (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-center items-center gap-2 text-gray-500">
              <div className="w-12 h-px bg-gray-300" />
              <span className="text-sm">
                Trusted by 50,000+ hosts worldwide
              </span>
              <div className="w-12 h-px bg-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Unplan. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

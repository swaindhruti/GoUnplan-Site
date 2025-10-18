"use client";

import React, { useEffect, useCallback, useState } from "react";
import {
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
  Compass,
  Crown,
  Languages,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { applyForHost, hasAppliedForHost } from "@/actions/user/action";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Link from "next/link";

// Common languages list
const COMMON_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Czech",
  "Hungarian",
  "Greek",
  "Turkish",
  "Hebrew",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Tagalog",
  "Swahili",
];

export const HostRegistration = ({ userEmail }: { userEmail: string }) => {
  const router = useRouter();

  const [step, setStep] = useState(1); // Step 1: Info page, Step 2: Application form
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [formData, setFormData] = useState({
    description: "",
    hostEmail: userEmail,
    hostMobile: "",
    languages: [] as string[],
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

  const handleLanguageAdd = (language: string) => {
    if (!formData.languages.includes(language)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, language],
      }));
    }
  };

  const handleLanguageRemove = (languageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== languageToRemove),
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
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center gap-2">
                <Compass className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900 font-bricolage">
                  GoUnplan
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/dashboard/user">
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 font-instrument"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full inline-block mb-4"></div>
            <p className="text-gray-600 font-instrument">
              Checking application status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 mt-16">
      {/* Main Content */}
      <div className="flex flex-1 min-h-0 mt-4">
        {/* Form - Full Width */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {alreadyApplied ? (
                // Application Already Submitted View
                <div className="w-full">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Application Under Review
                      </h1>
                      <p className="text-gray-600 font-instrument mt-2">
                        Your host application is being reviewed by our team
                      </p>
                    </div>

                    <div className="text-center py-8">
                      <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-amber-600" />
                      </div>
                      <p className="text-gray-600 font-instrument mb-6">
                        We&apos;ll notify you by email once your application is
                        approved.
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h3 className="text-sm font-semibold text-amber-800 mb-2 font-instrument">
                        What happens next?
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="font-instrument">
                            Review within 1-3 business days
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="font-instrument">
                            Email notification once approved
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="font-instrument">
                            Access to host features after approval
                          </span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => router.push("/dashboard/user")}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <span>Return to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                  </div>
                </div>
              ) : step === 1 ? (
                // Step 1: Initial Info Page
                <div className="w-full">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Want to be a Host?
                      </h1>
                      <p className="text-gray-600 font-instrument mt-2">
                        Join thousands of hosts creating unforgettable
                        experiences
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 font-bricolage">
                        Benefits of being a host
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 font-instrument">
                            Share your local knowledge and experiences
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 font-instrument">
                            Earn money by creating unique travel plans
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 font-instrument">
                            Connect with travelers from around the world
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 font-instrument">
                            Flexibility to manage your own schedule
                          </span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => setStep(2)}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        <span>Apply to be a Host</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-instrument">
                        Already a host?{" "}
                        <button
                          className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                          onClick={() => router.push("/auth/signin")}
                        >
                          Sign in here
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Step 2: Application Form
                <div className="w-full">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Complete Your Host Profile
                      </h2>
                      <p className="text-gray-600 font-instrument mt-2">
                        Tell us more about yourself and your experience
                      </p>
                    </div>

                    {state.successMessage && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 font-instrument">
                          {state.successMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    {state.errorMessage && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 font-instrument">
                          {state.errorMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 font-instrument flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          Host Bio/Description
                        </label>
                        <div className="mt-1">
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Tell travelers about yourself, your experience, and what makes your travel plans special..."
                            className="h-24 resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 font-instrument mt-1">
                          A good description helps travelers trust you as a host
                          (minimum 100 characters).
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 font-instrument">
                            Contact Email
                          </label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              id="hostEmail"
                              name="hostEmail"
                              value={formData.hostEmail}
                              onChange={handleInputChange}
                              placeholder="your.email@example.com"
                              className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                              required
                              disabled
                            />
                          </div>
                          <p className="text-xs text-gray-500 font-instrument mt-1">
                            Your account email
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 font-instrument">
                            Contact Phone
                          </label>
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="tel"
                              id="hostMobile"
                              name="hostMobile"
                              value={formData.hostMobile}
                              onChange={handleInputChange}
                              placeholder="+1234567890"
                              className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Languages Section */}
                      <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-700 font-instrument">
                          Languages You Speak
                        </label>
                        <div className="mt-2">
                          {/* Selected Languages */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {formData.languages.map((language) => (
                              <span
                                key={language}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-instrument"
                              >
                                {language}
                                <button
                                  type="button"
                                  onClick={() => handleLanguageRemove(language)}
                                  className="hover:bg-purple-200 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>

                          {/* Language Selection Dropdown */}
                          <div className="relative">
                            <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                              className="w-full pl-10 pr-4 py-2 h-11 border border-gray-200 rounded-md focus:border-purple-400 focus:ring-purple-100 bg-white font-instrument"
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleLanguageAdd(e.target.value);
                                  e.target.value = ""; // Reset selection
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Select a language to add...
                              </option>
                              {COMMON_LANGUAGES.filter(
                                (lang) => !formData.languages.includes(lang)
                              ).map((language) => (
                                <option key={language} value={language}>
                                  {language}
                                </option>
                              ))}
                            </select>
                          </div>
                          <p className="text-xs text-gray-500 font-instrument mt-1">
                            Select languages you can communicate with guests in
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 font-instrument">
                            Instagram URL (optional)
                          </label>
                          <div className="relative mt-1">
                            <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="url"
                              id="instagramUrl"
                              name="instagramUrl"
                              value={formData.instagramUrl}
                              onChange={handleInputChange}
                              placeholder="https://instagram.com/yourusername"
                              className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 font-instrument">
                            Twitter URL (optional)
                          </label>
                          <div className="relative mt-1">
                            <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="url"
                              id="twitterUrl"
                              name="twitterUrl"
                              value={formData.twitterUrl}
                              onChange={handleInputChange}
                              placeholder="https://twitter.com/yourusername"
                              className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 font-instrument">
                            LinkedIn URL (optional)
                          </label>
                          <div className="relative mt-1">
                            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="url"
                              id="linkedinUrl"
                              name="linkedinUrl"
                              value={formData.linkedinUrl}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/in/yourusername"
                              className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 font-instrument">
                            Website URL (optional)
                          </label>
                          <div className="relative mt-1">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="url"
                              id="websiteUrl"
                              name="websiteUrl"
                              value={formData.websiteUrl}
                              onChange={handleInputChange}
                              placeholder="https://yourwebsite.com"
                              className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2 font-instrument">
                          Before you submit:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="font-instrument">
                              Your application will be reviewed by our team
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="font-instrument">
                              You&apos;ll receive an email when approved
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="font-instrument">
                              After approval, you can start creating travel
                              plans
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          onClick={() => setStep(1)}
                          variant="outline"
                          className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-instrument"
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
                          className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {state.isRegistering ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4" />
                              <span>Submit Application</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

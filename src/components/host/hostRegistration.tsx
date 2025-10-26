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
  MapPin,
  Calendar,
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

// Months for hosting
const HOSTING_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const HostRegistration = ({ userEmail }: { userEmail: string }) => {
  const router = useRouter();

  // Multi-step form: 1 = Info page, 2 = Basic Info, 3 = Location Info, 4 = Languages, 5 = Social Media, 6 = Review
  const [step, setStep] = useState(1);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [formData, setFormData] = useState({
    description: "",
    hostEmail: userEmail,
    hostMobile: "",
    hostCity: "",
    plannedHostingMonths: [] as string[],
    plannedHostingLocation: "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const handleMonthAdd = (month: string) => {
    if (!formData.plannedHostingMonths.includes(month)) {
      setFormData((prev) => ({
        ...prev,
        plannedHostingMonths: [...prev.plannedHostingMonths, month],
      }));
    }
  };

  const handleMonthRemove = (monthToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      plannedHostingMonths: prev.plannedHostingMonths.filter(
        (month) => month !== monthToRemove
      ),
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

        // Move to a success confirmation step instead of redirecting
        setStep(7);
      } else {
        setState((prev) => ({
          ...prev,
          errorMessage: register.error || "Failed to submit host application.",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      }));
      console.error(error);
    } finally {
      setState((prev) => ({ ...prev, isRegistering: false }));
    }
  }, [userEmail, formData]);

  // Validation for each step
  const canProceedFromStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 2: // Basic Information
        return (
          formData.description.length >= 100 &&
          formData.hostEmail.length > 0 &&
          formData.hostMobile.length > 0
        );
      case 3: // Location Information
        return (
          formData.hostCity.length > 0 &&
          formData.plannedHostingMonths.length > 0 &&
          formData.plannedHostingLocation.length > 0
        );
      case 4: // Languages
        return formData.languages.length > 0;
      case 5: // Social Media (optional, can always proceed)
        return true;
      default:
        return true;
    }
  };

  // Progress indicator component
  const StepProgress = () => {
    const steps = [
      { num: 2, label: "Basic Info" },
      { num: 3, label: "Location" },
      { num: 4, label: "Languages" },
      { num: 5, label: "Social Media" },
      { num: 6, label: "Review" },
    ];

    if (step === 1) return null; // Don't show on info page

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= s.num
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.num ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    s.num - 1
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-instrument font-medium ${
                    step >= s.num ? "text-purple-600" : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                    step > s.num
                      ? "bg-gradient-to-r from-purple-600 to-blue-600"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

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
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-26">
          <div className={`w-full ${step === 6 ? "max-w-6xl" : "max-w-4xl"}`}>
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
                      onClick={() => router.push("/")}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <span>Go to Homepage</span>
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
              ) : step === 2 ? (
                // Step 2: Basic Information
                <div className="w-full">
                  <StepProgress />
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Basic Information
                      </h2>
                      <p className="text-gray-600 font-instrument mt-2">
                        Tell us about yourself and your experience
                      </p>
                    </div>

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
                            className="h-32 resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 font-instrument mt-1">
                          A good description helps travelers trust you as a host
                          (minimum 100 characters).{" "}
                          {formData.description.length}/100
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
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <Button
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-instrument"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!canProceedFromStep(2)}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-2">
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : step === 3 ? (
                // Step 3: Location Information
                <div className="w-full">
                  <StepProgress />
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Location Information
                      </h2>
                      <p className="text-gray-600 font-instrument mt-2">
                        Tell us about your location and hosting plans
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 font-instrument flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          Which city do you belong to?
                        </label>
                        <div className="mt-1">
                          <Input
                            type="text"
                            id="hostCity"
                            name="hostCity"
                            value={formData.hostCity}
                            onChange={handleInputChange}
                            placeholder="e.g., New York, London, Tokyo"
                            className="h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 font-instrument mt-1">
                          Your home city or base location
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 font-instrument flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          When do you plan to host trips?
                        </label>

                        {/* Selected Months */}
                        <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2 mb-3">
                          {formData.plannedHostingMonths.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {formData.plannedHostingMonths.map((month) => (
                                <span
                                  key={month}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-full font-instrument"
                                >
                                  {month}
                                  <button
                                    type="button"
                                    onClick={() => handleMonthRemove(month)}
                                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 font-instrument text-center">
                              No months selected yet
                            </p>
                          )}
                        </div>

                        {/* Month Selection Dropdown */}
                        <div className="mt-1">
                          <select
                            className="w-full h-11 px-4 border border-gray-200 rounded-md focus:border-purple-400 focus:ring-purple-100 bg-white font-instrument text-gray-700"
                            onChange={(e) => {
                              if (e.target.value) {
                                handleMonthAdd(e.target.value);
                                e.target.value = ""; // Reset selection
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select months to add...
                            </option>
                            {HOSTING_MONTHS.filter(
                              (month) =>
                                !formData.plannedHostingMonths.includes(month)
                            ).map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-gray-500 font-instrument mt-1">
                          Select the months you plan to host trips (you can
                          select multiple)
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 font-instrument flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          Where do you plan to host trips?
                        </label>
                        <div className="mt-1">
                          <Input
                            type="text"
                            id="plannedHostingLocation"
                            name="plannedHostingLocation"
                            value={formData.plannedHostingLocation}
                            onChange={handleInputChange}
                            placeholder="e.g., Bali, Indonesia or Paris, France"
                            className="h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 font-instrument mt-1">
                          The destination(s) where you plan to host your trips
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 font-instrument">
                          💡 <strong>Tip:</strong> Being specific about your
                          location and hosting plans helps us match you with the
                          right travelers.
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <Button
                        onClick={() => setStep(2)}
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-instrument"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(4)}
                        disabled={!canProceedFromStep(3)}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-2">
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : step === 4 ? (
                // Step 4: Languages
                <div className="w-full">
                  <StepProgress />
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Languages You Speak
                      </h2>
                      <p className="text-gray-600 font-instrument mt-2">
                        Help travelers know which languages you can communicate
                        in
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-700 font-instrument flex items-center gap-2 mb-3">
                          <Languages className="h-4 w-4 text-gray-400" />
                          Select Languages
                        </label>

                        {/* Selected Languages */}
                        <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                          {formData.languages.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {formData.languages.map((language) => (
                                <span
                                  key={language}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-full font-instrument"
                                >
                                  {language}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleLanguageRemove(language)
                                    }
                                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 font-instrument text-center">
                              No languages selected yet
                            </p>
                          )}
                        </div>

                        {/* Language Selection Dropdown */}
                        <div className="relative">
                          <select
                            className="w-full px-4 py-3 h-12 border border-gray-300 rounded-md focus:border-purple-400 focus:ring-purple-100 bg-white font-instrument text-gray-700"
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
                        <p className="text-xs text-gray-500 font-instrument mt-2">
                          Select at least one language you can communicate with
                          guests in
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <Button
                        onClick={() => setStep(3)}
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-instrument"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(5)}
                        disabled={!canProceedFromStep(4)}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-2">
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : step === 5 ? (
                // Step 5: Social Media Links
                <div className="w-full">
                  <StepProgress />
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Social Media & Links
                      </h2>
                      <p className="text-gray-600 font-instrument mt-2">
                        Add your social profiles to build trust with travelers
                        (optional)
                      </p>
                    </div>

                    <div className="space-y-4">
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

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 font-instrument">
                          💡 <strong>Tip:</strong> Adding social media links
                          helps build credibility and allows travelers to learn
                          more about you.
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <Button
                        onClick={() => setStep(4)}
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-instrument"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(6)}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <span>Continue to Review</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : step === 7 ? (
                // Step 7: Application Submitted Success
                <div className="w-full">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Application Submitted!
                      </h1>
                      <p className="text-gray-600 font-instrument mt-2">
                        Thank you for applying to become a host
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-3 font-instrument">
                        What happens next?
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-instrument">
                            Our team will review your application within 1-3
                            business days
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-instrument">
                            You&apos;ll receive an email notification once your
                            application is approved
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-instrument">
                            After approval, you can start creating amazing
                            travel experiences
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-800 font-instrument">
                        💡 <strong>In the meantime:</strong> Explore our
                        platform, check out existing trips, and start planning
                        your unique experiences!
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        router.push("/");
                      }}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <span>Go to Homepage</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                // Step 6: Review & Submit
                <div className="w-full">
                  <StepProgress />
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 font-bricolage">
                        Review Your Application
                      </h2>
                      <p className="text-gray-600 font-instrument mt-2">
                        Please review your information before submitting
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

                    {/* Grid Layout for Review Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Basic Information Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 font-instrument">
                            Basic Information
                          </h3>
                          <button
                            onClick={() => setStep(2)}
                            className="text-sm text-purple-600 hover:text-purple-700 font-instrument"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 font-instrument">
                              Description:
                            </span>
                            <p className="text-gray-900 mt-1 font-instrument break-words whitespace-pre-wrap">
                              {formData.description}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-instrument">
                              Email:
                            </span>
                            <p className="text-gray-900 font-instrument break-words">
                              {formData.hostEmail}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-instrument">
                              Phone:
                            </span>
                            <p className="text-gray-900 font-instrument">
                              {formData.hostMobile}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Location Information Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 font-instrument">
                            Location Information
                          </h3>
                          <button
                            onClick={() => setStep(3)}
                            className="text-sm text-purple-600 hover:text-purple-700 font-instrument"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 font-instrument">
                              Host City:
                            </span>
                            <p className="text-gray-900 font-instrument break-words">
                              {formData.hostCity}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-instrument">
                              Planned Hosting Months:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {formData.plannedHostingMonths.length > 0 ? (
                                formData.plannedHostingMonths.map((month) => (
                                  <span
                                    key={month}
                                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-instrument"
                                  >
                                    {month}
                                  </span>
                                ))
                              ) : (
                                <p className="text-gray-500 font-instrument italic">
                                  No months selected
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 font-instrument">
                              Planned Hosting Location:
                            </span>
                            <p className="text-gray-900 font-instrument break-words">
                              {formData.plannedHostingLocation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Languages Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 font-instrument">
                            Languages
                          </h3>
                          <button
                            onClick={() => setStep(4)}
                            className="text-sm text-purple-600 hover:text-purple-700 font-instrument"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.languages.map((language) => (
                            <span
                              key={language}
                              className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-instrument"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Social Media Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 lg:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 font-instrument">
                            Social Media & Links
                          </h3>
                          <button
                            onClick={() => setStep(5)}
                            className="text-sm text-purple-600 hover:text-purple-700 font-instrument"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.instagramUrl && (
                            <div className="flex items-center gap-2">
                              <Instagram className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-900 font-instrument truncate text-sm">
                                {formData.instagramUrl}
                              </span>
                            </div>
                          )}
                          {formData.twitterUrl && (
                            <div className="flex items-center gap-2">
                              <Twitter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-900 font-instrument truncate text-sm">
                                {formData.twitterUrl}
                              </span>
                            </div>
                          )}
                          {formData.linkedinUrl && (
                            <div className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-900 font-instrument truncate text-sm">
                                {formData.linkedinUrl}
                              </span>
                            </div>
                          )}
                          {formData.websiteUrl && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-900 font-instrument truncate text-sm">
                                {formData.websiteUrl}
                              </span>
                            </div>
                          )}
                          {!formData.instagramUrl &&
                            !formData.twitterUrl &&
                            !formData.linkedinUrl &&
                            !formData.websiteUrl && (
                              <p className="text-gray-500 font-instrument italic text-sm">
                                No social media links added
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Before Submit Info */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
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
                            After approval, you can start creating travel plans
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <Button
                        onClick={() => setStep(5)}
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-instrument"
                        disabled={state.isRegistering}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleRegister}
                        disabled={state.isRegistering}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

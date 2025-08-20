"use client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { FormComponentProps } from "@/types/form";
import { createTravelPlan } from "@/actions/host/action";
import { useRouter } from "next/navigation";
import { MultiValue } from "react-select";
import {
  Plus,
  Minus,
  Map,
  Calendar,
  FileText,
  Camera,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

// Dynamically import ReactSelect to prevent hydration issues
const ReactSelect = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="h-11 border border-gray-200 rounded animate-pulse bg-gray-50"></div>
  ),
});

type SelectOption = {
  value: string;
  label: string;
};

const getSelectOptions = (options?: string[]) => {
  return options?.map((val) => ({ value: val, label: val })) || [];
};

export const CreateDestinationForm = ({
  FormData,
  FormSchema,
}: FormComponentProps) => {
  const schema = FormSchema;
  const router = useRouter();
  const { uploadedFile, UploadButton } = useCloudinaryUpload();
  const { data: session } = useSession();

  // Initialize form with proper defaultValues
  const defaultValues = {
    ...FormData.reduce(
      (acc, field) => ({
        ...acc,
        [field.id]:
          field.type === "number"
            ? 0
            : field.type === "date"
            ? ""
            : field.type === "multi-select"
            ? []
            : "",
      }),
      {}
    ),
    dayWiseData: [
      {
        dayNumber: 1,
        title: "",
        description: "",
        activities: [],
        meals: "",
        accommodation: "",
        dayWiseImage: "",
      },
    ],
    // Add tripImage field
    tripImage: "",
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dayWiseData",
  });

  const [dayWiseImages, setDayWiseImages] = useState<{ [key: number]: string }>(
    {}
  );

  // Step management state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  console.log(dayWiseImages);

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step

  // Function to check if field should be shown in current step
  const shouldShowField = (fieldId: string) => {
    const step1Fields = [
      "tripName",
      "startDate",
      "endDate",
      "filters",
      "tripImage",
    ];
    const step2Fields = [
      "destination",
      "country",
      "state",
      "city",
      "price",
      "maxLimit",
    ];
    // Step 3: everything else (description, languages, includedActivities, restrictions, etc.)

    switch (currentStep) {
      case 1:
        return step1Fields.includes(fieldId);
      case 2:
        return step2Fields.includes(fieldId);
      case 3:
        return !step1Fields.includes(fieldId) && !step2Fields.includes(fieldId);
      default:
        return false;
    }
  };

  const addDay = () => {
    const nextDayNumber = fields.length + 1;
    append({
      dayNumber: nextDayNumber,
      title: `Day ${nextDayNumber}`,
      description: "",
      activities: [],
      meals: "",
      accommodation: "",
      dayWiseImage: "",
    });
  };

  const removeDay = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Clean up day-wise image state
      setDayWiseImages((prev) => {
        const newImages = { ...prev };
        delete newImages[index];
        return newImages;
      });
      fields.forEach((_, i) => {
        if (i > index) {
          form.setValue(`dayWiseData.${i - 1}.dayNumber`, i);
        }
      });
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    form.setValue("tripImage", "");
  };

  // Remove day-wise image
  const removeDayWiseImage = (dayIndex: number) => {
    form.setValue(`dayWiseData.${dayIndex}.dayWiseImage`, "");
  };

  // Watch for uploaded file changes (main trip image)
  useEffect(() => {
    const handleImageUpload = (imageUrl: string) => {
      form.setValue("tripImage", imageUrl);
    };
    if (uploadedFile?.secure_url) {
      console.log("tt:", uploadedFile);
      handleImageUpload(uploadedFile.secure_url);
    }
  }, [uploadedFile, form]);

  // Handle day-wise image upload success
  const handleDayWiseImageUpload = (dayIndex: number, imageUrl: string) => {
    setDayWiseImages((prev) => ({
      ...prev,
      [dayIndex]: imageUrl,
    }));
    form.setValue(`dayWiseData.${dayIndex}.dayWiseImage`, imageUrl);
  };

  const createDayWiseUploadButton = (dayIndex: number, label: string) => (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
      onSuccess={(results: CloudinaryUploadWidgetResults) => {
        const resultsInfo = results.info;
        if (
          resultsInfo &&
          typeof resultsInfo === "object" &&
          typeof resultsInfo.secure_url === "string"
        ) {
          handleDayWiseImageUpload(dayIndex, resultsInfo.secure_url);
        }
      }}
      onError={(error) => {
        console.error("Cloudinary upload error:", error);
      }}
    >
      {({ open }: { open?: () => void }) => (
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors font-instrument disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (open) {
              open();
            } else {
              console.error("Cloudinary widget not initialized properly");
            }
          }}
          disabled={!open}
        >
          <Camera className="h-4 w-4 mr-2" />
          {label}
        </button>
      )}
    </CldUploadWidget>
  );

  const onSubmit = async (
    data: z.infer<typeof schema>,
    isDraft: boolean = false
  ) => {
    // Log the raw form data to check what we're working with
    console.log("Raw form data:", JSON.stringify(data, null, 2));
    console.log(
      "Day-wise data from form:",
      JSON.stringify(data.dayWiseData, null, 2)
    );
    console.log("Saving as draft:", isDraft);

    try {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const noOfDays =
        Math.ceil(
          Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)
        ) + 1;

      // Process dayWiseData to ensure all fields are properly formatted
      const processedDayWiseData = data.dayWiseData.map(
        (
          day: {
            title?: string;
            description?: string;
            activities?: string[];
            meals?: string;
            accommodation?: string;
            dayWiseImage?: string;
          },
          index: number
        ) => ({
          dayNumber: index + 1,
          title: day.title || `Day ${index + 1}`,
          description: day.description || "",
          activities: Array.isArray(day.activities) ? day.activities : [],
          meals: day.meals || "",
          accommodation: day.accommodation || "",
          dayWiseImage: day.dayWiseImage || "",
        })
      );
      console.log("whole travel plan: ", data);
      console.log("Submitting day-wise data:", processedDayWiseData);

      const statusToSend = isDraft ? "DRAFT" : "INACTIVE";
      console.log(
        "🔍 DEBUG: isDraft =",
        isDraft,
        "| statusToSend =",
        statusToSend
      );

      const result = await createTravelPlan({
        title: data.tripName,
        description: data.description,
        destination: data.destination,
        includedActivities: data.includedActivities || [],
        restrictions: data.restrictions || [],
        noOfDays,
        price: data.price,
        startDate: start,
        endDate: end,
        maxParticipants: data.maxLimit,
        country: data.country,
        state: data.state,
        city: data.city,
        languages: data.languages || [],
        filters: data.filters || [],
        dayWiseData: processedDayWiseData,
        tripImage: data.tripImage || "",
        status: statusToSend,
      });

      if (result?.error) {
        console.error("Failed to create travel plan:", result.error);
      } else {
        console.log("🔍 DEBUG RESULT: Travel plan creation result:", result);
        router.push("/dashboard/host");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const formatDateForInput = (date: Date | string | number | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  // Get step title and description
  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Basic Trip Information",
          description:
            "Let's start with the essentials - trip name, dates, and preferences",
        };
      case 2:
        return {
          title: "Location & Pricing",
          description:
            "Tell us where you're going and set your pricing details",
        };
      case 3:
        return {
          title: "Trip Details & Activities",
          description: "Add the finishing touches to make your trip stand out",
        };
      default:
        return {
          title: "Create Trip",
          description: "Fill in your trip details",
        };
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === currentStep
                  ? "bg-purple-600 text-white"
                  : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-0.5 ml-4 ${
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  Create Experience
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                Hello, {session?.user?.name || "Host"}! Let&apos;s get started
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                Create your new travel experience and share it with the world
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/host")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-instrument"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
              <div className="bg-purple-50 p-4 rounded-full">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            {/* Step Indicator */}
            <StepIndicator />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Map className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 font-bricolage">
                  {getStepInfo().title}
                </h2>
                <p className="text-sm text-gray-600 font-instrument">
                  {getStepInfo().description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => onSubmit(data, false))}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FormData.filter((field) => shouldShowField(field.id)).map(
                    (data) => {
                      if (
                        ["text", "email", "tel", "number"].includes(data.type)
                      ) {
                        return (
                          <FormField
                            key={data.id}
                            control={form.control}
                            name={data.id}
                            render={({ field }) => (
                              <FormItem className={data.className}>
                                <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                  {data.label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type={data.type}
                                    placeholder={data.placeholder}
                                    className="h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                    {...field}
                                    value={field.value?.toString() ?? ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      }

                      if (data.type === "date") {
                        return (
                          <FormField
                            key={data.id}
                            control={form.control}
                            name={data.id}
                            render={({ field }) => (
                              <FormItem className={data.className}>
                                <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                  {data.label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                    {...field}
                                    value={formatDateForInput(field.value)}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? new Date(e.target.value)
                                          : ""
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      }

                      if (data.type === "textarea") {
                        return (
                          <FormField
                            key={data.id}
                            control={form.control}
                            name={data.id}
                            render={({ field }) => (
                              <FormItem
                                className={`${data.className} md:col-span-2`}
                              >
                                <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                  {data.label}
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={data.placeholder}
                                    className="min-h-[100px] resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                    {...field}
                                    value={field.value?.toString() ?? ""}
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-gray-500 mt-1 font-instrument">
                                  Provide a detailed description of your trip
                                  experience.
                                </p>
                              </FormItem>
                            )}
                          />
                        );
                      }

                      if (data.type === "sectionHead") {
                        return (
                          <div
                            key={data.id}
                            className={`${data.className} md:col-span-2 mt-8 mb-6`}
                          >
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-purple-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                                {data.label}
                              </h3>
                            </div>
                          </div>
                        );
                      }

                      if (
                        data.type === "multi-select" &&
                        "options" in data &&
                        Array.isArray(data.options)
                      ) {
                        return (
                          <FormField
                            key={data.id}
                            control={form.control}
                            name={data.id}
                            render={({ field }) => (
                              <FormItem className={data.className}>
                                <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                  {data.label}
                                </FormLabel>
                                <FormControl>
                                  <ReactSelect
                                    isMulti
                                    options={getSelectOptions(data.options)}
                                    value={(field.value as string[])?.map(
                                      (val) => ({
                                        value: val,
                                        label: val,
                                      })
                                    )}
                                    onChange={(newValue) => {
                                      const selected =
                                        newValue as MultiValue<SelectOption>;
                                      field.onChange(
                                        selected?.map((opt) => opt.value) || []
                                      );
                                    }}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        minHeight: "44px",
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0.375rem",
                                        boxShadow: "none",
                                        "&:hover": {
                                          borderColor: "#a855f7",
                                        },
                                        "&:focus-within": {
                                          borderColor: "#a855f7",
                                          boxShadow:
                                            "0 0 0 3px rgba(168, 85, 247, 0.1)",
                                        },
                                      }),
                                      multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: "#f3e8ff",
                                        borderRadius: "0.25rem",
                                      }),
                                      multiValueLabel: (base) => ({
                                        ...base,
                                        color: "#7c3aed",
                                        fontWeight: "500",
                                      }),
                                      multiValueRemove: (base) => ({
                                        ...base,
                                        color: "#7c3aed",
                                        "&:hover": {
                                          backgroundColor: "#e9d5ff",
                                          color: "#6d28d9",
                                        },
                                      }),
                                      option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected
                                          ? "#a855f7"
                                          : state.isFocused
                                          ? "#f3e8ff"
                                          : "white",
                                        color: state.isSelected
                                          ? "white"
                                          : "#374151",
                                      }),
                                      placeholder: (base) => ({
                                        ...base,
                                        color: "#9ca3af",
                                      }),
                                    }}
                                    placeholder={data.placeholder}
                                    className="font-instrument"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      }

                      return null;
                    }
                  )}
                </div>

                {/* Trip Image Upload Section - Only show in Step 1 */}
                {currentStep === 1 && (
                  <div className="space-y-4 mt-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                        Trip Cover Image
                      </h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="tripImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                            Upload Trip Cover Image
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {!field.value ? (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                                  <Camera className="h-12 w-12 text-gray-400 mb-4" />
                                  <p className="text-sm text-gray-500 mb-4 text-center">
                                    Upload a stunning image that showcases your
                                    trip destination
                                  </p>
                                  <UploadButton label="Choose Image" />
                                </div>
                              ) : (
                                <div className="relative group">
                                  <Image
                                    width={500}
                                    height={500}
                                    src={field.value}
                                    alt="Trip cover"
                                    className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                    <div className="flex gap-2">
                                      <UploadButton label="Change Image" />
                                      <button
                                        type="button"
                                        onClick={removeImage}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-instrument"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload a high-quality image (JPG, PNG, or WEBP) that
                            represents your trip destination.
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Day-wise Itinerary - Only show in Step 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6 mt-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                        Day-by-Day Itinerary
                      </h3>
                    </div>

                    {fields.map((field, index) => {
                      return (
                        <div
                          key={field.id}
                          className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-purple-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 font-bricolage">
                                Day {index + 1}
                              </h3>
                            </div>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeDay(index)}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-instrument"
                              >
                                <Minus className="h-4 w-4" />
                                Remove Day
                              </Button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <FormField
                              control={form.control}
                              name={`dayWiseData.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    Day Title
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Arrival & Welcome Ride"
                                      className="h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`dayWiseData.${index}.accommodation`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    Accommodation
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Alpine Lodge in Verbier"
                                      className="h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`dayWiseData.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    Day Description
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Describe the day's activities and schedule..."
                                      className="min-h-[100px] resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`dayWiseData.${index}.meals`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    Meals Included
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Breakfast, lunch, and dinner included"
                                      className="h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`dayWiseData.${index}.activities`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    Activities
                                  </FormLabel>
                                  <FormControl>
                                    <ReactSelect
                                      isMulti
                                      placeholder="Add activities..."
                                      options={[]} // You can add predefined options here
                                      value={
                                        field.value?.map((act: string) => ({
                                          value: act,
                                          label: act,
                                        })) || []
                                      }
                                      onChange={(newValue) => {
                                        const selected =
                                          newValue as MultiValue<SelectOption>;
                                        field.onChange(
                                          selected?.map((opt) => opt.value) ||
                                            []
                                        );
                                      }}
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          minHeight: "44px",
                                          backgroundColor: "white",
                                          border: "1px solid #e5e7eb",
                                          borderRadius: "0.375rem",
                                          boxShadow: "none",
                                          "&:hover": {
                                            borderColor: "#a855f7",
                                          },
                                          "&:focus-within": {
                                            borderColor: "#a855f7",
                                            boxShadow:
                                              "0 0 0 3px rgba(168, 85, 247, 0.1)",
                                          },
                                        }),
                                        multiValue: (base) => ({
                                          ...base,
                                          backgroundColor: "#f3e8ff",
                                          borderRadius: "0.25rem",
                                        }),
                                        multiValueLabel: (base) => ({
                                          ...base,
                                          color: "#7c3aed",
                                          fontWeight: "500",
                                        }),
                                        multiValueRemove: (base) => ({
                                          ...base,
                                          color: "#7c3aed",
                                          "&:hover": {
                                            backgroundColor: "#e9d5ff",
                                            color: "#6d28d9",
                                          },
                                        }),
                                        option: (base, state) => ({
                                          ...base,
                                          backgroundColor: state.isSelected
                                            ? "#a855f7"
                                            : state.isFocused
                                            ? "#f3e8ff"
                                            : "white",
                                          color: state.isSelected
                                            ? "white"
                                            : "#374151",
                                        }),
                                        placeholder: (base) => ({
                                          ...base,
                                          color: "#9ca3af",
                                        }),
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Day-wise Image Upload Section */}
                          <div className="space-y-4 mt-6">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                <Camera className="h-3 w-3 text-purple-600" />
                              </div>
                              <h4 className="text-sm font-semibold text-gray-700 font-instrument">
                                Day {index + 1} Image
                              </h4>
                            </div>

                            <FormField
                              control={form.control}
                              name={`dayWiseData.${index}.dayWiseImage`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    Upload Day Image
                                  </FormLabel>
                                  <FormControl>
                                    <div className="space-y-4">
                                      {!field.value ? (
                                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                                          <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                          <p className="text-xs text-gray-500 mb-3 text-center font-instrument">
                                            Add an image for this day&apos;s
                                            activities
                                          </p>
                                          {createDayWiseUploadButton(
                                            index,
                                            "Choose Image"
                                          )}
                                        </div>
                                      ) : (
                                        <div className="relative group">
                                          <Image
                                            width={400}
                                            height={300}
                                            src={field.value}
                                            alt={`Day ${index + 1} image`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                                          />
                                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <div className="flex gap-2">
                                              {createDayWiseUploadButton(
                                                index,
                                                "Change Image"
                                              )}
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  removeDayWiseImage(index)
                                                }
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-instrument"
                                              >
                                                <X className="h-3 w-3 mr-1" />
                                                Remove
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                  <p className="text-xs text-gray-500 mt-1 font-instrument">
                                    Upload an image that represents this
                                    day&apos;s activities or destination.
                                  </p>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addDay}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300 font-instrument"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Day
                      </Button>
                    </div>
                  </div>
                )}

                {/* Submission guidance - Only show in Step 3 */}
                {currentStep === 3 && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 font-bricolage">
                        Before you submit:
                      </h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2 font-instrument">
                      <li className="flex items-start">
                        <span className="mr-3 text-green-500">✓</span>
                        <span>Review all trip details for accuracy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 text-green-500">✓</span>
                        <span>Ensure dates and pricing are correct</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 text-green-500">✓</span>
                        <span>Upload a compelling trip cover image</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 text-green-500">✓</span>
                        <span>
                          Add day-wise images to enhance your itinerary
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-3 text-green-500">✓</span>
                        <span>Your trip will be live after submission</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Navigation and Submit Buttons */}
                <div className="flex justify-between gap-4">
                  <div className="flex gap-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="px-6 py-3 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-instrument flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {currentStep === 3 && (
                      <Button
                        type="button"
                        onClick={() =>
                          form.handleSubmit((data) => onSubmit(data, true))()
                        }
                        variant="outline"
                        className="px-8 py-3 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-instrument flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save as Draft
                      </Button>
                    )}

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-instrument flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-instrument flex items-center gap-2"
                      >
                        Create Travel Experience
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="m5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

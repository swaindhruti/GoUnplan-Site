"use client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import { Button } from "@/components/ui/button";
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
import { FormComponentProps } from "@/types/form";
import {
  createTravelPlan,
  searchPlaces,
  updateTravelPlan,
} from "@/actions/host/action";
import { useRouter } from "next/navigation";
import { MultiValue } from "react-select";
import {
  getValidationSchema,
  CreateDestinationSchema,
} from "@/config/form/formSchemaData/CreateDestinationSchema";
import { z } from "zod";

// Define the form data type
type FormDataType = z.infer<typeof CreateDestinationSchema>;

// Day item type inferred from schema (explicit to avoid `any` and satisfy ESLint)
type DayItem = {
  dayNumber?: number;
  title?: string;
  description?: string;
  activities?: string[];
  meals?: string;
  accommodation?: string;
  dayWiseImage?: string;
  destination?: string;
  country?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
};
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
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  initialData,
  isEditMode = false,
}: FormComponentProps) => {
  const router = useRouter();
  const { uploadedFile, UploadButton } = useCloudinaryUpload();
  const { data: session } = useSession();

  const formatDateForFormInput = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const defaultValues = initialData
    ? {
        tripName: initialData.title || "",
        destination: initialData.destination || "",
        country: initialData.country || "",
        price: initialData.price || 0,
        maxLimit: initialData.maxParticipants || 0,
        minLimit: initialData.minParticipants || 0,
        description: initialData.description || "",
        activities: initialData.activities || [],
        startDate: formatDateForFormInput(initialData.startDate),

        endDate: formatDateForFormInput(initialData.endDate),
        filters: initialData.filters || [],
        stops: initialData.stops || [],
        languages: initialData.languages || [],
        includedActivities: initialData.includedActivities || [],
        restrictions: initialData.restrictions || [],
        special: initialData.special || [],
        tripImage: initialData.tripImage || "",
        dayWiseData:
          initialData.dayWiseData?.length > 0
            ? initialData.dayWiseData
            : [
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
      }
    : {
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
        tripImage: "",
        stops: [],
      };

  const form = useForm<FormDataType>({
    resolver: undefined,
    defaultValues,
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dayWiseData",
  });

  const watchedNoOfDays = form.watch("noofdays") as number | undefined;
  const watchedStops = (form.watch("stops") as string[]) || [];
  const watchedStart = form.watch("startDate") as string | undefined;

  useEffect(() => {
    try {
      const allVals = form.getValues();
      const startVal = allVals.startDate as string | undefined;
      const noOfDaysVal = allVals.noofdays as number | string | undefined;
      if (!startVal || !noOfDaysVal) return;

      const parsedStart = new Date(startVal);
      const days = Number(noOfDaysVal);
      if (isNaN(parsedStart.getTime()) || isNaN(days) || days < 1) return;

      const calculatedEnd = new Date(parsedStart);
      calculatedEnd.setDate(calculatedEnd.getDate() + (days - 1));
      const currentEnd = form.getValues().endDate as string | undefined;
      if (
        !currentEnd ||
        new Date(currentEnd).toISOString() !== calculatedEnd.toISOString()
      ) {
        form.setValue("endDate", formatDateForFormInput(calculatedEnd));
      }
    } catch {}
  }, [watchedStart, watchedNoOfDays, form]);

  useEffect(() => {
    const rawNo = form.getValues().noofdays as number | string | undefined;
    const desired = Number(rawNo) || 1;

    if (isNaN(desired) || desired < 1) return;

    const currentLen = fields.length;
    if (currentLen < desired) {
      for (let i = currentLen; i < desired; i++) {
        append({
          dayNumber: i + 1,
          title: `Day ${i + 1}`,
          description: "",
          activities: [],
          meals: "",
          accommodation: "",
          dayWiseImage: "",
        });
      }
    } else if (currentLen > desired) {
      for (let i = currentLen - 1; i >= desired; i--) {
        remove(i);
      }
    }
    // Ensure dayNumber fields are in sync by updating the whole array
    try {
      const current = (form.getValues().dayWiseData || []) as DayItem[];
      const updated: DayItem[] = current.map((d: DayItem, idx: number) => ({
        ...(d || {}),
        dayNumber: idx + 1,
      }));
      form.setValue(
        "dayWiseData",
        updated as unknown as FormDataType["dayWiseData"]
      );
    } catch {
      // ignore
    }
  }, [watchedNoOfDays, append, remove, fields.length, form]);

  const [_, setDayWiseImages] = useState<{ [key: number]: string }>({});

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customActivityInput, setCustomActivityInput] = useState<{
    [key: number]: string;
  }>({});
  const [customIncludedInput, setCustomIncludedInput] = useState<string>("");
  const [customExcludedInput, setCustomExcludedInput] = useState<string>("");
  const [customSpecialInput, setCustomSpecialInput] = useState<string>("");
  const [customFilterInput, setCustomFilterInput] = useState<string>("");
  const [customStopsInput, setCustomStopsInput] = useState<string>("");
  const [stopSuggestions, setStopSuggestions] = useState<string[]>([]);

  const debounceTimer = useRef<number | null>(null);
  const debouncedFetch = (q: string) => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(() => {
      fetchSuggestions(q);
    }, 300) as unknown as number;
  };

  const fetchSuggestions = async (q: string) => {
    if (!q) {
      setStopSuggestions([]);
      return;
    }
    try {
      const res = await searchPlaces(q);

      if (res.error) {
        console.error(res.error);
        setStopSuggestions([]);
      } else {
        setStopSuggestions(res.results || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setStopSuggestions([]);
    }
  };

  const totalSteps = 3;

  useEffect(() => {
    if (initialData) {
      const formData = {
        tripName: initialData.title || "",
        destination: initialData.destination || "",
        country: initialData.country || "",
        price: initialData.price || 0,
        maxLimit: initialData.maxParticipants || 0,
        minLimit: initialData.minParticipants || 0,
        description: initialData.description || "",
        activities: initialData.activities || [],
        startDate: formatDateForFormInput(initialData.startDate),
        noofdays: initialData.noOfDays || 1,
        endDate: formatDateForFormInput(initialData.endDate),
        filters: initialData.filters || [],
        stops: initialData.stops || [],
        languages: initialData.languages || [],
        includedActivities: initialData.includedActivities || [],
        restrictions: initialData.restrictions || [],
        special: initialData.special || [],
        tripImage: initialData.tripImage || "",
        dayWiseData:
          initialData.dayWiseData?.length > 0
            ? initialData.dayWiseData.map(
                (day: {
                  dayNumber?: number;
                  title?: string;
                  description?: string;
                  activities?: string[] | unknown;
                  meals?: string;
                  accommodation?: string;
                  dayWiseImage?: string;
                }) => ({
                  dayNumber: day.dayNumber || 1,
                  title: day.title || "",
                  description: day.description || "",
                  activities: Array.isArray(day.activities)
                    ? day.activities
                    : [],
                  meals: day.meals || "",
                  accommodation: day.accommodation || "",
                  dayWiseImage: day.dayWiseImage || "",
                })
              )
            : [
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
      };

      form.reset(formData);

      if (initialData.dayWiseData?.length > 0) {
        const imageMap: { [key: number]: string } = {};
        initialData.dayWiseData.forEach(
          (
            day: {
              dayNumber?: number;
              title?: string;
              description?: string;
              activities?: string[] | unknown;
              meals?: string;
              accommodation?: string;
              dayWiseImage?: string;
            },
            index: number
          ) => {
            if (day.dayWiseImage) {
              imageMap[index] = day.dayWiseImage;
            }
          }
        );

        setDayWiseImages(imageMap);
      }
    }
  }, [initialData, form]);

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

  const shouldShowField = (fieldId: string) => {
    const step1Fields = [
      "tripName",
      "startDate",
      "endDate",
      "filters",
      "tripImage",
      "noofdays",
    ];
    const step2Fields = [
      "destination",
      "country",
      "price",
      "maxLimit",
      "stops",
    ];

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
      setDayWiseImages((prev) => {
        const newImages = { ...prev };
        delete newImages[index];
        return newImages;
      });
      // Reindex dayNumber by updating the entire array
      try {
        const current = (form.getValues().dayWiseData || []) as DayItem[];
        const updated: DayItem[] = current
          .filter((_: DayItem, idx: number) => idx !== index)
          .map((d: DayItem, idx: number) => ({
            ...(d || {}),
            dayNumber: idx + 1,
          }));
        form.setValue(
          "dayWiseData",
          updated as unknown as FormDataType["dayWiseData"]
        );
      } catch {
        // ignore
      }
    }
  };

  const removeImage = () => {
    form.setValue("tripImage", "");
  };

  const removeDayWiseImage = (dayIndex: number) => {
    try {
      const current = (form.getValues().dayWiseData || []) as DayItem[];
      const updated: DayItem[] = current.map((d: DayItem, idx: number) =>
        idx === dayIndex ? { ...(d || {}), dayWiseImage: "" } : d
      );
      form.setValue(
        "dayWiseData",
        updated as unknown as FormDataType["dayWiseData"]
      );
    } catch {
      // fallback: set back to whatever we have (typed)
      form.setValue(
        "dayWiseData",
        (form.getValues().dayWiseData ||
          []) as unknown as FormDataType["dayWiseData"]
      );
    }
  };

  useEffect(() => {
    const handleImageUpload = (imageUrl: string) => {
      form.setValue("tripImage", imageUrl);
    };
    if (uploadedFile?.secure_url) {
      handleImageUpload(uploadedFile.secure_url);
    }
  }, [uploadedFile, form]);

  // Handle day-wise image upload success
  const handleDayWiseImageUpload = (dayIndex: number, imageUrl: string) => {
    setDayWiseImages((prev) => ({
      ...prev,
      [dayIndex]: imageUrl,
    }));
    try {
      const current = (form.getValues().dayWiseData || []) as DayItem[];
      const updated: DayItem[] = current.map((d: DayItem, idx: number) =>
        idx === dayIndex ? { ...(d || {}), dayWiseImage: imageUrl } : d
      );
      form.setValue(
        "dayWiseData",
        updated as unknown as FormDataType["dayWiseData"]
      );
    } catch {
      // fallback
    }
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
      {({ open }) => {
        // Add null check for the open function
        if (!open) {
          console.warn("Cloudinary upload widget not ready");
          return (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed font-instrument"
              disabled
            >
              <Camera className="h-4 w-4 mr-2" />
              Loading...
            </button>
          );
        }

        return (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors font-instrument"
            onClick={() => {
              try {
                open();
              } catch (error) {
                console.error("Error opening upload widget:", error);
              }
            }}
          >
            <Camera className="h-4 w-4 mr-2" />
            {label}
          </button>
        );
      }}
    </CldUploadWidget>
  );

  // Dynamic validation function
  const validateFormData = (data: Partial<FormDataType>, isDraft: boolean) => {
    const validationSchema = getValidationSchema(isDraft);
    return validationSchema.safeParse(data);
  };

  const onSubmit = async (
    data: Partial<FormDataType>,
    isDraft: boolean = false
  ) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    // Log the raw form data to check what we're working with (safely)
    try {
      console.log("Raw form data:", {
        tripName: data.tripName,
        status: isDraft ? "DRAFT" : "ACTIVE",
        dayWiseDataLength: data.dayWiseData?.length || 0,
      });
      if (data.dayWiseData && data.dayWiseData.length > 0) {
        console.log(
          "Day-wise data summary:",
          data.dayWiseData.map(
            (
              day: {
                title?: string;
                activities?: string[];
              },
              idx: number
            ) => ({
              day: idx + 1,
              title: day.title || `Day ${idx + 1}`,
              hasActivities:
                Array.isArray(day.activities) && day.activities.length > 0,
            })
          )
        );
      }
    } catch {
      console.log("Form data logging error, continuing with submission");
    }
    console.log("Saving as draft:", isDraft);

    // Perform dynamic validation
    const validationResult = validateFormData(data, isDraft);

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      // If it's not a draft, show validation errors
      if (!isDraft) {
        setIsSubmitting(false);
        // The form will handle showing the validation errors
        return;
      }
      // For drafts, we continue even with validation errors
    }

    try {
      // Handle dates properly for drafts
      let start: Date | null = null;
      let end: Date | null = null;
      let noOfDays = 1;

      if (data.startDate && data.endDate && !isDraft) {
        start = new Date(data.startDate);
        end = new Date(data.endDate);

        // Only calculate noOfDays if we have valid dates
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          noOfDays =
            Math.ceil(
              Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)
            ) + 1;
        }
      } else if (data.startDate && data.endDate) {
        // For drafts, still try to set dates if provided
        const tempStart = new Date(data.startDate);
        const tempEnd = new Date(data.endDate);

        if (!isNaN(tempStart.getTime())) {
          start = tempStart;
        }
        if (!isNaN(tempEnd.getTime())) {
          end = tempEnd;
        }

        if (start && end) {
          noOfDays =
            Math.ceil(
              Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)
            ) + 1;
        }
      }

      // For drafts, we can have minimal data
      if (isDraft) {
        noOfDays = Math.max(noOfDays, 1); // Ensure at least 1 day for drafts
      }

      try {
        const desiredDays =
          Number((data as Partial<FormDataType>).noofdays) || noOfDays;
        const actualDays = (data.dayWiseData || []).length;
        if (!isDraft && desiredDays !== actualDays) {
          toast.error(
            `Please provide exactly ${desiredDays} day entries. You have provided ${actualDays}.`,
            {
              style: {
                background: "rgba(220, 38, 38, 0.95)",
                color: "white",
                fontFamily: "var(--font-instrument)",
              },
              duration: 4000,
            }
          );
          setIsSubmitting(false);
          return;
        }
      } catch {
        // ignore validation errors and continue — fallback below will catch other issues
      }

      // Process dayWiseData to ensure all fields are properly formatted
      let processedDayWiseData: Array<{
        dayNumber: number;
        title: string;
        description: string;
        activities: string[];
        meals: string;
        accommodation: string;
        dayWiseImage: string;
        destination?: string;
      }> = [];
      try {
        processedDayWiseData = (data.dayWiseData || []).map(
          (
            day: {
              title?: string;
              description?: string;
              activities?: string[];
              destination?: string;
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
            destination: day.destination || "",
          })
        );
      } catch (processingError) {
        console.error("Error processing day-wise data:", processingError);
        // Fallback to empty array if processing fails
        processedDayWiseData = [];
      }

      const statusToSend: "DRAFT" | "INACTIVE" = isDraft ? "DRAFT" : "INACTIVE";

      const tripData = {
        title: data.tripName || "",
        description: data.description || "",
        destination: data.destination || "",
        includedActivities: data.includedActivities || [],
        restrictions: data.restrictions || [],
        noOfDays,
        activities: data.activities || [],
        price: data.price || 0,
        startDate: start,
        endDate: end,
        special: data.special || [],
        maxParticipants: data.maxLimit || 0,
        country: data.country || "",
        stops: data.stops || [],
        // legacy support: state/city may be absent in the new form
        state: (data as Partial<FormDataType> & { state?: string }).state || "",
        city: (data as Partial<FormDataType> & { city?: string }).city || "",
        languages: data.languages || [],
        filters: data.filters || [],
        dayWiseData: processedDayWiseData,
        tripImage: data.tripImage || "",
        status: statusToSend,
      };

      let result;
      if (isEditMode && initialData?.travelPlanId) {
        result = await updateTravelPlan(initialData.travelPlanId, tripData);
      } else {
        result = await createTravelPlan(tripData);
      }

      if (result?.error) {
        toast.error(result.message || result.error, {
          style: {
            background: "rgba(147, 51, 234, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            color: "white",
            fontFamily: "var(--font-instrument)",
          },
          duration: 3000,
        });
        console.error(
          `Failed to ${isEditMode ? "update" : "create"} travel plan:`,
          result.error
        );
      } else {
        toast.success(result.message || "Operation completed successfully!", {
          style: {
            background: "rgba(147, 51, 234, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            color: "white",
            fontFamily: "var(--font-instrument)",
          },
          duration: 3000,
        });
        router.push("/dashboard/host");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.", {
        style: {
          background: "rgba(147, 51, 234, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(196, 181, 253, 0.3)",
          color: "white",
          fontFamily: "var(--font-instrument)",
        },
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraftSubmit = async () => {
    if (isSubmitting) return;

    const formData = form.getValues();
    await onSubmit(formData, true);
  };

  const handleFullSubmit = async () => {
    if (isSubmitting) return;

    const formData = form.getValues();

    const validationResult = validateFormData(formData, false);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      Object.keys(errors).forEach((field) => {
        const errorMessage = errors[field as keyof typeof errors];
        if (errorMessage && errorMessage[0]) {
          form.setError(field as keyof FormDataType, {
            type: "manual",
            message: errorMessage[0],
          });
        }
      });
      return;
    }

    await onSubmit(formData, false);
  };

  const formatDateForInput = (date: Date | string | number | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase font-instrument">
                  {isEditMode ? "Edit Experience" : "Create Experience"}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-bricolage leading-[1.05] tracking-tighter">
                Hello, {session?.user?.name || "Host"}!{" "}
                {isEditMode ? "Let's update your trip" : "Let's get started"}
              </h1>
              <p className="text-lg text-gray-600 font-instrument mt-2">
                {isEditMode
                  ? "Update your travel experience details"
                  : "Create your new travel experience and share it with the world"}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
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
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFullSubmit();
                }}
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
                            name={data.id as keyof FormDataType}
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
                                    {...(data.id === "noofdays"
                                      ? { min: 1, step: 1 }
                                      : {})}
                                  />
                                </FormControl>
                                <FormMessage />
                                {data.id === "noofdays" && (
                                  <p className="text-xs text-gray-500 mt-1 font-instrument">
                                    Setting the number of days will
                                    auto-generate
                                  </p>
                                )}
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
                            name={data.id as keyof FormDataType}
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
                                    value={formatDateForInput(
                                      field.value as
                                        | string
                                        | Date
                                        | number
                                        | undefined
                                    )}
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
                            name={data.id as keyof FormDataType}
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
                            name={data.id as keyof FormDataType}
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

                      // Stops field: creatable multi-select with suggestions
                      if (data.id === "stops") {
                        return (
                          <FormField
                            key={data.id}
                            control={form.control}
                            name={data.id as keyof FormDataType}
                            render={({ field }) => (
                              <FormItem className={data.className}>
                                <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                  {data.label}
                                </FormLabel>
                                <FormControl>
                                  <div className="space-y-3 mt-3">
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder={data.placeholder}
                                        className="flex-1 border-gray-200 font-instrument"
                                        value={customStopsInput}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          console.log("Input changed:", v);
                                          setCustomStopsInput(v);
                                          console.log(
                                            "stops input changed:",
                                            v
                                          );
                                          if (v.trim()) debouncedFetch(v);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            const val = customStopsInput.trim();
                                            const currentVals = Array.isArray(
                                              field.value
                                            )
                                              ? (field.value as string[])
                                              : [];
                                            if (
                                              val &&
                                              !currentVals.includes(val)
                                            ) {
                                              field.onChange([
                                                ...currentVals,
                                                val,
                                              ]);
                                              setCustomStopsInput("");
                                              setStopSuggestions([]);
                                            }
                                          }
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                          const val = customStopsInput.trim();
                                          const currentVals = Array.isArray(
                                            field.value
                                          )
                                            ? (field.value as string[])
                                            : [];
                                          if (
                                            val &&
                                            !currentVals.includes(val)
                                          ) {
                                            field.onChange([
                                              ...currentVals,
                                              val,
                                            ]);
                                            setCustomStopsInput("");
                                          }
                                        }}
                                        className="px-3 bg-purple-600 hover:bg-purple-700 text-white"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    {Array.isArray(field.value) &&
                                      (field.value as string[]).length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {(field.value as string[]).map(
                                            (
                                              item: string,
                                              itemIndex: number
                                            ) => (
                                              <span
                                                key={itemIndex}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                                              >
                                                {item}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const newItems = (
                                                      field.value as string[]
                                                    ).filter(
                                                      (_: string, i: number) =>
                                                        i !== itemIndex
                                                    );
                                                    field.onChange(newItems);
                                                  }}
                                                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                                >
                                                  <Minus className="h-3 w-3" />
                                                </button>
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )}
                                    {/* suggestions dropdown */}
                                    {stopSuggestions.length > 0 && (
                                      <div className="mt-2 border border-gray-200 rounded bg-white shadow-sm max-h-48 overflow-auto">
                                        {stopSuggestions.map((sug, i) => (
                                          <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                              const cur = (field.value ||
                                                []) as string[];
                                              if (!cur.includes(sug)) {
                                                field.onChange([...cur, sug]);
                                              }
                                              setCustomStopsInput("");
                                              setStopSuggestions([]);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                          >
                                            {sug}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      }

                      // Inclusion List Component
                      if (
                        (data.type === "inclusion-list" ||
                          data.type === "exclusion-list") &&
                        "options" in data &&
                        Array.isArray(data.options)
                      ) {
                        return (
                          <FormField
                            key={data.id}
                            control={form.control}
                            name={data.id as keyof FormDataType}
                            render={({ field }) => (
                              <FormItem className={data.className}>
                                <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                  {data.label}
                                </FormLabel>
                                <FormControl>
                                  <div className="space-y-2">
                                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                                      {(data.options || []).map(
                                        (option, index) => {
                                          const isSelected = (
                                            (field.value as string[]) || []
                                          ).includes(option);
                                          return (
                                            <div
                                              key={index}
                                              className="flex items-center justify-between p-2 hover:bg-white rounded transition-colors"
                                            >
                                              <span className="text-sm text-gray-700 font-instrument">
                                                {option}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                {isSelected ? (
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const newValue = (
                                                        (field.value as string[]) ||
                                                        []
                                                      ).filter(
                                                        (item) =>
                                                          item !== option
                                                      );
                                                      field.onChange(newValue);
                                                    }}
                                                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold text-sm transition-colors flex items-center justify-center"
                                                  >
                                                    −
                                                  </button>
                                                ) : (
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const currentValue =
                                                        (field.value as string[]) ||
                                                        [];
                                                      const newValue = [
                                                        ...currentValue,
                                                        option,
                                                      ];
                                                      field.onChange(newValue);
                                                    }}
                                                    className="w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-600 font-bold text-sm transition-colors flex items-center justify-center"
                                                  >
                                                    +
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                    {((field.value as string[]) || []).length >
                                      0 && (
                                      <div className="mt-3">
                                        <p className="text-xs text-gray-600 font-instrument mb-2">
                                          Selected{" "}
                                          {data.type === "inclusion-list"
                                            ? "inclusions"
                                            : "exclusions"}
                                          :
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {(
                                            (field.value as string[]) || []
                                          ).map((item, index) => (
                                            <span
                                              key={index}
                                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                data.type === "inclusion-list"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-red-100 text-red-800"
                                              }`}
                                            >
                                              {item}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const newValue = (
                                                    (field.value as string[]) ||
                                                    []
                                                  ).filter(
                                                    (val) => val !== item
                                                  );
                                                  field.onChange(newValue);
                                                }}
                                                className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
                                              >
                                                ×
                                              </button>
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      }

                      if (data.type === "custom-input-list") {
                        const isIncluded = data.id === "includedActivities";
                        const isFilters = data.id === "filters";
                        const customInput = isIncluded
                          ? customIncludedInput
                          : data.label === "Not Included"
                          ? customExcludedInput
                          : isFilters
                          ? customFilterInput
                          : customSpecialInput;
                        const setCustomInput = isIncluded
                          ? setCustomIncludedInput
                          : data.label === "Not Included"
                          ? setCustomExcludedInput
                          : isFilters
                          ? setCustomFilterInput
                          : setCustomSpecialInput;

                        return (
                          <FormField
                            key={data.id}
                            control={form.control}
                            name={data.id as keyof FormDataType}
                            render={({ field }) => (
                              <FormItem className={data.className}>
                                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                                  <div
                                    className={`w-5 h-5 rounded flex items-center justify-center ${
                                      isIncluded
                                        ? "bg-green-100"
                                        : data.label === "Not Included"
                                        ? "bg-red-100"
                                        : isFilters
                                        ? "bg-purple-100"
                                        : "bg-blue-100"
                                    }`}
                                  >
                                    {isIncluded ? (
                                      <Plus className="h-3 w-3 text-green-600" />
                                    ) : data.label === "Not Included" ? (
                                      <Minus className="h-3 w-3 text-red-600" />
                                    ) : isFilters ? (
                                      <Plus className="h-3 w-3 text-purple-600" />
                                    ) : (
                                      <Plus className="h-3 w-3 text-blue-600" />
                                    )}
                                  </div>
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    {data.label}
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <div className="space-y-3 mt-3">
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder={data.placeholder}
                                        className={`flex-1 border-gray-200 font-instrument ${
                                          isIncluded
                                            ? "focus:border-green-400 focus:ring-green-100"
                                            : data.label === "Not Included"
                                            ? "focus:border-red-400 focus:ring-red-100"
                                            : isFilters
                                            ? "focus:border-purple-400 focus:ring-purple-100"
                                            : "focus:border-blue-400 focus:ring-blue-100"
                                        }`}
                                        value={customInput}
                                        onChange={(e) =>
                                          setCustomInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            const item = customInput.trim();
                                            const currentVals = Array.isArray(
                                              field.value
                                            )
                                              ? (field.value as string[])
                                              : [];
                                            if (
                                              item &&
                                              !currentVals.includes(item)
                                            ) {
                                              field.onChange([
                                                ...currentVals,
                                                item,
                                              ]);
                                              setCustomInput("");
                                            }
                                          }
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                          const item = customInput.trim();
                                          const currentVals = Array.isArray(
                                            field.value
                                          )
                                            ? (field.value as string[])
                                            : [];
                                          if (
                                            item &&
                                            !currentVals.includes(item)
                                          ) {
                                            field.onChange([
                                              ...currentVals,
                                              item,
                                            ]);
                                            setCustomInput("");
                                          }
                                        }}
                                        className={`px-3 text-white ${
                                          isIncluded
                                            ? "bg-green-500 hover:bg-green-600"
                                            : data.label === "Not Included"
                                            ? "bg-red-500 hover:bg-red-600"
                                            : isFilters
                                            ? "bg-purple-500 hover:bg-purple-600"
                                            : "bg-blue-500 hover:bg-blue-600"
                                        }`}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    {Array.isArray(field.value) &&
                                      (field.value as string[]).length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {(field.value as string[]).map(
                                            (
                                              item: string,
                                              itemIndex: number
                                            ) => (
                                              <span
                                                key={itemIndex}
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                                  isIncluded
                                                    ? "bg-green-100 text-green-800"
                                                    : data.label ===
                                                      "Not Included"
                                                    ? "bg-red-100 text-red-800"
                                                    : isFilters
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                                }`}
                                              >
                                                {item}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const newItems = (
                                                      field.value as string[]
                                                    ).filter(
                                                      (_: string, i: number) =>
                                                        i !== itemIndex
                                                    );
                                                    field.onChange(newItems);
                                                  }}
                                                  className={`ml-1 rounded-full p-0.5 transition-colors ${
                                                    isIncluded
                                                      ? "hover:bg-green-200"
                                                      : data.label ===
                                                        "Not Included"
                                                      ? "hover:bg-red-200"
                                                      : isFilters
                                                      ? "hover:bg-purple-200"
                                                      : "hover:bg-blue-200"
                                                  }`}
                                                >
                                                  <Minus className="h-3 w-3" />
                                                </button>
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
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
                                <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                                  <CardContent className="flex flex-col items-center justify-center p-8">
                                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-sm text-muted-foreground mb-4 text-center">
                                      Upload a stunning image that showcases
                                      your trip destination
                                    </p>
                                    <UploadButton label="Choose Image" />
                                  </CardContent>
                                </Card>
                              ) : (
                                <Card className="overflow-hidden">
                                  <div className="relative group">
                                    <AspectRatio
                                      ratio={16 / 9}
                                      className="bg-muted"
                                    >
                                      <Image
                                        fill
                                        src={field.value}
                                        alt="Trip cover"
                                        className="object-cover rounded-lg"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </AspectRatio>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                      <div className="flex gap-2">
                                        <UploadButton label="Change Image" />
                                        <Button
                                          type="button"
                                          onClick={removeImage}
                                          variant="destructive"
                                          size="sm"
                                          className="font-instrument"
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">
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
                                onClick={() => {
                                  if (watchedNoOfDays) {
                                    toast.error(
                                      `Cannot remove day while number of days is set to ${watchedNoOfDays}. Please update the number of days if you want to change the day count and ensure all day data is filled.`,
                                      { duration: 4000 }
                                    );
                                    return;
                                  }
                                  removeDay(index);
                                }}
                                className={`text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-instrument ${
                                  watchedNoOfDays ? "opacity-50" : ""
                                }`}
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
                              name={`dayWiseData.${index}.destination`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 font-instrument">
                                    Destination
                                  </FormLabel>
                                  <FormControl>
                                    <select
                                      {...field}
                                      className="h-11 w-full border border-gray-200 rounded px-3 font-instrument"
                                    >
                                      <option value="">Select stop</option>
                                      {(watchedStops || []).map(
                                        (s: string, si: number) => (
                                          <option key={si} value={s}>
                                            {s}
                                          </option>
                                        )
                                      )}
                                    </select>
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
                                    <div className="space-y-3">
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Add an activity..."
                                          className="flex-1 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument"
                                          value={
                                            customActivityInput[index] || ""
                                          }
                                          onChange={(e) =>
                                            setCustomActivityInput((prev) => ({
                                              ...prev,
                                              [index]: e.target.value,
                                            }))
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              const activity =
                                                customActivityInput[
                                                  index
                                                ]?.trim();
                                              if (
                                                activity &&
                                                !(field.value || []).includes(
                                                  activity
                                                )
                                              ) {
                                                field.onChange([
                                                  ...(field.value || []),
                                                  activity,
                                                ]);
                                                setCustomActivityInput(
                                                  (prev) => ({
                                                    ...prev,
                                                    [index]: "",
                                                  })
                                                );
                                              }
                                            }
                                          }}
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={() => {
                                            const activity =
                                              customActivityInput[
                                                index
                                              ]?.trim();
                                            if (
                                              activity &&
                                              !(field.value || []).includes(
                                                activity
                                              )
                                            ) {
                                              field.onChange([
                                                ...(field.value || []),
                                                activity,
                                              ]);
                                              setCustomActivityInput(
                                                (prev) => ({
                                                  ...prev,
                                                  [index]: "",
                                                })
                                              );
                                            }
                                          }}
                                          className="bg-purple-600 hover:bg-purple-700 text-white px-3"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      {(field.value || []).length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {(field.value || []).map(
                                            (
                                              activity: string,
                                              actIndex: number
                                            ) => (
                                              <span
                                                key={actIndex}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                                              >
                                                {activity}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const newActivities = (
                                                      field.value || []
                                                    ).filter(
                                                      (_: string, i: number) =>
                                                        i !== actIndex
                                                    );
                                                    field.onChange(
                                                      newActivities
                                                    );
                                                  }}
                                                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                                >
                                                  <Minus className="h-3 w-3" />
                                                </button>
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
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
                                        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                                          <CardContent className="flex flex-col items-center justify-center p-6">
                                            <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-xs text-muted-foreground mb-3 text-center font-instrument">
                                              Add an image for this day&apos;s
                                              activities
                                            </p>
                                            {createDayWiseUploadButton(
                                              index,
                                              "Choose Image"
                                            )}
                                          </CardContent>
                                        </Card>
                                      ) : (
                                        <Card className="overflow-hidden">
                                          <div className="relative group">
                                            <AspectRatio
                                              ratio={4 / 3}
                                              className="bg-muted"
                                            >
                                              <Image
                                                fill
                                                src={field.value}
                                                alt={`Day ${index + 1} image`}
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                              />
                                            </AspectRatio>
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <div className="flex gap-2">
                                                {createDayWiseUploadButton(
                                                  index,
                                                  "Change Image"
                                                )}
                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    removeDayWiseImage(index)
                                                  }
                                                  variant="destructive"
                                                  size="sm"
                                                  className="font-instrument"
                                                >
                                                  <X className="h-3 w-3 mr-1" />
                                                  Remove
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </Card>
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
                        onClick={() => {
                          if (watchedNoOfDays) {
                            toast.error(
                              `Cannot add a day while number of days is set to ${watchedNoOfDays}. Please update the number of days if you want to change the day count and ensure all day data is filled.`,
                              { duration: 4000 }
                            );
                            return;
                          }
                          addDay();
                        }}
                        className={`text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300 font-instrument ${
                          watchedNoOfDays ? "opacity-50" : ""
                        }`}
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
                        onClick={handleDraftSubmit}
                        disabled={isSubmitting}
                        variant="outline"
                        className="px-8 py-3 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-instrument flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        {isSubmitting
                          ? isEditMode
                            ? "Updating..."
                            : "Saving..."
                          : isEditMode
                          ? "Update as Draft"
                          : "Save as Draft"}
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
                        type="button"
                        onClick={handleFullSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-instrument flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? isEditMode
                            ? "Updating..."
                            : "Creating..."
                          : isEditMode
                          ? "Update Travel Experience"
                          : "Create Travel Experience"}
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

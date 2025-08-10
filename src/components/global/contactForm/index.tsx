"use client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults
} from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { FormComponentProps } from "@/types/form";
import { createTravelPlan } from "@/actions/host/action";
import { useRouter } from "next/navigation";
import ReactSelect, { StylesConfig, MultiValue } from "react-select";
import { Plus, Minus, Map, Calendar, FileText, Camera, X } from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import Image from "next/image";
import { useEffect, useState } from "react";

type SelectOption = {
  value: string;
  label: string;
};

const getSelectOptions = (options?: string[]) => {
  return options?.map((val) => ({ value: val, label: val })) || [];
};

export const CreateDestinationForm = ({
  FormData,
  FormSchema
}: FormComponentProps) => {
  const schema = FormSchema;
  const router = useRouter();
  const { uploadedFile, UploadButton } = useCloudinaryUpload();

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
            : ""
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
        dayWiseImage: ""
      }
    ],
    // Add tripImage field
    tripImage: ""
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dayWiseData"
  });

  const [dayWiseImages, setDayWiseImages] = useState<{ [key: number]: string }>(
    {}
  );

  console.log(dayWiseImages);

  const addDay = () => {
    const nextDayNumber = fields.length + 1;
    append({
      dayNumber: nextDayNumber,
      title: `Day ${nextDayNumber}`,
      description: "",
      activities: [],
      meals: "",
      accommodation: "",
      dayWiseImage: ""
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
      [dayIndex]: imageUrl
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
          className="bg-white text-purple-700 border-2 border-black rounded-xl px-4 py-2 font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (open) {
              open();
            } else {
              console.error("Cloudinary widget not initialized properly");
            }
          }}
          disabled={!open}
        >
          {label}
        </button>
      )}
    </CldUploadWidget>
  );

  const onSubmit = async (data: z.infer<typeof schema>) => {
    // Log the raw form data to check what we're working with
    console.log("Raw form data:", JSON.stringify(data, null, 2));
    console.log(
      "Day-wise data from form:",
      JSON.stringify(data.dayWiseData, null, 2)
    );

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
          dayWiseImage: day.dayWiseImage || ""
        })
      );
      console.log("whole travel plan: ", data);
      console.log("Submitting day-wise data:", processedDayWiseData);

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
        tripImage: data.tripImage || ""
      });

      if (result?.error) {
        console.error("Failed to create travel plan:", result.error);
      } else {
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

  const selectStyles: StylesConfig<SelectOption, true> = {
    control: (base) => ({
      ...base,
      backgroundColor: "white",
      borderColor: "#e2e8f0",
      color: "#333"
    }),
    menu: (base) => ({ ...base, backgroundColor: "white" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#f3f4f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: "#333"
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "#f3f4f6" }),
    multiValueLabel: (base) => ({ ...base, color: "#333" }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#333",
      ":hover": { backgroundColor: "#e2e8f0" }
    }),
    placeholder: (base) => ({ ...base, color: "#94a3b8" }),
    input: (base) => ({ ...base, color: "#333" })
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50">
      <header className="bg-purple-100 border-b-4 border-black shadow-[0_6px_0_0_rgba(0,0,0,1)] relative z-10">
        <div className="max-w-7xl mx-auto flex items-center h-20 px-6 justify-between">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-purple-700 drop-shadow-[3px_3px_0_rgba(0,0,0,1)] select-none">
            Unplan
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                router.push("/dashboard/host");
              }}
              className="bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] font-bold text-purple-700 px-5 py-2 hover:bg-purple-50 transition-all duration-150"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                router.push("/dashboard/trips");
              }}
              className="bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] font-bold text-yellow-600 px-5 py-2 hover:bg-yellow-50 transition-all duration-150"
            >
              Trips
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] overflow-hidden">
          <div className="border-b-4 border-black bg-yellow-100 px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 border-4 border-black flex items-center justify-center mb-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                <Map className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                Create Your <span className="text-purple-700">Dream Trip</span>
              </h1>
              <p className="text-lg text-gray-700 font-semibold">
                Plan and organize your perfect destination experience
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {FormData.map((data) => {
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
                              <FormLabel className="flex items-center text-sm font-bold text-gray-800 mb-1">
                                {data.id === "tripName" && (
                                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                )}
                                {data.id === "price" && (
                                  <span className="h-4 w-4 text-gray-500 mr-2">
                                    $
                                  </span>
                                )}
                                {data.id === "destination" && (
                                  <Map className="h-4 w-4 text-gray-500 mr-2" />
                                )}
                                {data.label}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type={data.type}
                                  placeholder={data.placeholder}
                                  className="neo-input"
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
                              <FormLabel className="flex items-center text-sm font-bold text-gray-800 mb-1">
                                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                {data.label}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="neo-input"
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
                              <FormLabel className="flex items-center text-sm font-bold text-gray-800 mb-1">
                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                {data.label}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={data.placeholder}
                                  className="neo-input min-h-[100px] resize-none"
                                  {...field}
                                  value={field.value?.toString() ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-gray-500 mt-1">
                                Provide a detailed description of your trip.
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
                          className={`${data.className} md:col-span-2 mt-8 mb-4`}
                        >
                          <div className="w-full text-gray-800 text-xl font-extrabold flex items-center border-b-2 border-black pb-2">
                            <span className="bg-purple-100 p-1 rounded-md mr-2 border-2 border-black">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </span>
                            {data.label}
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
                              <FormLabel className="flex items-center text-sm font-bold text-gray-800 mb-1">
                                {data.label}
                              </FormLabel>
                              <FormControl>
                                <ReactSelect
                                  isMulti
                                  options={getSelectOptions(data.options)}
                                  value={(field.value as string[])?.map(
                                    (val) => ({
                                      value: val,
                                      label: val
                                    })
                                  )}
                                  onChange={(
                                    selected: MultiValue<SelectOption>
                                  ) =>
                                    field.onChange(
                                      selected.map((opt) => opt.value)
                                    )
                                  }
                                  styles={{
                                    ...selectStyles,
                                    control: (base) => ({
                                      ...base,
                                      backgroundColor: "#f3f4f6",
                                      border: "2px solid #000",
                                      borderRadius: "0.75rem",
                                      boxShadow: "4px 4px 0 0 #000",
                                      fontWeight: "bold"
                                    }),
                                    multiValue: (base) => ({
                                      ...base,
                                      backgroundColor: "#e9d5ff",
                                      color: "#6d28d9"
                                    }),
                                    option: (base, state) => ({
                                      ...base,
                                      backgroundColor: state.isSelected
                                        ? "#facc15"
                                        : state.isFocused
                                        ? "#fde68a"
                                        : "#fff",
                                      color: "#333",
                                      fontWeight: "bold"
                                    })
                                  }}
                                  placeholder={data.placeholder}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    }

                    return null;
                  })}
                </div>

                {/* Trip Image Upload Section */}
                <div className="space-y-4">
                  <div className="border-b-2 border-black pb-2">
                    <h3 className="text-lg font-extrabold text-gray-800 flex items-center">
                      <span className="bg-purple-100 p-1 rounded-md mr-2 border-2 border-black">
                        <Camera className="h-4 w-4 text-purple-600" />
                      </span>
                      Trip Image
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="tripImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-800 mb-1">
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
                                  className="w-full h-48 object-cover rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                  <div className="flex gap-2">
                                    <UploadButton label="Change Image" />
                                    <button
                                      type="button"
                                      onClick={removeImage}
                                      className="bg-red-500 text-white border-2 border-black rounded-xl px-4 py-2 font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-red-600 transition-all flex items-center gap-2"
                                    >
                                      <X className="h-4 w-4" />
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

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-gray-900 flex items-center drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">
                      <span className="bg-purple-100 p-1 rounded-md mr-2 border-2 border-black">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </span>
                      Day-by-Day Itinerary
                    </h3>
                  </div>

                  {fields.map((field, index) => {
                    return (
                      <div
                        key={field.id}
                        className="p-6 bg-yellow-50 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-extrabold text-gray-800">
                            Day {index + 1}
                          </h3>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDay(index)}
                              className="bg-red-50 border-2 border-black text-red-600 hover:bg-red-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name={`dayWiseData.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-bold text-gray-800 mb-1">
                                  Day Title
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Arrival & Welcome Ride"
                                    className="neo-input"
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
                                <FormLabel className="text-sm font-bold text-gray-800 mb-1">
                                  Accommodation
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Alpine Lodge in Verbier"
                                    className="neo-input"
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
                                <FormLabel className="text-sm font-bold text-gray-800 mb-1">
                                  Day Description
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe the day's activities and schedule..."
                                    className="neo-input min-h-[100px]"
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
                                <FormLabel className="text-sm font-bold text-gray-800 mb-1">
                                  Meals Included
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Breakfast, lunch, and dinner included"
                                    className="neo-input"
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
                                <FormLabel className="text-sm font-bold text-gray-800 mb-1">
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
                                        label: act
                                      })) || []
                                    }
                                    onChange={(
                                      selected: MultiValue<SelectOption>
                                    ) =>
                                      field.onChange(
                                        selected.map((opt) => opt.value)
                                      )
                                    }
                                    styles={{
                                      ...selectStyles,
                                      control: (base) => ({
                                        ...base,
                                        backgroundColor: "#f3f4f6",
                                        border: "2px solid #000",
                                        borderRadius: "0.75rem",
                                        boxShadow: "4px 4px 0 0 #000",
                                        fontWeight: "bold"
                                      }),
                                      multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: "#e9d5ff",
                                        color: "#6d28d9"
                                      }),
                                      option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected
                                          ? "#facc15"
                                          : state.isFocused
                                          ? "#fde68a"
                                          : "#fff",
                                        color: "#333",
                                        fontWeight: "bold"
                                      })
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Day-wise Image Upload Section */}
                        <div className="space-y-4">
                          <div className="border-b border-gray-300 pb-2">
                            <h4 className="text-md font-bold text-gray-700 flex items-center">
                              <Camera className="h-4 w-4 text-gray-500 mr-2" />
                              Day {index + 1} Image
                            </h4>
                          </div>

                          <FormField
                            control={form.control}
                            name={`dayWiseData.${index}.dayWiseImage`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-bold text-gray-800 mb-1">
                                  Upload Day Image
                                </FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    {!field.value ? (
                                      <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                                        <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-500 mb-3 text-center">
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
                                          className="w-full h-32 object-cover rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
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
                                              className="bg-red-500 text-white border-2 border-black rounded-lg px-3 py-1 font-bold shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:bg-red-600 transition-all flex items-center gap-1 text-sm"
                                            >
                                              <X className="h-3 w-3" />
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
                      className="border-2 border-purple-700 text-purple-700 bg-yellow-50 hover:bg-yellow-100 font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Day
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-black mb-4 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  <h4 className="font-bold text-gray-800 mb-2">
                    Before you submit:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1 font-semibold">
                    <li className="flex items-start">
                      <span className="mr-2">✔️</span>
                      <span>Review all trip details for accuracy</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔️</span>
                      <span>Ensure dates and pricing are correct</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔️</span>
                      <span>Upload a compelling trip cover image</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔️</span>
                      <span>Add day-wise images to enhance your itinerary</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✔️</span>
                      <span>Your trip will be live after submission</span>
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white px-8 py-4 h-auto rounded-lg text-lg font-extrabold border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all duration-300"
                >
                  Create Trip Destination
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="m5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </form>
            </Form>
          </div>

          <div className="border-t-4 border-black bg-yellow-100 px-6 py-4">
            <div className="flex justify-center items-center gap-2 text-gray-700 font-bold">
              <div className="w-12 h-px bg-gray-400" />
              <span className="text-sm">
                Create your perfect travel experience
              </span>
              <div className="w-12 h-px bg-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black py-6 shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600 font-bold">
            <p>© 2024 Unplan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

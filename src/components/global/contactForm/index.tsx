"use client";

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
import ReactSelect, { StylesConfig, MultiValue } from "react-select";
import { Plus, Minus, Map, Calendar, FileText } from "lucide-react";

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
    // Always include a properly structured dayWiseData with at least one day
    dayWiseData: [
      {
        dayNumber: 1,
        title: "",
        description: "",
        activities: [],
        meals: "",
        accommodation: "",
      },
    ],
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dayWiseData",
  });

  // Update the addDay function to ensure each day has required fields
  const addDay = () => {
    const nextDayNumber = fields.length + 1;
    append({
      dayNumber: nextDayNumber,
      title: `Day ${nextDayNumber}`, // Give a default title
      description: "",
      activities: [],
      meals: "",
      accommodation: "",
    });
  };

  const removeDay = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      fields.forEach((_, i) => {
        if (i > index) {
          form.setValue(`dayWiseData.${i - 1}.dayNumber`, i);
        }
      });
    }
  };

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
          },
          index: number
        ) => ({
          dayNumber: index + 1, // Ensure correct day numbering
          title: day.title || `Day ${index + 1}`,
          description: day.description || "",
          activities: Array.isArray(day.activities) ? day.activities : [],
          meals: day.meals || "",
          accommodation: day.accommodation || "",
        })
      );

      console.log("Submitting day-wise data:", processedDayWiseData);

      const result = await createTravelPlan({
        title: data.tripName,
        description: data.description,
        destination: data.destination,
        includedActivities: [],
        restrictions: [],
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
        dayWiseData: processedDayWiseData, // Use the processed data
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
      color: "#333",
    }),
    menu: (base) => ({ ...base, backgroundColor: "white" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#f3f4f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: "#333",
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "#f3f4f6" }),
    multiValueLabel: (base) => ({ ...base, color: "#333" }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#333",
      ":hover": { backgroundColor: "#e2e8f0" },
    }),
    placeholder: (base) => ({ ...base, color: "#94a3b8" }),
    input: (base) => ({ ...base, color: "#333" }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-purple-700">Unplan</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Map className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                Create Your <span className="text-purple-700">Dream Trip</span>
              </h1>
              <p className="text-lg text-gray-600">
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
                              <FormLabel className="flex items-center text-sm font-medium text-gray-700">
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
                                  className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                              <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                {data.label}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                              <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                {data.label}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={data.placeholder}
                                  className="h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                          <div className="w-full text-gray-800 text-xl font-semibold flex items-center border-b border-gray-200 pb-2">
                            <span className="bg-purple-100 p-1 rounded-md mr-2">
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
                              <FormLabel className="flex items-center text-sm font-medium text-gray-700">
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
                                  onChange={(
                                    selected: MultiValue<SelectOption>
                                  ) =>
                                    field.onChange(
                                      selected.map((opt) => opt.value)
                                    )
                                  }
                                  styles={selectStyles}
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

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="bg-purple-100 p-1 rounded-md mr-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </span>
                      Day-by-Day Itinerary
                    </h3>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">
                          Day {index + 1}
                        </h3>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDay(index)}
                            className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`dayWiseData.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Day Title
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Arrival & Welcome Ride"
                                  className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Accommodation
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Alpine Lodge in Verbier"
                                  className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Day Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the day's activities and schedule..."
                                  className="min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Meals Included
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Breakfast, lunch, and dinner included"
                                  className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                              <FormLabel className="text-sm font-medium text-gray-700">
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
                                  onChange={(
                                    selected: MultiValue<SelectOption>
                                  ) =>
                                    field.onChange(
                                      selected.map((opt) => opt.value)
                                    )
                                  }
                                  styles={selectStyles}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addDay}
                      className="border-purple-200 text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Day
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Before you submit:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
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
                        className="h-4 w-4 text-purple-600 mr-2 mt-0.5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Review all trip details for accuracy</span>
                    </li>
                    <li className="flex items-start">
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
                        className="h-4 w-4 text-purple-600 mr-2 mt-0.5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Ensure dates and pricing are correct</span>
                    </li>
                    <li className="flex items-start">
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
                        className="h-4 w-4 text-purple-600 mr-2 mt-0.5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Your trip will be live after submission</span>
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 h-auto rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
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

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-center items-center gap-2 text-gray-500">
              <div className="w-12 h-px bg-gray-300" />
              <span className="text-sm">
                Create your perfect travel experience
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
          </div>
        </div>
      </footer>
    </div>
  );
};

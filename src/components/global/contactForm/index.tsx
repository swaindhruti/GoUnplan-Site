"use client";

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
import { Plus, Minus } from "lucide-react";

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

  const defaultValues = FormData.reduce(
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
    {
      dayWiseData: [
        {
          dayNumber: 1,
          title: "",
          description: "",
          activities: [],
          meals: "",
          accommodation: ""
        }
      ]
    }
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dayWiseData"
  });

  const addDay = () => {
    const nextDayNumber = fields.length + 1;
    append({
      dayNumber: nextDayNumber,
      title: "",
      description: "",
      activities: [],
      meals: "",
      accommodation: ""
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
    console.log(data);
    try {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const noOfDays =
        Math.ceil(
          Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)
        ) + 1;

      const result = await createTravelPlan({
        title: data.tripName,
        description: data.description,
        includedActivities: [],
        destination: data.destination,
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
        filters: data.filters || []
        // dayWiseData: data.dayWiseData || []
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
      backgroundColor: "#1a1a1a",
      borderColor: "#444",
      color: "#fff"
    }),
    menu: (base) => ({ ...base, backgroundColor: "#1a1a1a" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2a2a2a"
        : state.isFocused
        ? "#2a2a2a"
        : "#1a1a1a",
      color: "#fff"
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "#2a2a2a" }),
    multiValueLabel: (base) => ({ ...base, color: "#fff" }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#fff",
      ":hover": { backgroundColor: "#3a3a3a" }
    }),
    placeholder: (base) => ({ ...base, color: "#ccc" }),
    input: (base) => ({ ...base, color: "#fff" })
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 bg-black lg:px-20 py-10 flex flex-col items-center gap-10">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Create Your Dream Trip
        </h1>
        <p className="text-lg text-white/70">
          Plan and organize your perfect destination experience
        </p>
      </div>

      <div className="w-full max-w-3xl p-6 rounded-xl bg-[#111111] shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-6"
          >
            {FormData.map((data) => {
              if (["text", "email", "tel", "number"].includes(data.type)) {
                return (
                  <FormField
                    key={data.id}
                    control={form.control}
                    name={data.id}
                    render={({ field }) => (
                      <FormItem className={data.className}>
                        <FormLabel className="text-sm font-bold text-white">
                          {data.label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={data.type}
                            placeholder={data.placeholder}
                            className="bg-[#1a1a1a] border border-white/20 text-white placeholder:text-white/60 focus:bg-[#2a2a2a]"
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
                        <FormLabel className="text-sm font-bold text-white">
                          {data.label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-[#1a1a1a] border border-white/20 text-white placeholder:text-white/60 focus:bg-[#2a2a2a]"
                            {...field}
                            value={formatDateForInput(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? new Date(e.target.value) : ""
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
                      <FormItem className={data.className}>
                        <FormLabel className="text-sm font-bold text-white">
                          {data.label}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={data.placeholder}
                            className="bg-[#1a1a1a] border border-white/20 text-white placeholder:text-white/60 min-h-[120px] focus:bg-[#2a2a2a]"
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

              if (data.type === "sectionHead") {
                return (
                  <div key={data.id} className={`${data.className}`}>
                    <div className="w-full text-white text-2xl font-semibold flex justify-center items-center">
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
                        <FormLabel className="text-sm font-bold text-white">
                          {data.label}
                        </FormLabel>
                        <FormControl>
                          <ReactSelect
                            isMulti
                            options={getSelectOptions(data.options)}
                            value={(field.value as string[])?.map((val) => ({
                              value: val,
                              label: val
                            }))}
                            onChange={(selected: MultiValue<SelectOption>) =>
                              field.onChange(selected.map((opt) => opt.value))
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

            <div className="col-span-2 space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-6 bg-[#1a1a1a] rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Day {index + 1}
                    </h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDay(index)}
                        className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
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
                          <FormLabel className="text-sm font-bold text-white">
                            Day Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Arrival & Welcome Ride"
                              className="bg-[#2a2a2a] border border-white/20 text-white placeholder:text-white/60"
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
                          <FormLabel className="text-sm font-bold text-white">
                            Accommodation
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Alpine Lodge in Verbier"
                              className="bg-[#2a2a2a] border border-white/20 text-white placeholder:text-white/60"
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
                          <FormLabel className="text-sm font-bold text-white">
                            Day Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the day's activities and schedule..."
                              className="bg-[#2a2a2a] border border-white/20 text-white placeholder:text-white/60 min-h-[100px]"
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
                          <FormLabel className="text-sm font-bold text-white">
                            Meals Included
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Breakfast, lunch, and dinner included"
                              className="bg-[#2a2a2a] border border-white/20 text-white placeholder:text-white/60"
                              {...field}
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
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Day
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              onClick={async () => {
                console.log("Button clicked!");
                console.log("Form values:", form.getValues());

                console.log("Form errors:", form.formState.errors);
                console.log("Is form valid?", form.formState.isValid);

                const isValid = await form.trigger();
                console.log("Manual validation result:", isValid);
                console.log(
                  "Errors after manual trigger:",
                  form.formState.errors
                );
              }}
              className="col-span-2 z-50 h-14 text-lg font-semibold bg-white text-black hover:bg-gray-200 transition-all rounded-md"
            >
              Create Trip Destination
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

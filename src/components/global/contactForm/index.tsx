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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateDestinationFormData } from "@/config/form/formData/CreateDestinationData";
import { CreateDestinationSchema } from "@/config/form/formSchemaData/CreateDestinationSchema";

export const CreateDestinationForm = () => {
  const schema = CreateDestinationSchema;

  const defaultValues = CreateDestinationFormData.reduce(
    (acc, field) => ({
      ...acc,
      [field.id]: field.type === "number" ? "" : ""
    }),
    {}
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log("Trip Destination Data:", data);
    // await submit(data);
  };

  return (
    <div
      id="trip-destination-form"
      // style={{ backgroundColor: "#000000" }}
      className="min-h-screen px-[16px] sm:px-6 bg-black lg:px-20 py-10 flex flex-col items-center gap-10 mt-0 relative"
    >
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Create Your Dream Trip
        </h1>
        <p className="text-lg text-white/70">
          Plan and organize your perfect destination experience
        </p>
      </div>

      <div
        style={{
          borderRadius: "11px",
          background: "#111111",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)"
        }}
        className="w-full max-w-3xl p-6 backdrop-blur-md relative z-10"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:grid md:grid-cols-2 gap-6"
          >
            {CreateDestinationFormData.map((data) => {
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
                            className="py-[14px] bg-[#1a1a1a] border border-white/20 text-white placeholder:text-white/60 focus:bg-[#2a2a2a]"
                            {...field}
                            value={field.value ?? ""}
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
                            className="py-[14px] bg-[#1a1a1a] border border-white/20 text-white placeholder:text-white/60 min-h-[120px] focus:bg-[#2a2a2a]"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (data.type === "select" && Array.isArray(data.options)) {
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString() ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#1a1a1a] border border-white/20 text-white hover:bg-[#2a2a2a]">
                              <SelectValue placeholder={data.placeholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              return null;
            })}

            <Button
              type="submit"
              className="col-span-2 h-14 flex justify-center items-center text-xl font-semibold bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all duration-200 rounded-md"
            >
              Create Trip Destination
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

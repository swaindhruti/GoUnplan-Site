"use client";

import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import {
  signupFormSchema,
  type SignupForm as SignupFormData,
} from "@/lib/validation";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading: boolean;
  serverError: string | null;
}

export function SignupForm({
  onSubmit,
  isLoading,
  serverError,
}: SignupFormProps) {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white pt-0 relative pb-0">
      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 border-3 border-black transform rotate-12 rounded-xl"></div>
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 border-3 border-black rounded-xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      ></motion.div>

      <CardHeader className="border-b-3 border-black bg-pink-400 p-6 rounded-t-2xl relative">
        {/* Floating bubbles decoration */}
        <motion.div
          className="absolute right-8 top-5"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-green-300 rounded-full border border-black"></div>
        </motion.div>
        <motion.div
          className="absolute right-14 top-8"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, delay: 0.3, repeat: Infinity }}
        >
          <div className="w-4 h-4 bg-yellow-300 rounded-full border border-black"></div>
        </motion.div>
        <motion.div
          className="absolute right-20 top-6"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, delay: 0.5, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-blue-300 rounded-full border border-black"></div>
        </motion.div>

        <CardTitle className="text-2xl font-black text-black uppercase">
          SIGN UP DETAILS
        </CardTitle>
        <CardDescription className="text-black font-bold">
          Fill out the form below to create your Unplan account
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 relative">
        {/* Decorative Element */}
        <motion.div
          className="absolute right-5 top-5 w-8 h-8"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Star
            className="w-8 h-8 text-yellow-400"
            fill="yellow"
            strokeWidth={1.5}
          />
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="bg-pink-400 border-3 border-black text-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center">
                    <AlertCircle
                      className="mr-2 h-4 w-4 text-black"
                      strokeWidth={2.5}
                    />
                    <AlertDescription className="font-bold">
                      {serverError}
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Decorative elements */}
              <motion.div
                className="absolute -left-3 -top-3 w-6 h-6 bg-purple-400 border-2 border-black rounded-full z-10"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>

              <motion.div
                className="absolute -right-3 bottom-10 w-6 h-6 bg-green-400 border-2 border-black rounded-full z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              ></motion.div>

              <FormInputField
                name="firstName"
                label="FIRST NAME"
                icon={
                  <div className="bg-blue-300 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <User className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                }
                placeholder="Enter first name"
                bgColor="bg-blue-200"
                isLoading={isLoading}
                control={form.control}
              />

              <FormInputField
                name="lastName"
                label="LAST NAME"
                icon={
                  <div className="bg-green-300 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <User className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                }
                placeholder="Enter last name"
                bgColor="bg-green-200"
                isLoading={isLoading}
                control={form.control}
              />

              <FormInputField
                name="email"
                label="EMAIL"
                icon={
                  <div className="bg-blue-400 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <Mail className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                }
                placeholder="you@example.com"
                type="email"
                bgColor="bg-blue-300"
                isLoading={isLoading}
                control={form.control}
              />

              <FormInputField
                name="phone"
                label="PHONE"
                icon={
                  <div className="bg-yellow-300 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <Phone className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                }
                placeholder="+1 234 567 8900"
                type="tel"
                bgColor="bg-yellow-200"
                isLoading={isLoading}
                control={form.control}
              />

              <FormInputField
                name="password"
                label="PASSWORD"
                icon={
                  <div className="bg-pink-300 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <Lock className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                }
                placeholder="••••••••"
                type="password"
                bgColor="bg-pink-200"
                isLoading={isLoading}
                control={form.control}
              />

              <FormInputField
                name="confirmPassword"
                label="CONFIRM PASSWORD"
                icon={
                  <div className="bg-green-400 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <Lock className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                }
                placeholder="••••••••"
                type="password"
                bgColor="bg-green-300"
                isLoading={isLoading}
                control={form.control}
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02, rotate: -0.5 }}
              whileTap={{ scale: 0.98 }}
              className="relative mt-8"
            >
              {/* Decorative zigzag */}
              <motion.div
                className="absolute -top-4 -right-4 text-purple-400"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-black uppercase py-4 border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-3 border-t-transparent border-black rounded-full animate-spin mr-2"></div>
                    <span>CREATING ACCOUNT...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center border-t-3 border-black p-5 bg-orange-200 rounded-b-2xl relative">
        {/* Decorative corner dots */}
        <motion.div
          className="absolute left-2 bottom-2 w-3 h-3 bg-purple-500 rounded-full border-2 border-black"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute right-2 bottom-2 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        ></motion.div>

        <p className="font-bold text-black">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="bg-blue-300 px-2 py-1 border-2 border-black inline-block hover:bg-blue-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-xl"
          >
            SIGN IN HERE
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

// Input field sub-component
interface FormInputFieldProps {
  name: keyof SignupFormData;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  bgColor: string;
  isLoading: boolean;
  control: Control<SignupFormData>;
}

function FormInputField({
  name,
  label,
  icon,
  placeholder,
  type = "text",
  bgColor,
  isLoading,
  control,
}: FormInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, formState }) => (
        <FormItem>
          <motion.div whileHover={{ x: 2 }}>
            <FormLabel className="flex items-center text-base font-black text-black mb-1">
              {icon}
              {label}
            </FormLabel>
          </motion.div>
          <FormControl>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                disabled={isLoading}
                className={`px-3 py-3 border-3 border-black rounded-2xl text-black font-bold focus:outline-none focus:ring-2 ${bgColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
              />
            </motion.div>
          </FormControl>
          {formState.errors[name] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 font-bold text-black bg-yellow-300 border-2 border-black p-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl"
            >
              <span className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" strokeWidth={2.5} />
                <FormMessage />
              </span>
            </motion.div>
          )}
        </FormItem>
      )}
    />
  );
}

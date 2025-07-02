"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight,
  User,
  ChevronLeft,
  Plane,
  Star,
  Compass,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import DotGridBackgroundProvider from "@/components/providers/dotGridBackgroundProvider";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// Component that uses useSearchParams
function SignInForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: "Invalid email or password" });
      } else if (result?.ok) {
        const session = await getSession();
        if (session) {
          router.push("/");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Signin error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-green-200 border-3 border-black text-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center">
                <CheckCircle2
                  className="mr-2 h-4 w-4 text-black"
                  strokeWidth={2.5}
                />
                <AlertDescription className="font-bold">
                  {successMessage}
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}

        {errors.general && (
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
                  {errors.general}
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Decorative Element */}
          <motion.div
            className="absolute right-5 top-32 w-8 h-8"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Star
              className="w-8 h-8 text-yellow-400"
              fill="yellow"
              strokeWidth={1.5}
            />
          </motion.div>

          {/* Email Field */}
          <div className="space-y-2">
            <motion.label
              htmlFor="email"
              className="flex items-center text-base font-black text-black"
              whileHover={{ x: 2 }}
            >
              <div className="bg-blue-300 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                <Mail className="h-4 w-4 text-black" strokeWidth={2.5} />
              </div>
              EMAIL ADDRESS
            </motion.label>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border-3 ${
                  errors.email
                    ? "border-red-500 bg-red-100"
                    : "border-black bg-blue-200"
                } rounded-2xl text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                placeholder="your.email@example.com"
              />
            </motion.div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-bold text-black bg-yellow-300 border-2 border-black p-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl"
              >
                <span className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" strokeWidth={2.5} />
                  {errors.email}
                </span>
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2 relative">
            {/* Decorative Element */}

            <motion.label
              htmlFor="password"
              className="flex items-center text-base font-black text-black"
              whileHover={{ x: 2 }}
            >
              <div className="bg-green-300 p-1 border-2 border-black mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                <Lock className="h-4 w-4 text-black" strokeWidth={2.5} />
              </div>
              PASSWORD
            </motion.label>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border-3 ${
                  errors.password
                    ? "border-red-500 bg-red-100"
                    : "border-black bg-green-200"
                } rounded-2xl text-black font-bold focus:outline-none focus:ring-2 focus:ring-green-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                placeholder="••••••••"
              />
            </motion.div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-bold text-black bg-yellow-300 border-2 border-black p-2 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl"
              >
                <span className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" strokeWidth={2.5} />
                  {errors.password}
                </span>
              </motion.p>
            )}

            {/* Decorative Element */}
            <motion.div
              className="absolute -right-2 bottom-2 w-5 h-5 bg-yellow-300 border-2 border-black rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            ></motion.div>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02, rotate: -0.5 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 relative"
        >
          {/* Decorative zigzag */}
          <motion.div
            className="absolute -top-4 -right-4 text-purple-400"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="h-6 w-6" strokeWidth={2.5} />
          </motion.div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase py-4 border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-3 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                <span>SIGNING IN...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>SIGN IN</span>
                <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} />
              </div>
            )}
          </Button>
        </motion.div>
      </form>
    </CardContent>
  );
}

// Loading fallback component
function SignInFallback() {
  return (
    <CardContent className="p-6">
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-2xl h-12 w-12 border-t-8 border-l-8 border-r-8 border-b-8 border-b-transparent border-black"></div>
      </div>
    </CardContent>
  );
}

export default function SignInPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isOverCard, setIsOverCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Track mouse position for custom cursor
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Check if cursor is over any card or interactive element
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const isOver =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        setIsOverCard(isOver);
      }
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);

  return (
    <>
      {/* Custom plane cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
          isOverCard ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%)`,
        }}
      >
        <div className="relative">
          <Plane
            className="h-14 w-14 text-black fill-amber-500 rotate-22.5"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Hide default cursor when custom cursor is visible */}
      <style jsx global>{`
        @media (min-width: 768px) {
          body {
            cursor: none;
          }
          .content-card {
            cursor: default;
          }
          .content-card button,
          .content-card a,
          .content-card input,
          .nav-button {
            cursor: pointer;
          }
        }
      `}</style>

      <DotGridBackgroundProvider
        dotSize={4}
        gap={20}
        baseColor="#c3c3c3"
        activeColor="#7c3aed"
        proximity={140}
        shockRadius={200}
        shockStrength={6}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-yellow-300 border-b-4 border-black relative z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-3xl font-black text-black uppercase flex items-center"
                >
                  <ChevronLeft className="h-6 w-6 mr-1" strokeWidth={2.5} />
                  UNPLAN
                </motion.div>
              </Link>
              <div className="flex items-center space-x-4">
                {/* Decorative Element */}
                <motion.div
                  className="hidden md:block mr-4 bg-pink-400 p-2 rounded-full border-3 border-black"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Compass className="h-5 w-5 text-black" strokeWidth={2.5} />
                </motion.div>

                <Link href="/auth/signup">
                  <Button className="nav-button text-black bg-white border-3 border-black rounded-2xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <User className="mr-2 h-5 w-5" strokeWidth={2.5} />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 items-center justify-center px-4 py-12 relative">
            {/* Decorative elements - kept within screen boundaries */}
            <motion.div
              initial={{ rotate: -12 }}
              animate={{ rotate: [-12, -5, -12] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute top-10 right-[5%] w-12 h-12 bg-green-400 border-3 border-black rounded-2xl hidden md:block"
            ></motion.div>
            <motion.div
              initial={{ rotate: 12 }}
              animate={{ rotate: [12, 5, 12] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute bottom-10 left-[5%] w-10 h-10 bg-blue-400 border-3 border-black rounded-2xl hidden md:block"
            ></motion.div>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-32 left-[10%] w-6 h-6 bg-pink-400 border-3 border-black rounded-full hidden md:block"
            ></motion.div>

            {/* New decorative elements */}
            <motion.div
              className="absolute bottom-[15%] right-[15%] w-14 h-14 flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>

            <motion.div
              className="absolute top-[20%] left-[20%] w-8 h-8 bg-yellow-300 border-3 border-black rounded-full hidden md:block"
              animate={{
                scale: [1, 1.2, 1],
                backgroundColor: ["#fde047", "#fbbf24", "#fde047"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>

            <motion.div
              className="absolute top-[35%] right-[8%] flex items-center justify-center md:flex"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-5 h-5 bg-purple-400 border-2 border-black rounded-full"></div>
              <div
                className="w-5 h-5 bg-blue-400 border-2 border-black rounded-full absolute"
                style={{ transform: "translateX(10px)" }}
              ></div>
              <div
                className="w-5 h-5 bg-green-400 border-2 border-black rounded-full absolute"
                style={{ transform: "translateY(10px)" }}
              ></div>
            </motion.div>

            <motion.div
              className="absolute bottom-70 right-50 z-10"
              animate={{
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="bg-yellow-300 p-2 rounded-full border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Star
                  className="h-8 w-8 text-black"
                  fill="black"
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md content-card relative"
              ref={cardRef}
            >
              {/* Additional decorative element */}

              <Card className="border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white pt-0 pb-0 transform">
                {/* Header decoration squares with rounded corners */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 border-3 border-black transform rotate-12 rounded-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-pink-400 border-3 border-black transform -rotate-12 rounded-xl"></div>

                <CardHeader className="border-b-3 border-black bg-purple-500 p-6 relative rounded-t-2xl">
                  <motion.div
                    className="absolute -right-3 -top-3 w-10 h-10 bg-blue-300 border-3 border-black transform rounded-xl"
                    animate={{ rotate: [-12, 0, -12] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  ></motion.div>

                  {/* Floating bubbles decoration */}
                  <motion.div
                    className="absolute left-5 top-5"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 bg-pink-300 rounded-full border border-black"></div>
                  </motion.div>
                  <motion.div
                    className="absolute left-10 top-8"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.5, delay: 0.3, repeat: Infinity }}
                  >
                    <div className="w-4 h-4 bg-blue-300 rounded-full border border-black"></div>
                  </motion.div>
                  <motion.div
                    className="absolute left-16 top-6"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.8, delay: 0.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-yellow-300 rounded-full border border-black"></div>
                  </motion.div>

                  <CardTitle className="text-2xl font-black text-center text-white uppercase">
                    WELCOME BACK
                  </CardTitle>
                  <CardDescription className="text-center text-white font-bold mt-2">
                    Sign in to continue your adventure
                  </CardDescription>
                </CardHeader>

                {/* Wrap the component using useSearchParams in Suspense */}
                <Suspense fallback={<SignInFallback />}>
                  <SignInForm />
                </Suspense>

                {/* Optional footer inside card */}
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
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="bg-blue-300 px-2 py-1 border-2 border-black inline-block hover:bg-blue-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-xl"
                    >
                      SIGN UP NOW
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="bg-yellow-300 border-t-4 border-black py-6 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <p className="uppercase font-black text-black">
                © 2025 UNPLAN. ALL RIGHTS RESERVED.
              </p>
              <div className="hidden md:flex space-x-2">
                {[1, 2, 3].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className={`w-3 h-12 ${
                      i === 0
                        ? "bg-blue-400"
                        : i === 1
                        ? "bg-pink-400"
                        : "bg-green-400"
                    } border-2 border-black rounded-t-lg`}
                  ></motion.div>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </DotGridBackgroundProvider>
    </>
  );
}

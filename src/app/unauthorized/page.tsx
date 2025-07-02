"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft, ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-yellow-300 border-b-4 border-black">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-3xl font-black text-black uppercase flex items-center"
            >
              <ChevronLeft className="h-6 w-6 mr-1" strokeWidth={2.5} />
              UNPLAN
            </motion.div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button className="text-black bg-white border-3 border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-400 text-black border-3 border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-pink-400 border-3 border-black -rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-400 border-3 border-black rotate-12 hidden lg:block"></div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-3 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
            <CardHeader className="border-b-3 border-black bg-red-400 p-6 text-center">
              <div className="mx-auto h-20 w-20 bg-white border-3 border-black flex items-center justify-center mb-4">
                <ShieldAlert
                  className="h-12 w-12 text-black"
                  strokeWidth={2.5}
                />
              </div>
              <CardTitle className="text-2xl font-black text-center text-black uppercase">
                Access Denied
              </CardTitle>
              <CardDescription className="text-center text-black font-bold mt-2">
                You don&apos;t have permission to access this resource
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 text-center p-8">
              <p className="text-black font-bold mb-6">
                You don&apos;t have permission to access this page. Please
                contact an administrator if you believe this is an error.
              </p>
              <div className="bg-yellow-300 rounded-none p-4 text-black font-bold border-3 border-black">
                <p>
                  If you recently registered as a host, your account may still
                  be under review.
                </p>
                <p className="mt-2">
                  Please check back later or contact support for assistance.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-4 pb-6 border-t-3 border-black bg-gray-100">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  className="w-full bg-blue-400 hover:bg-blue-500 text-black border-3 border-black rounded-none font-black uppercase py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                >
                  <Link
                    href="/dashboard/user"
                    className="flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" strokeWidth={2.5} /> Go
                    to Dashboard
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  className="w-full bg-green-400 hover:bg-green-500 text-black border-3 border-black rounded-none font-black uppercase py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                >
                  <Link href="/" className="flex items-center justify-center">
                    <Home className="mr-2 h-5 w-5" strokeWidth={2.5} /> Return
                    to Home
                  </Link>
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-yellow-300 border-t-4 border-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-black font-bold">
            <p className="uppercase font-black">
              © 2025 UNPLAN. ALL RIGHTS RESERVED.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              {["Privacy Policy", "Terms of Service", "Help"].map((text, i) => (
                <Link
                  key={i}
                  href="#"
                  className="bg-white px-3 py-1 border-2 border-black hover:bg-pink-300 transition-colors"
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";
import React from "react";
// import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

const BookingSummaryLoader = () => (
  <div className="flex flex-col items-center justify-center h-screen py-16">
    <div className="animate-bounce bg-blue-400 border-4 border-black rounded-lg h-20 w-20 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-6">
      <FileText className="h-10 w-10 text-black" />
    </div>
    <span className="text-2xl font-bold text-black ">
      Loading booking summary...
    </span>
  </div>
);

export default BookingSummaryLoader;

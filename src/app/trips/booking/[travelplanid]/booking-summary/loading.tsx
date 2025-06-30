"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BookingSummaryLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className=" p-6 space-y-2">
            <Skeleton className="h-6 w-2/3 " />
            <Skeleton className="h-4 w-1/3 " />
            <Skeleton className="h-3 w-full " />
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4 space-y-2"
                >
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 border rounded bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-center text-sm text-gray-500">
              <Skeleton className="h-3 w-1/2 mx-auto" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>

            <Skeleton className="h-3 w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryLoader;

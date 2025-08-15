"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-2 bg-red-600/80 backdrop-blur-sm rounded-full mb-4">
              <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                Error Loading
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
              Something Went
              <span className="block text-red-300 mt-2">Wrong</span>
            </h1>
            <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
              We encountered an error while loading your trips
            </p>
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-bricolage">
                Unable to Load Your Trips
              </h2>
              
              <p className="text-gray-600 font-instrument mb-2 max-w-md mx-auto">
                We&apos;re having trouble accessing your travel history right now. 
                This could be a temporary issue.
              </p>
              
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 text-left max-w-2xl mx-auto">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-instrument">
                    Technical Details (Development Mode)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs text-gray-800 overflow-auto">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  onClick={reset}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-instrument flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 font-instrument flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-instrument">
                  <strong>Need help?</strong> If this problem persists, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
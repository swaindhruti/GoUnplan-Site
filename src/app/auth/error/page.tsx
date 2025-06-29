"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Create a separate component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "AccessDenied":
          setError("You do not have access to this resource.");
          break;
        case "CredentialsSignin":
          setError(
            "Invalid credentials. Please check your email and password."
          );
          break;
        case "OAuthAccountNotLinked":
          setError(
            "To confirm your identity, sign in with the same account you used originally."
          );
          break;
        default:
          setError("An authentication error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  return (
    <CardContent className="pt-6">
      {error && (
        <Alert
          variant="destructive"
          className="mb-6 bg-red-50 border-red-200 text-red-800"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="text-center text-sm text-gray-600 mt-2 bg-gray-50 p-4 rounded-lg">
        <p>Please try again or contact support if the issue persists.</p>
        <p className="mt-2">
          You can also try using a different authentication method.
        </p>
      </div>
    </CardContent>
  );
}

// Fallback component to show while loading
function ErrorFallback() {
  return (
    <CardContent className="pt-6">
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
      <div className="text-center text-sm text-gray-600 mt-2 bg-gray-50 p-4 rounded-lg">
        <p>Loading error details...</p>
      </div>
    </CardContent>
  );
}

export default function AuthError() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="text-purple-600 bg-white border-purple-200 hover:bg-purple-50"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="space-y-1 border-b border-gray-100 bg-gray-50 rounded-t-lg">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              There was a problem with your authentication request
            </CardDescription>
          </CardHeader>

          {/* Wrap the component using useSearchParams in Suspense */}
          <Suspense fallback={<ErrorFallback />}>
            <ErrorContent />
          </Suspense>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5"
            >
              <Link
                href="/auth/signin"
                className="flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 py-5"
            >
              <Link href="/" className="flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" /> Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Unplan. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

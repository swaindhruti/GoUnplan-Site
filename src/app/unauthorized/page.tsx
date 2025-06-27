import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
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
          <CardHeader className="space-y-1 border-b border-gray-100 bg-gray-50 rounded-t-lg text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Access Denied
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              You don&apos;t have permission to access this resource
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to access this page. Please contact
              an administrator if you believe this is an error.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 border border-gray-200">
              <p>
                If you recently registered as a host, your account may still be
                under review.
              </p>
              <p className="mt-2">
                Please check back later or contact support for assistance.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5"
            >
              <Link
                href="/dashboard/user"
                className="flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Go to Dashboard
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

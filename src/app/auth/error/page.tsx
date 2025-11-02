'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Create a separate component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'AccessDenied':
          setError('You do not have access to this resource.');
          break;
        case 'CredentialsSignin':
          setError('Invalid credentials. Please check your email and password.');
          break;
        case 'OAuthAccountNotLinked':
          setError('To confirm your identity, sign in with the same account you used originally.');
          break;
        default:
          setError('An authentication error occurred. Please try again.');
      }
    }
  }, [searchParams]);

  return (
    <CardContent className="p-6">
      {error && (
        <Alert className="mb-6 bg-[#ffadad] border-3 border-black rounded-xl p-4 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-full border-2 border-black">
            <AlertCircle className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <AlertTitle className="font-black text-black">Error</AlertTitle>
            <AlertDescription className="font-bold text-black">{error}</AlertDescription>
          </div>
        </Alert>
      )}
      <div className="bg-white border-3 border-black rounded-xl p-4 text-center font-bold text-black">
        <p>Please try again or contact support if the issue persists.</p>
        <p className="mt-2">You can also try using a different authentication method.</p>
      </div>
    </CardContent>
  );
}

// Fallback component to show while loading
function ErrorFallback() {
  return (
    <CardContent className="p-6">
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div>
      </div>
      <div className="bg-white border-3 border-black rounded-xl p-4 text-center font-bold text-black">
        <p>Loading error details...</p>
      </div>
    </CardContent>
  );
}

export default function AuthError() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      {/* Header */}
      <header className="bg-[#e0c6ff] border-b-3 border-black py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-black text-black flex items-center">
            <div className="bg-white p-2 rounded-md border-2 border-black mr-2">
              <User className="h-6 w-6 text-black" strokeWidth={2.5} />
            </div>
            Unplan
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                className="bg-white text-black font-black uppercase 
                         border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                         hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-200 px-6 py-3"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden py-0">
          <CardHeader className="space-y-1 border-b-3 border-black bg-[#ffadad] p-6">
            <div className="bg-white p-3 rounded-full border-3 border-black mx-auto mb-3 w-16 h-16 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-black" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-2xl font-black text-black uppercase text-center">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-black font-bold text-center">
              There was a problem with your authentication request
            </CardDescription>
          </CardHeader>

          {/* Wrap the component using useSearchParams in Suspense */}
          <Suspense fallback={<ErrorFallback />}>
            <ErrorContent />
          </Suspense>

          <CardFooter className="flex flex-col space-y-4 pt-4 pb-6 border-t-3 border-black bg-[#fdffb6] p-6">
            <Button
              asChild
              className="w-full bg-[#a0c4ff] text-black font-black uppercase 
                       border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-200 py-4 h-14
                       rounded-xl"
            >
              <Link href="/auth/signin" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
                Back to Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-white text-black font-black uppercase 
                       border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-200 py-4 h-14
                       rounded-xl"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="h-5 w-5" strokeWidth={2.5} />
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-[#e0c6ff] border-t-3 border-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-bold text-black">© 2024 Unplan. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-3">
              <Link
                href="#"
                className="font-bold text-black border-b-2 border-black hover:bg-[#fdffb6] px-1"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="font-bold text-black border-b-2 border-black hover:bg-[#fdffb6] px-1"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="font-bold text-black border-b-2 border-black hover:bg-[#fdffb6] px-1"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

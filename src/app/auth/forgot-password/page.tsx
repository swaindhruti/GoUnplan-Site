'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Mail, ArrowLeft, Compass, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendPasswordResetEmail } from '@/actions/password-reset/actions';

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

function ForgotPasswordForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError, {
        style: {
          background: 'rgba(147, 51, 234, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 181, 253, 0.3)',
          color: 'white',
          fontFamily: 'var(--font-instrument)',
        },
        duration: 4000,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await sendPasswordResetEmail(formData.email.trim());

      setIsSubmitted(true);
      toast.success('Password reset link sent to your email!', {
        style: {
          background: 'rgba(147, 51, 234, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 181, 253, 0.3)',
          color: 'white',
          fontFamily: 'var(--font-instrument)',
        },
        duration: 5000,
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrors({ general: errorMessage });
      toast.error(errorMessage, {
        style: {
          background: 'rgba(147, 51, 234, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 181, 253, 0.3)',
          color: 'white',
          fontFamily: 'var(--font-instrument)',
        },
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full">
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-bricolage">Check Your Email</h1>
            <p className="text-gray-600 font-instrument mt-2">
              We&apos;ve sent a password reset link to <strong>{formData.email}</strong>
            </p>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-instrument">
              If an account with this email exists, you&apos;ll receive a password reset link within
              a few minutes.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-instrument text-center">
              Didn&apos;t receive an email? Check your spam folder or try again.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full h-12 border-gray-200 hover:bg-gray-50 font-instrument"
              >
                Try Another Email
              </Button>

              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  className="w-full h-12 border-purple-200 text-purple-600 hover:bg-purple-50 font-instrument"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="text-center">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-bricolage">Forgot Password?</h1>
          <p className="text-gray-600 font-instrument mt-2">
            No worries! Enter your email and we&apos;ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-instrument">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 font-instrument">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-100 font-instrument ${
                    errors.email ? 'border-red-400' : ''
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 font-instrument mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold font-instrument shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Sending Reset Link...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Send Reset Link</span>
              </div>
            )}
          </Button>

          <div className="text-center">
            <Link href="/auth/signin">
              <Button
                variant="ghost"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-instrument"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-2">
              <Compass className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 font-bricolage">GoUnplan</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-instrument font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 font-instrument"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
        {/* Right Side - Image */}
        <div className="hidden lg:block flex-1 relative">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
            alt="Mountain landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-2xl font-bold font-bricolage mb-2">Secure Your Journey</h2>
            <p className="text-white/80 font-instrument">
              Reset your password and get back to exploring amazing destinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

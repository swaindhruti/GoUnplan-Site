'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookingProgress } from './BookingProgress';
import { GuestInformationForm } from './GuestInformation';
import { useBookingStore } from '@/store/booking-store';
import type { TravelPlan, BookingFormData, BookingData } from '@/types/booking';
import { Loader2, Calendar, Users, DollarSign, MessageCircle, Languages, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BookingPageProps {
  userId: string;
  existingBookingData: Partial<BookingData>;
  tripData: TravelPlan;
  existingBookingId?: string;
  Step?: number;
  bookingId: string;
}

const EnhancedLoadingState = () => {
  const [loadingText, setLoadingText] = useState('Preparing your booking...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messages = [
      'Preparing your booking...',
      'Processing guest information...',
      'Securing your spot...',
      'Almost ready...',
    ];
    let messageIndex = 0;
    let progressValue = 0;

    const interval = setInterval(() => {
      progressValue += 25;
      setProgress(progressValue);
      if (messageIndex < messages.length - 1) {
        setLoadingText(messages[messageIndex]);
        messageIndex++;
      }
      if (progressValue >= 100) {
        clearInterval(interval);
        setLoadingText('Finalizing booking...');
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 font-bricolage">{loadingText}</h2>
        <p className="text-gray-600 text-sm font-instrument mb-6">
          Please don&apos;t close this page while we create your booking
        </p>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 font-instrument">{progress}% complete</p>
      </div>
    </div>
  );
};

export function BookingPage({
  userId,
  tripData,
  existingBookingData,
  Step,
  bookingId,
}: BookingPageProps) {
  const [currentStep, setCurrentStep] = useState(Step || 1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bookingData = useBookingStore(state => state.bookingData);
  const router = useRouter();
  const isLoading = useBookingStore(state => state.isLoading);
  const updateBookingData = useBookingStore(state => state.updateBookingData);
  const createNewBooking = useBookingStore(state => state.createNewBooking);

  const [_numberOfGuests, setNumberOfGuests] = useState<number>(bookingData.participants || 1);

  useEffect(() => {
    updateBookingData({
      userId,
      travelPlanId: tripData.travelPlanId,
      pricePerPerson: tripData.price,
      participants: tripData.maxParticipants,
      ...existingBookingData,
    });
  }, [
    existingBookingData,
    tripData.price,
    tripData.travelPlanId,
    updateBookingData,
    userId,
    tripData.maxParticipants,
  ]);

  useEffect(() => {
    if (bookingData.participants) setNumberOfGuests(bookingData.participants);
  }, [bookingData]);

  const handleGuestInfoSubmit = useCallback(
    async (guestCount: number, guestData: BookingFormData) => {
      setIsTransitioning(true);
      setNumberOfGuests(guestCount);

      try {
        const completeBookingData = {
          id: bookingId,
          userId,
          travelPlanId: tripData.travelPlanId,
          pricePerPerson: tripData.price,
          startDate: new Date(tripData.startDate || new Date()),
          endDate: new Date(tripData.endDate || new Date()),
          participants: guestCount,
          guests: guestData.guests,
          specialRequirements: guestData.specialRequirements,
          status: 'PENDING' as const,
          totalPrice: (tripData?.price || 0) * guestCount,
        };

        const newBooking = await createNewBooking(completeBookingData);

        if (newBooking) {
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
            setIsTransitioning(false);
          }, 300);
          toast.success('Guest info submitted successfully...!!', {
            style: {
              background: 'rgba(147, 51, 234, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(196, 181, 253, 0.3)',
              color: 'white',
              fontFamily: 'var(--font-instrument)',
            },
            duration: 3000,
          });
          router.push(`/trips/booking/${tripData.travelPlanId}/booking-summary/${newBooking.id}`);
        } else {
          setIsTransitioning(false);
        }
      } catch (error) {
        toast.success(`${error}`, {
          style: {
            background: 'rgba(147, 51, 234, 0.95)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            fontFamily: 'var(--font-instrument)',
          },
          duration: 3000,
        });
        console.error('Failed to create booking:', error);
        setIsTransitioning(false);
      }
    },
    [userId, tripData, createNewBooking, router, bookingId]
  );

  const formatDate = (date?: string | Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const heroTags = [`${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}`];

  const createdYear = new Date(tripData.createdAt || new Date()).getFullYear();

  const hostInfo = {
    name: tripData.host?.user.name || 'Host',
    image: tripData.host?.image || 'https://via.placeholder.com/60',
    email: tripData.host?.hostEmail || '',
    description: tripData.host?.description || '',
    createdYear,
    averageRating: tripData.host?.averageRating || 0,
  };

  const tripStats = {
    price: tripData.price || 0,
    noOfDays: tripData.noOfDays || 0,
    maxParticipants: tripData.maxParticipants || 0,
    languages: tripData.languages?.join(', ') || 'English',
  };

  if (isLoading) {
    return <EnhancedLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-instrument">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('${
            tripData.tripImage ||
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
          }')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex items-center justify-between mt-12">
            <div className="space-y-4">
              <div className="inline-flex items-center px-6 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full mb-4">
                <span className="text-white text-sm font-semibold tracking-wide uppercase font-instrument">
                  Secure Booking
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-bricolage leading-[1.05] tracking-tighter drop-shadow-lg">
                Reserve Your Spot
                <span className="block text-purple-300 mt-2">{tripData.title}</span>
              </h1>
              <p className="text-lg text-white/90 font-instrument mt-2 drop-shadow-md">
                Secure your adventure in {tripData.destination} with our easy booking process
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {heroTags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-xl font-medium font-instrument"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div
                className={`backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 ${
                  isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900 font-bricolage">
                        Guest Information
                      </h3>
                      <p className="text-gray-600 text-sm font-instrument">
                        Tell us about your travel companions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  {currentStep === 1 && <GuestInformationForm onContinue={handleGuestInfoSubmit} />}
                  {/* Add other steps here as needed */}
                  {currentStep === 2 && (
                    <div className="text-center py-8">
                      <h3 className="text-2xl font-bold text-gray-900 font-bricolage mb-4">
                        Booking Created Successfully!
                      </h3>
                      <p className="text-gray-600 font-instrument">
                        Your booking has been created with all guest information.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6 lg:sticky lg:top-10 ">
                <div className=" bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl text-white shadow-sm">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-bricolage">Trip Summary</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900 font-bricolage">
                        ₹{tripStats.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600 font-instrument">per person</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-instrument">
                        {tripStats.noOfDays} days experience
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Languages className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-instrument">{tripStats.languages}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <BookingProgress bookingData={bookingData} />
                  </div>
                </div>

                {/* Host Information Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-xl text-white shadow-sm">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-bricolage">
                      Meet Your Host
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-purple-200">
                      <AvatarImage src={hostInfo.image} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold">
                        {hostInfo.name?.charAt(0).toUpperCase() ?? 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 font-instrument">{hostInfo.name}</p>
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.round(hostInfo.averageRating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {hostInfo.averageRating > 0
                            ? hostInfo.averageRating.toFixed(1)
                            : 'No ratings'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-instrument">
                        Host since {hostInfo.createdYear}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700 font-instrument leading-relaxed">
                      {hostInfo.description ||
                        'Experienced travel guide passionate about sharing local culture and creating unforgettable experiences.'}
                    </p>
                  </div>

                  <button className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold py-3 rounded-xl transition-all duration-300 font-instrument text-sm">
                    View Host Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"></div>
    </div>
  );
}

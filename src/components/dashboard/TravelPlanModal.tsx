'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Star,
  Phone,
  Mail,
  User,
  Clock,
  Filter,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTravelPlanDetails } from '@/actions/admin/action';
import Image from 'next/image';

interface TravelPlanModalProps {
  travelPlanId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface DayWiseItinerary {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string;
  accommodation?: string;
}

interface HostUser {
  name: string;
  email: string;
  phone: string;
  image?: string;
  createdAt: Date;
}

interface HostProfile {
  hostId: string;
  description?: string;
  image?: string;
  reviewCount: number;
  averageRating: number;
  user: HostUser;
}

interface TravelPlanDetails {
  travelPlanId: string;
  title: string;
  description: string;
  includedActivities: string[];
  restrictions: string[];
  special: string[];
  notIncludedActivities: string[];
  genderPreference: 'MALE_ONLY' | 'FEMALE_ONLY' | 'MIX';
  noOfDays: number;
  hostId: string;
  price: number;
  country: string;
  state: string;
  city: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  maxParticipants: number;
  destination?: string;
  filters: string[];
  languages: string[];
  endDate?: Date;
  startDate?: Date;
  tripImage?: string;
  reviewCount: number;
  averageRating: number;
  host: HostProfile;
  dayWiseItinerary: DayWiseItinerary[];
}

export default function TravelPlanModal({ travelPlanId, isOpen, onClose }: TravelPlanModalProps) {
  const [travelPlan, setTravelPlan] = useState<TravelPlanDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTravelPlanDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTravelPlanDetails(travelPlanId);
      if (response.error) {
        setError(response.error);
        return;
      }
      setTravelPlan(response.travelPlan as TravelPlanDetails);
    } catch (err) {
      setError('Failed to fetch travel plan details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [travelPlanId]);

  useEffect(() => {
    if (isOpen && travelPlanId) {
      fetchTravelPlanDetails();
    }
  }, [isOpen, travelPlanId, fetchTravelPlanDetails]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Travel Plan Details</h2>
                <p className="text-purple-100">
                  Complete information about the travel plan and host
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading travel plan details...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : travelPlan ? (
            <div className="p-6 space-y-6">
              {/* Travel Plan Overview */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{travelPlan.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{travelPlan.description}</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {travelPlan.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {travelPlan.city}, {travelPlan.state}
                      </p>
                      <p className="text-sm text-gray-600">{travelPlan.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{travelPlan.noOfDays} days</p>
                      <p className="text-sm text-gray-600">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{formatPrice(travelPlan.price)}</p>
                      <p className="text-sm text-gray-600">Total price</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-900">Max {travelPlan.maxParticipants}</p>
                      <p className="text-sm text-gray-600">Participants</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Information */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Host Information
                </h4>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {travelPlan.host.user.image ? (
                      <Image
                        src={travelPlan.host.user.image}
                        alt={travelPlan.host.user.name}
                        width={64}
                        height={64}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      travelPlan.host.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h5 className="font-bold text-gray-900 text-lg">
                        {travelPlan.host.user.name}
                      </h5>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {travelPlan.host.user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {travelPlan.host.user.phone}
                        </div>
                      </div>

                      {/* Languages Display */}
                      {(
                        travelPlan.host as typeof travelPlan.host & {
                          languages?: string[];
                        }
                      ).languages &&
                        (
                          travelPlan.host as typeof travelPlan.host & {
                            languages?: string[];
                          }
                        ).languages!.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-600 mr-2">Languages:</span>
                            <div className="flex flex-wrap gap-1">
                              {(
                                travelPlan.host as typeof travelPlan.host & {
                                  languages: string[];
                                }
                              ).languages.map((language: string) => (
                                <span
                                  key={language}
                                  className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    {travelPlan.host.description && (
                      <p className="text-gray-600">{travelPlan.host.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">
                          {travelPlan.host.averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-600">
                          ({travelPlan.host.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Host since {formatDate(travelPlan.host.user.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Plan Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Included Activities */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    What&apos;s Included
                  </h4>
                  <div className="space-y-2">
                    {travelPlan.includedActivities && travelPlan.includedActivities.length > 0 ? (
                      travelPlan.includedActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{activity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No included activities specified for this trip
                      </p>
                    )}
                  </div>
                </div>

                {/* Not Included */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-300">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    Not Included
                  </h4>
                  <div className="space-y-2">
                    {travelPlan.restrictions && travelPlan.restrictions.length > 0 ? (
                      travelPlan.restrictions.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No exclusions specified for this trip</p>
                    )}
                  </div>
                </div>

                {/* What's Special */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-300">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-emerald-600" />
                    What&apos;s Special
                  </h4>
                  <div className="space-y-2">
                    {travelPlan.special && travelPlan.special.length > 0 ? (
                      travelPlan.special.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No special features specified for this trip
                      </p>
                    )}
                  </div>
                </div>

                {/* Gender Preference */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border-2 border-violet-300">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-600" />
                    Gender Preference
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        travelPlan.genderPreference === 'MALE_ONLY'
                          ? 'bg-blue-100 text-blue-800'
                          : travelPlan.genderPreference === 'FEMALE_ONLY'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {travelPlan.genderPreference === 'MALE_ONLY' && '👨 Male Only'}
                      {travelPlan.genderPreference === 'FEMALE_ONLY' && '👩 Female Only'}
                      {travelPlan.genderPreference === 'MIX' && '👥 Mixed Group'}
                    </Badge>
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200/50">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-purple-600" />
                    Languages Offered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {travelPlan.languages && travelPlan.languages.length > 0 ? (
                      travelPlan.languages.map((language, index) => (
                        <Badge
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {language}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No languages specified</p>
                    )}
                  </div>
                </div>

                {/* Trip Vibes/Filters */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-amber-600" />
                    Trip Vibes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {travelPlan.filters && travelPlan.filters.length > 0 ? (
                      travelPlan.filters.map((filter, index) => (
                        <Badge
                          key={index}
                          className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                        >
                          {filter}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No trip vibes specified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Day-wise Itinerary */}
              {travelPlan.dayWiseItinerary.length > 0 && (
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200/50">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    Day-wise Itinerary
                  </h4>
                  <div className="space-y-4">
                    {travelPlan.dayWiseItinerary.map(day => (
                      <div key={day.id} className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {day.dayNumber}
                          </div>
                          <h5 className="font-bold text-gray-900">{day.title}</h5>
                        </div>
                        <p className="text-gray-600 mb-3">{day.description}</p>

                        {day.activities.length > 0 && (
                          <div className="mb-3">
                            <h6 className="font-semibold text-gray-800 mb-2">Activities:</h6>
                            <div className="space-y-1">
                              {day.activities.map((activity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm text-gray-700"
                                >
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                  {activity}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {day.meals && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">Meals:</span>
                              <span className="text-gray-600">{day.meals}</span>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">Accommodation:</span>
                              <span className="text-gray-600">{day.accommodation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Created:</span>
                    <span className="text-gray-600">{formatDate(travelPlan.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Last Updated:</span>
                    <span className="text-gray-600">{formatDate(travelPlan.updatedAt)}</span>
                  </div>
                  {travelPlan.startDate && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">Start Date:</span>
                      <span className="text-gray-600">{formatDate(travelPlan.startDate)}</span>
                    </div>
                  )}
                  {travelPlan.endDate && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">End Date:</span>
                      <span className="text-gray-600">{formatDate(travelPlan.endDate)}</span>
                    </div>
                  )}
                  {travelPlan.destination && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">Destination:</span>
                      <span className="text-gray-600">{travelPlan.destination}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">Travel Plan ID:</span>
                    <span className="text-gray-600 font-mono text-xs">
                      {travelPlan.travelPlanId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="outline" className="px-6 py-2 rounded-xl">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

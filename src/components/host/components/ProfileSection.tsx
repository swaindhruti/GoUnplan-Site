'use client';
import { useState, useEffect } from 'react';
import { getHostDetails, updateHostProfile } from '@/actions/host/action';
import { User, AlertCircle, CheckCircle, Languages, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HostData } from '../types';
import Image from 'next/image';

const COMMON_LANGUAGES = [
  // Common Indian Languages (Added)
  'Hindi', // Already in your original list, but moved here for organization
  'Bengali',
  'Marathi',
  'Telugu',
  'Tamil',
  'Gujarati',
  'Urdu', // Already in your original list, but moved here for organization
  'Kannada',
  'Malayalam',
  'Odia',
  'Punjabi',

  // Existing Global Languages
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese (Mandarin)',
  'Japanese',
  'Korean',
  'Arabic',

  // The Rest of the Languages (Original list minus the moved Indian languages)
  'Dutch',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
  'Polish',
  'Czech',
  'Hungarian',
  'Greek',
  'Turkish',
  'Hebrew',
  'Thai',
  'Vietnamese',
  'Indonesian',
  'Malay',
  'Tagalog',
  'Swahili',
];

// Define proper interfaces based on the actual API response structure
interface HostDetails {
  hostId?: string;
  description?: string | null;
  image?: string | null;
  hostMobile?: string;
  languages?: string[];
  createdAt?: string | Date;
  user?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
}

interface ProfileUpdateData {
  description: string;
  image: string;
  hostMobile: string;
  languages: string[];
}

type ProfileSectionProps = {
  hostData: HostData;
};

export const ProfileSection = ({ hostData }: ProfileSectionProps) => {
  // Use null as initial state to prevent hydration mismatches
  const [hostDetails, setHostDetails] = useState<HostDetails | null>(null);
  const [hostLoading, setHostLoading] = useState(true);
  const [hostError, setHostError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({
    description: '',
    image: '',
    hostMobile: '',
    languages: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add this to prevent hydration mismatch during initial render
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch host details on component mount
  useEffect(() => {
    // Only run if component is mounted
    if (!isMounted) return;

    const fetchHostDetails = async () => {
      setHostLoading(true);
      setHostError(null);

      try {
        const response = await getHostDetails();
        if ('error' in response) {
          setHostError(response.error as string);
        } else if (response.host) {
          setHostDetails(response.host);
          // Populate form data with current values
          setFormData({
            description: response.host?.description || '',
            image: response.host?.image || '',
            hostMobile: response.host?.user?.phone || '',
            languages: response.host?.languages || [],
          });
        }
      } catch (err) {
        console.error('Error fetching host details:', err);
        setHostError('Failed to load host profile');
      } finally {
        setHostLoading(false);
      }
    };

    fetchHostDetails();
  }, [isMounted]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageAdd = (language: string) => {
    if (!formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language],
      }));
    }
  };

  const handleLanguageRemove = (languageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove),
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateSuccess(false);

    try {
      const response = await updateHostProfile(formData);
      if ('error' in response) {
        setHostError(response.error as string);
      } else {
        setUpdateSuccess(true);
        // Refresh host details
        const updatedDetails = await getHostDetails();
        if (!('error' in updatedDetails) && updatedDetails.host) {
          setHostDetails(updatedDetails.host);
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setHostError('Failed to update profile');
    } finally {
      setIsSubmitting(false);
      // Reset success message after 3 seconds
      if (updateSuccess) {
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    }
  };

  // Return a loading state if not yet mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 animate-pulse">
          <User className="h-8 w-8 text-purple-600" />
        </div>
        <span className="ml-3 text-xl font-semibold text-gray-900">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Host Profile</h2>
          <p className="text-gray-600 font-medium">
            Manage your personal information and host settings
          </p>
        </div>
      </div>

      {hostLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 animate-pulse">
            <User className="h-8 w-8 text-purple-600" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Loading profile data...</span>
        </div>
      ) : hostError ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <p className="text-xl font-semibold text-gray-900">{hostError}</p>
          </div>
        </div>
      ) : hostDetails ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-purple-50 p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Your Profile</h3>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-purple-100 mb-6 overflow-hidden border-4 border-purple-200">
                {hostDetails.image ? (
                  // Use key to force re-render when image changes
                  <Image
                    key={hostDetails.image}
                    height={112}
                    width={112}
                    src={hostDetails.image}
                    alt={hostData.name || 'Host'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-4 text-purple-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {hostData.name || hostDetails.user?.name || ''}
              </h3>
              <p className="text-gray-600 mb-6 font-medium">
                {hostData.email || hostDetails.user?.email || ''}
              </p>
              <div className="w-full border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Host Since
                </p>
                <p className="font-semibold text-gray-900 text-lg">
                  {hostDetails.createdAt
                    ? new Date(hostDetails.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
            <div className="bg-purple-50 p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Edit Host Information</h3>
            </div>
            <div className="p-6">
              {updateSuccess && (
                <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 font-medium flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Image URL
                    </label>
                    <Input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="Enter image URL"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <Input
                      type="tel"
                      name="hostMobile"
                      value={formData.hostMobile}
                      onChange={handleFormChange}
                      placeholder="Enter mobile number"
                      className="w-full"
                    />
                  </div>

                  {/* Languages Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Languages You Speak
                    </label>
                    <div className="space-y-3">
                      {/* Selected Languages */}
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map(language => (
                          <span
                            key={language}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-instrument"
                          >
                            {language}
                            <button
                              type="button"
                              onClick={() => handleLanguageRemove(language)}
                              className="hover:bg-purple-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Language Selection Dropdown */}
                      <div className="relative">
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          className="w-full pl-10 pr-4 py-2 h-11 border border-gray-200 rounded-md focus:border-purple-400 focus:ring-purple-100 bg-white font-instrument"
                          onChange={e => {
                            if (e.target.value) {
                              handleLanguageAdd(e.target.value);
                              e.target.value = ''; // Reset selection
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a language to add...
                          </option>
                          {COMMON_LANGUAGES.filter(lang => !formData.languages.includes(lang)).map(
                            language => (
                              <option key={language} value={language}>
                                {language}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Select languages you can communicate with guests in
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Tell travelers about yourself and your hosting style..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-700 text-white font-semibold hover:bg-purple-800 shadow-sm"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

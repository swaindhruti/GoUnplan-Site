'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, XCircle, Star } from 'lucide-react';
import { getHostApplicationDetails } from '@/actions/admin/action';
import { Role } from '@/types/auth';

interface ApplicationDetails {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  appliedForHost: boolean;
  isEmailVerified: boolean;
  bookings: Array<{
    id: string;
    status: string;
    totalPrice: number;
    createdAt: Date;
    travelPlan: {
      title: string;
      destination: string | null;
    };
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    host: {
      hostEmail: string;
    };
  }>;
  supportTickets: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    createdAt: Date;
  }>;
  hostProfile?: {
    description: string | null;
    averageRating: number;
    reviewCount: number;
    languages: string[];
    instagramUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    websiteUrl: string | null;
    createdAt: Date;
  } | null;
  _count: {
    bookings: number;
    reviews: number;
    supportTickets: number;
    sentMessages: number;
    receivedMessages: number;
  };
}

interface HostApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId: string | null;
  onApprove?: (email: string) => void;
  onReject?: (email: string) => void;
}

export default function HostApplicationModal({
  isOpen,
  onClose,
  applicantId,
  onApprove,
  onReject,
}: HostApplicationModalProps) {
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!applicantId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getHostApplicationDetails(applicantId);
        if (response.error) {
          setError(response.error);
        } else if (response.applicant) {
          setApplicationDetails(response.applicant);
        }
      } catch {
        setError('Failed to fetch application details');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && applicantId) {
      fetchApplicationDetails();
    }
  }, [isOpen, applicantId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = () => {
    if (applicationDetails?.email && onApprove) {
      onApprove(applicationDetails.email);
      onClose();
    }
  };

  const handleReject = () => {
    if (applicationDetails?.email && onReject) {
      onReject(applicationDetails.email);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Host Application Details
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Review host application information
            </DialogDescription>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {applicationDetails && !loading && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  {applicationDetails.image ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={applicationDetails.image}
                        alt={applicationDetails.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{applicationDetails.name}</h3>
                  <p className="text-gray-600">{applicationDetails.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{applicationDetails.role}</Badge>
                    <Badge variant={applicationDetails.isEmailVerified ? 'default' : 'destructive'}>
                      {applicationDetails.isEmailVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Contact Information</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{applicationDetails.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{applicationDetails.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Dates */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Application Timeline</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Applied On</p>
                      <p className="font-medium">{formatDate(applicationDetails.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {applicationDetails.bio && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">About</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{applicationDetails.bio}</p>
                  </div>
                </div>
              )}

              {/* Host Profile */}
              {applicationDetails.hostProfile && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Host Profile</h4>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    {applicationDetails.hostProfile.description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Description</p>
                        <p className="text-gray-700">
                          {applicationDetails.hostProfile.description}
                        </p>
                      </div>
                    )}
                    {applicationDetails.hostProfile.languages.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Languages</p>
                        <div className="flex flex-wrap gap-1">
                          {applicationDetails.hostProfile.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {applicationDetails.hostProfile.averageRating > 0 && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {applicationDetails.hostProfile.averageRating.toFixed(1)}(
                          {applicationDetails.hostProfile.reviewCount} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {applicationDetails && !loading && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {applicationDetails.role !== 'HOST' && (
                <>
                  <Button variant="destructive" onClick={handleReject}>
                    Reject
                  </Button>
                  <Button onClick={handleApprove}>Approve</Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

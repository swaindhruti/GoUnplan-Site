"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

interface HostApplicationDetails {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  appliedForHost: boolean;
  isEmailVerified: boolean;
}

interface HostApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: HostApplicationDetails | null;
  onApprove: (email: string) => void;
  onReject: (email: string) => void;
}

export default function HostApplicationDetailsModal({
  isOpen,
  onClose,
  applicant,
  onApprove,
  onReject,
}: HostApplicationDetailsModalProps) {
  if (!applicant) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-bricolage flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            Host Application Details
          </DialogTitle>
          <DialogDescription className="font-instrument">
            Review the complete information about this host application
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-200px)] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                {applicant.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 font-bricolage">
                  {applicant.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={
                      applicant.role === "USER"
                        ? "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium font-instrument"
                        : "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium font-instrument"
                    }
                  >
                    {applicant.role}
                  </Badge>
                  <Badge
                    className={
                      applicant.isEmailVerified
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium font-instrument"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium font-instrument"
                    }
                  >
                    {applicant.isEmailVerified ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Email Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Email Not Verified
                      </span>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 font-bricolage flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold font-instrument">
                      Email
                    </span>
                  </div>
                  <p className="text-gray-900 font-instrument font-medium break-all">
                    {applicant.email || "Not provided"}
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold font-instrument">
                      Phone
                    </span>
                  </div>
                  <p className="text-gray-900 font-instrument font-medium">
                    {applicant.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900 font-bricolage flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Biography
              </h4>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700 font-instrument leading-relaxed">
                  {applicant.bio || "No biography provided"}
                </p>
              </div>
            </div>

            {/* Timeline Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 font-bricolage flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm font-semibold text-gray-600 mb-1 font-instrument">
                    Account Created
                  </div>
                  <p className="text-gray-900 font-instrument font-medium">
                    {formatDate(applicant.createdAt)}
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm font-semibold text-gray-600 mb-1 font-instrument">
                    Last Updated
                  </div>
                  <p className="text-gray-900 font-instrument font-medium">
                    {formatDate(applicant.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Status */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900 font-bricolage mb-1">
                    Application Status
                  </h4>
                  <p className="text-amber-800 font-instrument text-sm">
                    This user has applied to become a host. Review their
                    information carefully before making a decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-instrument font-medium border-gray-300 hover:bg-gray-50"
          >
            Close
          </Button>
          <Button
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700 border-0 font-instrument font-medium"
            onClick={() => {
              onReject(applicant.email || "");
              onClose();
            }}
          >
            Reject Application
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700 font-instrument font-medium"
            onClick={() => {
              onApprove(applicant.email || "");
              onClose();
            }}
          >
            Approve Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

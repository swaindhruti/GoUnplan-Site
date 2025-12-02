'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PayoutDetails } from '@/types/payout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, User, Briefcase } from 'lucide-react';

interface PayoutDetailsDialogProps {
  payout: PayoutDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PayoutDetailsDialog({
  payout,
  open,
  onOpenChange,
}: PayoutDetailsDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payout Details</DialogTitle>
          <DialogDescription>Complete information about this payout</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Trip Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Trip Title</p>
                <p className="font-medium">{payout.tripTitle}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trip Duration</p>
                <p className="font-medium">
                  {formatDate(payout.tripStartDate)} - {formatDate(payout.tripEndDate)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Host Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Host Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Host Name</p>
                <p className="font-medium">{payout.hostName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Host Email</p>
                <p className="font-medium">{payout.hostEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Traveler Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Traveler Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Traveler Name</p>
                <p className="font-medium">{payout.userName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Traveler Email</p>
                <p className="font-medium">{payout.userEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Information
            </h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Payout Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(payout.totalAmount)}</p>
              </div>

              {/* First Payment */}
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">First Payment</h4>
                  <Badge variant={payout.firstPaymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {payout.firstPaymentStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {formatCurrency(payout.firstPaymentAmount)} ({payout.firstPaymentPercent}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">{formatDate(payout.firstPaymentDate)}</p>
                  </div>
                  {payout.firstPaymentPaidAt && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Paid On</p>
                      <p className="font-medium text-green-600">
                        {formatDateTime(payout.firstPaymentPaidAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Second Payment */}
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Second Payment</h4>
                  <Badge variant={payout.secondPaymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {payout.secondPaymentStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {formatCurrency(payout.secondPaymentAmount)} ({payout.secondPaymentPercent}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">{formatDate(payout.secondPaymentDate)}</p>
                  </div>
                  {payout.secondPaymentPaidAt && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Paid On</p>
                      <p className="font-medium text-green-600">
                        {formatDateTime(payout.secondPaymentPaidAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {payout.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{payout.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Created: {formatDateTime(payout.createdAt)}</p>
            <p>Last Updated: {formatDateTime(payout.updatedAt)}</p>
            <p>Payout ID: {payout.id}</p>
            <p>Booking ID: {payout.bookingId}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

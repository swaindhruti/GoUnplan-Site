'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createPayout } from '@/actions/payout/payout-actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface BookingForPayout {
  id: string;
  userId: string;
  travelPlanId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  participants: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string | null;
  };
  travelPlan: {
    title: string;
    hostId: string;
    host: {
      user: {
        name: string;
        email: string | null;
      };
    };
  };
}

interface CreatePayoutDialogProps {
  bookings: BookingForPayout[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreatePayoutDialog({
  bookings,
  open,
  onOpenChange,
  onSuccess,
}: CreatePayoutDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: '',
    firstPaymentPercent: 20,
    secondPaymentPercent: 80,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bookingId) {
      toast.error('Please select a booking');
      return;
    }

    // Validate percentages
    if (formData.firstPaymentPercent + formData.secondPaymentPercent !== 100) {
      toast.error('Payment percentages must add up to 100%');
      return;
    }

    setLoading(true);
    try {
      const result = await createPayout({
        bookingId: formData.bookingId,
        firstPaymentPercent: formData.firstPaymentPercent,
        secondPaymentPercent: formData.secondPaymentPercent,
        notes: formData.notes || undefined,
      });

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success('Payout created successfully');
        setFormData({
          bookingId: '',
          firstPaymentPercent: 20,
          secondPaymentPercent: 80,
          notes: '',
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error('Failed to create payout');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePercentageChange = (
    field: 'firstPaymentPercent' | 'secondPaymentPercent',
    value: number
  ) => {
    if (field === 'firstPaymentPercent') {
      setFormData({
        ...formData,
        firstPaymentPercent: value,
        secondPaymentPercent: 100 - value,
      });
    } else {
      setFormData({
        ...formData,
        secondPaymentPercent: value,
        firstPaymentPercent: 100 - value,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const selectedBooking = bookings.find(b => b.id === formData.bookingId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Payout</DialogTitle>
          <DialogDescription>Create a payout schedule for a confirmed booking</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Booking */}
          <div className="space-y-2">
            <Label htmlFor="booking">Select Booking</Label>
            <Select
              value={formData.bookingId}
              onValueChange={value => setFormData({ ...formData, bookingId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a booking" />
              </SelectTrigger>
              <SelectContent>
                {bookings.map(booking => (
                  <SelectItem key={booking.id} value={booking.id}>
                    {booking.travelPlan.title} - {booking.user.name} -{' '}
                    {formatCurrency(booking.totalPrice)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {bookings.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No confirmed bookings without payouts available
              </p>
            )}
          </div>

          {/* Selected Booking Details */}
          {selectedBooking && (
            <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold">{formatCurrency(selectedBooking.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trip Start:</span>
                <span>{new Date(selectedBooking.startDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Host:</span>
                <span>{selectedBooking.travelPlan.host.user.name}</span>
              </div>
            </div>
          )}

          {/* Payment Percentages */}
          <div className="space-y-4">
            <h4 className="font-semibold">Payment Split</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstPercent">First Payment % (15 days before)</Label>
                <Input
                  id="firstPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.firstPaymentPercent}
                  onChange={e =>
                    handlePercentageChange('firstPaymentPercent', parseInt(e.target.value) || 0)
                  }
                />
                {selectedBooking && (
                  <p className="text-xs text-muted-foreground">
                    Amount:{' '}
                    {formatCurrency(
                      Math.round((selectedBooking.totalPrice * formData.firstPaymentPercent) / 100)
                    )}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondPercent">Second Payment % (on trip day)</Label>
                <Input
                  id="secondPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.secondPaymentPercent}
                  onChange={e =>
                    handlePercentageChange('secondPaymentPercent', parseInt(e.target.value) || 0)
                  }
                />
                {selectedBooking && (
                  <p className="text-xs text-muted-foreground">
                    Amount:{' '}
                    {formatCurrency(
                      Math.round((selectedBooking.totalPrice * formData.secondPaymentPercent) / 100)
                    )}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {formData.firstPaymentPercent + formData.secondPaymentPercent}%
              {formData.firstPaymentPercent + formData.secondPaymentPercent !== 100 && (
                <span className="text-destructive ml-2">(Must equal 100%)</span>
              )}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this payout..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || bookings.length === 0}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Payout
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

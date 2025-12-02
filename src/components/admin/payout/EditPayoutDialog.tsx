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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PayoutDetails } from '@/types/payout';
import { updatePayout } from '@/actions/payout/payout-actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditPayoutDialogProps {
  payout: PayoutDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditPayoutDialog({
  payout,
  open,
  onOpenChange,
  onSuccess,
}: EditPayoutDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstPaymentPercent: payout.firstPaymentPercent,
    secondPaymentPercent: payout.secondPaymentPercent,
    firstPaymentDate: new Date(payout.firstPaymentDate).toISOString().split('T')[0],
    secondPaymentDate: new Date(payout.secondPaymentDate).toISOString().split('T')[0],
    notes: payout.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate percentages
    if (formData.firstPaymentPercent + formData.secondPaymentPercent !== 100) {
      toast.error('Payment percentages must add up to 100%');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePayout({
        payoutId: payout.id,
        firstPaymentPercent: formData.firstPaymentPercent,
        secondPaymentPercent: formData.secondPaymentPercent,
        firstPaymentDate: new Date(formData.firstPaymentDate),
        secondPaymentDate: new Date(formData.secondPaymentDate),
        notes: formData.notes || undefined,
      });

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success('Payout updated successfully');
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error('Failed to update payout');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Payout</DialogTitle>
          <DialogDescription>Modify payment percentages, dates, and notes</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Percentages */}
          <div className="space-y-4">
            <h4 className="font-semibold">Payment Percentages</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstPercent">First Payment %</Label>
                <Input
                  id="firstPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.firstPaymentPercent}
                  onChange={e =>
                    handlePercentageChange('firstPaymentPercent', parseInt(e.target.value) || 0)
                  }
                  disabled={
                    payout.firstPaymentStatus === 'PAID' || payout.secondPaymentStatus === 'PAID'
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondPercent">Second Payment %</Label>
                <Input
                  id="secondPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.secondPaymentPercent}
                  onChange={e =>
                    handlePercentageChange('secondPaymentPercent', parseInt(e.target.value) || 0)
                  }
                  disabled={
                    payout.firstPaymentStatus === 'PAID' || payout.secondPaymentStatus === 'PAID'
                  }
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {formData.firstPaymentPercent + formData.secondPaymentPercent}%
            </p>
          </div>

          {/* Payment Dates */}
          <div className="space-y-4">
            <h4 className="font-semibold">Payment Dates</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstDate">First Payment Date</Label>
                <Input
                  id="firstDate"
                  type="date"
                  value={formData.firstPaymentDate}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      firstPaymentDate: e.target.value,
                    })
                  }
                  disabled={payout.firstPaymentStatus === 'PAID'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondDate">Second Payment Date</Label>
                <Input
                  id="secondDate"
                  type="date"
                  value={formData.secondPaymentDate}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      secondPaymentDate: e.target.value,
                    })
                  }
                  disabled={payout.secondPaymentStatus === 'PAID'}
                />
              </div>
            </div>
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConvertLeadToBooking } from '../hooks/useBookings';
import { convertLeadToBookingSchema, ConvertLeadToBookingFormData } from '../schemas/booking.schema';
import { Lead } from '@/features/leads/types/lead.types';
import { useEffect, useState } from 'react';
import { BUSINESS_HOURS } from '@/config/business-hours';
import { AlertCircle } from 'lucide-react';

interface Props {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConvertLeadDialog = ({ lead, isOpen, onClose }: Props) => {
  const convertMutation = useConvertLeadToBooking();
  const [apiError, setApiError] = useState<string>('');

  const form = useForm<any>({
    resolver: zodResolver(convertLeadToBookingSchema),
  });
  
  const { register, handleSubmit, formState: { errors }, reset } = form;

  useEffect(() => {
    if (isOpen) {
      setApiError('');
      reset({
        scheduled_date: new Date().toISOString().split('T')[0],
        slot: '10:00',
        address_line_1: '',
        address_line_2: '',
        area: '',
        landmark: '',
        city_name: lead?.city?.name || '',
        postal_code: '',
        country: 'India',
        notes: '',
        special_instructions: '',
      });
    }
  }, [isOpen, lead, reset]);

  const onSubmit = (data: ConvertLeadToBookingFormData) => {
    if (!lead) return;
    setApiError('');

    // Combine date and time slot into a single valid ISO datetime
    const dateStr = data.scheduled_date.split('T')[0];
    const timeStr = data.slot || '00:00';
    const combinedDateTime = new Date(`${dateStr}T${timeStr}:00`);

    const payload = {
      ...data,
      scheduled_date: combinedDateTime.toISOString()
    };

    convertMutation.mutate(
      { leadId: lead.id, data: payload },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (error: any) => {
          // Show error inline inside the dialog so it's unmissable
          setApiError(error.response?.data?.message || 'Failed to convert lead. Please try again.');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert Lead to Booking</DialogTitle>
          <DialogDescription>
            Schedule a service for {lead?.name || 'Customer'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Inline API error — shown inside dialog, not just as toast */}
          {apiError && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <div className="space-y-4 rounded-md border p-4 bg-muted/20">
            <h3 className="font-medium text-sm">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date <span className="text-destructive">*</span></label>
                <Input type="date" {...register('scheduled_date')} />
                {errors.scheduled_date && <p className="text-xs text-destructive">{errors.scheduled_date.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Time Slot
                  <span className="text-xs text-muted-foreground ml-1">({BUSINESS_HOURS.START_HOUR}:00 – {BUSINESS_HOURS.END_HOUR}:00)</span>
                </label>
                <Input
                  type="time"
                  min={`${String(BUSINESS_HOURS.START_HOUR).padStart(2,'0')}:00`}
                  max={`${String(BUSINESS_HOURS.END_HOUR).padStart(2,'0')}:00`}
                  {...register('slot')}
                />
                {errors.slot && <p className="text-xs text-destructive">{errors.slot.message as string}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-md border p-4 bg-muted/20">
            <h3 className="font-medium text-sm">Service Address</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address Line 1 <span className="text-destructive">*</span></label>
              <Input placeholder="House/Flat No, Building Name" {...register('address_line_1')} />
              {errors.address_line_1 && <p className="text-xs text-destructive">{errors.address_line_1.message as string}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address Line 2</label>
              <Input placeholder="Street Name, Locality" {...register('address_line_2')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City <span className="text-destructive">*</span></label>
                <Input {...register('city_name')} />
                {errors.city_name && <p className="text-xs text-destructive">{errors.city_name.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">PIN Code <span className="text-destructive">*</span></label>
                <Input {...register('postal_code')} />
                {errors.postal_code && <p className="text-xs text-destructive">{errors.postal_code.message as string}</p>}
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <p className="text-xs text-muted-foreground mt-2">
                Note: The GST State is derived automatically based on the Lead's selected City profile.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Special Instructions</label>
            <Input placeholder="e.g. Bring own ladder" {...register('special_instructions')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={convertMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={convertMutation.isPending}>
              {convertMutation.isPending ? 'Converting...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConvertLeadToBooking } from '../hooks/useBookings';
import { convertLeadToBookingSchema, ConvertLeadToBookingFormData } from '../schemas/booking.schema';
import { Lead } from '@/features/leads/types/lead.types';
import { useEffect } from 'react';

interface Props {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConvertLeadDialog = ({ lead, isOpen, onClose }: Props) => {
  const convertMutation = useConvertLeadToBooking();

  const form = useForm<any>({
    resolver: zodResolver(convertLeadToBookingSchema),
  });
  
  const { register, handleSubmit, formState: { errors }, reset } = form;

  useEffect(() => {
    if (isOpen) {
      reset({
        scheduled_date: new Date().toISOString().split('T')[0],
        slot: '10:00',
        address_line_1: '',
        address_line_2: '',
        area: '',
        landmark: '',
        city_name: lead?.city?.name || '',
        postal_code: '',
        state: 'Kerala',
        country: 'India',
        notes: '',
        special_instructions: '',
      });
    }
  }, [isOpen, lead, reset]);

  const onSubmit = (data: ConvertLeadToBookingFormData) => {
    if (!lead) return;

    // Combine date and time slot into a single valid ISO datetime
    const dateStr = data.scheduled_date.split('T')[0]; // Ensure it's just YYYY-MM-DD
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
          
          <div className="space-y-4 rounded-md border p-4 bg-muted/20">
            <h3 className="font-medium text-sm">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date <span className="text-destructive">*</span></label>
                <Input type="date" {...register('scheduled_date')} />
                {errors.scheduled_date && <p className="text-xs text-destructive">{errors.scheduled_date.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Slot</label>
                <Input type="time" {...register('slot')} />
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
            <div className="space-y-2">
              <label className="text-sm font-medium">State <span className="text-destructive">*</span></label>
              <Input {...register('state')} />
              {errors.state && <p className="text-xs text-destructive">{errors.state.message as string}</p>}
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

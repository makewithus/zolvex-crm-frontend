import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCancelBooking } from '../hooks/useBookings';
import { cancelBookingSchema, CancelBookingFormData } from '../schemas/booking.schema';
import { Booking } from '../types/booking.types';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingCancelDialog = ({ booking, isOpen, onClose }: Props) => {
  const cancelBookingMutation = useCancelBooking();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CancelBookingFormData>({
    resolver: zodResolver(cancelBookingSchema),
  });

  const onSubmit = (data: CancelBookingFormData) => {
    if (!booking) return;

    cancelBookingMutation.mutate(
      { id: booking.id, cancel_reason: data.cancel_reason },
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Cancel Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel booking {booking?.booking_id}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cancellation Reason <span className="text-destructive">*</span></label>
            <Input placeholder="Enter reason for cancellation" {...register('cancel_reason')} />
            {errors.cancel_reason && <p className="text-sm text-destructive">{errors.cancel_reason.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={cancelBookingMutation.isPending}>
              Keep Booking
            </Button>
            <Button type="submit" variant="destructive" disabled={cancelBookingMutation.isPending}>
              {cancelBookingMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

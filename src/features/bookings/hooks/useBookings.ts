import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bookingApi from '../api/booking.api';
import { toast } from 'sonner';

export const useBookings = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingApi.getBookings(params),
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getBookingById(id),
    enabled: !!id,
  });
};

export const useConvertLeadToBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: any }) => bookingApi.convertLeadToBooking(leadId, data),
    onSuccess: () => {
      toast.success('Lead converted to booking successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to convert lead');
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cancel_reason }: { id: string; cancel_reason: string }) => bookingApi.cancelBooking(id, cancel_reason),
    onSuccess: (_, variables) => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });
};

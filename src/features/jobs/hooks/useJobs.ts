import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobsApi from '../api/jobs.api';
import { UpdateJobStatusInput, AssignJobInput, RescheduleJobInput } from '../schemas/job.schema';
import { toast } from 'sonner';

export const useJobs = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getJobs(filters),
  });
};

export const useCalendarJobs = (filters: { start_date: string, end_date: string, [key: string]: any }) => {
  return useQuery({
    queryKey: ['jobs', 'calendar', filters],
    queryFn: () => jobsApi.getCalendarJobs(filters),
    enabled: !!filters.start_date && !!filters.end_date,
    refetchInterval: 30000, // 30s auto-refresh for dispatch board
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, priority }: { bookingId: string; priority?: string }) => 
      jobsApi.createJobFromBooking(bookingId, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Job generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate job');
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobStatusInput }) => 
      jobsApi.updateJobStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Job status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useAssignJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignJobInput }) => 
      jobsApi.assignJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] });
      toast.success('Technician assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign technician');
    },
  });
};

export const useRescheduleJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RescheduleJobInput }) => 
      jobsApi.rescheduleJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Job rescheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reschedule job');
    },
  });
};

export const useUploadJobPhotos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      jobsApi.uploadJobPhotos(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] });
      toast.success('Photos uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload photos');
    },
  });
};

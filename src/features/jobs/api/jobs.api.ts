import { apiClient } from '@/lib/axios';
import { Job } from '../types/job.types';
import { UpdateJobStatusInput, AssignJobInput, RescheduleJobInput } from '../schemas/job.schema';

export const getJobs = async (filters?: Record<string, any>): Promise<Job[]> => {
  const { data } = await apiClient.get('/jobs', { params: filters });
  return data.data;
};

export const getCalendarJobs = async (filters: { start_date: string, end_date: string, [key: string]: any }): Promise<{ jobs: Job[], kpis: any }> => {
  const { data } = await apiClient.get('/jobs/calendar', { params: filters });
  return data.data;
};

export const getJobById = async (id: string): Promise<Job> => {
  const { data } = await apiClient.get(`/jobs/${id}`);
  return data.data;
};

export const createJobFromBooking = async (bookingId: string, priority?: string): Promise<Job> => {
  const { data } = await apiClient.post(`/jobs/from-booking/${bookingId}`, { priority });
  return data.data;
};

export const updateJobStatus = async (id: string, payload: UpdateJobStatusInput): Promise<Job> => {
  const { data } = await apiClient.patch(`/jobs/${id}/status`, payload);
  return data.data;
};

export const assignJob = async (id: string, payload: AssignJobInput): Promise<void> => {
  await apiClient.patch(`/jobs/${id}/assign`, payload);
};

export const rescheduleJob = async (id: string, payload: RescheduleJobInput): Promise<void> => {
  await apiClient.patch(`/jobs/${id}/reschedule`, payload);
};

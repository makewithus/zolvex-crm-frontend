import { apiClient } from '@/lib/axios';

export const getDashboardKPIs = async () => {
  const { data } = await apiClient.get('/dashboard/kpis');
  return data.data;
};

export const getDashboardActivity = async (limit = 10) => {
  const { data } = await apiClient.get('/dashboard/activity', { params: { limit } });
  return data.data;
};

export const getUpcomingBookings = async () => {
  const { data } = await apiClient.get('/dashboard/upcoming-bookings');
  return data.data;
};

export const getDashboardRevenue = async () => {
  const { data } = await apiClient.get('/dashboard/revenue');
  return data.data;
};

export const getMe = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data.data;
};

export const getRecentTransactions = async (limit = 10) => {
  const { data } = await apiClient.get('/dashboard/recent-transactions', { params: { limit } });
  return data.data;
};

export const getServiceDistribution = async () => {
  const { data } = await apiClient.get('/dashboard/service-distribution');
  return data.data as Array<{ name: string; count: number; pct: number; revenue?: number }>;
};


import { apiClient as api } from '@/lib/axios';

export const getBookings = async (params?: Record<string, any>) => {
  const response = await api.get('/bookings', { params });
  return response.data.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data.data;
};

export const createBooking = async (data: any) => {
  const response = await api.post('/bookings', data);
  return response.data.data;
};

export const convertLeadToBooking = async (leadId: string, data: any) => {
  const response = await api.post(`/bookings/convert-lead/${leadId}`, data);
  return response.data.data;
};

export const updateBooking = async (id: string, data: any) => {
  const response = await api.patch(`/bookings/${id}`, data);
  return response.data.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data.data;
};

export const cancelBooking = async (id: string, cancel_reason: string) => {
  const response = await api.patch(`/bookings/${id}/cancel`, { cancel_reason });
  return response.data.data;
};

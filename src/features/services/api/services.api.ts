import { apiClient } from '@/lib/axios';
import { ServicesResponse, CreateServiceResponse } from '../types/service.types';
import { ServiceFormData, UpdateServiceFormData } from '../schemas/service.schema';

export const getServices = async (): Promise<ServicesResponse> => {
  const response = await apiClient.get('/services');
  return response.data;
};

export const createService = async (data: ServiceFormData): Promise<CreateServiceResponse> => {
  const response = await apiClient.post('/services', data);
  return response.data;
};

export const updateService = async (id: string, data: UpdateServiceFormData): Promise<unknown> => {
  const response = await apiClient.patch(`/services/${id}`, data);
  return response.data;
};

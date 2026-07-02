import { apiClient } from '@/lib/axios';
import { LoginFormData } from '../schemas/auth.schema';
import { LoginResponse } from '../types/auth.types';

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

import { apiClient } from '@/lib/axios';
import { RolesResponse } from '../types/role.types';

export const getRoles = async (): Promise<RolesResponse> => {
  const response = await apiClient.get('/roles');
  return response.data;
};

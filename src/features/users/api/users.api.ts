import { apiClient } from '@/lib/axios';
import { UsersResponse, CreateUserResponse } from '../types/user.types';
import { UserFormData } from '../schemas/user.schema';

export const getUsers = async (): Promise<UsersResponse> => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const createUser = async (data: UserFormData): Promise<CreateUserResponse> => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

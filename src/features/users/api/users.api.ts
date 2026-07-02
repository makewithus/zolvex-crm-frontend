import { apiClient } from '@/lib/axios';
import { UsersResponse, CreateUserResponse } from '../types/user.types';
import { UserFormData, UpdateUserFormData } from '../schemas/user.schema';

export const getUsers = async (): Promise<UsersResponse> => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const createUser = async (data: UserFormData): Promise<CreateUserResponse> => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserFormData): Promise<unknown> => {
  const response = await apiClient.patch(`/users/${id}`, data);
  return response.data;
};

export const resetPassword = async (id: string, new_password: string): Promise<unknown> => {
  const response = await apiClient.patch(`/users/${id}/reset-password`, { new_password });
  return response.data;
};

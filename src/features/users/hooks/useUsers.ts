import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, resetPassword } from '../api/users.api';
import { UserFormData, UpdateUserFormData } from '../schemas/user.schema';
import { AxiosError } from 'axios';
import { CreateUserResponse } from '../types/user.types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateUserResponse, AxiosError<{ message?: string }>, UserFormData>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<unknown, AxiosError<{ message?: string }>, { id: string; data: UpdateUserFormData }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useResetPassword = () => {
  return useMutation<unknown, AxiosError<{ message?: string }>, { id: string; new_password: string }>({
    mutationFn: ({ id, new_password }) => resetPassword(id, new_password),
  });
};

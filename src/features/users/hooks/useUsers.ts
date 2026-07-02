import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser } from '../api/users.api';
import { UserFormData } from '../schemas/user.schema';
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

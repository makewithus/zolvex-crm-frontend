import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import { LoginFormData } from '../schemas/auth.schema';
import { LoginResponse } from '../types/auth.types';

import { AxiosError } from 'axios';

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError<{ message?: string }>, LoginFormData>({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userRole', data.data.user.role.name);
      localStorage.setItem('userId', data.data.user.id);
      localStorage.setItem('userName', data.data.user.name);
    }
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  window.location.href = '/login';
};

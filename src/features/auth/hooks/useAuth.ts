import { useMutation, useQuery } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import { getMe } from '../api/dashboard.api';
import { LoginFormData } from '../schemas/auth.schema';
import { LoginResponse } from '../types/auth.types';
import { AxiosError } from 'axios';

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError<{ message?: string }>, LoginFormData>({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: async (data) => {
      // 1. Store JWT immediately for instant UI
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userRole', data.data.user.role.name);
      localStorage.setItem('userId', data.data.user.id);
      localStorage.setItem('userName', data.data.user.name);
      localStorage.setItem('crm_last_activity', Date.now().toString());

      // 2. Validate against server (/me) — overwrites with authoritative values
      try {
        const profile = await getMe();
        localStorage.setItem('userRole', profile.role.name);
        localStorage.setItem('userId', profile.id);
        localStorage.setItem('userName', profile.name);
        if (profile.city_id) localStorage.setItem('userCityId', profile.city_id);
      } catch {
        // /me failed — clear session to force re-login
        logout();
      }
    }
  });
};

// useCurrentUser: re-validates identity on every page load.
// If the account is deactivated, the 401 from /me triggers the axios interceptor → redirect to login.
export const useCurrentUser = () => {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // re-validate every 5 minutes
    retry: false,
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userCityId');
  localStorage.removeItem('crm_last_activity');
  window.location.href = '/login';
};


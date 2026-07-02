import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService } from '../api/services.api';
import { ServiceFormData, UpdateServiceFormData } from '../schemas/service.schema';
import { AxiosError } from 'axios';
import { CreateServiceResponse } from '../types/service.types';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateServiceResponse, AxiosError<{ message?: string }>, ServiceFormData>({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation<unknown, AxiosError<{ message?: string }>, { id: string; data: UpdateServiceFormData }>({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService } from '../api/services.api';
import { ServiceFormData } from '../schemas/service.schema';
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

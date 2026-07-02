import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCities, createCity } from '../api/cities.api';
import { CityFormData } from '../schemas/city.schema';
import { AxiosError } from 'axios';
import { CreateCityResponse } from '../types/city.types';

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });
};

export const useCreateCity = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateCityResponse, AxiosError<{ message?: string }>, CityFormData>({
    mutationFn: createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCities, createCity, updateCity } from '../api/cities.api';
import { CityFormData, UpdateCityFormData } from '../schemas/city.schema';
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

export const useUpdateCity = () => {
  const queryClient = useQueryClient();
  
  return useMutation<unknown, AxiosError<{ message?: string }>, { id: string; data: UpdateCityFormData }>({
    mutationFn: ({ id, data }) => updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
  });
};

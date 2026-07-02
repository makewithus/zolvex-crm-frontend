import { apiClient } from '@/lib/axios';
import { CitiesResponse, CreateCityResponse } from '../types/city.types';
import { CityFormData } from '../schemas/city.schema';

export const getCities = async (): Promise<CitiesResponse> => {
  const response = await apiClient.get('/cities');
  return response.data;
};

export const createCity = async (data: CityFormData): Promise<CreateCityResponse> => {
  const response = await apiClient.post('/cities', data);
  return response.data;
};

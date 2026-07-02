import { apiClient } from '@/lib/axios';
import { Customer, UpdateCustomerInput } from '../schemas/customer.schema';

export const getCustomers = async (): Promise<Customer[]> => {
  const { data } = await apiClient.get('/customers');
  return data.data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const { data } = await apiClient.get(`/customers/${id}`);
  return data.data;
};

export const updateCustomer = async (id: string, customerData: Partial<UpdateCustomerInput>): Promise<Customer> => {
  const { data } = await apiClient.patch(`/customers/${id}`, customerData);
  return data.data;
};

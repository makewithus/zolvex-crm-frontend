import { apiClient } from '@/lib/axios';
import { PricingRulesResponse, CreatePricingRuleResponse } from '../types/pricingRule.types';
import { PricingRuleFormData, UpdatePricingRuleFormData } from '../schemas/pricingRule.schema';

export const getPricingRules = async (params?: { service_id?: string; city_id?: string }): Promise<PricingRulesResponse> => {
  const response = await apiClient.get('/pricing-rules', { params });
  return response.data;
};

export const createPricingRule = async (data: PricingRuleFormData): Promise<CreatePricingRuleResponse> => {
  const response = await apiClient.post('/pricing-rules', data);
  return response.data;
};

export const updatePricingRule = async (id: string, data: UpdatePricingRuleFormData): Promise<unknown> => {
  const response = await apiClient.patch(`/pricing-rules/${id}`, data);
  return response.data;
};

export const deletePricingRule = async (id: string): Promise<unknown> => {
  const response = await apiClient.delete(`/pricing-rules/${id}`);
  return response.data;
};

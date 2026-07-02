import { apiClient } from '@/lib/axios';
import { PricingRulesResponse, CreatePricingRuleResponse } from '../types/pricingRule.types';
import { PricingRuleFormData } from '../schemas/pricingRule.schema';

export const getPricingRules = async (): Promise<PricingRulesResponse> => {
  const response = await apiClient.get('/pricing-rules');
  return response.data;
};

export const createPricingRule = async (data: PricingRuleFormData): Promise<CreatePricingRuleResponse> => {
  const response = await apiClient.post('/pricing-rules', data);
  return response.data;
};

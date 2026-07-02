import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPricingRules, createPricingRule } from '../api/pricingRules.api';
import { PricingRuleFormData } from '../schemas/pricingRule.schema';
import { AxiosError } from 'axios';
import { CreatePricingRuleResponse } from '../types/pricingRule.types';

export const usePricingRules = () => {
  return useQuery({
    queryKey: ['pricing-rules'],
    queryFn: getPricingRules,
  });
};

export const useCreatePricingRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreatePricingRuleResponse, AxiosError<{ message?: string }>, PricingRuleFormData>({
    mutationFn: createPricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
    },
  });
};

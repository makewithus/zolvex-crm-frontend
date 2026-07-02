import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPricingRules, createPricingRule, updatePricingRule, deletePricingRule } from '../api/pricingRules.api';
import { PricingRuleFormData, UpdatePricingRuleFormData } from '../schemas/pricingRule.schema';
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

export const useUpdatePricingRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation<unknown, AxiosError<{ message?: string }>, { id: string; data: UpdatePricingRuleFormData }>({
    mutationFn: ({ id, data }) => updatePricingRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
    },
  });
};

export const useDeletePricingRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation<unknown, AxiosError<{ message?: string }>, string>({
    mutationFn: deletePricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
    },
  });
};

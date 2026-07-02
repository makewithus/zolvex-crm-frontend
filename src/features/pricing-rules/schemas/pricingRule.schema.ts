import { z } from 'zod';

export const pricingRuleSchema = z.object({
  service_id: z.string().uuid('Valid Service ID required').min(1, 'Service is required'),
  city_id: z.string().uuid('Valid City ID required').optional().or(z.literal('')),
  bhk_type: z.string().optional(),
  tank_size: z.string().optional(),
  base_price: z.number().min(0, 'Base price must be >= 0'),
}).transform((data) => ({
  ...data,
  city_id: data.city_id === '' ? undefined : data.city_id,
}));

export type PricingRuleFormData = z.input<typeof pricingRuleSchema>;

export const updatePricingRuleSchema = z.object({
  service_id: z.string().uuid('Valid Service ID required').optional(),
  city_id: z.string().uuid('Valid City ID required').optional().or(z.literal('')),
  bhk_type: z.string().optional().nullable(),
  tank_size: z.string().optional().nullable(),
  base_price: z.number().min(0, 'Base price must be >= 0').optional(),
}).transform((data) => ({
  ...data,
  city_id: data.city_id === '' ? undefined : data.city_id,
  bhk_type: data.bhk_type === '' ? null : data.bhk_type,
  tank_size: data.tank_size === '' ? null : data.tank_size,
}));

export type UpdatePricingRuleFormData = z.input<typeof updatePricingRuleSchema>;

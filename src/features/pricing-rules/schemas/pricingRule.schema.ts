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

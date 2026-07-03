import { z } from 'zod';

export const pricingRuleSchema = z.object({
  service_id: z.string().uuid('Valid Service ID required').min(1, 'Service is required'),
  city_id: z.string().uuid('Valid City ID required').optional().or(z.literal('')),
  bhk_type: z.string().optional(),
  tank_size: z.string().optional(),
  base_price: z.number().min(0, 'Base price must be >= 0'),
  cgst_percent: z.number().min(0, 'CGST must be >= 0').default(9),
  sgst_percent: z.number().min(0, 'SGST must be >= 0').default(9),
  igst_percent: z.number().min(0, 'IGST must be >= 0').default(0),
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
  cgst_percent: z.number().min(0, 'CGST must be >= 0').optional(),
  sgst_percent: z.number().min(0, 'SGST must be >= 0').optional(),
  igst_percent: z.number().min(0, 'IGST must be >= 0').optional(),
}).transform((data) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { service_id, ...rest } = data;
  return {
    ...rest,
    city_id: rest.city_id === '' ? null : rest.city_id,
    bhk_type: rest.bhk_type === '' ? null : rest.bhk_type,
    tank_size: rest.tank_size === '' ? null : rest.tank_size,
  };
});

export type UpdatePricingRuleFormData = z.input<typeof updatePricingRuleSchema>;

import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'Base price must be >= 0'),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

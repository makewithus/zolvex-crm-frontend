import { z } from 'zod';

export const customerSchema = z.object({
  id: z.string().uuid(),
  phone: z.string(),
  name: z.string().nullable(),
  is_repeat_customer: z.boolean(),
  tags: z.array(z.string()),
  // Leads associated with the customer
  leads: z.array(z.any()).optional(), // We can type this strictly later if needed
});

export type Customer = z.infer<typeof customerSchema>;

export const updateCustomerSchema = z.object({
  name: z.string().nullable().optional(),
  is_repeat_customer: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

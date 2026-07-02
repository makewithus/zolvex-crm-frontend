import { z } from 'zod';

export const customerLeadSchema = z.object({
  id: z.string(),
  source: z.string(),
  status: z.string(),
  created_at: z.string(),
});

export const customerSchema = z.object({
  id: z.string().uuid(),
  phone: z.string(),
  name: z.string().nullable().optional(),
  is_repeat_customer: z.boolean(),
  tags: z.array(z.string()).optional(),
  leads: z.array(customerLeadSchema).optional(),
  bookings: z.array(z.any()).optional(),
});

export type Customer = z.infer<typeof customerSchema>;

export const updateCustomerSchema = z.object({
  name: z.string().nullable().optional(),
  is_repeat_customer: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export const customerFormSchema = z.object({
  name: z.string().optional().nullable().or(z.literal('')),
  is_repeat_customer: z.boolean(),
  tags: z.string().optional(),
}).transform(data => ({
  name: data.name === '' ? null : data.name,
  is_repeat_customer: data.is_repeat_customer,
  tags: data.tags 
    ? data.tags.split(',').map(t => t.trim()).filter(Boolean) 
    : [],
}));

export type CustomerFormInput = z.input<typeof customerFormSchema>;

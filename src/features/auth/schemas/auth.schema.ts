import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

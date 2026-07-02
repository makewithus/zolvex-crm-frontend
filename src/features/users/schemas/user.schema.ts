import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role_id: z.string().min(1, "Role is required"),
  city_id: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

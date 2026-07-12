import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role_id: z.string().min(1, "Role is required"),
  city_id: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits').optional(),
  role_id: z.string().min(1, "Role is required").optional(),
  city_id: z.string().optional(),
  is_active: z.boolean().optional(),
});
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const resetPasswordSchema = z.object({
  new_password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

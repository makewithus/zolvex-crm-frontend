import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role_id: z.string().min(1, "Role is required"),
  // Transform empty string → undefined so no invalid FK is ever sent
  city_id: z.string().optional().transform(v => v === '' ? undefined : v),
});

export type UserFormData = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits').optional(),
  role_id: z.string().min(1, "Role is required").optional(),
  // Transform empty string → undefined so no invalid FK is ever sent
  city_id: z.string().optional().transform(v => v === '' ? undefined : v),
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

import { z } from 'zod';

export const citySchema = z.object({
  name: z.string().min(2, "City name must be at least 2 characters"),
});

export type CityFormData = z.infer<typeof citySchema>;

export const updateCitySchema = z.object({
  name: z.string().min(2, "City name must be at least 2 characters").optional(),
  is_active: z.boolean().optional(),
});

export type UpdateCityFormData = z.infer<typeof updateCitySchema>;

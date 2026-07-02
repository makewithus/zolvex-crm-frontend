import { z } from 'zod';

export const createBookingSchema = z.object({
  customer_id: z.string().uuid('Invalid customer ID'),
  city_id: z.string().uuid('Invalid city ID'),
  service_id: z.string().uuid('Invalid service ID'),
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
  slot: z.string().optional(),
  
  address_line_1: z.string().min(1, 'Address Line 1 is required'),
  address_line_2: z.string().optional(),
  area: z.string().optional(),
  landmark: z.string().optional(),
  city_name: z.string().min(1, 'City name is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('India'),
  
  notes: z.string().optional(),
  special_instructions: z.string().optional(),
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;

export const convertLeadToBookingSchema = z.object({
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
  slot: z.string().optional(),
  
  address_line_1: z.string().min(1, 'Address Line 1 is required'),
  address_line_2: z.string().optional(),
  area: z.string().optional(),
  landmark: z.string().optional(),
  city_name: z.string().min(1, 'City name is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('India'),
  
  notes: z.string().optional(),
  special_instructions: z.string().optional(),
});

export type ConvertLeadToBookingFormData = z.infer<typeof convertLeadToBookingSchema>;

export const updateBookingSchema = z.object({
  notes: z.string().optional(),
  special_instructions: z.string().optional(),
});

export type UpdateBookingFormData = z.infer<typeof updateBookingSchema>;

export const cancelBookingSchema = z.object({
  cancel_reason: z.string().min(5, 'Reason must be at least 5 characters long'),
});

export type CancelBookingFormData = z.infer<typeof cancelBookingSchema>;

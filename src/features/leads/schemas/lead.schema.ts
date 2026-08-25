import { z } from 'zod';

export const leadFormSchema = z.object({
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
  name: z.string().optional().nullable(),
  source: z.enum(['Phone', 'WhatsApp', 'WebsiteForm', 'MetaAds', 'ManualEntry', 'Justdial', 'Referrals']),
  city_id: z.string().uuid().optional().nullable().or(z.literal('')),
  service_id: z.string().uuid().optional().nullable().or(z.literal('')),
  service_location: z.string().optional().nullable(),
  follow_up_date: z.string().optional().nullable(),
}).transform(data => ({
  ...data,
  city_id: data.city_id === '' ? undefined : data.city_id,
  service_id: data.service_id === '' ? undefined : data.service_id,
  follow_up_date: data.follow_up_date ? new Date(data.follow_up_date).toISOString() : null,
}));

export const leadUpdateSchema = z.object({
  name: z.string().optional(),
  city_id: z.string().optional(),
  service_id: z.string().optional(),
  status: z.enum(['New', 'Contacted', 'FollowUp', 'Qualified', 'QuotationSent', 'Booked', 'Lost']).optional(),
  assigned_to: z.string().optional(),
  service_location: z.string().optional().nullable(),
  follow_up_date: z.string().optional().nullable(),
}).transform(data => ({
  ...data,
  assigned_to: data.assigned_to === '' ? undefined : data.assigned_to,
  follow_up_date: data.follow_up_date ? new Date(data.follow_up_date).toISOString() : null,
}));



export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadUpdateInput = z.input<typeof leadUpdateSchema>;
export type LeadNoteInput = z.infer<typeof leadNoteSchema>;

export const leadNoteSchema = z.object({
  note_text: z.string().min(1, 'Note text is required')
});

import { z } from 'zod';

export const leadFormSchema = z.object({
  phone: z.string().min(10, 'Valid phone required'),
  name: z.string().optional().nullable(),
  source: z.enum(['Phone', 'WhatsApp', 'WebsiteForm', 'MetaAds', 'ManualEntry', 'Justdial', 'Referrals']),
  city_id: z.string().uuid().optional().nullable().or(z.literal('')),
  service_id: z.string().uuid().optional().nullable().or(z.literal('')),
});

export const leadUpdateSchema = z.object({
  status: z.enum(['New', 'Contacted', 'FollowUp', 'Qualified', 'QuotationSent', 'Booked', 'Lost']).optional(),
  assigned_to: z.string().uuid().optional().nullable().or(z.literal('')),
});

export const leadNoteSchema = z.object({
  note_text: z.string().min(1, 'Note text is required')
});

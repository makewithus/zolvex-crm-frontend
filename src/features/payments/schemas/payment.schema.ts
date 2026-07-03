import { z } from 'zod';

export const recordPaymentSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.number().positive('Amount must be greater than zero'),
  payment_method: z.enum(['Cash', 'UPI', 'BankTransfer', 'Card', 'Cheque']),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

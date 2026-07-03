export type PaymentMethod = 'Cash' | 'UPI' | 'BankTransfer' | 'Card' | 'Cheque';
export type PaymentTransactionStatus = 'Pending' | 'Completed' | 'Failed' | 'Voided';

export interface Payment {
  id: string;
  payment_number: string;
  sequence_number: number;
  invoice_id: string;
  customer_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentTransactionStatus;
  payment_date: string;
  payment_metadata?: any;
  notes?: string;
  recorded_by: string;
  created_at: string;
  
  user?: { name: string };
  customer?: { name: string; phone: string };
  history?: PaymentHistory[];
}

export interface PaymentHistory {
  id: string;
  payment_id: string;
  action: string;
  changed_by: string;
  changed_by_role?: string;
  reason?: string;
  ip_address?: string;
  changed_at: string;
}

export interface RecordPaymentPayload {
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string;
  reason?: string;
}

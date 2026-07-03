export type InvoiceStatus = 'Draft' | 'Issued' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid';

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  service_name: string;
  quantity: number;
  unit_price: number | string;
  discount_amount: number | string;
  cgst_amount: number | string;
  sgst_amount: number | string;
  igst_amount: number | string;
  line_total: number | string;
}

export interface InvoiceHistory {
  id: string;
  invoice_id: string;
  action: string;
  from_status?: InvoiceStatus;
  to_status: InvoiceStatus;
  changed_by: string;
  changed_by_role?: string;
  reason?: string;
  changed_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  sequence_number: number;
  booking_id: string;
  city_id: string;
  technician_id?: string;
  issue_date: string;
  due_date: string;
  customer_name?: string;
  customer_phone: string;
  billing_address: string;
  service_name: string;
  base_amount: number | string;
  discount_amount: number | string;
  cgst_percent: number | string;
  cgst_amount: number | string;
  sgst_percent: number | string;
  sgst_amount: number | string;
  igst_percent: number | string;
  igst_amount: number | string;
  total_tax_amount: number | string;
  final_amount: number | string;
  status: InvoiceStatus;
  payment_status: PaymentStatus;
  amount_paid: number | string;
  balance_due: number | string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
  history?: InvoiceHistory[];
}

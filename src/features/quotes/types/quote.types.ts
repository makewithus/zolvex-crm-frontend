export type QuoteStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';

export interface QuoteLineItem {
  id:          string;
  quote_id:    string;
  service_id:  string | null;
  description: string;
  quantity:    number;
  unit_price:  string; // Decimal as string
  tax_percent: string;
  total_price: string;
  sort_order:  number;
}

export interface Quote {
  id:                string;
  quote_id:          string; // e.g. QT-2608-001
  customer_id:       string;
  customer:          { id: string; name: string; phone: string };
  lead_id:           string | null;
  subject:           string;
  description:       string | null;
  status:            QuoteStatus;
  subtotal:          string;
  tax_amount:        string;
  discount_amount:   string;
  total_amount:      string;
  valid_until:       string | null;
  notes:             string | null;
  terms:             string | null;
  pdf_url:           string | null;
  sent_at:           string | null;
  viewed_at:         string | null;
  accepted_at:       string | null;
  rejected_at:       string | null;
  created_by:        string;
  createdBy:         { id: string; name: string };
  line_items:        QuoteLineItem[];
  created_at:        string;
  updated_at:        string;
}

export interface CreateQuoteLineItemPayload {
  service_id?:  string;
  description:  string;
  quantity:     number;
  unit_price:   number;
  tax_percent?: number;
  sort_order?:  number;
}

export interface CreateQuotePayload {
  customer_id:  string;
  lead_id?:     string;
  subject:      string;
  description?: string;
  valid_until?: string;
  notes?:       string;
  terms?:       string;
  discount_amount?: number | string;
  line_items:   CreateQuoteLineItemPayload[];
}

export type UpdateQuotePayload = Partial<Omit<CreateQuotePayload, 'customer_id'>>;

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  Draft:    'Draft',
  Sent:     'Sent',
  Viewed:   'Viewed',
  Accepted: 'Accepted',
  Rejected: 'Rejected',
  Expired:  'Expired',
};

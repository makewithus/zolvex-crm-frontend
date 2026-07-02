export interface CustomerLead {
  id: string;
  source: string;
  status: string;
  created_at: string;
  service?: {
    name: string;
  };
}

export interface Customer {
  id: string;
  phone: string;
  name?: string | null;
  is_repeat_customer: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
  leads?: CustomerLead[];
  bookings?: any[];
}

export interface CustomersResponse {
  status: string;
  message: string;
  data: Customer[];
}

export interface CustomerResponse {
  status: string;
  message: string;
  data: Customer;
}

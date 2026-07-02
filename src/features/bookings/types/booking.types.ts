export type BookingStatus = 'Draft' | 'Pending' | 'Confirmed' | 'Scheduled' | 'Assigned' | 'InProgress' | 'Completed' | 'Cancelled' | 'NoShow';

export interface Booking {
  id: string;
  booking_id: string;
  lead_id?: string;
  customer_id: string;
  city_id: string;
  service_id: string;
  pricing_rule_id?: string;
  
  scheduled_date: string;
  slot?: string;
  
  customer_name?: string;
  customer_phone: string;
  customer_email?: string;
  
  address_line_1: string;
  address_line_2?: string;
  area?: string;
  landmark?: string;
  city_name: string;
  postal_code: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  
  service_name: string;
  estimated_duration_minutes?: number;
  
  base_price: string;
  discount: string;
  tax: string;
  final_amount: string;
  pricing_rule_name?: string;
  
  status: BookingStatus;
  notes?: string;
  special_instructions?: string;
  cancel_reason?: string;
  
  assigned_user_id?: string;
  
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;

  customer?: { id: string; name?: string; phone: string };
  city?: { id: string; name: string };
  service?: { id: string; name: string };
  assignedUser?: { id: string; name: string };
}

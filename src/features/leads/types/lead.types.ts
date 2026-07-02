export type LeadSource = 'Phone' | 'WhatsApp' | 'WebsiteForm' | 'MetaAds' | 'ManualEntry' | 'Justdial' | 'Referrals';
export type LeadStatus = 'New' | 'Contacted' | 'FollowUp' | 'Qualified' | 'QuotationSent' | 'Booked' | 'Lost';

export interface LeadNote {
  id: string;
  note_text: string;
  created_at: string;
  created_by: {
    name: string;
  };
}

export interface Lead {
  id: string;
  phone: string;
  name?: string | null;
  source: LeadSource;
  status: LeadStatus;
  city_id?: string | null;
  service_id?: string | null;
  assigned_to?: string | null;
  created_at: string;
  assignedTo?: {
    id: string;
    name: string;
  } | null;
  city?: {
    id: string;
    name: string;
  } | null;
  service?: {
    id: string;
    name: string;
  } | null;
  notes?: LeadNote[];
}

export interface LeadsResponse {
  status: string;
  message: string;
  data: Lead[];
}

export interface LeadResponse {
  status: string;
  message: string;
  data: Lead;
}

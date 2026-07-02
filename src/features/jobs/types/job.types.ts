export interface JobMedia {
  id: string;
  type: string;
  category: string;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface JobHistory {
  id: string;
  from_status?: string;
  to_status: string;
  changed_by: string;
  changed_by_role?: string;
  changed_at: string;
  note?: string;
}

export interface JobAssignmentHistory {
  id: string;
  previous_user_id?: string;
  new_user_id?: string;
  assigned_by: string;
  assigned_at: string;
  reason?: string;
}

export interface Job {
  id: string;
  job_id: string;
  booking_id: string;
  assigned_user_id?: string;
  status: string;
  priority: string;
  
  scheduled_start: string;
  scheduled_end?: string;
  actual_start?: string;
  actual_end?: string;
  estimated_duration_minutes?: number;

  completion_notes?: string;
  internal_notes?: string;
  cancellation_reason?: string;
  failure_reason?: string;
  
  signature_url?: string;
  signed_by_name?: string;
  signed_at?: string;
  
  latitude?: number;
  longitude?: number;

  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;

  booking?: any;
  assignedUser?: { id: string; name: string; phone: string };
  history?: JobHistory[];
  assignment_history?: JobAssignmentHistory[];
  media?: JobMedia[];
}

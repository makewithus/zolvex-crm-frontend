import { apiClient } from '@/lib/axios';

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  city_id?: string;
  assigned_user_id?: string;
  status?: string;
}

export interface RevenueSummary {
  total_revenue: number;
  total_tax: number;
  total_subtotal: number;
  invoice_count: number;
}

export interface OutstandingSummary {
  total_outstanding: number;
  outstanding_invoices_count: number;
}

export interface CollectionsSummary {
  total_collected: number;
  payment_count: number;
}

export interface GSTSummary {
  cgst: number;
  sgst: number;
  igst: number;
  total_tax: number;
}

export interface DashboardKPIsReport {
  financial: {
    revenue: number;
    outstanding: number;
    collections: number;
  };
  operational: {
    bookings_by_status: Record<string, number>;
    jobs_by_status: Record<string, number>;
  };
}

export interface TechnicianProductivity {
  [techId: string]: {
    jobs_completed: number;
    total_scheduled_mins: number;
    total_actual_mins: number;
  };
}

const buildParams = (filters?: ReportFilters) => {
  const params: Record<string, string> = {};
  if (filters?.start_date) params.start_date = filters.start_date;
  if (filters?.end_date) params.end_date = filters.end_date;
  if (filters?.city_id) params.city_id = filters.city_id;
  if (filters?.assigned_user_id) params.assigned_user_id = filters.assigned_user_id;
  if (filters?.status) params.status = filters.status;
  return params;
};

export const getReportDashboard = async (filters?: ReportFilters): Promise<DashboardKPIsReport> => {
  const { data } = await apiClient.get('/reports/dashboard', { params: buildParams(filters) });
  return data.data;
};

export const getFinancialReport = async (filters?: ReportFilters): Promise<{
  revenue: RevenueSummary;
  outstanding: OutstandingSummary;
  collections: CollectionsSummary;
}> => {
  const { data } = await apiClient.get('/reports/financial', { params: buildParams(filters) });
  return data.data;
};

export const getOperationalReport = async (filters?: ReportFilters): Promise<{
  bookings: Record<string, number>;
  jobs: Record<string, number>;
}> => {
  const { data } = await apiClient.get('/reports/operational', { params: buildParams(filters) });
  return data.data;
};

export const getTechnicianReport = async (filters?: ReportFilters): Promise<{
  productivity: TechnicianProductivity;
}> => {
  const { data } = await apiClient.get('/reports/technician', { params: buildParams(filters) });
  return data.data;
};

export const getGSTReport = async (filters?: ReportFilters): Promise<{ gst: GSTSummary }> => {
  const { data } = await apiClient.get('/reports/gst', { params: buildParams(filters) });
  return data.data;
};

import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '../lib/axios';

export interface AlertsSummary {
  openComplaints: number;
  newLeads: number;
  dueFollowUps: number;
  unpaidInvoices: number;
  pendingExpenses: number;
  rejectedExpenses: number;
  total: number;
}

export const useAlerts = () => {
  return useQuery<AlertsSummary>({
    queryKey: ['alerts', 'summary'],
    queryFn: async () => {
      const response = await api.get('/alerts/summary');
      return response.data.data;
    },
    refetchInterval: 60000, // refresh every minute
  });
};

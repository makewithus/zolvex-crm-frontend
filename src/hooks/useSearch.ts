import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '../lib/axios';

export interface SearchResultItem {
  id: string;
  name?: string;
  phone?: string;
  status?: string;
  booking_id?: string;
  customer_name?: string;
  invoice_number?: string;
}

export interface SearchResults {
  customers: SearchResultItem[];
  leads: SearchResultItem[];
  bookings: SearchResultItem[];
  invoices: SearchResultItem[];
}

export const useGlobalSearch = (query: string) => {
  return useQuery<SearchResults>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (query.trim().length < 2) {
        return { customers: [], leads: [], bookings: [], invoices: [] };
      }
      const response = await api.get('/search', { params: { q: query } });
      return response.data.data;
    },
    enabled: query.trim().length >= 2,
    staleTime: 5000,
  });
};

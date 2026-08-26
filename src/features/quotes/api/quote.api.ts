import { apiClient as api } from '@/lib/axios';
import { Quote, CreateQuotePayload, UpdateQuotePayload } from '../types/quote.types';

const BASE = '/quotes';

export const getQuotes = async (params?: { status?: string; customer_id?: string }) => {
  const { data } = await api.get<{ success?: boolean; data?: Quote[] } | Quote[]>(BASE, { params });
  // Handle both wrapped and unwrapped responses
  return Array.isArray(data) ? data : (data as any).data ?? [];
};

export const getQuoteById = async (id: string) => {
  const { data } = await api.get<Quote>(`${BASE}/${id}`);
  return data;
};

export const createQuote = async (payload: CreateQuotePayload) => {
  const { data } = await api.post<Quote>(BASE, payload);
  return data;
};

export const updateQuote = async (id: string, payload: UpdateQuotePayload) => {
  const { data } = await api.put<Quote>(`${BASE}/${id}`, payload);
  return data;
};

export const sendQuote = async (id: string, note?: string) => {
  const { data } = await api.post<Quote>(`${BASE}/${id}/send`, { note });
  return data;
};

export const acceptQuote = async (id: string, note?: string) => {
  const { data } = await api.post<Quote>(`${BASE}/${id}/accept`, { note });
  return data;
};

export const rejectQuote = async (id: string, reason: string) => {
  const { data } = await api.post<Quote>(`${BASE}/${id}/reject`, { reason });
  return data;
};

export const downloadQuotePdf = async (id: string, quoteNumber: string) => {
  const response = await api.get(`${BASE}/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data as any]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `quotation-${quoteNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

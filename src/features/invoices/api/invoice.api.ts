import { apiClient as api } from '@/lib/axios';
import { Invoice, InvoiceStatus } from '../types/invoice.types';

export const getInvoices = async (params?: { status?: string; city_id?: string }) => {
  const { data } = await api.get<{ success: boolean; data: Invoice[] }>('/invoices', { params });
  return data.data;
};

export const getInvoiceById = async (id: string) => {
  const { data } = await api.get<{ success: boolean; data: Invoice }>(`/invoices/${id}`);
  return data.data;
};

export const updateInvoiceStatus = async (id: string, payload: { status: InvoiceStatus; reason?: string }) => {
  const { data } = await api.patch<{ success: boolean; data: Invoice }>(`/invoices/${id}/status`, payload);
  return data.data;
};

export const getCustomerInvoices = async (customerId: string) => {
  const { data } = await api.get<{ success: boolean; data: Invoice[] }>(`/customers/${customerId}/invoices`);
  return data.data;
};

export const downloadInvoicePdf = async (id: string, invoiceNumber: string) => {
  const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

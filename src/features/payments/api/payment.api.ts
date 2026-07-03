import api from '@/lib/axios';
import { Payment, RecordPaymentPayload } from '../types/payment.types';

export const recordPayment = async (data: RecordPaymentPayload): Promise<Payment> => {
  const response = await api.post('/payments', data);
  return response.data.data;
};

export const getPayments = async (filters?: { invoice_id?: string; customer_id?: string }): Promise<Payment[]> => {
  const response = await api.get('/payments', { params: filters });
  return response.data.data;
};

export const getPaymentById = async (id: string): Promise<Payment> => {
  const response = await api.get(`/payments/${id}`);
  return response.data.data;
};

export const downloadReceiptPdf = async (id: string, paymentNumber: string): Promise<void> => {
  const response = await api.get(`/payments/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Receipt-${paymentNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

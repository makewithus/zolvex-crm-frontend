import { useQuery, useMutation } from '@tanstack/react-query';
import * as paymentApi from '../api/payment.api';

export const usePayments = (filters?: { invoice_id?: string; customer_id?: string }) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentApi.getPayments(filters),
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentApi.getPaymentById(id),
    enabled: !!id,
  });
};

export const useDownloadReceipt = () => {
  return useMutation({
    mutationFn: ({ id, paymentNumber }: { id: string; paymentNumber: string }) => 
      paymentApi.downloadReceiptPdf(id, paymentNumber),
  });
};

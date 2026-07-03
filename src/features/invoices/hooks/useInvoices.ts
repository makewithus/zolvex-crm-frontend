import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/invoice.api';
import { InvoiceStatus } from '../types/invoice.types';
import { toast } from 'sonner';

export const useInvoices = (filters?: { status?: string; city_id?: string }) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => api.getInvoices(filters),
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => api.getInvoiceById(id),
    enabled: !!id,
  });
};

export const useCustomerInvoices = (customerId: string) => {
  return useQuery({
    queryKey: ['customers', customerId, 'invoices'],
    queryFn: () => api.getCustomerInvoices(customerId),
    enabled: !!customerId,
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: InvoiceStatus; reason?: string }) =>
      api.updateInvoiceStatus(id, { status, reason }),
    onSuccess: (data) => {
      toast.success(`Invoice marked as ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', data.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update invoice status');
    }
  });
};

export const useDownloadPdf = () => {
  return useMutation({
    mutationFn: ({ id, invoiceNumber }: { id: string; invoiceNumber: string }) => api.downloadInvoicePdf(id, invoiceNumber),
    onSuccess: () => {
      toast.success('PDF downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download PDF');
    }
  });
};

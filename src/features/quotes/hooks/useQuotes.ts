import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getQuotes, getQuoteById, createQuote,
  updateQuote, sendQuote, acceptQuote, rejectQuote,
  downloadQuotePdf,
} from '../api/quote.api';
import { CreateQuotePayload, UpdateQuotePayload } from '../types/quote.types';

const QUERY_KEY = 'quotes';

export const useQuotes = (params?: { status?: string; customer_id?: string }) =>
  useQuery({ queryKey: [QUERY_KEY, params], queryFn: () => getQuotes(params) });

export const useQuote = (id: string) =>
  useQuery({ queryKey: [QUERY_KEY, id], queryFn: () => getQuoteById(id), enabled: !!id });

export const useCreateQuote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuotePayload) => createQuote(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Quote created'); },
    onError:   () => toast.error('Failed to create quote'),
  });
};

export const useUpdateQuote = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateQuotePayload) => updateQuote(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Quote updated'); },
    onError:   () => toast.error('Failed to update quote'),
  });
};

export const useSendQuote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => sendQuote(id, note),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Quote sent — Lead updated to QuotationSent'); },
    onError:   () => toast.error('Failed to send quote'),
  });
};

export const useAcceptQuote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => acceptQuote(id, note),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Quote accepted'); },
    onError:   () => toast.error('Failed to accept quote'),
  });
};

export const useRejectQuote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectQuote(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Quote rejected'); },
    onError:   () => toast.error('Failed to reject quote'),
  });
};

export const useDownloadQuotePdf = () => {
  return useMutation({
    mutationFn: ({ id, quoteNumber }: { id: string; quoteNumber: string }) => downloadQuotePdf(id, quoteNumber),
    onSuccess: () => toast.success('PDF downloaded successfully'),
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to download PDF'),
  });
};

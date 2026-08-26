import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getExpenses, getExpenseById, createExpense,
  updateExpense, submitExpense, approveExpense,
  rejectExpense, deleteExpense, uploadReceipt, downloadExpensePdf,
} from '../api/expense.api';
import { CreateExpensePayload, UpdateExpensePayload } from '../types/expense.types';

const QUERY_KEY = 'expenses';

export const useExpenses = (params?: { status?: string; category?: string; city_id?: string }) =>
  useQuery({ queryKey: [QUERY_KEY, params], queryFn: () => getExpenses(params) });

export const useExpense = (id: string) =>
  useQuery({ queryKey: [QUERY_KEY, id], queryFn: () => getExpenseById(id), enabled: !!id });

export const useCreateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Expense created'); },
    onError:   () => toast.error('Failed to create expense'),
  });
};

export const useUpdateExpense = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateExpensePayload) => updateExpense(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Expense updated'); },
    onError:   () => toast.error('Failed to update expense'),
  });
};

export const useSubmitExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submitExpense(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Expense submitted'); },
    onError:   () => toast.error('Failed to submit expense'),
  });
};

export const useApproveExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveExpense(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Expense approved'); },
    onError:   () => toast.error('Failed to approve expense'),
  });
};

export const useRejectExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectExpense(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Expense rejected'); },
    onError:   () => toast.error('Failed to reject expense'),
  });
};

export const useDeleteExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); toast.success('Expense deleted'); },
    onError:   () => toast.error('Failed to delete expense'),
  });
};

export const useUploadReceipt = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadReceipt(id, file),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY, id] }); toast.success('Receipt uploaded'); },
    onError:   () => toast.error('Failed to upload receipt'),
  });
};

export const useDownloadExpensePdf = () => {
  return useMutation({
    mutationFn: ({ id, expenseNumber }: { id: string; expenseNumber: string }) => downloadExpensePdf(id, expenseNumber),
    onSuccess: () => toast.success('PDF downloaded successfully'),
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to download PDF'),
  });
};

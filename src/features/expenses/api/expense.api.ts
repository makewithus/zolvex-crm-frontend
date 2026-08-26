import { apiClient as api } from '@/lib/axios';
import { Expense, CreateExpensePayload, UpdateExpensePayload } from '../types/expense.types';

const BASE = '/expenses';

export const getExpenses = async (params?: {
  status?:   string;
  category?: string;
  city_id?:  string;
}) => {
  const { data } = await api.get<{ success: boolean; data: Expense[] }>(BASE, { params });
  return data.data;
};

export const getExpenseById = async (id: string) => {
  const { data } = await api.get<{ success: boolean; data: Expense }>(`${BASE}/${id}`);
  return data.data;
};

export const createExpense = async (payload: CreateExpensePayload) => {
  const { data } = await api.post<{ success: boolean; data: Expense }>(BASE, payload);
  return data.data;
};

export const updateExpense = async (id: string, payload: UpdateExpensePayload) => {
  const { data } = await api.put<{ success: boolean; data: Expense }>(`${BASE}/${id}`, payload);
  return data.data;
};

export const submitExpense = async (id: string) => {
  const { data } = await api.patch<{ success: boolean; data: Expense }>(`${BASE}/${id}/submit`);
  return data.data;
};

export const approveExpense = async (id: string) => {
  const { data } = await api.patch<{ success: boolean; data: Expense }>(`${BASE}/${id}/approve`);
  return data.data;
};

export const rejectExpense = async (id: string, reason: string) => {
  const { data } = await api.patch<{ success: boolean; data: Expense }>(`${BASE}/${id}/reject`, { reason });
  return data.data;
};

export const deleteExpense = async (id: string) => {
  await api.delete(`${BASE}/${id}`);
};

export const uploadReceipt = async (id: string, file: File) => {
  const form = new FormData();
  form.append('receipt', file);
  const { data } = await api.post<{ success: boolean; data: Expense; receipt_url: string }>(
    `${BASE}/${id}/receipt`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

export const downloadExpensePdf = async (id: string, expenseNumber: string) => {
  const response = await api.get(`${BASE}/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data as any]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `expense-${expenseNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

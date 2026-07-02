import { apiClient } from '@/lib/axios';
import { LeadsResponse, LeadResponse } from '../types/lead.types';
import { LeadFormInput, LeadUpdateInput } from '../schemas/lead.schema';

export const getLeads = async (): Promise<LeadsResponse> => {
  const res = await apiClient.get('/leads');
  return res.data;
};

export const getLeadById = async (id: string): Promise<LeadResponse> => {
  const res = await apiClient.get(`/leads/${id}`);
  return res.data;
};

export const createLead = async (data: LeadFormInput): Promise<LeadResponse> => {
  const res = await apiClient.post('/leads', data);
  return res.data;
};

export const updateLead = async ({ id, data }: { id: string; data: LeadUpdateInput }): Promise<LeadResponse> => {
  const res = await apiClient.patch(`/leads/${id}`, data);
  return res.data;
};

export const addLeadNote = async ({ id, note_text }: { id: string; note_text: string }): Promise<LeadResponse> => {
  const res = await apiClient.post(`/leads/${id}/notes`, { note_text });
  return res.data;
};

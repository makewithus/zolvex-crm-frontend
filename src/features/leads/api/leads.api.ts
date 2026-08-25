import { apiClient } from '@/lib/axios';
import { LeadsResponse, LeadResponse } from '../types/lead.types';
import { LeadFormInput, LeadUpdateInput } from '../schemas/lead.schema';

export const getLeads = async (params?: any): Promise<LeadsResponse> => {
  const res = await apiClient.get('/leads', { params });
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

export const getLostReasons = async () => {
  const res = await apiClient.get('/lost-reasons');
  return res.data;
};

export const createLostReason = async (reason_text: string) => {
  const res = await apiClient.post('/lost-reasons', { reason_text });
  return res.data;
};

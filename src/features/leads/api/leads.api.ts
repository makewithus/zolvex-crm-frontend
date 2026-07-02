import { apiClient } from '@/lib/axios';

export const getLeads = async () => {
  const res = await apiClient.get('/leads');
  return res.data.data;
};

export const createLead = async (data: any) => {
  const payload = { ...data };
  if (!payload.city_id) delete payload.city_id;
  if (!payload.service_id) delete payload.service_id;
  
  const res = await apiClient.post('/leads', payload);
  return res.data.data;
};

export const updateLead = async ({ id, data }: { id: string; data: any }) => {
  const payload = { ...data };
  if (!payload.assigned_to) delete payload.assigned_to;

  const res = await apiClient.patch(`/leads/${id}`, payload);
  return res.data.data;
};

export const addLeadNote = async ({ id, note_text }: { id: string; note_text: string }) => {
  const res = await apiClient.post(`/leads/${id}/notes`, { note_text });
  return res.data.data;
};

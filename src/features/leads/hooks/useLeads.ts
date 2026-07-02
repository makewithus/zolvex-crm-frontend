import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/leads.api';

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => api.getLeadById(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateLead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
    }
  });
};

export const useAddLeadNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addLeadNote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
    }
  });
};

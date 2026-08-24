import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/axios';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatEnumLabel } from '@/lib/utils';

interface JobChecklistPanelProps {
  jobId: string;
  canApply: boolean; // True for Admins
  isFieldStaff: boolean; // True if they should be able to check things off
}

export const JobChecklistPanel = ({ jobId, canApply, isFieldStaff }: JobChecklistPanelProps) => {
  const queryClient = useQueryClient();
  const [isApplying, setIsApplying] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [checklistToRemove, setChecklistToRemove] = useState<any | null>(null);

  // Fetch job checklists
  const { data: checklists, isLoading } = useQuery({
    queryKey: ['job-checklists', jobId],
    queryFn: async () => {
      const res = await api.get(`/jobs/${jobId}/checklists`);
      return res.data.data;
    }
  });

  // Fetch available templates for the dropdown
  const { data: templates } = useQuery({
    queryKey: ['checklist-templates'],
    queryFn: async () => {
      const res = await api.get('/checklists?include_inactive=false');
      return res.data.data;
    },
    enabled: canApply,
  });

  const applyMutation = useMutation({
    mutationFn: (templateId: string) => api.post(`/jobs/${jobId}/checklists`, { template_id: templateId }),
    onSuccess: () => {
      toast.success('Checklist applied to job');
      setIsApplying(false);
      setSelectedTemplate('');
      queryClient.invalidateQueries({ queryKey: ['job-checklists', jobId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to apply checklist')
  });

  const removeMutation = useMutation({
    mutationFn: (checklistId: string) => api.delete(`/jobs/${jobId}/checklists/${checklistId}`),
    onSuccess: () => {
      toast.success('Checklist removed');
      setChecklistToRemove(null);
      queryClient.invalidateQueries({ queryKey: ['job-checklists', jobId] });
    },
    onError: () => toast.error('Failed to remove checklist')
  });

  const toggleItemMutation = useMutation({
    mutationFn: ({ itemId, isChecked }: { itemId: string, isChecked: boolean }) => 
      api.patch(`/jobs/${jobId}/checklists/items/${itemId}`, { is_checked: isChecked }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-checklists', jobId] });
    }
  });

  if (isLoading) return null;

  return (
    <div className="bg-white rounded p-5 shadow-none border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <ClipboardList className="text-primary h-5 w-5" /> Job Checklists
        </h3>
        {canApply && !isApplying && (
          <Button variant="ghost" size="sm" onClick={() => setIsApplying(true)} className="h-8 px-2 text-primary">
            <Plus className="h-4 w-4 mr-1" /> Apply
          </Button>
        )}
      </div>

      {isApplying && (
        <div className="mb-4 p-3 bg-slate-50 border rounded-md space-y-3">
          <select 
            className="flex h-9 w-full rounded border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={selectedTemplate}
            onChange={e => setSelectedTemplate(e.target.value)}
          >
            <option value="">Select a template...</option>
            {templates?.map((t: any) => (
              <option key={t.id} value={t.id}>{formatEnumLabel(t.name)}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsApplying(false)}>Cancel</Button>
            <Button 
              size="sm" 
              className="flex-1"
              disabled={!selectedTemplate || applyMutation.isPending}
              onClick={() => applyMutation.mutate(selectedTemplate)}
            >
              {applyMutation.isPending ? 'Applying...' : 'Apply'}
            </Button>
          </div>
        </div>
      )}

      {!checklists || checklists.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No checklists assigned</p>
      ) : (
        <div className="space-y-4">
          {checklists.map((cl: any) => {
            const completedCount = cl.items.filter((i: any) => i.is_checked).length;
            const totalCount = cl.items.length;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            const isComplete = totalCount > 0 && completedCount === totalCount;

            return (
              <div key={cl.id} className="border rounded-md overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm flex items-center gap-1">
                      {cl.template.name}
                      {isComplete && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </p>
                    <p className="text-xs text-slate-500">
                      {completedCount} / {totalCount} completed
                    </p>
                  </div>
                  {canApply && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-slate-400 hover:text-destructive"
                      onClick={() => setChecklistToRemove(cl)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="h-1 w-full bg-slate-100">
                  <div 
                    className={`h-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-primary'}`} 
                    style={{ width: `${progress}%` }} 
                  />
                </div>

                <div className="p-2 space-y-1">
                  {cl.items.map((item: any) => (
                    <div key={item.id} className="flex items-start gap-2 p-1.5 rounded hover:bg-slate-50">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer disabled:opacity-50"
                        checked={item.is_checked}
                        disabled={!isFieldStaff && !canApply}
                        onChange={(e) => toggleItemMutation.mutate({ itemId: item.id, isChecked: e.target.checked })}
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${item.is_checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {item.label}
                        </p>
                      </div>
                      {item.is_required && !item.is_checked && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium whitespace-nowrap">
                          Req
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <ConfirmDialog
        isOpen={!!checklistToRemove}
        onClose={() => setChecklistToRemove(null)}
        onConfirm={() => checklistToRemove && removeMutation.mutate(checklistToRemove.id)}
        title="Remove Checklist?"
        description={`Are you sure you want to remove the checklist "${checklistToRemove?.template?.name}" from this job? This action cannot be undone.`}
        confirmText="Remove"
        isDestructive={true}
        isPending={removeMutation.isPending}
      />
    </div>
  );
};

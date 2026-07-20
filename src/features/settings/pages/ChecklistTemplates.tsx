import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/axios';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { LoadingState } from '@/components/ui-custom/LoadingState';
import { Plus, Trash2, ChevronDown, ChevronUp, ClipboardList, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistTemplateItem {
  label: string;
  sort_order: number;
  is_required: boolean;
}

interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  service_id?: string;
  is_active: boolean;
  items: (ChecklistTemplateItem & { id: string })[];
}

export default function ChecklistTemplatesPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: '', description: '' });
  const [items, setItems] = useState<{ label: string; is_required: boolean }[]>([
    { label: '', is_required: false }
  ]);

  const { data: templates, isLoading } = useQuery<ChecklistTemplate[]>({
    queryKey: ['checklist-templates'],
    queryFn: async () => {
      const res = await api.get('/checklists?include_inactive=false');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/checklists', data),
    onSuccess: () => {
      toast.success('Checklist template created');
      setIsCreateOpen(false);
      setForm({ name: '', description: '' });
      setItems([{ label: '', is_required: false }]);
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
    },
    onError: () => toast.error('Failed to create template')
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/checklists/${id}`),
    onSuccess: () => {
      toast.success('Template deactivated');
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
    },
    onError: () => toast.error('Failed to deactivate template')
  });

  const handleCreate = () => {
    if (!form.name.trim()) { toast.error('Template name is required'); return; }
    const validItems = items.filter(i => i.label.trim());
    if (validItems.length === 0) { toast.error('At least one checklist item is required'); return; }
    createMutation.mutate({
      ...form,
      items: validItems.map((item, idx) => ({ ...item, sort_order: idx }))
    });
  };

  const addItem = () => setItems(prev => [...prev, { label: '', is_required: false }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: any) =>
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  if (isLoading) return <PageContainer><LoadingState text="Loading checklist templates..." /></PageContainer>;

  return (
    <PageContainer>
      <PageHeader title="Checklist Templates" description="Manage reusable checklists for job execution">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Checklist Template</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <FormGroup label="Template Name">
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AC Deep Service Checklist" />
              </FormGroup>
              <FormGroup label="Description (optional)">
                <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description" />
              </FormGroup>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Checklist Items</p>
                  <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" />Add Item</Button>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded border bg-secondary/30">
                      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        className="flex-1 h-8 text-sm"
                        value={item.label}
                        onChange={e => updateItem(idx, 'label', e.target.value)}
                        placeholder={`Item ${idx + 1}`}
                      />
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={item.is_required}
                          onChange={e => updateItem(idx, 'is_required', e.target.checked)}
                          className="w-3.5 h-3.5"
                          title="Mark as important"
                        />
                        <span className="text-xs text-muted-foreground">Req</span>
                      </div>
                      {items.length > 1 && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeItem(idx)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Note: Checklists are informational — they never block job completion.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {!templates || templates.length === 0 ? (
        <EmptyState
          title="No Checklist Templates"
          description="Create your first checklist template to standardize job execution."
        />
      ) : (
        <div className="space-y-3">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedId(prev => prev === template.id ? null : template.id)}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{template.name}</p>
                    {template.description && (
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">{template.items.length} items</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-7 text-xs"
                    onClick={e => { e.stopPropagation(); deactivateMutation.mutate(template.id); }}
                    disabled={deactivateMutation.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />Deactivate
                  </Button>
                  {expandedId === template.id
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </div>

              {expandedId === template.id && (
                <CardContent className="pt-0 pb-4 px-4 border-t bg-secondary/10">
                  <div className="space-y-2 mt-3">
                    {template.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No items defined</p>
                    ) : template.items.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-3 py-1.5 px-3 rounded bg-background border">
                        <span className="text-xs text-muted-foreground w-5 text-right">{idx + 1}.</span>
                        <span className="text-sm flex-1">{item.label}</span>
                        {item.is_required && (
                          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700">Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

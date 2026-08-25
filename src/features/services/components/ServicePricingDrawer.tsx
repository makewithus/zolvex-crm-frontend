import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  usePricingRules,
  useCreatePricingRule,
  useUpdatePricingRule,
  useDeletePricingRule,
} from '@/features/pricing-rules/hooks/usePricingRules';
import { pricingRuleSchema, PricingRuleFormData } from '@/features/pricing-rules/schemas/pricingRule.schema';
import { PricingRule } from '@/features/pricing-rules/types/pricingRule.types';
import { useCities } from '@/features/cities/hooks/useCities';
import { Service } from '../types/service.types';
import { formatEnumLabel } from '@/lib/utils';
import { Plus, Pencil, Trash2, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { FormGrid } from '@/components/ui-custom/FormGrid';

interface Props {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Inline compact edit row ─────────────────────────────────────────────────
interface EditRowProps {
  rule: PricingRule;
  onCancel: () => void;
  onSaved: () => void;
}

const EditRow = ({ rule, onCancel, onSaved }: EditRowProps) => {
  const updateRule = useUpdatePricingRule();
  const [bhk, setBhk] = useState(rule.bhk_type || '');
  const [tank, setTank] = useState(rule.tank_size || '');
  const [price, setPrice] = useState(String(rule.base_price));
  const [cgst, setCgst] = useState(String(rule.cgst_percent ?? 9));
  const [sgst, setSgst] = useState(String(rule.sgst_percent ?? 9));
  const [igst, setIgst] = useState(String(rule.igst_percent ?? 0));
  const [err, setErr] = useState('');

  const save = () => {
    const base_price = parseFloat(price);
    if (isNaN(base_price) || base_price < 0) { setErr('Price must be >= 0'); return; }
    setErr('');
    updateRule.mutate(
      {
        id: rule.id,
        data: {
          bhk_type: bhk || null,
          tank_size: tank || null,
          base_price,
          cgst_percent: parseFloat(cgst) || 0,
          sgst_percent: parseFloat(sgst) || 0,
          igst_percent: parseFloat(igst) || 0,
        } as any,
      },
      {
        onSuccess: () => { toast.success('Variant updated successfully'); onSaved(); },
        onError: (e: any) => setErr(e.response?.data?.message || 'Update failed'),
      }
    );
  };

  return (
    <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <p className="text-xs font-semibold text-slate-700">Modify Variant</p>
        {err && <p className="text-xs text-destructive font-medium">{err}</p>}
      </div>
      
      <FormGrid>
        <FormGroup label="BHK Type">
          <Input className="h-9 text-sm" value={bhk} onChange={e => setBhk(e.target.value)} placeholder="e.g. 2BHK" />
        </FormGroup>
        <FormGroup label="Tank Size">
          <Input className="h-9 text-sm" value={tank} onChange={e => setTank(e.target.value)} placeholder="e.g. 500L" />
        </FormGroup>
      </FormGrid>

      <FormGroup label="Base Price (₹)">
        <Input className="h-9 text-sm" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
      </FormGroup>

      <FormGrid columns={3}>
        <FormGroup label="CGST %">
          <Input className="h-9 text-sm" type="number" min="0" step="0.01" value={cgst} onChange={e => setCgst(e.target.value)} />
        </FormGroup>
        <FormGroup label="SGST %">
          <Input className="h-9 text-sm" type="number" min="0" step="0.01" value={sgst} onChange={e => setSgst(e.target.value)} />
        </FormGroup>
        <FormGroup label="IGST %">
          <Input className="h-9 text-sm" type="number" min="0" step="0.01" value={igst} onChange={e => setIgst(e.target.value)} />
        </FormGroup>
      </FormGrid>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="h-8 text-xs gap-1" onClick={save} disabled={updateRule.isPending}>
          <Check className="h-3.5 w-3.5" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

// ── Add Variant form ────────────────────────────────────────────────────────
interface AddFormProps {
  serviceId: string;
  cityId: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

const AddVariantForm = ({ serviceId, cityId, onSaved, onCancel }: AddFormProps) => {
  const createRule = useCreatePricingRule();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      service_id: serviceId,
      city_id: cityId || '',
      cgst_percent: 9,
      sgst_percent: 9,
      igst_percent: 0,
    },
  });
  const [apiErr, setApiErr] = useState('');

  const onSubmit = (data: PricingRuleFormData) => {
    setApiErr('');
    createRule.mutate(data, {
      onSuccess: () => {
        toast.success('Variant created successfully');
        reset({
          service_id: serviceId,
          city_id: cityId || '',
          bhk_type: '',
          tank_size: '',
          base_price: undefined as any,
          cgst_percent: 9,
          sgst_percent: 9,
          igst_percent: 0,
        });
        onSaved();
      },
      onError: (e: any) => {
        const msg = e.response?.data?.message || 'Failed to add variant';
        setApiErr(msg.includes('Unique') || msg.includes('unique') ? 'A variant with these parameters already exists for this scope.' : msg);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50/50 border border-slate-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Create Pricing Variant
        </p>
        {apiErr && <p className="text-xs text-destructive font-medium">{apiErr}</p>}
      </div>

      <input type="hidden" {...register('service_id')} value={serviceId} />
      <input type="hidden" {...register('city_id')} value={cityId || ''} />

      <FormGrid>
        <FormGroup label="BHK Type (Optional)" error={errors.bhk_type?.message}>
          <Input className="h-9 text-sm bg-white" {...register('bhk_type')} placeholder="e.g. 2BHK" />
        </FormGroup>
        <FormGroup label="Tank Size (Optional)" error={errors.tank_size?.message}>
          <Input className="h-9 text-sm bg-white" {...register('tank_size')} placeholder="e.g. 500L" />
        </FormGroup>
      </FormGrid>

      <FormGroup label="Base Price (₹)" error={errors.base_price?.message}>
        <Input className="h-9 text-sm bg-white" type="number" min="0" step="0.01" placeholder="0.00" {...register('base_price', { valueAsNumber: true })} />
      </FormGroup>

      <FormGrid columns={3}>
        <FormGroup label="CGST %">
          <Input className="h-9 text-sm bg-white" type="number" min="0" step="0.01" defaultValue={9} {...register('cgst_percent', { valueAsNumber: true })} />
        </FormGroup>
        <FormGroup label="SGST %">
          <Input className="h-9 text-sm bg-white" type="number" min="0" step="0.01" defaultValue={9} {...register('sgst_percent', { valueAsNumber: true })} />
        </FormGroup>
        <FormGroup label="IGST %">
          <Input className="h-9 text-sm bg-white" type="number" min="0" step="0.01" defaultValue={0} {...register('igst_percent', { valueAsNumber: true })} />
        </FormGroup>
      </FormGrid>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button size="sm" type="button" variant="outline" className="h-8 text-xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" type="submit" className="h-8 text-xs gap-1" disabled={createRule.isPending}>
          <Plus className="h-3.5 w-3.5" /> {createRule.isPending ? 'Saving...' : 'Add Variant'}
        </Button>
      </div>
    </form>
  );
};

// ── Delete confirmation row ──────────────────────────────────────────────────
interface DeleteRowProps {
  rule: PricingRule;
  onCancel: () => void;
  onDeleted: () => void;
}

const DeleteRow = ({ rule, onCancel, onDeleted }: DeleteRowProps) => {
  const deleteRule = useDeletePricingRule();
  const label = [rule.bhk_type, rule.tank_size].filter(Boolean).join(' / ') || 'Base Rule';
  return (
    <div className="bg-slate-50/50 border border-destructive/20 rounded-lg p-4 space-y-3">
      <p className="text-sm font-medium text-slate-800">
        Remove variant <span className="font-bold">{label} (₹{rule.base_price})</span>?
      </p>
      <p className="text-xs text-muted-foreground">
        This variant will no longer be available for future bookings. Existing historical bookings will not be modified.
      </p>
      <div className="flex justify-end gap-2 pt-1">
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm" variant="destructive" className="h-8 text-xs"
          disabled={deleteRule.isPending}
          onClick={() => deleteRule.mutate(rule.id, {
            onSuccess: () => { toast.success('Variant removed'); onDeleted(); },
            onError: (e: any) => toast.error(e.response?.data?.message || 'Delete failed'),
          })}
        >
          {deleteRule.isPending ? 'Removing...' : 'Confirm Remove'}
        </Button>
      </div>
    </div>
  );
};

// ── Main Drawer ─────────────────────────────────────────────────────────────
export const ServicePricingDrawer = ({ service, open, onOpenChange }: Props) => {
  const { data: citiesResponse } = useCities();
  const cities = citiesResponse?.data || [];

  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedCityId('');
      setEditingRuleId(null);
      setDeletingRuleId(null);
      setShowAddForm(false);
    }
  }, [open, service?.id]);

  const queryParams = service
    ? {
        service_id: service.id,
        ...(selectedCityId ? { city_id: selectedCityId } : {}),
      }
    : undefined;

  const { data: rulesResponse, isLoading } = usePricingRules(queryParams);
  const allRules: PricingRule[] = rulesResponse?.data || [];
  const rules = selectedCityId
    ? allRules
    : allRules.filter(r => !r.city_id);

  const selectedCityName = cities.find(c => c.id === selectedCityId)?.name;

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[550px] max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-lg font-bold tracking-tight">Pricing Variants</DialogTitle>
            <Badge variant="outline" className="font-semibold text-xs border-slate-300 text-slate-700 bg-slate-50 uppercase px-2 py-0.5">
              {service.name}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-500 mt-1">
            Manage overrides and variants for this service. Active bookings fetch these rules explicitly.
          </DialogDescription>
        </DialogHeader>

        {/* City Selector */}
        <div className="py-4 border-b">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Select Scope
          </label>
          <div className="relative">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
              value={selectedCityId}
              onChange={e => {
                setSelectedCityId(e.target.value);
                setEditingRuleId(null);
                setDeletingRuleId(null);
                setShowAddForm(false);
              }}
            >
              <option value="">🌐 Global Rules (Fallback)</option>
              {cities.filter((c: any) => c.is_active || c.id === selectedCityId).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}{c.state ? `, ${c.state}` : ''}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {selectedCityId && (
            <p className="text-xs text-muted-foreground mt-2">
              Viewing variant rules scoped to <strong className="text-slate-800">{formatEnumLabel(selectedCityName || '')}</strong>.
            </p>
          )}
          {!selectedCityId && (
            <p className="text-xs text-muted-foreground mt-2">
              Global fallback rules are selected if no city-specific overrides are present.
            </p>
          )}
        </div>

        {/* Variants List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading variants...</div>
          ) : rules.length === 0 && !showAddForm ? (
            <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50/50 space-y-3">
              <p className="text-sm text-muted-foreground italic">
                No custom variants configured for {selectedCityId ? (selectedCityName || 'this city') : 'Global scope'}.
              </p>
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs font-semibold" onClick={() => setShowAddForm(true)}>
                <Plus className="h-3.5 w-3.5" /> Define First Variant
              </Button>
            </div>
          ) : (
            <>
              {rules.map(rule => {
                const variantLabel = [
                  rule.bhk_type ? `BHK: ${rule.bhk_type}` : null,
                  rule.tank_size ? `Size: ${rule.tank_size}` : null,
                ].filter(Boolean).join(' · ') || 'Base / Standard Rate';

                if (editingRuleId === rule.id) {
                  return (
                    <EditRow
                      key={rule.id}
                      rule={rule}
                      onCancel={() => setEditingRuleId(null)}
                      onSaved={() => setEditingRuleId(null)}
                    />
                  );
                }

                if (deletingRuleId === rule.id) {
                  return (
                    <DeleteRow
                      key={rule.id}
                      rule={rule}
                      onCancel={() => setDeletingRuleId(null)}
                      onDeleted={() => setDeletingRuleId(null)}
                    />
                  );
                }

                return (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{variantLabel}</p>
                      <div className="flex items-center gap-2.5 mt-1 flex-wrap text-[11px] text-muted-foreground">
                        <span className="text-sm font-bold text-slate-900">₹{rule.base_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                        <span>CGST {rule.cgst_percent ?? 9}%</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                        <span>SGST {rule.sgst_percent ?? 9}%</span>
                        {(rule.igst_percent ?? 0) > 0 && (
                          <>
                            <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                            <span>IGST {rule.igst_percent}%</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900"
                        onClick={() => { setEditingRuleId(rule.id); setDeletingRuleId(null); setShowAddForm(false); }}
                        title="Edit variant parameters"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                        onClick={() => { setDeletingRuleId(rule.id); setEditingRuleId(null); setShowAddForm(false); }}
                        title="Delete variant rule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {showAddForm && (
                <AddVariantForm
                  serviceId={service.id}
                  cityId={selectedCityId || null}
                  onSaved={() => {}}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!showAddForm && rules.length > 0 && (
          <div className="border-t pt-4 flex justify-end">
            <Button
              className="gap-1.5 h-9 font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-white"
              onClick={() => { setShowAddForm(true); setEditingRuleId(null); setDeletingRuleId(null); }}
            >
              <Plus className="h-4 w-4" /> Add Pricing Variant
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

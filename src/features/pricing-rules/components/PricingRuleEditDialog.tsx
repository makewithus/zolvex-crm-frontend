import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdatePricingRule } from '../hooks/usePricingRules';
import { updatePricingRuleSchema, UpdatePricingRuleFormData } from '../schemas/pricingRule.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { FormGrid } from '@/components/ui-custom/FormGrid';
import { useServices } from '@/features/services/hooks/useServices';
import { useCities } from '@/features/cities/hooks/useCities';
import { formatEnumLabel } from '@/lib/utils';
import { PricingRule } from '../types/pricingRule.types';
import { toast } from 'sonner';

interface PricingRuleEditDialogProps {
  rule: PricingRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingRuleEditDialog = ({ rule, open, onOpenChange }: PricingRuleEditDialogProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const updateRule = useUpdatePricingRule();
  
  const { data: servicesResponse } = useServices();
  const services = servicesResponse?.data || [];
  
  const { data: citiesResponse } = useCities();
  const cities = citiesResponse?.data || [];

  const { register, handleSubmit, formState: { errors, isDirty }, reset, getValues } = useForm<UpdatePricingRuleFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updatePricingRuleSchema) as any,
    defaultValues: {
      service_id: rule?.service?.id || '',
      city_id: rule?.city?.id || '',
      bhk_type: rule?.bhk_type || '',
      tank_size: rule?.tank_size || '',
      base_price: rule?.base_price || 0,
      cgst_percent: rule?.cgst_percent ?? 9,
      sgst_percent: rule?.sgst_percent ?? 9,
      igst_percent: rule?.igst_percent ?? 0,
    }
  });

  useEffect(() => {
    if (rule && open) {
      reset({
        service_id: rule.service?.id || '',
        city_id: rule.city?.id || '',
        bhk_type: rule.bhk_type || '',
        tank_size: rule.tank_size || '',
        base_price: rule.base_price || 0,
        cgst_percent: rule.cgst_percent ?? 9,
        sgst_percent: rule.sgst_percent ?? 9,
        igst_percent: rule.igst_percent ?? 0,
      });
    }
  }, [rule, open, reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (!rule) return;
    setErrorMsg('');
    
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    updateRule.mutate({ id: rule.id, data }, {
      onSuccess: () => {
        toast.success('Pricing rule updated successfully');
        onOpenChange(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to update pricing rule');
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setErrorMsg('');
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Pricing Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <FormGrid>
            <FormGroup label="Service" error={errors.service_id?.message}>
              <select 
                {...register('service_id')}
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background cursor-not-allowed"
              >
                <option value="">Select a service...</option>
                {services.filter((s: any) => s.is_active || s.id === getValues('service_id')).map((s: any) => <option key={s.id} value={s.id}>{formatEnumLabel(s.name)}</option>)}
              </select>
            </FormGroup>

            <FormGroup label="City (Optional for Global)" error={errors.city_id?.message}>
              <select 
                {...register('city_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Global Rule</option>
                {cities.filter((c: any) => c.is_active || c.id === getValues('city_id')).map((c: any) => <option key={c.id} value={c.id}>{formatEnumLabel(c.name)}</option>)}
              </select>
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup label="BHK Type (Optional)" error={errors.bhk_type?.message}>
              <Input placeholder="e.g. 2BHK" {...register('bhk_type')} />
            </FormGroup>

            <FormGroup label="Tank Size (Optional)" error={errors.tank_size?.message}>
              <Input placeholder="e.g. 500L" {...register('tank_size')} />
            </FormGroup>
          </FormGrid>

          <FormGroup label="Base Price" error={errors.base_price?.message}>
            <Input type="number" step="0.01" min="0" placeholder="0.00" {...register('base_price', { valueAsNumber: true })} />
          </FormGroup>

          <FormGrid columns={3}>
            <FormGroup label="CGST (%)" error={errors.cgst_percent?.message}>
              <Input type="number" step="0.01" min="0" {...register('cgst_percent', { valueAsNumber: true })} />
            </FormGroup>
            <FormGroup label="SGST (%)" error={errors.sgst_percent?.message}>
              <Input type="number" step="0.01" min="0" {...register('sgst_percent', { valueAsNumber: true })} />
            </FormGroup>
            <FormGroup label="IGST (%)" error={errors.igst_percent?.message}>
              <Input type="number" step="0.01" min="0" {...register('igst_percent', { valueAsNumber: true })} />
            </FormGroup>
          </FormGrid>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateRule.isPending || !isDirty}>
              {updateRule.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

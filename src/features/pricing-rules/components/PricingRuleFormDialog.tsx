import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreatePricingRule } from '../hooks/usePricingRules';
import { pricingRuleSchema, PricingRuleFormData } from '../schemas/pricingRule.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { FormGrid } from '@/components/ui-custom/FormGrid';
import { useServices } from '@/features/services/hooks/useServices';
import { useCities } from '@/features/cities/hooks/useCities';

export const PricingRuleFormDialog = () => {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const createPricingRule = useCreatePricingRule();
  
  const { data: servicesResponse } = useServices();
  const services = servicesResponse?.data || [];
  
  const { data: citiesResponse } = useCities();
  const cities = citiesResponse?.data || [];

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema)
  });

  const onSubmit = (data: PricingRuleFormData) => {
    setErrorMsg('');
    createPricingRule.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to create pricing rule');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Pricing Rule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Pricing Rule</DialogTitle>
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a service...</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </FormGroup>

            <FormGroup label="City (Optional for Global)" error={errors.city_id?.message}>
              <select 
                {...register('city_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Global Rule</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createPricingRule.isPending}>
              {createPricingRule.isPending ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

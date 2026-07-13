import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateCity } from '../hooks/useCities';
import { updateCitySchema, UpdateCityFormData } from '../schemas/city.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { City } from '../types/city.types';
import { toast } from 'sonner';
import { INDIAN_STATES } from '@/config/states';

interface CityEditDialogProps {
  city: City | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CityEditDialog = ({ city, open, onOpenChange }: CityEditDialogProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const updateCity = useUpdateCity();

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<UpdateCityFormData>({
    resolver: zodResolver(updateCitySchema),
    defaultValues: {
      name: city?.name || '',
      state: city?.state || '',
      is_active: city?.is_active ?? true
    }
  });

  useEffect(() => {
    if (city && open) {
      reset({
        name: city.name || '',
        state: city.state || '',
        is_active: city.is_active ?? true
      });
    }
  }, [city, open, reset]);

  const onSubmit = (data: UpdateCityFormData) => {
    if (!city) return;
    setErrorMsg('');
    
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    updateCity.mutate({ id: city.id, data }, {
      onSuccess: () => {
        toast.success('Region updated successfully');
        onOpenChange(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to update region');
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setErrorMsg('');
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Region Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <FormGroup label="Region / City Name" required error={errors.name?.message}>
            <Input placeholder="e.g. Mumbai" {...register('name')} />
          </FormGroup>

          <FormGroup label="State" required error={errors.state?.message}>
            <select
              {...register('state')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </FormGroup>
          
          <FormGroup label="Operational Status" error={errors.is_active?.message}>
            <select 
              {...register('is_active', { setValueAs: v => String(v) === 'true' })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="true">Active</option>
              <option value="false">Disabled</option>
            </select>
          </FormGroup>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateCity.isPending || !isDirty}>
              {updateCity.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

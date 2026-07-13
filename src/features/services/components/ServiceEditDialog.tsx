import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateService } from '../hooks/useServices';
import { updateServiceSchema, UpdateServiceFormData } from '../schemas/service.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { Service } from '../types/service.types';
import { toast } from 'sonner';

interface ServiceEditDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServiceEditDialog = ({ service, open, onOpenChange }: ServiceEditDialogProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const updateService = useUpdateService();

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      base_price: service?.base_price || 0,
      is_active: service?.is_active ?? true
    }
  });

  useEffect(() => {
    if (service && open) {
      reset({
        name: service.name || '',
        description: service.description || '',
        base_price: service.base_price || 0,
        is_active: service.is_active ?? true
      });
    }
  }, [service, open, reset]);

  const onSubmit = (data: UpdateServiceFormData) => {
    if (!service) return;
    setErrorMsg('');
    
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    updateService.mutate({ id: service.id, data }, {
      onSuccess: () => {
        toast.success('Service updated successfully');
        onOpenChange(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to update service');
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
          <DialogTitle>Edit Service Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <FormGroup label="Service Name" error={errors.name?.message}>
            <Input placeholder="e.g. Deep Cleaning" {...register('name')} />
          </FormGroup>
          
          <FormGroup label="Description" error={errors.description?.message}>
            <Input placeholder="Service details" {...register('description')} />
          </FormGroup>
          
          <FormGroup label="Base Price ($)" error={errors.base_price?.message}>
            <Input type="number" min="0" step="0.01" {...register('base_price', { valueAsNumber: true })} />
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
            <Button type="submit" disabled={updateService.isPending || !isDirty}>
              {updateService.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

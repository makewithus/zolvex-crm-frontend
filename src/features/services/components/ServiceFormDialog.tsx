import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateService } from '../hooks/useServices';
import { serviceSchema, ServiceFormData } from '../schemas/service.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';

export const ServiceFormDialog = () => {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const createService = useCreateService();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema)
  });

  const onSubmit = (data: ServiceFormData) => {
    setErrorMsg('');
    createService.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to create service');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <FormGroup label="Service Name" error={errors.name?.message}>
            <Input placeholder="Enter service name..." {...register('name')} />
          </FormGroup>

          <FormGroup label="Description" error={errors.description?.message}>
            <Input placeholder="Optional description..." {...register('description')} />
          </FormGroup>

          <FormGroup label="Base Price" error={errors.base_price?.message}>
            <Input type="number" step="0.01" min="0" placeholder="0.00" {...register('base_price', { valueAsNumber: true })} />
          </FormGroup>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createService.isPending}>
              {createService.isPending ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

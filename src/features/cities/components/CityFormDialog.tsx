import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateCity } from '../hooks/useCities';
import { citySchema, CityFormData } from '../schemas/city.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';

export const CityFormDialog = () => {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const createCity = useCreateCity();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CityFormData>({
    resolver: zodResolver(citySchema)
  });

  const onSubmit = (data: CityFormData) => {
    setErrorMsg('');
    createCity.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to create city');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add City</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New City</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <FormGroup label="City Name" error={errors.name?.message}>
            <Input placeholder="Enter city name..." {...register('name')} />
          </FormGroup>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createCity.isPending}>
              {createCity.isPending ? 'Creating...' : 'Create City'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

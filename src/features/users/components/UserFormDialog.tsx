import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateUser } from '../hooks/useUsers';
import { userSchema, UserFormData } from '../schemas/user.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { FormGrid } from '@/components/ui-custom/FormGrid';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { useCities } from '@/features/cities/hooks/useCities';

export const UserFormDialog = () => {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const createUser = useCreateUser();
  const { data: rolesResponse } = useRoles();
  const roles = rolesResponse?.data || [];
  const { data: citiesResponse } = useCities();
  const cities = citiesResponse?.data || [];

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = (data: UserFormData) => {
    setErrorMsg('');
    const payload = { ...data, city_id: data.city_id || undefined };
    createUser.mutate(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to create user');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <FormGrid>
            <FormGroup label="Full Name" error={errors.name?.message}>
              <Input placeholder="John Doe" {...register('name')} />
            </FormGroup>
            
            <FormGroup label="Phone Number" error={errors.phone?.message}>
              <Input placeholder="9999999999" {...register('phone')} />
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup label="Role" error={errors.role_id?.message}>
              <select 
                {...register('role_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a role...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Password" error={errors.password?.message}>
              <Input type="password" {...register('password')} />
            </FormGroup>

            <FormGroup label="Location" error={errors.city_id?.message}>
              <select 
                {...register('city_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Global Access (All Cities)</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormGroup>
          </FormGrid>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

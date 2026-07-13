import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateUser } from '../hooks/useUsers';
import { updateUserSchema, UpdateUserFormData } from '../schemas/user.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { FormGrid } from '@/components/ui-custom/FormGrid';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { User } from '../types/user.types';
import { toast } from 'sonner';
import { useCities } from '@/features/cities/hooks/useCities';

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserEditDialog = ({ user, open, onOpenChange }: UserEditDialogProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const updateUser = useUpdateUser();
  const { data: rolesResponse } = useRoles();
  const roles = rolesResponse?.data || [];
  const { data: citiesResponse } = useCities();
  const cities = citiesResponse?.data || [];

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      role_id: user?.role?.id || '',
      city_id: user?.city?.id || '',
      is_active: user?.is_active ?? true
    }
  });

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        role_id: user.role?.id || '',
        city_id: user.city?.id || '',
        is_active: user.is_active ?? true
      });
    }
  }, [user, open, reset]);

  const onSubmit = (data: UpdateUserFormData) => {
    if (!user) return;
    setErrorMsg('');
    
    // Only send if dirty
    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    const payload = { ...data, city_id: data.city_id || undefined };
    updateUser.mutate({ id: user.id, data: payload }, {
      onSuccess: () => {
        toast.success('User updated successfully');
        onOpenChange(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to update user');
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
          <DialogTitle>Edit User Profile</DialogTitle>
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

            <FormGroup label="Status" error={errors.is_active?.message}>
               <select 
                {...register('is_active', { setValueAs: v => String(v) === 'true' })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateUser.isPending || !isDirty}>
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

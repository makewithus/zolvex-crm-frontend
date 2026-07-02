import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '../hooks/useUsers';
import { resetPasswordSchema, ResetPasswordFormData } from '../schemas/user.schema';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { User } from '../types/user.types';
import { toast } from 'sonner';

interface ResetPasswordDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResetPasswordDialog = ({ user, open, onOpenChange }: ResetPasswordDialogProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const resetPassword = useResetPassword();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  useEffect(() => {
    if (open) {
      reset({ new_password: '', confirm_password: '' });
    }
  }, [open, reset]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!user) return;
    setErrorMsg('');
    
    resetPassword.mutate({ id: user.id, new_password: data.new_password }, {
      onSuccess: () => {
        toast.success(`Password reset successfully for ${user.name}`);
        onOpenChange(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to reset password');
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
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset the password for {user?.name}? The new password must meet security requirements.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <FormGroup label="New Password" error={errors.new_password?.message}>
            <Input type="password" placeholder="Enter new password" {...register('new_password')} />
          </FormGroup>

          <FormGroup label="Confirm Password" error={errors.confirm_password?.message}>
            <Input type="password" placeholder="Confirm new password" {...register('confirm_password')} />
          </FormGroup>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={resetPassword.isPending}>
              {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

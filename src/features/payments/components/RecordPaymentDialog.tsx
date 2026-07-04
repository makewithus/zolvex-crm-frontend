import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { Input } from '@/components/ui/input';
import { recordPaymentSchema } from '../schemas/payment.schema';
import { recordPayment } from '../api/payment.api';

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any; // We'll pass the full invoice
}

export const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      invoice_id: invoice?.id || '',
      amount: invoice?.balance_due || 0,
      payment_method: 'UPI',
      payment_date: format(new Date(), 'yyyy-MM-dd'), // Default to today
      notes: '',
      reason: ''
    }
  });

  // Update form defaults when invoice changes
  React.useEffect(() => {
    if (invoice) {
      setValue('invoice_id', invoice.id);
      setValue('amount', Number(invoice.balance_due));
    }
  }, [invoice, setValue]);

  const mutation = useMutation({
    mutationFn: recordPayment,
    onSuccess: () => {
      toast.success('Payment recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['invoice', invoice.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  });

  const onSubmit = (data: any) => {
    if (data.amount > Number(invoice.balance_due)) {
      toast.error(`Amount cannot exceed balance due (₹${Number(invoice.balance_due).toLocaleString('en-IN')})`);
      return;
    }
    mutation.mutate(data);
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice</span>
            <span className="font-medium">{invoice.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium">{invoice.customer_name}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 mt-2">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-medium">₹{Number(invoice.final_amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Balance Due</span>
            <span className="font-bold text-destructive">₹{Number(invoice.balance_due).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormGroup label="Amount (₹)" error={errors.amount?.message as string}>
            <Input 
              type="number" 
              step="0.01" 
              min="0.01" 
              max={Number(invoice.balance_due)}
              {...register('amount', { valueAsNumber: true })} 
            />
          </FormGroup>

          <FormGroup label="Payment Method" error={errors.payment_method?.message as string}>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('payment_method')}
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="BankTransfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Cheque">Cheque</option>
            </select>
          </FormGroup>

          <FormGroup label="Notes / Reference (Optional)" error={errors.notes?.message as string}>
            <Input placeholder="e.g. UTR Number, Cheque No." {...register('notes')} />
          </FormGroup>

          <FormGroup label="Payment Date" error={(errors as any).payment_date?.message as string}>
            <Input type="date" {...register('payment_date')} />
          </FormGroup>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeletePricingRule } from '../hooks/usePricingRules';
import { PricingRule } from '../types/pricingRule.types';
import { toast } from 'sonner';

interface PricingRuleDeleteDialogProps {
  rule: PricingRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingRuleDeleteDialog = ({ rule, open, onOpenChange }: PricingRuleDeleteDialogProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const deleteRule = useDeletePricingRule();

  const onDelete = () => {
    if (!rule) return;
    setErrorMsg('');
    
    deleteRule.mutate(rule.id, {
      onSuccess: () => {
        toast.success('Pricing rule deleted successfully');
        onOpenChange(false);
      },
      onError: (error) => {
        setErrorMsg(error.response?.data?.message || 'Failed to delete pricing rule');
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setErrorMsg('');
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Pricing Rule</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this pricing rule? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {rule && (
          <div className="p-4 bg-secondary/50 rounded-md border text-sm space-y-2 my-2">
            <div><span className="font-medium">Service:</span> {rule.service?.name}</div>
            <div><span className="font-medium">City:</span> {rule.city?.name || 'Global'}</div>
            <div><span className="font-medium">Price:</span> ${rule.base_price}</div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md mt-2">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={deleteRule.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete} disabled={deleteRule.isPending}>
            {deleteRule.isPending ? 'Deleting...' : 'Delete Rule'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

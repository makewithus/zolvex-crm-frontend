import { useState, useEffect } from 'react';
import { useCreateExpense, useUpdateExpense } from '../hooks/useExpenses';
import { Expense, ExpenseCategory, CreateExpensePayload } from '../types/expense.types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { Input } from '@/components/ui/input';

interface Props {
  existing: Expense | null;
  onClose: () => void;
}

const CATEGORIES: ExpenseCategory[] = ['Supplies','Travel','Salaries','Marketing','Utilities','Maintenance','Other'];

export const ExpenseFormDialog = ({ existing, onClose }: Props) => {
  const isEdit = !!existing;
  const { mutate: doCreate, isPending: creating } = useCreateExpense();
  const { mutate: doUpdate, isPending: updating } = useUpdateExpense(existing?.id ?? '');

  const [form, setForm] = useState<CreateExpensePayload>({
    category:     'Supplies',
    amount:       0,
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    description:  '',
    vendor_name:  '',
    city_id:      undefined,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        category:     existing.category,
        amount:       parseFloat(existing.amount),
        expense_date: existing.expense_date.substring(0, 10),
        description:  existing.description,
        vendor_name:  existing.vendor_name ?? '',
        city_id:      existing.city_id ?? undefined,
      });
    }
  }, [existing]);

  const set = (k: keyof CreateExpensePayload, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };

    if (isEdit) {
      doUpdate(payload, { onSuccess: onClose });
    } else {
      doCreate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Expense' : 'New Expense'}</DialogTitle>
        </DialogHeader>

        <form id="expense-form" onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Category */}
          <FormGroup label="Category" required>
            <select
              id="expense-category"
              value={form.category}
              onChange={e => set('category', e.target.value as ExpenseCategory)}
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormGroup>

          {/* Amount */}
          <FormGroup label="Amount (₹)" required>
            <Input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount || ''}
              onChange={e => set('amount', e.target.value)}
              required
              placeholder="0.00"
              className="focus-visible:ring-0 focus-visible:border-slate-900"
            />
          </FormGroup>

          {/* Date */}
          <FormGroup label="Expense Date" required>
            <Input
              id="expense-date"
              type="date"
              value={form.expense_date}
              onChange={e => set('expense_date', e.target.value)}
              required
              className="focus-visible:ring-0 focus-visible:border-slate-900"
            />
          </FormGroup>

          {/* Description */}
          <FormGroup label="Description" required>
            <textarea
              id="expense-description"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
              minLength={2}
              rows={3}
              placeholder="Brief description of the expense…"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </FormGroup>

          {/* Vendor */}
          <FormGroup label="Vendor / Payee">
            <Input
              id="expense-vendor"
              type="text"
              value={form.vendor_name ?? ''}
              onChange={e => set('vendor_name', e.target.value)}
              placeholder="Optional vendor or payee name"
              className="focus-visible:ring-0 focus-visible:border-slate-900"
            />
          </FormGroup>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button
            id="btn-save-expense"
            type="submit"
            form="expense-form"
            disabled={creating || updating}
          >
            {creating || updating ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Expense'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateQuote } from '../hooks/useQuotes';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { CreateQuotePayload, CreateQuoteLineItemPayload } from '../types/quote.types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { Input } from '@/components/ui/input';

interface Props {
  prefillCustomerId?: string;
  prefillLeadId?:     string;
  prefillSubject?:    string;
  onClose: () => void;
}

const emptyItem = (): CreateQuoteLineItemPayload => ({
  description: '', quantity: 1, unit_price: 0, tax_percent: 18, sort_order: 0,
});

export const QuoteFormDialog = ({ prefillCustomerId, prefillLeadId, prefillSubject, onClose }: Props) => {
  const { data: customers } = useCustomers();
  const { mutate: doCreate, isPending } = useCreateQuote();

  const [form, setForm] = useState<CreateQuotePayload>({
    customer_id:  prefillCustomerId ?? '',
    lead_id:      prefillLeadId,
    subject:      prefillSubject ?? '',
    description:  '',
    valid_until:  '',
    notes:        '',
    discount_amount: 0,
    line_items:   [emptyItem()],
  });

  const setField = (k: keyof CreateQuotePayload, v: any) => setForm(f => ({ ...f, [k]: v }));

  const setItem = (i: number, k: keyof CreateQuoteLineItemPayload, v: any) => {
    setForm(f => {
      const items = [...f.line_items];
      items[i] = { ...items[i], [k]: v };
      return { ...f, line_items: items };
    });
  };

  const addItem    = () => setForm(f => ({ ...f, line_items: [...f.line_items, emptyItem()] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, line_items: f.line_items.filter((_, idx) => idx !== i) }));

  const subtotal = form.line_items.reduce((sum, item) => sum + (Number(item.unit_price) * Number(item.quantity)), 0);
  const tax = form.line_items.reduce((sum, item) => {
    const base = Number(item.unit_price) * Number(item.quantity);
    return sum + (base * (Number(item.tax_percent ?? 18) / 100));
  }, 0);
  const discount = Number(form.discount_amount || 0);
  const taxableAmount = subtotal - discount;
  const grandTotal = taxableAmount + tax;

  const isDiscountInvalid = discount < 0 || discount > subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      valid_until: form.valid_until || undefined,
      line_items: form.line_items.map((item, i) => ({
        ...item,
        unit_price:  Number(item.unit_price),
        quantity:    Number(item.quantity),
        tax_percent: Number(item.tax_percent ?? 18),
        sort_order:  i,
      })),
      discount_amount: Number(form.discount_amount || 0),
    };
    doCreate(payload, { onSuccess: onClose });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Quotation</DialogTitle>
        </DialogHeader>

        <form id="quote-form" onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Customer */}
          <FormGroup label="Customer" required>
            <select
              id="quote-customer-id"
              value={form.customer_id}
              onChange={e => setField('customer_id', e.target.value)}
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a customer…</option>
              {customers?.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name ? `${c.name} (${c.phone})` : c.phone}
                </option>
              ))}
            </select>
          </FormGroup>

          {/* Subject */}
          <FormGroup label="Subject" required>
            <Input
              id="quote-subject"
              type="text"
              value={form.subject}
              onChange={e => setField('subject', e.target.value)}
              required
              minLength={3}
              placeholder="e.g. AC Servicing — 2 Units"
              className="focus-visible:ring-0 focus-visible:border-slate-900"
            />
          </FormGroup>

          {/* Description + Valid Until */}
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="Description">
              <textarea
                id="quote-description"
                value={form.description ?? ''}
                rows={2}
                onChange={e => setField('description', e.target.value)}
                placeholder="Optional additional details…"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </FormGroup>
            <FormGroup label="Valid Until">
              <Input
                id="quote-valid-until"
                type="date"
                value={form.valid_until ?? ''}
                onChange={e => setField('valid_until', e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="focus-visible:ring-0 focus-visible:border-slate-900"
              />
            </FormGroup>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Line Items <span className="text-destructive">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="flex items-center gap-1 h-8 px-2.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </Button>
            </div>
            <div className="grid grid-cols-12 gap-2 px-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
              <span className="col-span-5">Description</span>
              <span className="col-span-1 text-center">Qty</span>
              <span className="col-span-2">Price</span>
              <span className="col-span-2">Tax %</span>
              <span className="col-span-1 text-right pr-1">Total</span>
              <span className="col-span-1"></span>
            </div>
            <div className="space-y-2">
              {form.line_items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800">
                  <div className="col-span-5">
                    <Input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={e => setItem(i, 'description', e.target.value)}
                      required
                      className="h-8 text-xs bg-white dark:bg-slate-950 focus-visible:ring-0 focus-visible:border-slate-900"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      min={1}
                      onChange={e => setItem(i, 'quantity', e.target.value)}
                      required
                      className="h-8 text-xs bg-white dark:bg-slate-950 px-1 text-center focus-visible:ring-0 focus-visible:border-slate-900"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price || ''}
                      min={0}
                      step={0.01}
                      onChange={e => setItem(i, 'unit_price', e.target.value)}
                      required
                      className="h-8 text-xs bg-white dark:bg-slate-950 focus-visible:ring-0 focus-visible:border-slate-900"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Tax%"
                      value={item.tax_percent ?? 18}
                      min={0}
                      max={100}
                      onChange={e => setItem(i, 'tax_percent', e.target.value)}
                      className="h-8 text-xs bg-white dark:bg-slate-950 focus-visible:ring-0 focus-visible:border-slate-900"
                    />
                  </div>
                  <div className="col-span-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold text-right pr-1">
                    ₹{(Number(item.unit_price) * Number(item.quantity) * (1 + Number(item.tax_percent ?? 18)/100)).toFixed(0)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(i)}
                      disabled={form.line_items.length === 1}
                      className="h-7 w-7 text-slate-400 hover:text-destructive transition-colors disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <FormGroup label="Notes">
            <textarea
              id="quote-notes"
              value={form.notes ?? ''}
              rows={2}
              onChange={e => setField('notes', e.target.value)}
              placeholder="Internal or customer-facing notes…"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </FormGroup>
        </form>

          {/* Footer & Totals */}
          <div className="flex items-start justify-between pt-4 border-t border-slate-200">
            <div className="flex flex-col gap-1.5 w-1/2">
              <FormGroup label="Discount (₹)">
                <Input
                  id="quote-discount"
                  type="number"
                  min={0}
                  max={subtotal}
                  value={form.discount_amount === 0 ? '' : form.discount_amount}
                  onChange={e => setField('discount_amount', e.target.value)}
                  placeholder="0"
                  className="w-32 h-8 text-sm focus-visible:ring-0 focus-visible:border-slate-900"
                />
                {isDiscountInvalid && <span className="text-xs text-destructive">Discount cannot exceed subtotal</span>}
              </FormGroup>
            </div>
            
            <div className="flex flex-col gap-1 w-1/2 items-end text-sm text-slate-700 dark:text-slate-300">
              <div className="flex justify-between w-48">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-48">
                <span>Discount:</span>
                <span className="text-destructive">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-48 font-medium">
                <span>Taxable Amount:</span>
                <span>₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-48">
                <span>Tax:</span>
                <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-48 pt-2 mt-1 border-t border-slate-200 font-bold text-base text-foreground">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="quote-form" disabled={isPending || isDiscountInvalid}>
            {isPending ? 'Creating…' : 'Create Quote'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


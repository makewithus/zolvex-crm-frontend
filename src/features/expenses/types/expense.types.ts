export type ExpenseCategory = 'Supplies' | 'Travel' | 'Salaries' | 'Marketing' | 'Utilities' | 'Maintenance' | 'Other';
export type ExpenseStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

export interface Expense {
  id:              string;
  expense_number:  string;
  sequence_number: number;
  category:        ExpenseCategory;
  amount:          string; // Decimal comes as string from Prisma JSON
  expense_date:    string;
  description:     string;
  vendor_name:     string | null;
  receipt_url:     string | null;
  city_id:         string | null;
  city:            { id: string; name: string } | null;
  status:          ExpenseStatus;
  approved_by:     string | null;
  approvedBy:      { id: string; name: string } | null;
  created_by:      string;
  createdBy:       { id: string; name: string };
  created_at:      string;
  updated_at:      string;
}

export interface CreateExpensePayload {
  category:     ExpenseCategory;
  amount:       number;
  expense_date: string; // ISO date string
  description:  string;
  vendor_name?: string;
  city_id?:     string;
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  Supplies:    'Supplies',
  Travel:      'Travel',
  Salaries:    'Salaries',
  Marketing:   'Marketing',
  Utilities:   'Utilities',
  Maintenance: 'Maintenance',
  Other:       'Other',
};

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  Draft:     'Draft',
  Submitted: 'Submitted',
  Approved:  'Approved',
  Rejected:  'Rejected',
};

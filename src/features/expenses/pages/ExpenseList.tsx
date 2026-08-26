import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Edit, Send, Trash2, CheckCircle2, XCircle, ExternalLink, Download, MoreHorizontal, Receipt, IndianRupee } from 'lucide-react';
import { useExpenses, useDeleteExpense, useSubmitExpense, useApproveExpense, useRejectExpense, useDownloadExpensePdf } from '../hooks/useExpenses';
import { ExpenseFormDialog } from '../components/ExpenseFormDialog';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { Expense, ExpenseCategory, ExpenseStatus } from '../types/expense.types';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { StatCard } from '@/components/ui-custom/StatCard';

const mapExpenseStatus = (status: ExpenseStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'Draft': return 'default';
    case 'Submitted': return 'warning';
    case 'Approved': return 'success';
    case 'Rejected': return 'error';
    default: return 'default';
  }
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Supplies:    'bg-blue-50 text-blue-700 border-blue-100',
  Travel:      'bg-purple-50 text-purple-700 border-purple-100',
  Salaries:    'bg-pink-50 text-pink-700 border-pink-100',
  Marketing:   'bg-orange-50 text-orange-700 border-orange-100',
  Utilities:   'bg-teal-50 text-teal-700 border-teal-100',
  Maintenance: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  Other:       'bg-slate-50 text-slate-600 border-slate-200',
};

export const ExpenseList = () => {
  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role?.name || '';
  const canApprove = ['Super Admin', 'Finance'].includes(userRole);

  const [statusFilter, setStatusFilter]     = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchTerm, setSearchTerm]         = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm]             = useState(false);
  const [editTarget, setEditTarget]         = useState<Expense | null>(null);
  const [rejectTarget, setRejectTarget]     = useState<string | null>(null);
  const [rejectReason, setRejectReason]     = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: expenses = [], isLoading } = useExpenses({
    status:   statusFilter   || undefined,
    category: categoryFilter || undefined,
  });

  const { mutate: doDelete, isPending: deleting }  = useDeleteExpense();
  const { mutate: doSubmit }  = useSubmitExpense();
  const { mutate: doApprove } = useApproveExpense();
  const { mutate: doReject }  = useRejectExpense();
  const { mutate: downloadPdf } = useDownloadExpensePdf();

  const totalApproved = expenses
    .filter((e: Expense) => e.status === 'Approved')
    .reduce((sum: number, e: Expense) => sum + parseFloat(e.amount), 0);

  const filteredExpenses = useMemo(() => {
    let list = expenses;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((item) =>
        item.expense_number.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.vendor_name && item.vendor_name.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [expenses, searchTerm]);

  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / limit));
  const paginatedExpenses = filteredExpenses.slice((page - 1) * limit, page * limit);

  const columns: Column<Expense>[] = [
    {
      key: 'expense_number',
      header: 'Expense #',
      cell: (row) => <span className="font-mono text-slate-700 font-medium">{row.expense_number}</span>,
    },
    {
      key: 'expense_date',
      header: 'Date',
      cell: (row) => <span className="text-slate-600">{format(parseISO(row.expense_date), 'dd MMM yyyy')}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      cell: (row) => (
        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${CATEGORY_COLORS[row.category]}`}>
          {row.category}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      cell: (row) => <span className="text-slate-700 max-w-[200px] truncate block">{row.description || '—'}</span>,
    },
    {
      key: 'vendor_name',
      header: 'Vendor',
      cell: (row) => <span className="text-slate-500">{row.vendor_name || '—'}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (row) => (
        <span className="font-medium">
          ₹{parseFloat(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    /*
    {
      key: 'city',
      header: 'City',
      cell: (row) => <span className="text-slate-500">{row.city?.name || '—'}</span>,
    },
    */
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={mapExpenseStatus(row.status)} label={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.status === 'Draft' && (
              <>
                <DropdownMenuItem className="cursor-pointer text-slate-700" onClick={() => { setEditTarget(row); setShowForm(true); }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Draft
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-amber-700 focus:text-amber-900" onClick={() => doSubmit(row.id)}>
                  <Send className="h-4 w-4 mr-2" /> Submit Expense
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-700" onClick={() => setDeleteTargetId(row.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Draft
                </DropdownMenuItem>
              </>
            )}
            {row.status === 'Submitted' && canApprove && (
              <>
                <DropdownMenuItem className="cursor-pointer text-emerald-700 focus:text-emerald-900" onClick={() => doApprove(row.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Approve Expense
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-700" onClick={() => { setRejectTarget(row.id); setRejectReason(''); }}>
                  <XCircle className="h-4 w-4 mr-2" /> Reject Expense
                </DropdownMenuItem>
              </>
            )}
            {row.receipt_url && (
              <DropdownMenuItem className="cursor-pointer text-blue-600 focus:text-blue-800" asChild>
                <a
                  href={row.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> View Receipt
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer text-slate-700" onClick={() => downloadPdf({ id: row.id, expenseNumber: row.expense_number })}>
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <PageHeader
          title="Expenses"
          description="Record and track company expenses and category classifications."
        />
        <Button onClick={() => { setEditTarget(null); setShowForm(true); }} className="gap-2 shadow-sm bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> New Expense
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard 
          title="Total Expenses"
          value={expenses.length}
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatCard 
          title="Approved Amount"
          value={`₹${totalApproved.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={<IndianRupee className="h-4 w-4" />}
          trend="Total value of approved expenses"
        />
      </div>

      <DataTable
        columns={columns}
        data={paginatedExpenses}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        onSearch={(query) => { setSearchTerm(query); setPage(1); }}
        searchPlaceholder="Search expenses by ID, vendor, category, or description..."
        pagination={{ page, totalPages, onPageChange: setPage }}
        emptyStateTitle="No expenses found"
        emptyStateDescription="Create a new expense draft to get started."
        filterControls={
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              id="filter-expense-status"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex h-9 w-full sm:w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              id="filter-expense-category"
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
              className="flex h-9 w-full sm:w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Categories</option>
              <option value="Supplies">Supplies</option>
              <option value="Travel">Travel</option>
              <option value="Salaries">Salaries</option>
              <option value="Marketing">Marketing</option>
              <option value="Utilities">Utilities</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>
        }
      />

      {/* Form Dialog */}
      {showForm && (
        <ExpenseFormDialog
          existing={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            doDelete(deleteTargetId, { onSuccess: () => setDeleteTargetId(null) });
          }
        }}
        title="Delete Draft Expense"
        description="Are you sure you want to delete this draft expense? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isPending={deleting}
      />

      {/* Reject Dialog */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-[15px] font-semibold text-slate-900 mb-4">Reject Expense</h2>
            <label className="block text-[12px] font-medium text-slate-700 mb-1">Reason (required)</label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
              placeholder="Enter reason for rejection…"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejectTarget(null)} className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded transition-colors">Cancel</button>
              <button
                disabled={rejectReason.trim().length < 3}
                onClick={() => {
                  doReject({ id: rejectTarget, reason: rejectReason });
                  setRejectTarget(null);
                }}
                className="px-4 py-2 text-[12px] bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-40"
              >Reject</button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Send, Check, X, Eye, MoreHorizontal, FileText, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuotes, useSendQuote, useRejectQuote } from '../hooks/useQuotes';
import { QuoteFormDialog } from '../components/QuoteFormDialog';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { Quote, QuoteStatus } from '../types/quote.types';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { StatCard } from '@/components/ui-custom/StatCard';

const mapQuoteStatus = (status: QuoteStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'Draft': return 'default';
    case 'Sent': return 'info';
    case 'Viewed': return 'info';
    case 'Accepted': return 'success';
    case 'Rejected': return 'error';
    case 'Expired': return 'warning';
    default: return 'default';
  }
};

export const QuoteList = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role?.name || '';
  const canCreate = ['Super Admin', 'City Manager', 'Support Agent'].includes(userRole);

  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [sendTargetId, setSendTargetId] = useState<string | null>(null);

  const { data: quotes = [], isLoading } = useQuotes({ status: statusFilter || undefined });
  const { mutate: doSend, isPending: sending } = useSendQuote();
  const { mutate: doReject } = useRejectQuote();

  const totalValue = quotes
    .filter((q: Quote) => ['Sent', 'Viewed', 'Accepted'].includes(q.status))
    .reduce((sum: number, q: Quote) => sum + parseFloat(q.total_amount), 0);

  const filteredQuotes = useMemo(() => {
    let list = quotes;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((item: Quote) =>
        item.quote_id.toLowerCase().includes(q) ||
        (item.customer?.name && item.customer.name.toLowerCase().includes(q)) ||
        (item.subject && item.subject.toLowerCase().includes(q))
      );
    }
    return list;
  }, [quotes, searchTerm]);

  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / limit));
  const paginatedQuotes = filteredQuotes.slice((page - 1) * limit, page * limit);

  const columns: Column<Quote>[] = [
    {
      key: 'quote_id',
      header: 'Quote #',
      cell: (row) => <span className="font-mono text-slate-700 font-medium">{row.quote_id}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      cell: (row) => <span>{row.customer?.name || '—'}</span>,
    },
    {
      key: 'subject',
      header: 'Subject',
      cell: (row) => <span className="text-slate-600 max-w-[180px] truncate block">{row.subject}</span>,
    },
    {
      key: 'total_amount',
      header: 'Total',
      cell: (row) => (
        <span className="font-medium whitespace-nowrap">
          ₹{parseFloat(row.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusBadge status={mapQuoteStatus(row.status)} label={row.status} />,
    },
    {
      key: 'sent_at',
      header: 'Sent',
      cell: (row) => (
        <span className="text-slate-500 whitespace-nowrap">
          {row.sent_at ? format(parseISO(row.sent_at), 'dd MMM yyyy') : '—'}
        </span>
      ),
    },
    {
      key: 'valid_until',
      header: 'Valid Until',
      cell: (row) => (
        <span className="text-slate-500 whitespace-nowrap">
          {row.valid_until ? format(parseISO(row.valid_until), 'dd MMM yyyy') : '—'}
        </span>
      ),
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
            <DropdownMenuItem className="cursor-pointer text-slate-700" onClick={() => navigate(`/quotations/${row.id}`)}>
              <Eye className="h-4 w-4 mr-2" /> View Details
            </DropdownMenuItem>
            {row.status === 'Draft' && canCreate && (
              <DropdownMenuItem
                className="cursor-pointer text-blue-600 focus:text-blue-800"
                onClick={() => setSendTargetId(row.id)}
              >
                <Send className="h-4 w-4 mr-2" /> Send Quote
              </DropdownMenuItem>
            )}
            {row.status === 'Sent' && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer text-emerald-700 focus:text-emerald-900"
                  onClick={() => navigate(`/quotations/${row.id}`)}
                >
                  <Check className="h-4 w-4 mr-2" /> Accept Quote
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:text-red-700"
                  onClick={() => { setRejectTarget(row.id); setRejectReason(''); }}
                >
                  <X className="h-4 w-4 mr-2" /> Reject Quote
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <PageHeader
          title="Quotations"
          description="Manage customer quotations, rates, and validity periods."
        />
        {canCreate && (
          <Button onClick={() => setShowForm(true)} className="gap-2 shadow-sm bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="h-4 w-4" /> New Quote
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard 
          title="Total Quotations"
          value={quotes.length}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard 
          title="Quotation Pipeline"
          value={`₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon={<IndianRupee className="h-4 w-4" />}
          trend="Total value of active quotations"
        />
      </div>

      <DataTable
        columns={columns}
        data={paginatedQuotes}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        onSearch={(query) => { setSearchTerm(query); setPage(1); }}
        searchPlaceholder="Search quotes by ID, customer, or subject..."
        pagination={{ page, totalPages, onPageChange: setPage }}
        emptyStateTitle="No quotations found"
        emptyStateDescription="Create a quotation for a lead to get started."
        onRowClick={(row) => navigate(`/quotations/${row.id}`)}
        filterControls={
          <div className="relative w-full sm:w-auto">
            <select
              id="filter-quote-status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex h-9 w-full sm:w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Statuses</option>
              {['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Form Dialog */}
      {showForm && (
        <QuoteFormDialog
          onClose={() => setShowForm(false)}
        />
      )}

      <ConfirmDialog
        isOpen={!!sendTargetId}
        onClose={() => setSendTargetId(null)}
        onConfirm={() => {
          if (sendTargetId) {
            doSend({ id: sendTargetId }, { onSuccess: () => setSendTargetId(null) });
          }
        }}
        title="Send Quote"
        description="Are you sure you want to send this quote? The linked Lead will be updated to QuotationSent."
        confirmText="Send Quote"
        isPending={sending}
      />

      {/* Reject Dialog */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-[15px] font-semibold text-slate-900 mb-4">Reject Quote</h2>
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
                onClick={() => { doReject({ id: rejectTarget, reason: rejectReason }); setRejectTarget(null); }}
                className="px-4 py-2 text-[12px] bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-40"
              >Reject</button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

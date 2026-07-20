import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { DataTable } from '@/components/ui-custom/DataTable';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { Button } from '@/components/ui/button';
import { ComplaintForm } from '@/features/complaints/components/ComplaintForm';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

const STATUS_STYLES: Record<string, string> = {
  Open:       'bg-blue-50 text-blue-700 border-blue-200',
  Assigned:   'bg-violet-50 text-violet-700 border-violet-200',
  InProgress: 'bg-amber-50 text-amber-700 border-amber-200',
  Resolved:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Escalated:  'bg-red-50 text-red-700 border-red-200',
  Closed:     'bg-gray-50 text-gray-500 border-gray-200',
};

const PRIORITY_STYLES: Record<string, string> = {
  Low:      'bg-gray-50 text-gray-600',
  Normal:   'bg-blue-50 text-blue-600',
  High:     'bg-amber-50 text-amber-700',
  Critical: 'bg-red-50 text-red-700',
};

export default function ComplaintList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const limit = 12;

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['complaints', statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/complaints', { params });
      return res.data;
    }
  });

  const list: any[] = Array.isArray(complaints) ? complaints : [];
  const totalPages = Math.max(1, Math.ceil(list.length / limit));
  const paged = list.slice((page - 1) * limit, page * limit);

  const columns = [
    {
      key: 'complaint_id',
      header: 'ID',
      cell: (row: any) => <span className="font-mono text-sm font-semibold">{row.complaint_id}</span>
    },
    {
      key: 'customer',
      header: 'Customer',
      cell: (row: any) => (
        <div>
          <p className="font-medium text-sm">{row.customer?.name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">{row.customer?.phone}</p>
        </div>
      )
    },
    {
      key: 'subject',
      header: 'Subject',
      cell: (row: any) => <span className="text-sm">{row.subject}</span>
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (row: any) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${PRIORITY_STYLES[row.priority] || ''}`}>
          {row.priority}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row: any) => (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${STATUS_STYLES[row.status] || 'bg-gray-50'}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'assigned',
      header: 'Assigned To',
      cell: (row: any) => row.assignedTo
        ? <span className="text-sm">{row.assignedTo.name}</span>
        : <span className="text-xs text-muted-foreground italic">Unassigned</span>
    },
    {
      key: 'created_at',
      header: 'Raised On',
      cell: (row: any) => <span className="text-xs text-muted-foreground">{format(new Date(row.created_at), 'dd MMM yyyy')}</span>
    },
    {
      key: 'actions',
      header: '',
      cell: (row: any) => (
        <button
          className="text-primary hover:underline text-sm font-medium"
          onClick={() => navigate(`/complaints/${row.id}`)}
        >
          View
        </button>
      )
    }
  ];

  const STATUSES = ['', 'Open', 'Assigned', 'InProgress', 'Resolved', 'Escalated', 'Closed'];

    const { data: currentUser } = useCurrentUser();
    const userRole = currentUser?.role?.name || '';
    const canCreate = ['Super Admin', 'City Manager', 'Support Agent'].includes(userRole);

  return (
    <PageContainer>
      <ComplaintForm open={showForm} onClose={() => setShowForm(false)} />
      <PageHeader title="Complaints" description="Track and resolve customer complaints.">
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
          {canCreate && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              New Complaint
            </Button>
          )}
        </div>
      </PageHeader>

      {!isLoading && list.length === 0 ? (
        <EmptyState title="No Complaints" description="No complaints have been raised yet." />
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          <DataTable
            data={paged}
            columns={columns}
            keyExtractor={(row: any) => row.id}
            isLoading={isLoading}
            searchPlaceholder="Search by ID, customer, subject..."
            pagination={{ page, totalPages, onPageChange: setPage }}
          />
        </div>
      )}
    </PageContainer>
  );
}

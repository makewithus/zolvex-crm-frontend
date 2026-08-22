import { useState, useMemo } from 'react';
import { useJobs } from '../hooks/useJobs';
import { FilterPopover, FilterState } from '@/components/ui-custom/FilterPopover';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { JOB_STATUS_COLORS } from '../constants/job-colors';

export const DispatchDashboard = () => {
  const [userFilters, setUserFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState('');

  const activeFilters = {
    ...userFilters,
    status: userFilters.status || ['Pending', 'Assigned', 'Accepted', 'Travelling', 'Arrived', 'Started'],
  };

  const { data: jobs, isLoading } = useJobs(activeFilters);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 10;
  
  const filteredJobs = useMemo(() => {
    let list = jobs || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((j: any) => 
        j.job_id?.toLowerCase().includes(q) ||
        j.booking?.customer_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [jobs, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / limit));
  const sortedJobs = [...filteredJobs].sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  const paginatedJobs = sortedJobs.slice((page - 1) * limit, page * limit);

  const columns = [
    { key: 'job_id', header: 'Job ID', cell: (row: any) => (
      <span className="font-mono text-sm font-medium">{row.job_id}</span>
    )},
    { key: 'customer', header: 'Customer', cell: (row: any) => row.booking?.customer_name || '—' },
    { key: 'service', header: 'Service', cell: (row: any) => row.booking?.service?.name || '—' },
    {
      key: 'datetime',
      header: 'Scheduled',
      cell: (row: any) => format(new Date(row.scheduled_start), 'dd MMM, HH:mm')
    },
    {
      key: 'technician',
      header: 'Technician',
      cell: (row: any) => row.assignedUser
        ? row.assignedUser.name
        : <span className="text-muted-foreground italic text-xs">Unassigned</span>
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (row: any) => <Badge variant="outline">{row.priority}</Badge>
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row: any) => {
        const colors = JOB_STATUS_COLORS[row.status] || {};
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: '',
      cell: (row: any) => (
        <button
          className="text-primary hover:underline text-sm font-medium"
          onClick={() => navigate(`/jobs/${row.id}`)}
        >
          View
        </button>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dispatch Dashboard"
        description="Active jobs requiring attention."
      />
      <div className="bg-card rounded-lg border shadow-sm">
        <DataTable
          data={paginatedJobs}
          columns={columns}
          keyExtractor={(row: any) => row.id}
          isLoading={isLoading}
          onSearch={(q) => { setSearchQuery(q); setPage(1); }}
          searchPlaceholder="Search by Job ID, customer..."
          pagination={{ page, totalPages, onPageChange: setPage }}
          filterControls={
            <FilterPopover 
              filters={userFilters}
              onFilterChange={f => { setUserFilters(f); setPage(1); }}
              statusOptions={['Pending', 'Assigned', 'Accepted', 'Travelling', 'Arrived', 'Started', 'Completed', 'Cancelled', 'Failed', 'NoAccess', 'CustomerNotAvailable']}
            />
          }
        />
      </div>
    </div>
  );
};

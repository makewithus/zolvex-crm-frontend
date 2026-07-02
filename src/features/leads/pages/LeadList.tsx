import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '../types/lead.types';

export const LeadList = () => {
  const { data: leadsResponse, isLoading } = useLeads();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const columns: Column<Lead>[] = [
    { key: 'phone', header: 'Phone', cell: (row) => <span className="font-medium text-foreground">{row.phone}</span> },
    { key: 'name', header: 'Name', cell: (row) => row.name || '-' },
    { key: 'source', header: 'Source', cell: (row) => <StatusBadge status="default" label={row.source} /> },
    { key: 'status', header: 'Stage', cell: (row) => <StatusBadge status={row.status === 'Lost' ? 'error' : row.status === 'Booked' ? 'success' : 'info'} label={row.status} /> },
    { key: 'assigned', header: 'Assigned To', cell: (row) => row.assignedTo?.name || 'Unassigned' },
    { key: 'actions', header: 'Actions', align: 'right', cell: (row) => (
      <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${row.id}`)}>View</Button>
    )}
  ];

  const filteredData = useMemo(() => {
    const currentLeads = leadsResponse?.data || [];
    return currentLeads.filter((l) => 
      l.phone.includes(search) || (l.name && l.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [leadsResponse?.data, search]);

  return (
    <PageContainer>
      <PageHeader title="Lead Management" description="Manage incoming leads and pipeline.">
        <Button onClick={() => navigate('/leads/new')}>Add Lead</Button>
      </PageHeader>
      <DataTable 
        columns={columns} 
        data={filteredData} 
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        onSearch={setSearch}
        searchPlaceholder="Search phone or name..."
        pagination={{ page, totalPages: 1, onPageChange: setPage }}
      />
    </PageContainer>
  );
};

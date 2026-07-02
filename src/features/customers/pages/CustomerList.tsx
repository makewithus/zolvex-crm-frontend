import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { Customer } from '../schemas/customer.schema';
import { Button } from '@/components/ui/button';

export default function CustomerList() {
  const { data: customers, isLoading } = useCustomers();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    const custs = customers || [];
    return custs.filter((customer: Customer) =>
      (customer.name && customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      customer.phone.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => row.name || 'Unknown',
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (row) => <span className="font-medium text-foreground">{row.phone}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row) => (
        row.is_repeat_customer 
          ? <StatusBadge status="info" label="Repeat" /> 
          : <StatusBadge status="default" label="New" />
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      cell: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.tags?.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'leads',
      header: 'Total Leads',
      cell: (row) => (
        <span className="font-medium">{row.leads?.length || 0}</span>
      ),
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      align: 'right', 
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => navigate(`/customers/${row.id}`)}>View</Button>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Customer Management" 
        description="View and manage customer profiles." 
      />
      
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        searchPlaceholder="Search customers by name or phone..."
        pagination={{ page, totalPages: 1, onPageChange: setPage }}
      />
    </PageContainer>
  );
}

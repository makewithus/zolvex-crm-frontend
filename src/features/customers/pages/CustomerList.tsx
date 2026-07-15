import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { Customer } from '../schemas/customer.schema';
import { Button } from '@/components/ui/button';
import { User, Phone, Tag, History, MoreHorizontal, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function CustomerList() {
  const { data: customers, isLoading } = useCustomers();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    let custs = customers || [];
    custs = [...custs].sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return custs.filter((customer: Customer) =>
      (customer.name && customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      customer.phone.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / limit));
  const paginatedCustomers = filteredCustomers.slice((page - 1) * limit, page * limit);

  const columns: Column<Customer>[] = [
    {
      key: 'identity',
      header: 'Customer',
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="h-9 w-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold shadow-sm">
            {row.name ? row.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm leading-tight">{row.name || 'Anonymous Client'}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Segment',
      cell: (row) => (
        row.is_repeat_customer 
          ? <StatusBadge status="info" label="Repeat Client" /> 
          : <StatusBadge status="default" label="First Time" />
      ),
    },
    {
      key: 'tags',
      header: 'Attributes',
      cell: (row) => (
        <div className="flex gap-1.5 flex-wrap items-center">
          {row.tags && row.tags.length > 0 ? row.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[11px] font-medium rounded border">
              {tag}
            </span>
          )) : (
            <span className="text-sm text-muted-foreground italic flex items-center gap-1"><Tag className="h-3 w-3" /> None</span>
          )}
        </div>
      ),
    },
    {
      key: 'leads',
      header: 'Engagement',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <History className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.leads?.length || 0} Interactions</span>
        </div>
      ),
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      align: 'right', 
      cell: (row) => (
        <div className="flex justify-end gap-2 items-center">
          <Button variant="outline" size="sm" className="hidden md:flex bg-background shadow-sm" onClick={() => navigate(`/customers/${row.id}`)}>
            Profile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/customers/${row.id}`)}>
                <Eye className="h-4 w-4 mr-2" /> View 360° Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Customer Directory" 
        description="Comprehensive view of all active clientele and interaction histories." 
      />
      
      <DataTable
        columns={columns}
        data={paginatedCustomers}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        onSearch={(query) => { setSearchQuery(query); setPage(1); }}
        searchPlaceholder="Search customers by name or phone..."
        pagination={{ page, totalPages, onPageChange: setPage }}
        emptyStateTitle="No clientele found"
        emptyStateDescription="Successfully converted leads will appear here."
      />
    </PageContainer>
  );
}

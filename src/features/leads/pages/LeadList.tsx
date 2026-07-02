import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { Lead } from '../types/lead.types';
import { Button } from '@/components/ui/button';
import { Plus, User, Phone, MapPin, MoreHorizontal, ArrowRight, Activity } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const LeadList = () => {
  const { data: leadsResponse, isLoading } = useLeads();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredLeads = useMemo(() => {
    const leads = leadsResponse?.data || [];
    return leads.filter((lead: Lead) =>
      (lead.name && lead.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.phone.includes(searchQuery)
    );
  }, [leadsResponse, searchQuery]);

  const columns: Column<Lead>[] = [
    {
      key: 'contact',
      header: 'Prospect',
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold shadow-sm">
            {row.name ? row.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm leading-tight">{row.name || 'Unknown Prospect'}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      cell: (row) => <StatusBadge status="default" label={row.source} />,
    },
    {
      key: 'assignment',
      header: 'Assigned To',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>{row.assigned_to ? 'Assigned' : 'Unassigned'}</span>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{row.city?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Stage',
      cell: (row) => (
        <StatusBadge 
          status={row.status === 'Lost' ? 'error' : row.status === 'Booked' ? 'success' : 'info'} 
          label={row.status} 
        />
      ),
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      align: 'right', 
      cell: (row) => (
        <div className="flex justify-end gap-2 items-center">
          <Button variant="outline" size="sm" className="hidden md:flex bg-background shadow-sm" onClick={() => navigate(`/leads/${row.id}`)}>
            View Details
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/leads/${row.id}`)}>
                <Activity className="h-4 w-4 mr-2" /> Pipeline View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/leads/${row.id}/edit`)}>
                <ArrowRight className="h-4 w-4 mr-2" /> Edit Prospect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <PageHeader 
          title="Lead Pipeline" 
          description="Manage prospect interactions and conversion tracking." 
        />
        <Button onClick={() => navigate('/leads/new')} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Add New Lead
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredLeads}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        searchPlaceholder="Search leads by name or phone..."
        pagination={{ page, totalPages: 1, onPageChange: setPage }}
        emptyStateTitle="No leads in pipeline"
        emptyStateDescription="Add a prospect to begin the conversion process."
      />
    </PageContainer>
  );
};

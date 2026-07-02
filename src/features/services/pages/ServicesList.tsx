import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useServices } from '../hooks/useServices';
import { Service } from '../types/service.types';
import { ServiceFormDialog } from '../components/ServiceFormDialog';
import { Button } from '@/components/ui/button';
import { Briefcase, Layers, MoreHorizontal, Edit, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { ServiceEditDialog } from '../components/ServiceEditDialog';

export const ServicesList = () => {
  const { data: servicesResponse, isLoading, isError, error } = useServices();
  const services = servicesResponse?.data || [];
  
  const [editingService, setEditingService] = useState<Service | null>(null);

  const columns: Column<Service>[] = [
    { 
      key: 'name', 
      header: 'Service Offering', 
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-md">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm leading-tight">{row.name}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{row.description || 'No description provided.'}</span>
          </div>
        </div>
      ) 
    },
    {
      key: 'category',
      header: 'Category',
      cell: () => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Layers className="h-3.5 w-3.5" />
          <span>General Services</span>
        </div>
      )
    },
    { 
      key: 'base_price', 
      header: 'Base Price', 
      cell: (row) => (
        <div className="flex items-center font-medium text-foreground">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
          {row.base_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      ) 
    },
    { 
      key: 'is_active', 
      header: 'Status', 
      cell: (row) => (
        <StatusBadge 
          status={row.is_active ? 'success' : 'default'} 
          label={row.is_active ? 'Active' : 'Archived'} 
        />
      ) 
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={() => setEditingService(row)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Service Offerings" description="Manage standard services and base pricing." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          Failed to load services. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Service Offerings" 
        description="Manage standard services and base pricing."
      >
        <ServiceFormDialog />
      </PageHeader>
      <DataTable
        columns={columns}
        data={services}
        keyExtractor={(service) => service.id}
        isLoading={isLoading}
        searchPlaceholder="Search services..."
        emptyStateTitle="No services defined"
        emptyStateDescription="Create a base service to start configuring pricing."
      />
      <ServiceEditDialog 
        service={editingService} 
        open={!!editingService} 
        onOpenChange={(open) => !open && setEditingService(null)} 
      />
    </PageContainer>
  );
};

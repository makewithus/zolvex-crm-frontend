import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useServices } from '../hooks/useServices';
import { Service } from '../types/service.types';
import { ServiceFormDialog } from '../components/ServiceFormDialog';

export const ServicesList = () => {
  const { data: servicesResponse, isLoading, isError, error } = useServices();
  const services = servicesResponse?.data || [];

  const columns: Column<Service>[] = [
    { key: 'name', header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'description', header: 'Description', cell: (row) => <span className="text-muted-foreground">{row.description || '-'}</span> },
    { key: 'base_price', header: 'Base Price', cell: (row) => `$${row.base_price.toFixed(2)}` },
    { key: 'is_active', header: 'Status', cell: (row) => (
      <StatusBadge 
        status={row.is_active ? 'success' : 'default'} 
        label={row.is_active ? 'Active' : 'Inactive'} 
      />
    ) },
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Service Catalogue" description="Manage offerings and base prices." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          Failed to load services. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Service Catalogue" 
        description="Manage offerings and base prices."
      >
        {localStorage.getItem('userRole') === 'Super Admin' && <ServiceFormDialog />}
      </PageHeader>
      <DataTable
        columns={columns}
        data={services}
        keyExtractor={(service) => service.id}
        isLoading={isLoading}
        searchPlaceholder="Search services..."
        emptyStateTitle="No services found"
        emptyStateDescription="Add a new service to build out your catalogue."
      />
    </PageContainer>
  );
};

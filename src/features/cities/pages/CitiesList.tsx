import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useCities } from '../hooks/useCities';
import { City } from '../types/city.types';
import { CityFormDialog } from '../components/CityFormDialog';

export const CitiesList = () => {
  const { data: citiesResponse, isLoading, isError, error } = useCities();
  const cities = citiesResponse?.data || [];

  const columns: Column<City>[] = [
    { key: 'name', header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'is_active', header: 'Status', cell: (row) => (
      <StatusBadge 
        status={row.is_active ? 'success' : 'default'} 
        label={row.is_active ? 'Active' : 'Inactive'} 
      />
    ) },
    { key: 'serviceAreas', header: 'Service Areas', cell: (row) => row.serviceAreas?.length || 0 },
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Cities & Service Areas" description="Manage operational regions." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          Failed to load cities. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Cities & Service Areas" 
        description="Manage operational regions."
      >
        {localStorage.getItem('userRole') === 'Super Admin' && <CityFormDialog />}
      </PageHeader>
      <DataTable
        columns={columns}
        data={cities}
        keyExtractor={(city) => city.id}
        isLoading={isLoading}
        searchPlaceholder="Search cities..."
        emptyStateTitle="No cities found"
        emptyStateDescription="Add a new city to start managing service areas."
      />
    </PageContainer>
  );
};

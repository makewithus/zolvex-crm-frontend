import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useCities } from '../hooks/useCities';
import { City } from '../types/city.types';
import { CityFormDialog } from '../components/CityFormDialog';
import { Building2, Map, Users, MoreHorizontal, Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const CitiesList = () => {
  const { data: citiesResponse, isLoading, isError, error } = useCities();
  const cities = citiesResponse?.data || [];

  const columns: Column<City>[] = [
    { 
      key: 'name', 
      header: 'Region / City', 
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-md">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground">{row.name}</span>
        </div>
      ) 
    },
    {
      key: 'services',
      header: 'Active Services',
      cell: (row) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Map className="h-3.5 w-3.5" />
          <span>{row.serviceAreas?.length || 'System Default'}</span>
        </div>
      )
    },
    {
      key: 'staff',
      header: 'Staff Count',
      cell: () => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>Pending Data</span>
        </div>
      )
    },
    { 
      key: 'is_active', 
      header: 'Status', 
      cell: (row) => (
        <StatusBadge 
          status={row.is_active ? 'success' : 'default'} 
          label={row.is_active ? 'Operational' : 'Disabled'} 
        />
      ) 
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="h-4 w-4 mr-2" /> Edit Region
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" /> Pricing Config
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Geographic Regions" description="Manage operational cities and localized settings." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          Failed to load regions. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Geographic Regions" 
        description="Manage operational cities and localized settings."
      >
        <CityFormDialog />
      </PageHeader>
      <DataTable
        columns={columns}
        data={cities}
        keyExtractor={(city) => city.id}
        isLoading={isLoading}
        searchPlaceholder="Search regions..."
        emptyStateTitle="No regions found"
        emptyStateDescription="Get started by defining your first operational city."
      />
    </PageContainer>
  );
};

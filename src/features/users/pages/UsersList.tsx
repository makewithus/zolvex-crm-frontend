import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types/user.types';
import { UserFormDialog } from '../components/UserFormDialog';

export const UsersList = () => {
  const { data: usersResponse, isLoading, isError, error } = useUsers();
  const users = usersResponse?.data || [];

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'phone', header: 'Phone', cell: (row) => row.phone },
    { key: 'role', header: 'Role', cell: (row) => row.role.name },
    { key: 'city', header: 'City', cell: (row) => row.city?.name || 'Global' },
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
        <PageHeader title="Staff Management" description="Manage system users and access." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          Failed to load users. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Staff Management" 
        description="Manage system users and access."
      >
        <UserFormDialog />
      </PageHeader>
      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(user) => user.id}
        isLoading={isLoading}
        searchPlaceholder="Search staff by name or phone..."
        emptyStateTitle="No staff found"
        emptyStateDescription="Get started by adding a new user to the system."
      />
    </PageContainer>
  );
};

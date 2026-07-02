import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { useRoles } from '../hooks/useRoles';
import { Role } from '../types/role.types';

export const RolesList = () => {
  const { data: rolesResponse, isLoading, isError, error } = useRoles();
  const roles = rolesResponse?.data || [];

  const columns: Column<Role>[] = [
    { key: 'id', header: 'Role ID', cell: (row) => <span className="font-mono text-xs text-muted-foreground">{row.id}</span> },
    { key: 'name', header: 'Role Name', cell: (row) => <span className="font-medium">{row.name}</span> },
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Roles & Permissions" description="System Roles Configuration" />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          Failed to load roles. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Roles & Permissions" description="System Roles Configuration" />
      <DataTable
        columns={columns}
        data={roles}
        keyExtractor={(role) => role.id}
        isLoading={isLoading}
        searchPlaceholder="Search roles..."
        emptyStateTitle="No roles found"
        emptyStateDescription="The system requires at least one default role."
      />
    </PageContainer>
  );
};

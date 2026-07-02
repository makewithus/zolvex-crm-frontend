import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useRoles } from '../hooks/useRoles';
import { Role } from '../types/role.types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Users } from 'lucide-react';

export const RolesList = () => {
  const { data: rolesResponse, isLoading, isError, error } = useRoles();
  const roles = rolesResponse?.data || [];

  const columns: Column<Role>[] = [
    { 
      key: 'name', 
      header: 'Role Name', 
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="p-2 bg-primary/10 rounded-md">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{row.name}</span>
        </div>
      )
    },
    { 
      key: 'description', 
      header: 'Description', 
      cell: (row) => (
        <span className="text-muted-foreground text-sm">
          {row.name === 'Super Admin' ? 'Full system access and configuration.' : 
           row.name === 'City Manager' ? 'Regional branch and staff oversight.' : 
           row.name === 'Support Agent' ? 'Customer service, leads, and bookings.' :
           row.name === 'Field Staff' ? 'Job execution and schedule management.' :
           row.name === 'Finance' ? 'Invoicing, payments, and financial reporting.' : 'Standard functional access.'}
        </span>
      )
    },
    { 
      key: 'users', 
      header: 'Assigned Users', 
      cell: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row._count?.users || 0}</span>
        </div>
      )
    },
    { 
      key: 'permissions', 
      header: 'Permissions', 
      cell: (row) => (
        <span className="text-sm font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full border">
          {row.name === 'Super Admin' ? 'All Access' : 'Custom Matrix'}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      cell: () => <StatusBadge status="success" label="Active" />
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Permission Matrix</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{row.name} - Permissions</DialogTitle>
              </DialogHeader>
              <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-secondary/30 mt-4">
                <Shield className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="font-semibold text-lg">Matrix Configuration</h3>
                <p className="text-sm text-muted-foreground text-center mt-1 max-w-sm">
                  Detailed permission checkboxes for individual modules will be enabled in Phase 4.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Roles & Permissions" description="Manage security roles and access matrices." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          Failed to load roles. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Roles & Permissions" description="Manage security roles and access matrices." />
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

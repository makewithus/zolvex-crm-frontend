import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useRoles } from '../hooks/useRoles';
import { Role } from '../types/role.types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Users, CheckCircle, XCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { FEATURE_REGISTRY } from '@/config/features';

// Permission matrix: role → which modules it can access (maps to backend authorize() lists)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Super Admin': FEATURE_REGISTRY.map(f => f.id),
  'City Manager': ['dashboard','leads','customers','bookings','jobs','calendar','invoices','payments','reports','users'],
  'Support Agent': ['dashboard','leads','customers','bookings','jobs'],
  'Field Staff': ['dashboard','customers','bookings','jobs'],
  'Finance': ['dashboard','invoices','payments','reports'],
};

const PermissionMatrix = ({ roleName }: { roleName: string }) => {
  const permissions = ROLE_PERMISSIONS[roleName] || [];
  const modules = FEATURE_REGISTRY.filter(f => f.sidebarVisibility);

  return (
    <div className="mt-4 max-h-[60vh] overflow-y-auto">
      <p className="text-xs text-muted-foreground mb-4 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
        ⚠️ Permissions are enforced at the backend route level. This matrix reflects the current access policy.
      </p>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left font-semibold px-4 py-2.5 text-foreground">Module</th>
              <th className="text-center font-semibold px-4 py-2.5 text-foreground">View</th>
              <th className="text-center font-semibold px-4 py-2.5 text-foreground w-32 text-xs text-muted-foreground" colSpan={3}>
                Create / Edit / Delete — Super Admin only
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {modules.map(mod => {
              const canAccess = permissions.includes(mod.id);
              const isSuperAdmin = roleName === 'Super Admin';
              return (
                <tr key={mod.id} className={canAccess ? '' : 'opacity-40'}>
                  <td className="px-4 py-2.5 font-medium text-foreground">{mod.name}</td>
                  <td className="px-4 py-2.5 text-center">
                    {canAccess
                      ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
                      : <XCircle className="h-4 w-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-2 py-2.5 text-center" colSpan={3}>
                    {isSuperAdmin
                      ? <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle className="h-3 w-3" />Full</span>
                      : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RolesList = () => {
  const { data: rolesResponse, isLoading, isError, error } = useRoles();
  const [page, setPage] = useState(1);
  const limit = 10;

  const roles = useMemo(() => {
    const all = rolesResponse?.data || [];
    return [...all].sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }, [rolesResponse]);

  const totalPages = Math.max(1, Math.ceil(roles.length / limit));
  const paginatedRoles = roles.slice((page - 1) * limit, page * limit);

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
                <DialogTitle>{row.name} — Permission Matrix</DialogTitle>
              </DialogHeader>
              <PermissionMatrix roleName={row.name} />
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
        data={paginatedRoles}
        keyExtractor={(role) => role.id}
        isLoading={isLoading}
        searchPlaceholder="Search roles..."
        emptyStateTitle="No roles found"
        emptyStateDescription="The system requires at least one default role."
        pagination={{ page, totalPages, onPageChange: setPage }}
      />
    </PageContainer>
  );
};

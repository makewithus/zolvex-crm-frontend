import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useRoles } from '../hooks/useRoles';
import { Role } from '../types/role.types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Users, CheckCircle, XCircle, Info } from 'lucide-react';
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

  let summary = 'Standard functional access.';
  if (roleName === 'Super Admin') summary = 'Full System Access';
  else if (roleName === 'Finance') summary = 'Invoices, Payments, Financial Reports';
  else if (roleName === 'Technician') summary = 'Assigned Jobs, Assigned Customers, Dashboard';
  else if (roleName === 'Field Staff') summary = 'Assigned Operational Data, Customers, Dashboard';
  else if (roleName === 'Support Agent') summary = 'Operational Modules';
  else if (roleName === 'City Manager') summary = 'Regional branch and staff oversight';

  return (
    <div className="mt-2 max-h-[65vh] overflow-y-auto space-y-6 pr-2">
      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
        <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
        <div>
          <p className="font-semibold text-blue-900 mb-1">Backend Enforced RBAC</p>
          <p className="leading-relaxed">
            Permissions shown below are enforced by backend middleware and database authorization. This matrix is informational only and cannot be modified through the UI in Phase 0–10.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="font-semibold text-sm text-foreground">Role Summary</h4>
        <p className="text-sm text-muted-foreground">{summary}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground">Current Access Policy</h4>
        <div className="border rounded-lg overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left font-semibold px-4 py-3 text-foreground">Module</th>
                <th className="text-center font-semibold px-4 py-3 text-foreground">View</th>
                <th className="text-center font-semibold px-4 py-3 text-foreground">Create</th>
                <th className="text-center font-semibold px-4 py-3 text-foreground">Edit</th>
                <th className="text-center font-semibold px-4 py-3 text-foreground">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {modules.map(mod => {
                const canView = permissions.includes(mod.id);
                const isSuperAdmin = roleName === 'Super Admin';
                
                // Simplified CRUD mapping for visual matrix
                let canCreate = canView && roleName !== 'Technician';
                let canEdit = canView;
                let canDelete = isSuperAdmin;

                if (mod.id === 'reports' || mod.id === 'dashboard') {
                   canCreate = false;
                   canEdit = false;
                }

                return (
                  <tr key={mod.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{mod.name}</td>
                    <td className="px-4 py-3 text-center">
                      {canView ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {canCreate ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {canEdit ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {canDelete ? <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-slate-300 mx-auto" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const RolesList = () => {
  const { data: rolesResponse, isLoading, isError, error } = useRoles();
  const [page, setPage] = useState(1);
  const limit = 10;

  const roles = useMemo(() => {
    return rolesResponse?.data || [];
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
        <span className="text-[11px] font-medium px-2 py-0.5 bg-secondary text-secondary-foreground rounded border">
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
      <DataTable hideFilters
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

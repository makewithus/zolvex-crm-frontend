import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types/user.types';
import { UserFormDialog } from '../components/UserFormDialog';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, MoreHorizontal, Edit, Lock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useMemo } from 'react';
import { UserEditDialog } from '../components/UserEditDialog';
import { ResetPasswordDialog } from '../components/ResetPasswordDialog';
export const UsersList = () => {
  const { data: usersResponse, isLoading, isError, error } = useUsers();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  const users = useMemo(() => {
    const all = usersResponse?.data || [];
    const sorted = all;
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter((u: any) =>
      u.name?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.role?.name?.toLowerCase().includes(q)
    );
  }, [usersResponse, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(users.length / limit));
  const paginatedUsers = users.slice((page - 1) * limit, page * limit);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  const columns: Column<User>[] = [
    { 
      key: 'name', 
      header: 'Staff Member', 
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
            {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm leading-tight">{row.name || 'Unknown User'}</span>
            <span className="text-xs text-muted-foreground">{row.phone}</span>
          </div>
        </div>
      ) 
    },
    { 
      key: 'role', 
      header: 'Security Role', 
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 bg-secondary text-secondary-foreground rounded border w-fit">
          <Shield className="h-3 w-3" />
          {row.role.name}
        </div>
      ) 
    },
    { 
      key: 'city', 
      header: 'Location', 
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {row.city?.name || 'Global Access'}
        </div>
      ) 
    },
    { 
      key: 'is_active', 
      header: 'Status', 
      cell: (row) => (
        <StatusBadge 
          status={row.is_active ? 'success' : 'default'} 
          label={row.is_active ? 'Active' : 'Inactive'} 
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => setEditingUser(row)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => setResetPasswordUser(row)}>
              <Lock className="h-4 w-4 mr-2" /> Reset Password
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Staff Directory" description="Manage system users and regional access." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          Failed to load users. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Staff Directory" 
        description="Manage system users and regional access."
      >
        <UserFormDialog onSuccess={() => setPage(1)} />
      </PageHeader>
      <DataTable hideFilters
        columns={columns}
        data={paginatedUsers}
        keyExtractor={(user) => user.id}
        isLoading={isLoading}
        onSearch={(q) => { setSearchQuery(q); setPage(1); }}
        searchPlaceholder="Search by name, phone or role..."
        emptyStateTitle="No staff found"
        emptyStateDescription="Try a different search term or add a new user."
        pagination={{ page, totalPages, onPageChange: setPage }}
      />
      <UserEditDialog 
        user={editingUser} 
        open={!!editingUser} 
        onOpenChange={(open) => !open && setEditingUser(null)} 
      />
      <ResetPasswordDialog 
        user={resetPasswordUser} 
        open={!!resetPasswordUser} 
        onOpenChange={(open) => !open && setResetPasswordUser(null)} 
      />
    </PageContainer>
  );
};

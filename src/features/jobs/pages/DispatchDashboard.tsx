import React, { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const DispatchDashboard = () => {
  const [filters, setFilters] = useState({});
  const { data: jobs, isLoading } = useJobs(filters);
  const navigate = useNavigate();

  const columns = [
    { header: 'Job ID', accessorKey: 'job_id' },
    { 
      header: 'Date & Time', 
      cell: (row: any) => format(new Date(row.scheduled_start), 'MMM dd, yyyy HH:mm') 
    },
    { 
      header: 'Technician', 
      cell: (row: any) => row.assignedUser ? row.assignedUser.name : <span className="text-muted-foreground italic">Unassigned</span>
    },
    { header: 'Priority', cell: (row: any) => <Badge variant="outline">{row.priority}</Badge> },
    { 
      header: 'Status', 
      cell: (row: any) => <Badge>{row.status}</Badge> 
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex gap-2">
          <button 
            className="text-primary hover:underline text-sm font-medium"
            onClick={() => navigate(`/jobs/${row.id}`)}
          >
            View
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Dispatch Dashboard" 
        description="Manage job assignments and field operations."
      />
      <div className="bg-card rounded-lg border shadow-sm">
        <DataTable 
          data={jobs || []} 
          columns={columns} 
          isLoading={isLoading} 
          searchPlaceholder="Search jobs..."
        />
      </div>
    </div>
  );
};

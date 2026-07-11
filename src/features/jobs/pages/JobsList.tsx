import { DispatchDashboard } from './DispatchDashboard';
import { FieldStaffJobs } from './FieldStaffJobs';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

export const JobsList = () => {
  const { data: currentUser, isLoading } = useCurrentUser();
  
  if (isLoading) return <div>Loading...</div>;

  const userRole = currentUser?.role?.name || 'Super Admin';

  if (userRole === 'Field Staff') {
    return <FieldStaffJobs />;
  }

  return <DispatchDashboard />;
};

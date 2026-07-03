import { DispatchDashboard } from './DispatchDashboard';
import { FieldStaffJobs } from './FieldStaffJobs';

export const JobsList = () => {
  const userRole = localStorage.getItem('userRole') || 'Super Admin';

  if (userRole === 'Field Staff') {
    return <FieldStaffJobs />;
  }

  return <DispatchDashboard />;
};

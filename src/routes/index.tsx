import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/ui-custom/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/features/auth';
import { Navigate } from 'react-router-dom';
import { Cities } from '@/pages/Cities';
import { Users } from '@/pages/Users';
import { Roles } from '@/pages/Roles';
import { Services } from '@/pages/Services';
import { PricingRules } from '@/pages/PricingRules';
import { LeadList, LeadDetail, LeadForm } from '@/features/leads';
import CustomerList from '@/features/customers/pages/CustomerList';
import CustomerDetail from '@/features/customers/pages/CustomerDetail';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <AppShell />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="cities" element={<Cities />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        <Route path="services" element={<Services />} />
        <Route path="pricing-rules" element={<PricingRules />} />
        <Route path="leads" element={<LeadList />} />
        <Route path="leads/new" element={<LeadForm />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="leads/:id/edit" element={<LeadForm />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
      </Route>
    </Routes>
  );
};

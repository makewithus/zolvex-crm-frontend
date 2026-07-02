import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Cities } from '@/pages/Cities';
import { Users } from '@/pages/Users';
import { Roles } from '@/pages/Roles';
import { Services } from '@/pages/Services';
import { PricingRules } from '@/pages/PricingRules';

// Placeholder wrapper. Auth protection to be implemented in Phase 1.
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="cities" element={<Cities />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        <Route path="services" element={<Services />} />
        <Route path="pricing-rules" element={<PricingRules />} />
      </Route>
    </Routes>
  );
};

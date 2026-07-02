import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';

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
      </Route>
    </Routes>
  );
};

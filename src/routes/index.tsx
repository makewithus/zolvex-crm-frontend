import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { LandingPage } from '@/pages/LandingPage';
import { Login } from '@/features/auth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CitiesList } from '@/features/cities';
import { UsersList } from '@/features/users';
import { RolesList } from '@/features/roles';
import { ServicesList } from '@/features/services';
import { PricingRulesList } from '@/features/pricing-rules';
import { LeadList, LeadDetail, LeadForm } from '@/features/leads';
import CustomerList from '@/features/customers/pages/CustomerList';
import CustomerDetail from '@/features/customers/pages/CustomerDetail';

import { BookingsList } from '@/features/bookings/pages/BookingsList';
import { BookingDetail } from '@/features/bookings/pages/BookingDetail';
import { JobsList } from '@/features/jobs/pages/JobsList';
import { JobDetail } from '@/features/jobs/pages/JobDetail';
import { JobCalendar } from '@/features/jobs/pages/JobCalendar';
import { InvoiceList } from '@/features/invoices/pages/InvoiceList';
import { InvoiceDetail } from '@/features/invoices/pages/InvoiceDetail';
import { PaymentsList } from '@/features/payments/pages/PaymentsList';
import { ReportsDashboard } from '@/features/reports/pages/ReportsDashboard';
import { FinancialReport } from '@/features/reports/pages/FinancialReport';
import { OperationalReport } from '@/features/reports/pages/OperationalReport';
import { TechnicianReport } from '@/features/reports/pages/TechnicianReport';
import { GSTReport } from '@/features/reports/pages/GSTReport';
import { FinanceOverviewReport } from '@/features/reports/pages/FinanceOverviewReport';
import { Settings } from '@/features/settings/pages/Settings';
import ChecklistTemplates from '@/features/settings/pages/ChecklistTemplates';
import ComplaintList from '@/features/complaints/pages/ComplaintList';
import ComplaintDetail from '@/features/complaints/pages/ComplaintDetail';
import FeedbackList from '@/features/feedback/pages/FeedbackList';
import WhatsAppInbox from '@/features/whatsapp/pages/WhatsAppInbox';
import { ExpenseList } from '@/features/expenses/pages/ExpenseList';
import { QuoteList } from '@/features/quotes/pages/QuoteList';
import { QuoteDetail } from '@/features/quotes/pages/QuoteDetail';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  // Re-validate token on every mount to prevent bfcache from showing
  // protected pages after logout (browser Back button issue).
  useEffect(() => {
    const checkToken = () => {
      if (!localStorage.getItem('token')) {
        navigate('/login', { replace: true });
      }
    };

    checkToken();

    // Handle bfcache restorations (when the user clicks the browser back button)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkToken();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [navigate]);

  if (!token) {
    if (location.pathname === '/') {
      return <LandingPage />;
    }
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="cities" element={<CitiesList />} />
        <Route path="users" element={<UsersList />} />
        <Route path="roles" element={<RolesList />} />
        <Route path="services" element={<ServicesList />} />
        <Route path="pricing-rules" element={<PricingRulesList />} />
        <Route path="leads" element={<LeadList />} />
        <Route path="leads/new" element={<LeadForm />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="leads/:id/edit" element={<LeadForm />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        
        {/* Bookings */}
        <Route path="bookings" element={<BookingsList />} />
        <Route path="bookings/:id" element={<BookingDetail />} />

        {/* Jobs */}
        <Route path="jobs" element={<JobsList />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="calendar" element={<JobCalendar />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="payments" element={<PaymentsList />} />
        <Route path="reports" element={<ReportsDashboard />} />
        <Route path="reports/financial" element={<FinancialReport />} />
        <Route path="reports/operational" element={<OperationalReport />} />
        <Route path="reports/technician" element={<TechnicianReport />} />
        <Route path="reports/gst" element={<GSTReport />} />
        <Route path="reports/finance-overview" element={<FinanceOverviewReport />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/checklists" element={<ChecklistTemplates />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
        <Route path="feedback" element={<FeedbackList />} />
        <Route path="whatsapp" element={<WhatsAppInbox />} />
        {/* Finance — Expense Module */}
        <Route path="expenses" element={<ExpenseList />} />
        {/* Finance — Quotation Module */}
        <Route path="quotations" element={<QuoteList />} />
        <Route path="quotations/:id" element={<QuoteDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

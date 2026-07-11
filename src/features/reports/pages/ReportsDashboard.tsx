import React from 'react';
import { Link } from 'react-router-dom';
import { useReportDashboard } from '../hooks/useReports';
import { DollarSign, TrendingUp, AlertCircle,
  Briefcase, Calendar, ChevronRight,
  BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatCurrency = (val: number) =>
  `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const Skeleton = () => (
  <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse mt-1" />
);

const KPICard = ({
  title, value, icon: Icon, color, bg, link, loading
}: {
  title: string; value: string; icon: any;
  color: string; bg: string; link?: string; loading?: boolean;
}) => {
  const inner = (
    <Card className={`relative overflow-hidden hover:shadow-md transition-shadow ${link ? 'cursor-pointer' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? <Skeleton /> : (
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bg}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
        {link && (
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
            Open Report <ChevronRight className="w-3 h-3" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return link ? <Link to={link}>{inner}</Link> : inner;
};

const StatusBar = ({
  label, count, total, color
}: { label: string; count: number; total: number; color: string }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const ReportsDashboard: React.FC = () => {
  const userRole = localStorage.getItem('userRole') || '';
  const canSeeFinancial = ['Super Admin', 'Finance', 'City Manager'].includes(userRole);

  const { data, isLoading } = useReportDashboard();

  const financial = data?.financial;
  const bookings = data?.operational?.bookings_by_status || {};
  const jobs = data?.operational?.jobs_by_status || {};

  const totalBookings = Object.values(bookings).reduce((a, b) => a + b, 0);
  const totalJobs = Object.values(jobs).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Live read-only view of the transaction engine.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
          <BarChart3 className="w-3.5 h-3.5" />
          Read-only consumer
        </div>
      </div>

      {/* Financial KPIs */}
      {canSeeFinancial && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Financial</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="Revenue"
              value={isLoading ? '—' : formatCurrency(financial?.revenue ?? 0)}
              icon={DollarSign}
              color="text-emerald-600"
              bg="bg-emerald-50"
              link="/reports/financial"
              loading={isLoading}
            />
            <KPICard
              title="Collections"
              value={isLoading ? '—' : formatCurrency(financial?.collections ?? 0)}
              icon={TrendingUp}
              color="text-blue-600"
              bg="bg-blue-50"
              link="/reports/financial"
              loading={isLoading}
            />
            <KPICard
              title="Outstanding"
              value={isLoading ? '—' : formatCurrency(financial?.outstanding ?? 0)}
              icon={AlertCircle}
              color="text-amber-600"
              bg="bg-amber-50"
              link="/reports/financial"
              loading={isLoading}
            />
          </div>
        </section>
      )}

      {/* Operational KPIs */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Operational</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bookings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-800">Bookings by Status</CardTitle>
                <Link to="/reports/operational" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                  View Report <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}
                </div>
              ) : totalBookings === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No bookings found</p>
              ) : (
                Object.entries(bookings).map(([status, count]) => (
                  <StatusBar
                    key={status}
                    label={status}
                    count={count}
                    total={totalBookings}
                    color={
                      status === 'Completed' ? 'bg-emerald-500' :
                      status === 'Cancelled' ? 'bg-red-400' :
                      status === 'InProgress' ? 'bg-blue-500' :
                      'bg-amber-400'
                    }
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Jobs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-800">Jobs by Status</CardTitle>
                <Link to="/reports/operational" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                  View Report <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}
                </div>
              ) : totalJobs === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No jobs found</p>
              ) : (
                Object.entries(jobs).map(([status, count]) => (
                  <StatusBar
                    key={status}
                    label={status}
                    count={count}
                    total={totalJobs}
                    color={
                      status === 'Completed' ? 'bg-emerald-500' :
                      status === 'Cancelled' ? 'bg-red-400' :
                      status === 'Started' ? 'bg-blue-500' :
                      status === 'Assigned' ? 'bg-indigo-500' :
                      'bg-amber-400'
                    }
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation Cards */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Detailed Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Financial Report', desc: 'Revenue, Outstanding, Collections, GST', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/reports/financial', show: canSeeFinancial },
            { label: 'Operational Report', desc: 'Bookings and Jobs summary', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', link: '/reports/operational', show: true },
            { label: 'Technician Report', desc: 'Productivity and utilization', icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-50', link: '/reports/technician', show: true },
            { label: 'GST Report', desc: 'CGST, SGST, IGST breakdown', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50', link: '/reports/gst', show: canSeeFinancial },
          ].filter(c => c.show).map(card => (
            <Link key={card.link} to={card.link}>
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{card.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

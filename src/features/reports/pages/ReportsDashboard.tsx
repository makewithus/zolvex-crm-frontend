import React from 'react';
import { Link } from 'react-router-dom';
import { useReportDashboard } from '../hooks/useReports';
import { DollarSign, TrendingUp, AlertCircle,
  Briefcase, Calendar, ChevronRight,
  BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

const formatCurrency = (val: number) =>
  `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const Skeleton = () => (
  <div className="h-8 w-3/4 bg-muted rounded animate-pulse mt-1" />
);

const KPICard = ({
  title, value, icon: Icon, link, loading
}: {
  title: string; value: string; icon: any; link?: string; loading?: boolean;
}) => {
  const inner = (
    <Card className={`relative overflow-hidden transition-all shadow-sm ${link ? 'cursor-pointer hover:bg-muted/30' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? <Skeleton /> : (
              <p className="text-3xl font-bold tracking-tight text-foreground mt-1.5">{value}</p>
            )}
          </div>
          <Icon className="w-5 h-5 text-muted-foreground/60" />
        </div>
        {link && (
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
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
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{count} <span className="text-muted-foreground/70 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded overflow-hidden">
        <div className={`h-full rounded ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const ReportsDashboard: React.FC = () => {
  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role?.name || '';
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Live read-only view of the transaction engine.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-md flex-shrink-0">
          <BarChart3 className="w-3.5 h-3.5" />
          Read-only consumer
        </div>
      </div>

      {/* Navigation Cards */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-3">Detailed Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Finance Overview',    desc: 'Revenue, Expenses, Net Profit, Quotation Pipeline', icon: TrendingUp,  link: '/reports/finance-overview', show: canSeeFinancial },
            { label: 'Financial Report',    desc: 'Revenue, Outstanding, Collections, GST',             icon: DollarSign,  link: '/reports/financial',       show: canSeeFinancial },
            { label: 'Operational Report',  desc: 'Bookings and Jobs summary',                          icon: Calendar,    link: '/reports/operational',     show: true },
            { label: 'Technician Report',   desc: 'Productivity and utilization',                       icon: Briefcase,   link: '/reports/technician',      show: true },
            { label: 'GST Report',          desc: 'CGST, SGST, IGST breakdown',                        icon: BarChart3,   link: '/reports/gst',             show: canSeeFinancial },
          ].filter(c => c.show).map(card => (
            <Link key={card.link} to={card.link}>
              <Card className="hover:border-border hover:bg-muted/30 transition-colors shadow-sm cursor-pointer h-full border-border/60">
                <CardContent className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <card.icon className="w-5 h-5 text-muted-foreground mb-3" />
                    <p className="font-semibold text-foreground text-sm tracking-tight">{card.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{card.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Financial KPIs */}
      {canSeeFinancial && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-3">Financial</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="Invoice Revenue"
              value={isLoading ? '—' : formatCurrency(financial?.revenue ?? 0)}
              icon={DollarSign}
              link="/reports/financial"
              loading={isLoading}
            />
            <KPICard
              title="Collections"
              value={isLoading ? '—' : formatCurrency(financial?.collections ?? 0)}
              icon={TrendingUp}
              link="/reports/financial"
              loading={isLoading}
            />
            <KPICard
              title="Outstanding"
              value={isLoading ? '—' : formatCurrency(financial?.outstanding ?? 0)}
              icon={AlertCircle}
              link="/reports/financial"
              loading={isLoading}
            />
          </div>
        </section>
      )}

      {/* Operational KPIs */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-3">Operational</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bookings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-800">Bookings by Status</CardTitle>
                <Link to="/reports/operational" className="text-xs text-slate-800 hover:underline flex items-center gap-0.5">
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
                      status === 'Completed' ? 'bg-emerald-600' :
                      status === 'Cancelled' ? 'bg-rose-600' :
                      status === 'InProgress' ? 'bg-slate-700' :
                      'bg-amber-500'
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
                <Link to="/reports/operational" className="text-xs text-slate-800 hover:underline flex items-center gap-0.5">
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
                      status === 'Completed' ? 'bg-emerald-600' :
                      status === 'Cancelled' ? 'bg-rose-600' :
                      status === 'Started' ? 'bg-slate-700' :
                      status === 'Assigned' ? 'bg-slate-500' :
                      'bg-amber-500'
                    }
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>


    </div>
  );
};

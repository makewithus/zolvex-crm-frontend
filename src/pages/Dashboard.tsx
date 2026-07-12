import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Calendar, Plus, Activity, ChevronRight, Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getDashboardKPIs,
  getDashboardActivity,
  getUpcomingBookings,
  getDashboardRevenue,
} from '@/features/auth/api/dashboard.api';
import { FEATURE_REGISTRY } from '@/config/features';
import { format } from 'date-fns';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role?.name || 'Super Admin';

  const hasAccess = (route: string) => {
    const feat = FEATURE_REGISTRY.find(f => f.route === route);
    return feat ? feat.requiredRoles.includes(userRole) : false;
  };

  const canSeeRevenue = ['Super Admin', 'Finance'].includes(userRole);

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: getDashboardKPIs,
    staleTime: 60000,
  });

  const { data: activity = [], isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => getDashboardActivity(8),
    staleTime: 60000,
  });

  const { data: upcomingBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['dashboard', 'upcoming-bookings'],
    queryFn: getUpcomingBookings,
    staleTime: 60000,
  });

  const { data: revenue } = useQuery({
    queryKey: ['dashboard', 'revenue'],
    queryFn: getDashboardRevenue,
    enabled: canSeeRevenue,
    staleTime: 60000,
  });

  const kpiCards = [
    {
      label: 'Total Leads',
      value: kpis?.total_leads ?? '—',
      icon: Users,
    },
    {
      label: 'Customers',
      value: kpis?.total_customers ?? '—',
      icon: Users,
    },
    {
      label: 'Active Bookings',
      value: kpis?.active_bookings ?? '—',
      icon: Calendar,
    },
    {
      label: 'Jobs Today',
      value: kpis?.jobs_today ?? '—',
      icon: Briefcase,
    },
    {
      label: 'Booked Value',
      value: canSeeRevenue
        ? (revenue ? `₹${Number(revenue.mtd_revenue).toLocaleString('en-IN')}` : '—')
        : null,
      icon: DollarSign,
    },
  ].filter(c => c.value !== null);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <PageHeader
          title="Overview"
          description="Live view of your CRM pipeline, bookings, and operations."
        />
        <div className="flex gap-2">
          {hasAccess('/leads') && (
            <Button onClick={() => navigate('/leads/new')} size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> New Lead
            </Button>
          )}
          {hasAccess('/bookings') && (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/bookings')}>
              <Calendar className="h-4 w-4" /> Bookings
            </Button>
          )}
        </div>
      </div>

      {/* Live KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        {kpisLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-sm border-border/40 animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-8 bg-muted rounded w-16 mb-2" />
                  <div className="h-4 bg-muted rounded w-24" />
                </CardContent>
              </Card>
            ))
          : kpiCards.map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight">{value}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Recent Activity — live from BookingHistory + JobHistory */}
        <Card className="md:col-span-8 shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Recent Activity
            </CardTitle>
            <CardDescription>Live audit trail from bookings and jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : activity.length === 0 ? (
              <EmptyState title="No recent activity" description="Audit trail events will appear here once bookings or jobs are created." />
            ) : (
              <div className="space-y-1">
                {activity.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b last:border-0 hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-md">
                    <div className="mt-0.5 text-muted-foreground/70">
                      {item.type === 'booking' ? <Calendar className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 tracking-wider uppercase">
                        {format(new Date(item.at), 'dd MMM, h:mm a')}
                      </p>
                    </div>
                    {item.to && <StatusBadge status="default" label={item.to} />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings — live from DB */}
        {hasAccess('/bookings') && (
          <Card className="md:col-span-4 shadow-sm border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Upcoming Bookings</CardTitle>
                <CardDescription>Next 48 hours</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')}>
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <EmptyState title="No upcoming bookings" description="No scheduled bookings for the next 48 hours." />
              ) : (
                <div className="space-y-2">
                  {upcomingBookings.map((b: any) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50 cursor-pointer transition-colors shadow-sm"
                      onClick={() => navigate(`/bookings/${b.id}`)}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{b.customer_name || 'Customer'}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{b.service_name}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-medium">{format(new Date(b.scheduled_date), 'dd MMM')}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{format(new Date(b.scheduled_date), 'h:mm a')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Revenue summary — Super Admin / Finance only */}
      {canSeeRevenue && revenue && (
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md text-muted-foreground">Month to Date</span>
            </CardHeader>
            <CardContent className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-4xl font-bold tracking-tight">
                  ₹{Number(revenue.mtd_revenue).toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Generated from <span className="font-medium text-foreground">{revenue.completed_bookings_count}</span> completed booking{revenue.completed_bookings_count !== 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};

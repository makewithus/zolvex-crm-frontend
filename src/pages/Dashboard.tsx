import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Calendar, Plus, Activity, Briefcase, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getDashboardKPIs,
  getDashboardActivity,
  getUpcomingBookings,
  getDashboardRevenue,
} from '@/features/auth/api/dashboard.api';
import { getLeads } from '@/features/leads/api/leads.api';
import { getJobs } from '@/features/jobs/api/jobs.api';
import { FEATURE_REGISTRY } from '@/config/features';
import { format } from 'date-fns';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

const EmptyWidget = ({ icon: Icon, title, description, action, onClick }: any) => (
  <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[220px]">
    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-slate-400" />
    </div>
    <h3 className="text-[16px] font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-[14px] text-slate-500 max-w-[280px] mb-6">{description}</p>
    {action && (
      <Button variant="outline" className="h-9 px-4 text-[13px] font-semibold bg-white border-slate-300 shadow-sm" onClick={onClick}>
        {action}
      </Button>
    )}
  </div>
);

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

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const s = status?.toLowerCase() || '';
    if (['completed', 'booked', 'qualified', 'confirmed'].includes(s)) return 'success';
    if (['cancelled', 'lost', 'failed'].includes(s)) return 'error';
    if (['inprogress', 'in progress', 'followup', 'quotationsent', 'assigned', 'started', 'arrived'].includes(s)) return 'warning';
    if (['new', 'contacted', 'scheduled'].includes(s)) return 'info';
    return 'default';
  };

  const { data: leadsRes, isLoading: leadsLoading } = useQuery({
    queryKey: ['dashboard', 'leads'],
    queryFn: getLeads,
    staleTime: 60000,
  });
  const latestLeads = leadsRes?.data?.slice(0, 5) || [];

  const { data: jobsList = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['dashboard', 'jobs'],
    queryFn: () => getJobs(),
    staleTime: 60000,
  });
  const recentJobs = jobsList.slice(0, 5);

  const kpiCards = [
    {
      label: 'Total Leads',
      value: kpis?.total_leads ?? '—',
      icon: Target,
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        <PageHeader
          title="Overview"
          description="Live view of your CRM pipeline, bookings, and operations."
        />
        <div className="flex items-center gap-2">
          {hasAccess('/bookings') && (
            <Button variant="outline" className="h-8 px-3 rounded text-[13px] font-medium text-slate-700 bg-white border-slate-300 hover:bg-slate-50 shadow-none" onClick={() => navigate('/bookings')}>
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> Bookings
            </Button>
          )}
          {hasAccess('/leads') && (
            <Button className="h-8 px-3 rounded text-[13px] font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-none" onClick={() => navigate('/leads/new')}>
              <Plus className="h-3.5 w-3.5 mr-1.5 text-white" /> New Lead
            </Button>
          )}
        </div>
      </div>

      {/* Live KPI Row */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5 mb-6">
        {kpisLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-none border-slate-200 rounded h-[76px] bg-white animate-pulse">
                <CardContent className="p-3">
                  <div className="h-4 bg-slate-100 rounded w-16 mb-2" />
                  <div className="h-6 bg-slate-100 rounded w-20" />
                </CardContent>
              </Card>
            ))
          : kpiCards.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="shadow-none border-slate-200 rounded h-[76px] bg-white">
                <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 space-y-0">
                  <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</CardTitle>
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <div className="text-xl font-bold text-slate-900 tracking-tight leading-none">{value}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Row 1: Activity & Upcoming Bookings */}
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        {/* Recent Activity */}
        <Card className="shadow-none border-slate-200 rounded flex flex-col bg-white">
          <CardHeader className="p-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-[13px] font-bold text-slate-900">
                Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {activityLoading ? (
              <div className="p-3 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-50 rounded animate-pulse" />
                ))}
              </div>
            ) : activity.length === 0 ? (
              <EmptyWidget 
                icon={Activity} 
                title="No recent activity" 
                description="Audit trail events will appear here once bookings or jobs are created." 
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {activity.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 py-2 px-3 hover:bg-slate-50/50 transition-colors">
                    <div className="text-slate-400">
                      {item.type === 'booking' ? <Calendar className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-900 leading-tight truncate">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {format(new Date(item.at), 'dd MMM, h:mm a')}
                      </p>
                    </div>
                    {item.to && <StatusBadge status={getStatusColor(item.to)} label={item.to} />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        {hasAccess('/bookings') && (
          <Card className="shadow-none border-slate-200 rounded flex flex-col bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-[13px] font-bold text-slate-900">Upcoming Bookings</CardTitle>
              </div>
              <button className="text-[12px] font-medium text-slate-600 hover:text-slate-900 transition-colors" onClick={() => navigate('/bookings')}>
                View All
              </button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {bookingsLoading ? (
                <div className="p-3 space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <EmptyWidget 
                  icon={Calendar} 
                  title="No upcoming bookings" 
                  description="There are no scheduled bookings for the next 48 hours." 
                  onClick={() => navigate('/bookings')}
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingBookings.slice(0, 5).map((b: any) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between py-2 px-3 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/bookings/${b.id}`)}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">{b.customer_name || 'Customer'}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{b.service_name}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-[12px] font-semibold text-slate-900">{format(new Date(b.scheduled_date), 'dd MMM')}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{format(new Date(b.scheduled_date), 'h:mm a')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Row 2: Leads & Jobs */}
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        {/* Latest Leads */}
        {hasAccess('/leads') && (
          <Card className="shadow-none border-slate-200 rounded flex flex-col bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-[13px] font-bold text-slate-900">Latest Leads</CardTitle>
              </div>
              <button className="text-[12px] font-medium text-slate-600 hover:text-slate-900 transition-colors" onClick={() => navigate('/leads')}>
                View All
              </button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {leadsLoading ? (
                <div className="p-3 space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : latestLeads.length === 0 ? (
                <EmptyWidget 
                  icon={Target} 
                  title="No active leads" 
                  description="Start tracking potential customers by adding your first lead." 
                  action="Add Lead"
                  onClick={() => navigate('/leads/new')}
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {latestLeads.map((lead: any) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between py-2 px-3 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">{lead.name || lead.phone}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">Source: {lead.source}</p>
                      </div>
                      <div className="ml-3 shrink-0">
                        <StatusBadge status={getStatusColor(lead.status)} label={lead.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Jobs */}
        {hasAccess('/jobs') && (
          <Card className="shadow-none border-slate-200 rounded flex flex-col bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-[13px] font-bold text-slate-900">Recent Jobs</CardTitle>
              </div>
              <button className="text-[12px] font-medium text-slate-600 hover:text-slate-900 transition-colors" onClick={() => navigate('/jobs')}>
                View All
              </button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {jobsLoading ? (
                <div className="p-3 space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : recentJobs.length === 0 ? (
                <EmptyWidget 
                  icon={Briefcase} 
                  title="No active jobs" 
                  description="Jobs created from confirmed bookings will appear here." 
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentJobs.map((job: any) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between py-2 px-3 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">Job #{job.job_number || job.id.slice(0,6)}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {job.booking?.customer_name || 'Customer'} • {job.booking?.service_name || 'Service'}
                        </p>
                      </div>
                      <div className="ml-3 shrink-0 text-right">
                        <StatusBadge status={getStatusColor(job.status)} label={job.status} />
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
        <div className="mt-4">
          <Card className="shadow-none border-slate-200 rounded overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-[13px] font-bold text-slate-900">Revenue Overview</CardTitle>
              </div>
              <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">Month to Date</span>
            </CardHeader>
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-6 bg-white">
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  ₹{Number(revenue.mtd_revenue).toLocaleString('en-IN')}
                </p>
              </div>
              
              <div className="hidden md:block h-8 w-px bg-slate-200"></div>

              <div className="flex-1 max-w-[400px]">
                 <p className="text-[13px] font-semibold text-slate-900 leading-tight">Performance Summary</p>
                 <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                   Revenue generated from <strong className="text-slate-950 font-semibold">{revenue.completed_bookings_count}</strong> completed booking{revenue.completed_bookings_count !== 1 ? 's' : ''}. Follow up on pending invoices to optimize cash flow.
                 </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};

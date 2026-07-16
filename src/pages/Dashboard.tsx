import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, DollarSign, Calendar, Plus, Activity, Briefcase, Target, 
  Search, MoreHorizontal
} from 'lucide-react';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getDashboardKPIs,
  getDashboardActivity,
  getUpcomingBookings,
  getRecentTransactions,
  getServiceDistribution,
} from '@/features/auth/api/dashboard.api';
import { getLeads } from '@/features/leads/api/leads.api';
import { getJobs } from '@/features/jobs/api/jobs.api';
import { FEATURE_REGISTRY } from '@/config/features';
import { format } from 'date-fns';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useState, useMemo } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const EmptyWidget = ({ icon: Icon, title, description, action, onClick, compact }: any) => (
  <div className={`flex flex-col items-center justify-center text-center h-full ${compact ? 'p-3 min-h-[140px]' : 'p-6 min-h-[220px]'}`}>
    <div className={`${compact ? 'h-8 w-8 mb-2' : 'h-10 w-10 mb-3'} rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100`}>
      <Icon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-slate-400`} />
    </div>
    <h3 className={`${compact ? 'text-[11.5px]' : 'text-[13px]'} font-semibold text-slate-900 mb-0.5`}>{title}</h3>
    <p className={`${compact ? 'text-[10.5px] max-w-[220px]' : 'text-[12px] max-w-[280px]'} text-slate-500 mb-3 leading-normal`}>{description}</p>
    {action && (
      <Button variant="outline" className={`${compact ? 'h-7 px-3 text-[10px]' : 'h-8 px-4 text-[11px]'} font-semibold bg-white border-slate-300 shadow-none rounded`} onClick={onClick}>
        {action}
      </Button>
    )}
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role?.name || 'Super Admin';

  const [activeTab, setActiveTab] = useState<'bookings' | 'jobs' | 'leads'>('bookings');
  const [tableSearch, setTableSearch] = useState('');
  const [logsSearch, setLogsSearch] = useState('');
  // trendFilter removed: Weekly/Monthly/Yearly buttons were decorative (no API re-fetch); removed entirely

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

  const { data: transactionList = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['dashboard', 'recent-transactions'],
    queryFn: () => getRecentTransactions(5),
    staleTime: 60000,
  });

  // Real service distribution from ALL bookings via dedicated endpoint
  const { data: serviceDistribution = [] } = useQuery({
    queryKey: ['dashboard', 'service-distribution'],
    queryFn: getServiceDistribution,
    staleTime: 60000,
  });

  const leadsRes = useQuery({
    queryKey: ['dashboard', 'leads'],
    queryFn: getLeads,
    staleTime: 60000,
  });
  const latestLeads = (leadsRes.data?.data || [])
    .sort((a: any, b: any) => {
      const getLatestDate = (lead: any) => {
        if (!lead.history || lead.history.length === 0) return 0;
        return Math.max(...lead.history.map((h: any) => new Date(h.changed_at).getTime()));
      };
      return getLatestDate(b) - getLatestDate(a);
    })
    .slice(0, 5);
  const leadsLoading = leadsRes.isLoading;

  const jobsQuery = useQuery({
    queryKey: ['dashboard', 'jobs'],
    queryFn: () => getJobs({ include_booking: true }),
    staleTime: 60000,
  });
  const jobsList: any[] = jobsQuery.data || [];
  const jobsLoading = jobsQuery.isLoading;
  const recentJobs = [...jobsList]
    .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const s = status?.toLowerCase() || '';
    if (['completed', 'booked', 'qualified', 'confirmed', 'success'].includes(s)) return 'success';
    if (['cancelled', 'lost', 'failed', 'refunded'].includes(s)) return 'error';
    if (['inprogress', 'in progress', 'followup', 'quotationsent', 'assigned', 'started', 'arrived', 'pending'].includes(s)) return 'warning';
    if (['new', 'contacted', 'scheduled'].includes(s)) return 'info';
    return 'default';
  };

  const formatActor = (actor: string) => {
    if (!actor) return 'System';
    // Backend now resolves UUID → real user name via User table join.
    // If a UUID still appears (edge case), display it truncated.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(actor)) {
      return `User (${actor.slice(0, 8)}…)`;
    }
    return actor;
  };

  const maxRevenueValue = useMemo(() => {
    if (!kpis?.monthly_revenue_trend) return 1;
    const vals = kpis.monthly_revenue_trend.map((d: any) => Math.max(d.revenue ?? 0, d.collections ?? 0, d.outstanding ?? 0));
    return Math.max(...vals, 1);
  }, [kpis?.monthly_revenue_trend]);

  const formatYAxisLabel = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${Math.round(value)}`;
  };

  const getActivityIcon = (item: any) => {
    const to = item.to?.toLowerCase();
    if (to === 'completed') return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />;
    if (to === 'started') return <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />;
    if (to === 'travelling') return <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />;
    if (to === 'arrived') return <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />;
    if (to === 'cancelled' || to === 'failed') return <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />;
    return <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />;
  };

  // Real sparkline generator with premium gradients
  const renderSmoothSparkline = (dataPoints: number[], color: 'indigo' | 'violet' | 'emerald' | 'blue' = 'indigo') => {
    if (!dataPoints || dataPoints.length === 0) return null;
    const hasData = dataPoints.some(v => v > 0);
    if (!hasData) return null;
      
    const maxVal = Math.max(...dataPoints, 1);
    const width = 60;
    const height = 30;
    const padding = 2;
    const chartHeight = height - padding * 2;

    const points = dataPoints.map((val, idx) => {
      const x = idx * (width / (Math.max(1, dataPoints.length - 1)));
      const h = (val / maxVal) * chartHeight;
      const y = height - padding - h;
      return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    const colors = {
      indigo: { stroke: 'rgb(99, 102, 241)' },
      violet: { stroke: 'rgb(139, 92, 246)' },
      emerald: { stroke: 'rgb(16, 185, 129)' },
      blue: { stroke: 'rgb(59, 130, 246)' }
    };
    const c = colors[color] || colors.indigo;
    const gradId = `spark-grad-${color}-${Math.random().toString(36).substr(2, 4)}`;

    return (
      <svg className="w-16 h-8 shrink-0 self-end mb-1" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.stroke} stopOpacity="0.2" />
            <stop offset="100%" stopColor={c.stroke} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={c.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const kpiCards = [
    {
      label: 'Total Leads',
      value: kpis?.total_leads ?? 0,
      icon: Target,
      trend: null,
      sparkline: kpis?.sparklines?.leads,
      color: 'indigo' as const
    },
    {
      label: 'New Customers',
      value: kpis?.total_customers ?? 0,
      icon: Users,
      trend: null,
      sparkline: kpis?.sparklines?.customers,
      color: 'violet' as const
    },
    {
      label: 'Active Bookings',
      value: kpis?.active_bookings ?? 0,
      icon: Calendar,
      trend: null,
      sparkline: kpis?.sparklines?.bookings,
      color: 'emerald' as const
    },
    {
      label: 'Jobs Today',
      value: kpis?.jobs_today ?? 0,
      icon: Briefcase,
      trend: null,
      color: 'blue' as const
    },
    {
      label: 'Invoice Revenue (MTD)',
      value: canSeeRevenue
        ? (kpis?.monthly_revenue_trend && kpis.monthly_revenue_trend[11] 
            ? `₹${Math.round(Number(kpis.monthly_revenue_trend[11].revenue)).toLocaleString('en-IN')}` 
            : '₹0')
        : '—',
      icon: DollarSign,
      trend: null,
      color: 'emerald' as const
    },
  ];



  // serviceBreakdown now comes directly from the real API (ALL bookings, not just last 5)
  const serviceBreakdown = serviceDistribution;

  // Consolidated tab datasets
  const filteredTabData = useMemo(() => {
    const q = logsSearch.toLowerCase();
    if (activeTab === 'bookings') {
      const data = upcomingBookings.map((b: any) => ({
        id: b.booking_id || `BK-${b.id.slice(0, 4).toUpperCase()}`,
        name: b.customer_name || 'Customer',
        detail: b.service_name || 'Service Call',
        date: format(new Date(b.scheduled_date), 'dd MMM, hh:mm a'),
        status: b.status || 'Pending',
        raw: b
      }));
      if (!q) return data;
      return data.filter((d: any) => 
        d.id.toLowerCase().includes(q) || 
        d.name.toLowerCase().includes(q) || 
        d.detail.toLowerCase().includes(q)
      );
    } else if (activeTab === 'jobs') {
      const data = recentJobs.map((j: any) => ({
        id: j.job_id || `JOB-${j.id.slice(0, 4).toUpperCase()}`,
        name: j.booking?.customer_name || j.booking?.customer?.name || 'Unknown Customer',
        detail: j.booking?.service_name || j.booking?.service?.name || 'Service Job',
        date: j.scheduled_start ? format(new Date(j.scheduled_start), 'dd MMM, hh:mm a') : 'Unscheduled',
        status: j.status || 'Assigned',
        raw: j
      }));
      if (!q) return data;
      return data.filter((d: any) => 
        d.id.toLowerCase().includes(q) || 
        d.name.toLowerCase().includes(q) || 
        d.detail.toLowerCase().includes(q)
      );
    } else {
      const data = latestLeads.map((l: any) => ({
        id: `LD-${l.id.slice(0, 4).toUpperCase()}`,
        name: l.name || l.phone || 'Lead',
        detail: `Source: ${l.source || 'Direct'}`,
        date: l.phone || 'No Contact', 
        status: l.status || 'New',
        raw: l
      }));
      if (!q) return data;
      return data.filter((d: any) => 
        d.id.toLowerCase().includes(q) || 
        d.name.toLowerCase().includes(q) || 
        d.detail.toLowerCase().includes(q)
      );
    }
  }, [activeTab, upcomingBookings, recentJobs, latestLeads, logsSearch]);

  // Recent transactions mapping (matches reference layout)
  const recentTransactions = useMemo(() => {
    return transactionList.map((b: any) => ({
      id: b.booking_id || `BK-${b.id.slice(0, 4).toUpperCase()}`,
      customer: b.customer_name || 'Anonymous Client',
      product: b.service_name || 'General Operations',
      status: b.status || 'Completed',
      qty: 1,
      unitPrice: b.base_price ? `₹${Number(b.base_price).toLocaleString('en-IN')}` : '₹0',
      totalRevenue: b.final_amount ? `₹${Number(b.final_amount).toLocaleString('en-IN')}` : '₹0',
      rawRow: b,
    }));
  }, [transactionList]);

  const filteredTransactions = useMemo(() => {
    if (!tableSearch.trim()) return recentTransactions;
    const q = tableSearch.toLowerCase();
    return recentTransactions.filter((t: any) => 
      t.customer.toLowerCase().includes(q) || 
      t.product.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }, [recentTransactions, tableSearch]);


  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-[25px] font-extrabold text-slate-900 tracking-tight leading-tight">Operations Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Last Updated: {format(new Date(), 'h:mm a')}
            </span>
            <span className="text-xs font-bold bg-white border border-slate-200/80 px-3 h-9 rounded-lg text-slate-600 flex items-center gap-1.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-slate-450" />
              {format(new Date(), 'd MMM yyyy')}
            </span>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-5">
          {kpisLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-slate-200/50 rounded-xl bg-white min-h-[96px] animate-pulse">
                  <CardContent className="p-4 flex flex-col justify-between h-[68px]">
                    <div className="h-3 bg-slate-100 rounded w-16" />
                    <div className="h-8 bg-slate-100 rounded w-20" />
                  </CardContent>
                </Card>
              ))
            : kpiCards.map((card) => {
                return (
                  <Card key={card.label} className="shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-slate-200/60 rounded-xl bg-white hover:shadow-md hover:border-slate-300 transition-all duration-200">
                    <CardContent className="p-4 flex justify-between items-center min-h-[96px] relative overflow-hidden">
                      <div className="flex flex-col justify-between h-[68px]">
                        <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider leading-none">
                          {card.label}
                        </span>
                        <span className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none my-1">{card.value}</span>
                        <div className="flex items-center">
                          {card.trend ? (
                            <span className="inline-flex items-center text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-100/50 leading-none">
                              {card.trend}
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-400/80 font-semibold flex items-center gap-1 leading-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                              Updated today
                            </span>
                          )}
                        </div>
                      </div>
                      {card.sparkline && (
                        <div className="w-16 h-8 shrink-0 flex items-center justify-end">
                          {renderSmoothSparkline(card.sparkline, card.color)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Row 2: Sales Trend vs Revenue Breakdown */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-sm border border-slate-200/60 rounded-xl bg-white lg:h-[265px] flex flex-col hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <CardHeader className="px-4 py-2.5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  <CardTitle className="text-[12px] font-semibold text-slate-800">Invoice Revenue (Last 12 Months)</CardTitle>
                </div>
                <div className="flex items-center gap-2.5 text-[8.5px] font-semibold text-slate-500 uppercase tracking-wider border-l border-slate-200 pl-3">
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-sm bg-slate-800"></div> Total</div>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-sm bg-emerald-500"></div> Collected</div>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-sm bg-rose-500"></div> Due</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-3 flex-1 flex flex-col justify-between relative">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-slate-900 tracking-tight leading-none">
                  ₹{(kpis?.monthly_revenue_trend?.reduce((s: number, m: any) => s + m.revenue, 0) ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Custom SVG Column Bars */}
              <div className="relative flex justify-between items-end h-[140px] pt-2 border-b border-slate-200 pr-12">
                {/* Horizontal dashed backdrop lines to mimic professional charts */}
                <div className="absolute inset-x-0 top-2 bottom-0.5 flex flex-col justify-between pointer-events-none z-0 pr-12">
                  <div className="border-b border-dashed border-slate-200/80 w-full relative">
                    <span className="absolute right-[-48px] text-[7.5px] font-bold text-slate-400/80 leading-none -translate-y-1/2">{formatYAxisLabel(maxRevenueValue)}</span>
                  </div>
                  <div className="border-b border-dashed border-slate-200/80 w-full relative">
                    <span className="absolute right-[-48px] text-[7.5px] font-bold text-slate-400/80 leading-none -translate-y-1/2">{formatYAxisLabel(maxRevenueValue / 2)}</span>
                  </div>
                  <div className="w-full relative">
                    <span className="absolute right-[-48px] text-[7.5px] font-bold text-slate-400/80 leading-none -translate-y-1/2">₹0</span>
                  </div>
                </div>

                {(!kpis?.monthly_revenue_trend || kpis.monthly_revenue_trend.length === 0) ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <EmptyWidget 
                       icon={Activity} 
                       title="No trend data available" 
                       description="Historical monthly revenue trends will appear here once aggregated." 
                       compact
                    />
                  </div>
                ) : (
                  kpis.monthly_revenue_trend.map((d: any) => (
                    <div key={d.month} className="flex flex-col items-center flex-1 group z-10">
                      <div className="w-full flex items-end justify-center gap-[2px] h-[115px] px-[2px]">
                        <div 
                          className="w-1/3 max-w-[8px] bg-slate-800 rounded-t-sm transition-all hover:bg-slate-950"
                          style={{ height: d.revenuePct > 0 ? `${d.revenuePct}%` : '2px', minHeight: '2px' }}
                          title={`Total Revenue: ₹${d.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                        />
                        <div 
                          className="w-1/3 max-w-[8px] bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600"
                          style={{ height: d.collectionsPct > 0 ? `${d.collectionsPct}%` : '2px', minHeight: '2px' }}
                          title={`Collected: ₹${(d.collections || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                        />
                        <div 
                          className="w-1/3 max-w-[8px] bg-rose-500 rounded-t-sm transition-all hover:bg-rose-600"
                          style={{ height: d.outstandingPct > 0 ? `${d.outstandingPct}%` : '2px', minHeight: '2px' }}
                          title={`Due: ₹${(d.outstanding || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                        />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-400 mt-1.5 uppercase leading-none">{d.month}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="shadow-sm border border-slate-200/60 rounded-xl bg-white lg:h-[265px] flex flex-col hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <CardHeader className="px-4 py-2.5 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[12px] font-semibold text-slate-800">Service Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-3 flex-1 flex flex-col justify-between">
              {serviceBreakdown.length > 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider mb-0.5">Top Service</span>
                    <span className="text-[13px] font-bold text-slate-900 leading-tight capitalize">{serviceBreakdown[0]?.name}</span>
                    <div className="flex flex-col text-[10.5px] font-semibold text-slate-500 mt-0.5 leading-normal">
                      <span>{serviceBreakdown[0]?.count} Bookings</span>
                      <span>₹{(serviceBreakdown[0]?.revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Revenue</span>
                    </div>
                  </div>
                  <span className="text-[11.5px] bg-slate-200/80 text-slate-800 font-bold px-2 py-0.5 rounded">
                    {serviceBreakdown[0]?.pct}%
                  </span>
                </div>
              )}

              {/* Service Breakdown list */}
              <div className="space-y-2.5 mt-2 flex-1 flex flex-col justify-end pb-0.5">
                {serviceBreakdown.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-4">No active services to display breakdown.</div>
                ) : (
                  serviceBreakdown.slice(0, 3).map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3">
                      <span className="text-[11.5px] font-semibold text-slate-650 truncate w-[100px] capitalize">{item.name}</span>
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-slate-800 h-full rounded-full" 
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 w-8 text-right">{item.pct}%</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Tabbed Workspaces & System Activity Audit Feed */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Side: Consolidated Tabbed CRM Logs (2/3 width) */}
          <Card className="lg:col-span-2 shadow-sm border border-slate-200/60 rounded-xl bg-white overflow-hidden flex flex-col lg:h-[310px] hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <CardHeader className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs shrink-0">
                <button 
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${activeTab === 'bookings' ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  onClick={() => { setActiveTab('bookings'); setLogsSearch(''); }}
                >
                  Upcoming Bookings
                </button>
                {hasAccess('/jobs') && (
                  <button 
                    className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${activeTab === 'jobs' ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    onClick={() => { setActiveTab('jobs'); setLogsSearch(''); }}
                  >
                    Recent Jobs
                  </button>
                )}
                {hasAccess('/leads') && (
                  <button 
                    className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${activeTab === 'leads' ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    onClick={() => { setActiveTab('leads'); setLogsSearch(''); }}
                  >
                    Latest Leads
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">

                <Button 
                  onClick={() => {
                    if (activeTab === 'bookings') navigate('/bookings');
                    else if (activeTab === 'jobs') navigate('/jobs');
                    else navigate('/leads/new');
                  }}
                  className="h-9 px-3.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-none flex items-center gap-1.5 shrink-0"
                >
                  {activeTab === 'leads' ? <Plus className="w-3.5 h-3.5" /> : null}
                  {activeTab === 'bookings' ? 'Manage Bookings' : activeTab === 'jobs' ? 'Manage Jobs' : 'Add Lead'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 overflow-auto flex flex-col justify-between">
              <div className="min-w-full flex-1">
                {((activeTab === 'bookings' && bookingsLoading) || (activeTab === 'jobs' && jobsLoading) || (activeTab === 'leads' && leadsLoading)) ? (
                  <div className="p-4 space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-8 bg-slate-50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : filteredTabData.length === 0 ? (
                  <EmptyWidget 
                    icon={activeTab === 'bookings' ? Calendar : activeTab === 'jobs' ? Briefcase : Target} 
                    title={`No ${activeTab} records`} 
                    description={`There are currently no active ${activeTab} records matching your dashboard filters.`} 
                    compact
                  />
                ) : (
                  <>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 w-28 uppercase tracking-wider">{activeTab === 'bookings' ? 'Booking' : activeTab === 'jobs' ? 'Job' : 'Lead'}</th>
                          <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 uppercase tracking-wider">Customer</th>
                          <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 uppercase tracking-wider">Service</th>
                          <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 uppercase tracking-wider">{activeTab === 'leads' ? 'Contact' : 'Schedule'}</th>
                          <th className="text-[10px] font-semibold text-slate-455 py-2.5 px-4 w-32 uppercase tracking-wider">Status</th>
                          <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 w-16 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                        {filteredTabData.slice(0, 5).map((row: any) => (
                          <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2 px-4 font-mono text-[11px] font-medium text-slate-500">{row.id}</td>
                            <td className="py-2 px-4 font-semibold text-slate-900 text-xs">{row.name}</td>
                            <td className="py-2 px-4 text-slate-500 text-xs">{row.detail}</td>
                            <td className="py-2 px-4 text-slate-500 text-xs">
                              {row.date ?? <span className="text-slate-300">—</span>}
                            </td>
                            <td className="py-2 px-4">
                              <StatusBadge status={getStatusColor(row.status)} label={row.status} />
                            </td>
                            <td className="py-2 px-4 text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-6 w-6 p-0 rounded hover:bg-slate-100">
                                    <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="text-xs">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      if (activeTab === 'bookings') navigate(`/bookings/${row.raw.id}`);
                                      else if (activeTab === 'jobs') navigate(`/jobs/${row.raw.id}`);
                                      else navigate(`/leads/${row.raw.id}`);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Side: System Activity Audit Feed (1/3 width) */}
          <Card className="shadow-sm border border-slate-200/60 rounded-xl bg-white overflow-hidden flex flex-col lg:h-[310px] hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <CardHeader className="px-4 py-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="text-[12px] font-semibold text-slate-800">
                  System Activity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-3.5 flex-1 overflow-y-auto">
              {activityLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 bg-slate-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <EmptyWidget 
                  icon={Activity} 
                  title="No recent activity" 
                  description="Audit trail events will appear here once bookings or jobs are created." 
                  compact
                />
              ) : (
                <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-5 text-[12px] py-1">
                  {activity.slice(0, 5).map((item: any, i: number) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[22px] top-[5px] flex items-center justify-center">
                        {getActivityIcon(item)}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight text-[12.5px] capitalize">
                          {item.type} {item.to.toLowerCase()}
                        </p>
                        {item.ref && (
                          <p className="text-[11px] text-slate-500 font-mono mt-1 leading-none">
                            {item.ref}
                          </p>
                        )}
                        <div className="flex flex-col gap-1 mt-2.5">
                          <span className="text-[11.5px] text-slate-700 font-medium leading-none">{formatActor(item.actor)}</span>
                          <span className="text-[10.5px] text-slate-400 leading-none">{format(new Date(item.at), 'd MMM • h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Row 4: Recent Invoices Card at the very bottom */}
        <Card className="shadow-sm border border-slate-200/60 rounded-xl bg-white overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200">
          <CardHeader className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center">
              <CardTitle className="text-[12px] font-semibold text-slate-800">Recent Invoices</CardTitle>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search invoices..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 h-9 rounded-lg text-xs bg-white border-slate-300 shadow-none focus-visible:ring-1 focus-visible:ring-slate-700 w-full"
                />
              </div>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 border border-slate-205 flex items-center justify-center shrink-0">
                <MoreHorizontal className="h-4 w-4 text-slate-550" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {transactionsLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 bg-slate-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <EmptyWidget 
                  icon={DollarSign} 
                  title="No recent invoices" 
                  description="Recent completed financial invoices will appear here." 
                  compact
                />
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 w-28 uppercase tracking-wider">Booking</th>
                      <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 uppercase tracking-wider">Customer</th>
                      <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 uppercase tracking-wider">Service</th>
                      <th className="text-[10px] font-semibold text-slate-455 py-2.5 px-4 w-32 uppercase tracking-wider">Status</th>
                      <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 w-28 text-right uppercase tracking-wider">Unit Price</th>
                      <th className="text-[10px] font-semibold text-slate-455 py-2.5 px-4 w-32 text-right uppercase tracking-wider">Amount</th>
                      <th className="text-[10px] font-semibold text-slate-450 py-2.5 px-4 w-16 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredTransactions.slice(0, 5).map((row: any) => (
                      <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-1.5 px-4 font-mono text-[11px] font-medium text-slate-500">{row.id}</td>
                        <td className="py-1.5 px-4 font-semibold text-slate-900 text-xs">{row.customer}</td>
                        <td className="py-1.5 px-4 text-slate-500 text-xs">{row.product}</td>
                        <td className="py-1.5 px-4">
                          <StatusBadge status={getStatusColor(row.status)} label={row.status} />
                        </td>
                        <td className="py-1.5 px-4 text-right text-slate-700 text-xs">{row.unitPrice}</td>
                        <td className="py-1.5 px-4 text-right font-semibold text-slate-900 text-xs">{row.totalRevenue}</td>
                        <td className="py-1.5 px-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 rounded hover:bg-slate-100">
                                <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs">
                              <DropdownMenuItem 
                                onClick={() => {
                                  if (row.rawRow?.id) {
                                    navigate(`/bookings/${row.rawRow.id}`);
                                  } else {
                                    navigate('/bookings');
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

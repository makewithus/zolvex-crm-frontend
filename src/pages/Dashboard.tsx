import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, Calendar, Plus, Activity, Star, ChevronRight, Server, ShieldCheck, Mail, Database, Zap } from 'lucide-react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '@/features/leads/hooks/useLeads';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: leadsResponse } = useLeads();
  const recentLeads = (leadsResponse?.data || []).slice(0, 5);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <PageHeader 
          title="Overview" 
          description="Monitor your CRM pipeline, bookings, and revenue metrics." 
        />
        <div className="flex gap-2">
          <Button onClick={() => navigate('/leads/new')} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> New Lead
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" /> New Booking
          </Button>
        </div>
      </div>
      
      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-sm border-border/40 hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">1,248</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/40 hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-full">
              <Star className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">856</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40 hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">142</div>
            <p className="text-xs text-orange-600 font-medium flex items-center mt-1">
              <Zap className="h-3 w-3 mr-1" /> 12 require assignment
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40 hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (MTD)</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">$45,231</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +18% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12 mb-6">
        
        {/* Main Charts Area */}
        <Card className="md:col-span-8 shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <CardDescription>Monthly recurring and transactional revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-end justify-between gap-2 pt-4">
              {/* CSS Bar Chart Placeholder */}
              {[40, 55, 30, 70, 85, 45, 60, 95, 80, 100, 75, 90].map((val, i) => (
                <div key={i} className="relative flex flex-col justify-end items-center flex-1 h-full group">
                  <div className="w-full bg-primary/20 rounded-t-md transition-all duration-300 group-hover:bg-primary/50 relative" style={{ height: `${val}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity z-10 whitespace-nowrap">
                      ${(val * 450).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-2 block w-full text-center border-t pt-2 font-medium">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="md:col-span-4 shadow-sm border-border/40 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">System Health</CardTitle>
            <CardDescription>Infrastructure & Services</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-full"><Database className="h-4 w-4 text-emerald-600" /></div>
                  <span className="text-sm font-medium">Database (Prisma)</span>
                </div>
                <StatusBadge status="success" label="Operational" />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-full"><Server className="h-4 w-4 text-emerald-600" /></div>
                  <span className="text-sm font-medium">API Server</span>
                </div>
                <StatusBadge status="success" label="Operational" />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-full"><ShieldCheck className="h-4 w-4 text-emerald-600" /></div>
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <StatusBadge status="success" label="Operational" />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-full"><Mail className="h-4 w-4 text-blue-600" /></div>
                  <span className="text-sm font-medium">Email Gateway</span>
                </div>
                <StatusBadge status="info" label="Processing" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Latest Leads */}
        <Card className="md:col-span-8 shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Latest Leads</CardTitle>
              <CardDescription>Recently acquired prospects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>View All</Button>
          </CardHeader>
          <CardContent>
            {recentLeads.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Contact</th>
                      <th className="px-4 py-3 text-left font-medium">Source</th>
                      <th className="px-4 py-3 text-left font-medium">Stage</th>
                      <th className="px-4 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium">{lead.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status="default" label={lead.source} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={lead.status === 'Lost' ? 'error' : lead.status === 'Booked' ? 'success' : 'info'} label={lead.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/leads/${lead.id}`)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-secondary/20 rounded-lg border border-dashed">
                <Users className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-semibold text-sm">No recent leads</h3>
                <p className="text-xs text-muted-foreground mt-1">Your pipeline is currently empty.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings & Activity */}
        <div className="md:col-span-4 space-y-6">
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upcoming Bookings</CardTitle>
              <CardDescription>Next 48 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center bg-secondary/20 rounded-lg border border-dashed">
                <Calendar className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-semibold text-sm">Schedule clear</h3>
                <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                  Once bookings are confirmed, they will appear here.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[
                  { time: '10m ago', text: 'Sarah marked Lead #482 as Booked', icon: Activity, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-200' },
                  { time: '1h ago', text: 'New Customer profile auto-generated', icon: Users, color: 'text-blue-600 bg-blue-500/10 border-blue-200' },
                  { time: '2h ago', text: 'City Manager assigned 5 leads', icon: ChevronRight, color: 'text-orange-600 bg-orange-500/10 border-orange-200' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-md border ${activity.color}`}>
                      <activity.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-medium leading-tight">{activity.text}</p>
                      <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

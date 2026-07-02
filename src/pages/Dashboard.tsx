import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, Calendar, Plus, Activity, Star, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

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
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-emerald-500 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <Star className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-emerald-500 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">Requires assignment: 12</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-emerald-500 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Main Charts Area */}
        <Card className="md:col-span-4 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-end justify-between gap-2 pt-4">
              {/* Fake CSS Chart */}
              {[40, 55, 30, 70, 85, 45, 60, 95, 80, 100, 75, 90].map((val, i) => (
                <div key={i} className="relative flex flex-col justify-end items-center flex-1 h-full group">
                  <div className="w-full bg-primary/20 rounded-t-sm transition-all duration-300 group-hover:bg-primary/40 relative" style={{ height: `${val}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-foreground text-background text-[10px] px-2 py-1 rounded transition-opacity">
                      ${(val * 450).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-2 block w-full text-center border-t pt-1">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Funnel */}
        <Card className="md:col-span-3 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
            <CardDescription>Current stage distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">New</span>
                <span className="font-bold">450</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-full rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Contacted</span>
                <span className="font-bold">280</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[75%] rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Qualified</span>
                <span className="font-bold">120</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[50%] rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Booked</span>
                <span className="font-bold">85</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[25%] rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-4 shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across your team</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              {[
                { time: '10m ago', text: 'Sarah marked Lead #482 as Booked', icon: Activity, color: 'text-emerald-500 bg-emerald-500/10' },
                { time: '1h ago', text: 'New Customer profile auto-generated for John Doe', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
                { time: '2h ago', text: 'City Manager assigned 5 leads to Field Team Alpha', icon: ChevronRight, color: 'text-orange-500 bg-orange-500/10' },
                { time: 'Yesterday', text: 'Invoice #1094 paid in full', icon: DollarSign, color: 'text-primary bg-primary/10' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="md:col-span-3 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Next 48 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Use empty state since we have no real bookings yet */}
              <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-lg border border-dashed">
                <Calendar className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-semibold text-sm">No upcoming bookings</h3>
                <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                  Once bookings are confirmed, they will appear here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

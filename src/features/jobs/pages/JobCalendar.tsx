import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCalendarJobs } from '../hooks/useJobs';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { CalendarKPIs } from '../components/CalendarKPIs';
import { JOB_STATUS_COLORS } from '../constants/job-colors';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, Globe, EyeOff, Eye } from 'lucide-react';
import { Job } from '../types/job.types';
import { BUSINESS_HOURS } from '@/config/business-hours';

// Calendar config derives from the single shared Business Hours config
const START_HOUR = BUSINESS_HOURS.START_HOUR;
const END_HOUR = BUSINESS_HOURS.END_HOUR;
const PIXELS_PER_MINUTE = 2;

export const JobCalendar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Timezone indicator
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isDev = import.meta.env.DEV;

  // URL-synced state
  const currentDateParam = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const cityId = searchParams.get('city') || '';
  const searchQuery = searchParams.get('search') || '';
  // Priority 3: Show Cancelled toggle — hidden by default, persists in URL
  const showCancelled = searchParams.get('show_cancelled') === 'true';

  const filters = {
    start_date: startOfDay(parseISO(currentDateParam)).toISOString(),
    end_date: endOfDay(parseISO(currentDateParam)).toISOString(),
    ...(cityId ? { city_id: cityId } : {}),
  };

  const { data: calendarData, isLoading, error } = useCalendarJobs(filters);
  const allJobs = calendarData?.jobs || [];
  const kpis = calendarData?.kpis;

  const handleDateChange = (days: number) => {
    const d = parseISO(currentDateParam);
    d.setDate(d.getDate() + days);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('date', format(d, 'yyyy-MM-dd'));
    setSearchParams(newParams);
  };

  const toggleShowCancelled = () => {
    const p = new URLSearchParams(searchParams);
    if (showCancelled) p.delete('show_cancelled');
    else p.set('show_cancelled', 'true');
    setSearchParams(p);
  };

  // Group Jobs by Technician, applying search and cancelled filter
  const { lanes, unassignedJobs, activeJobCount } = useMemo(() => {
    let filteredJobs = allJobs;

    // Priority 3: Filter out cancelled jobs unless show_cancelled is active
    if (!showCancelled) {
      filteredJobs = filteredJobs.filter(j => j.status !== 'Cancelled');
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(j =>
        j.job_id.toLowerCase().includes(q) ||
        j.booking?.customer_name?.toLowerCase().includes(q)
      );
    }

    const techMap = new Map<string, { id: string, name: string, jobs: Job[] }>();
    const unassigned: Job[] = [];
    let activeCount = 0;

    filteredJobs.forEach(job => {
      if (job.status !== 'Cancelled') activeCount++;
      if (!job.assigned_user_id) {
        unassigned.push(job);
      } else {
        if (!techMap.has(job.assigned_user_id)) {
          techMap.set(job.assigned_user_id, {
            id: job.assigned_user_id,
            name: job.assignedUser?.name || 'Unknown Tech',
            jobs: []
          });
        }
        techMap.get(job.assigned_user_id)!.jobs.push(job);
      }
    });

    return { lanes: Array.from(techMap.values()), unassignedJobs: unassigned, activeJobCount: activeCount };
  }, [allJobs, searchQuery, showCancelled]);

  const hours: number[] = [];
  for (let i = START_HOUR; i <= END_HOUR; i++) {
    hours.push(i);
  }

  const renderJobCard = (job: Job) => {
    const isCancelled = job.status === 'Cancelled';
    const start = new Date(job.scheduled_start);
    const minutesFromStart = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
    const top = minutesFromStart * PIXELS_PER_MINUTE;
    const height = Math.max((job.estimated_duration_minutes || 60) * PIXELS_PER_MINUTE, 24);
    const colors = JOB_STATUS_COLORS[job.status] || JOB_STATUS_COLORS.Pending;

    return (
      <div
        key={job.id}
        // Priority 3: Cancelled cards are non-interactive (no onClick, no hover ring)
        onClick={isCancelled ? undefined : () => navigate(`/jobs/${job.id}`)}
        role={isCancelled ? undefined : 'button'}
        aria-label={isCancelled ? `Cancelled: ${job.job_id}` : `Open ${job.job_id}`}
        className={[
          'absolute left-1 right-1 rounded-md p-1.5 overflow-hidden shadow-sm transition-all',
          // Premium Cancelled: striped background via inline style, subtle border
          isCancelled 
            ? `border border-slate-300 cursor-not-allowed` 
            : `border ${colors.border} ${colors.bg} cursor-pointer hover:ring-2 ring-primary/50`,
        ].join(' ')}
        style={{ 
          top: `${top}px`, 
          height: `${height}px`,
          ...(isCancelled ? {
            backgroundImage: 'repeating-linear-gradient(45deg, #f8fafc, #f8fafc 8px, #f1f5f9 8px, #f1f5f9 16px)'
          } : {})
        }}
        title={isCancelled ? `CANCELLED: ${job.job_id}` : `${job.job_id} — ${job.booking?.customer_name}`}
      >
        {isCancelled && (
          <div className="absolute top-1.5 right-1.5 bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm z-10">
            CANCELLED
          </div>
        )}
        <div className={`text-xs font-semibold truncate ${isCancelled ? 'text-slate-500 pr-10 relative z-10' : colors.text}`}>
          {job.job_id}
        </div>
        <div className={`text-xs font-medium truncate ${isCancelled ? 'text-slate-500 relative z-10' : ''}`}>
          {job.booking?.customer_name}
        </div>
        {height >= 50 && (
          <div className={`text-xs truncate ${isCancelled ? 'text-slate-400 relative z-10 mt-0.5' : 'text-slate-400 mt-0.5'}`}>
            {job.booking?.service_name} · {format(start, 'HH:mm')} ({job.estimated_duration_minutes}m)
          </div>
        )}
      </div>
    );
  };

  const gridHeight = (END_HOUR - START_HOUR + 1) * 60 * PIXELS_PER_MINUTE;

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <PageHeader title="Dispatch Calendar" />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center flex-shrink-0">
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleDateChange(-1)} aria-label="Previous day">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold w-44 text-center text-slate-800">
            {format(parseISO(currentDateParam), 'EEEE, MMM d')}
          </div>
          <Button variant="outline" size="icon" onClick={() => handleDateChange(1)} aria-label="Next day">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const p = new URLSearchParams(searchParams);
            p.set('date', format(new Date(), 'yyyy-MM-dd'));
            setSearchParams(p);
          }}>Today</Button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Timezone indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-200">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span><strong>{userTimezone}</strong></span>
          </div>

          {/* Show Cancelled Toggle — Priority 3 */}
          <Button
            variant={showCancelled ? 'default' : 'outline'}
            size="sm"
            onClick={toggleShowCancelled}
            aria-pressed={showCancelled}
            className="gap-1.5"
          >
            {showCancelled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {showCancelled ? 'Hide Cancelled' : 'Show Cancelled'}
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search ID or Customer..."
              className="pl-9 w-[240px]"
              value={searchQuery}
              onChange={(e) => {
                const p = new URLSearchParams(searchParams);
                if (e.target.value) p.set('search', e.target.value);
                else p.delete('search');
                setSearchParams(p);
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <CalendarKPIs kpis={kpis} />

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-10 flex justify-center text-slate-500 text-sm">Loading calendar data…</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 text-sm">Failed to load calendar. Please try again.</div>
        ) : (
          <div className="flex" style={{ minWidth: `${80 + (1 + lanes.length) * 250}px` }}>
            {/* Time Axis — sticky left */}
            <div className="w-20 flex-shrink-0 border-r border-slate-200 bg-slate-50 sticky left-0 z-20">
              <div className="h-12 border-b border-slate-200" />
              <div className="relative" style={{ height: `${gridHeight}px` }}>
                {hours.map(h => (
                  <div
                    key={h}
                    className="absolute w-full text-right pr-2 text-xs text-slate-400 -mt-2"
                    style={{ top: `${(h - START_HOUR) * 60 * PIXELS_PER_MINUTE}px` }}
                  >
                    {h.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Unassigned Lane */}
            <div className="flex-1 min-w-[250px] border-r border-slate-200 relative">
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center justify-center font-semibold text-sm text-slate-700 sticky top-0 z-10 shadow-sm">
                Unassigned ({unassignedJobs.length})
              </div>

              {/* Empty state banner */}
              {activeJobCount === 0 && !isLoading && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 pointer-events-none">
                  <div className="bg-slate-800 text-slate-100 text-sm px-4 py-2 rounded-full shadow-lg text-center">
                    <p>No active jobs for {format(parseISO(currentDateParam), 'EEEE, MMM d')}.</p>
                    {isDev && <p className="text-xs text-slate-400 mt-0.5">Dev: Check timezone boundary if jobs exist.</p>}
                  </div>
                </div>
              )}

              <div className="relative" style={{ height: `${gridHeight}px` }}>
                {hours.map(h => (
                  <div key={h} className="absolute w-full border-t border-slate-100" style={{ top: `${(h - START_HOUR) * 60 * PIXELS_PER_MINUTE}px` }} />
                ))}
                {unassignedJobs.map(renderJobCard)}
              </div>
            </div>

            {/* Technician Lanes */}
            {lanes.map(lane => (
              <div key={lane.id} className="flex-1 min-w-[250px] border-r border-slate-200 relative">
                <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center justify-center font-semibold text-sm text-slate-700 sticky top-0 z-10 shadow-sm">
                  {lane.name} ({lane.jobs.filter(j => j.status !== 'Cancelled').length})
                </div>
                <div className="relative" style={{ height: `${gridHeight}px` }}>
                  {hours.map(h => (
                    <div key={h} className="absolute w-full border-t border-slate-100" style={{ top: `${(h - START_HOUR) * 60 * PIXELS_PER_MINUTE}px` }} />
                  ))}
                  {lane.jobs.map(renderJobCard)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

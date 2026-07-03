import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCalendarJobs } from '../hooks/useJobs';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { CalendarKPIs } from '../components/CalendarKPIs';
import { JOB_STATUS_COLORS } from '../constants/job-colors';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Job } from '../types/job.types';

// Calendar Config
const START_HOUR = 8;
const END_HOUR = 20;
const PIXELS_PER_MINUTE = 2; // e.g., 60 mins = 120px

export const JobCalendar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL state
  const currentDateParam = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const cityId = searchParams.get('city') || '';
  const status = searchParams.get('status') || '';
  const searchQuery = searchParams.get('search') || '';

  const filters = {
    start_date: startOfDay(parseISO(currentDateParam)).toISOString(),
    end_date: endOfDay(parseISO(currentDateParam)).toISOString(),
    ...(cityId ? { city_id: cityId } : {}),
    ...(status ? { status } : {}),
  };

  const { data: calendarData, isLoading, error } = useCalendarJobs(filters);
  const jobs = calendarData?.jobs || [];
  const kpis = calendarData?.kpis;

  // Change Date
  const handleDateChange = (days: number) => {
    const d = parseISO(currentDateParam);
    d.setDate(d.getDate() + days);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('date', format(d, 'yyyy-MM-dd'));
    setSearchParams(newParams);
  };

  // Group Jobs by Technician
  const { lanes, unassignedJobs } = useMemo(() => {
    let filteredJobs = jobs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredJobs = jobs.filter(j => 
        j.job_id.toLowerCase().includes(q) || 
        j.booking?.customer_name?.toLowerCase().includes(q)
      );
    }

    const techMap = new Map<string, { id: string, name: string, jobs: Job[] }>();
    const unassigned: Job[] = [];

    filteredJobs.forEach(job => {
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

    return { lanes: Array.from(techMap.values()), unassignedJobs: unassigned };
  }, [jobs, searchQuery]);

  // Generate Hours
  const hours: number[] = [];
  for (let i = START_HOUR; i <= END_HOUR; i++) {
    hours.push(i);
  }

  const renderJobCard = (job: Job) => {
    const start = new Date(job.scheduled_start);
    const minutesFromStart = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
    const top = minutesFromStart * PIXELS_PER_MINUTE;
    const height = (job.estimated_duration_minutes || 60) * PIXELS_PER_MINUTE;

    const colors = JOB_STATUS_COLORS[job.status] || JOB_STATUS_COLORS.Pending;

    return (
      <div 
        key={job.id}
        onClick={() => navigate(`/jobs/${job.id}`)}
        className={`absolute left-1 right-1 rounded-md border p-2 overflow-hidden shadow-sm cursor-pointer hover:ring-2 ring-primary/50 transition-all ${colors.bg} ${colors.border}`}
        style={{ top: `${top}px`, height: `${height}px` }}
        title={`${job.job_id} - ${job.booking?.customer_name}`}
      >
        <div className={`text-xs font-semibold ${colors.text} truncate`}>{job.job_id}</div>
        <div className="text-sm font-medium truncate">{job.booking?.customer_name}</div>
        <div className="text-xs text-slate-500 truncate">{job.booking?.service_name} • {job.booking?.city_name}</div>
        <div className="text-xs font-medium mt-1 truncate">{format(start, 'HH:mm')} ({job.estimated_duration_minutes}m)</div>
      </div>
    );
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <PageHeader title="Dispatch Calendar" />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleDateChange(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold w-40 text-center">
            {format(parseISO(currentDateParam), 'EEEE, MMM d')}
          </div>
          <Button variant="outline" size="icon" onClick={() => handleDateChange(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => {
            const p = new URLSearchParams(searchParams);
            p.set('date', format(new Date(), 'yyyy-MM-dd'));
            setSearchParams(p);
          }}>Today</Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search ID or Customer..." 
              className="pl-9 w-[250px]"
              value={searchQuery}
              onChange={(e) => {
                const p = new URLSearchParams(searchParams);
                if (e.target.value) p.set('search', e.target.value);
                else p.delete('search');
                setSearchParams(p);
              }}
            />
          </div>
          {/* Add City/Status filters here later */}
        </div>
      </div>

      <CalendarKPIs kpis={kpis} />

      {/* Main Calendar Grid */}
      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-10 flex justify-center text-slate-500">Loading calendar data...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500">Failed to load calendar. Please try again.</div>
        ) : (
          <div className="min-w-[1000px] flex border-b border-slate-200">
            {/* Timeline Axis */}
            <div className="w-20 flex-shrink-0 border-r border-slate-200 bg-slate-50 relative z-10 sticky left-0">
              <div className="h-12 border-b border-slate-200" /> {/* Header spacer */}
              <div className="relative" style={{ height: `${(END_HOUR - START_HOUR + 1) * 60 * PIXELS_PER_MINUTE}px` }}>
                {hours.map(h => (
                  <div key={h} className="absolute w-full text-right pr-2 text-xs text-slate-500 -mt-2" style={{ top: `${(h - START_HOUR) * 60 * PIXELS_PER_MINUTE}px` }}>
                    {h.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Unassigned Lane */}
            <div className="flex-1 min-w-[250px] border-r border-slate-200 relative">
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center justify-center font-semibold text-slate-700 sticky top-0 z-10 shadow-sm">
                Unassigned ({unassignedJobs.length})
              </div>
              <div className="relative" style={{ height: `${(END_HOUR - START_HOUR + 1) * 60 * PIXELS_PER_MINUTE}px` }}>
                {/* Grid Lines */}
                {hours.map(h => (
                  <div key={h} className="absolute w-full border-t border-slate-100" style={{ top: `${(h - START_HOUR) * 60 * PIXELS_PER_MINUTE}px` }} />
                ))}
                {unassignedJobs.map(renderJobCard)}
              </div>
            </div>

            {/* Technician Lanes */}
            {lanes.map(lane => (
              <div key={lane.id} className="flex-1 min-w-[250px] border-r border-slate-200 relative">
                <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center justify-center font-semibold text-slate-700 sticky top-0 z-10 shadow-sm">
                  {lane.name} ({lane.jobs.length})
                </div>
                <div className="relative" style={{ height: `${(END_HOUR - START_HOUR + 1) * 60 * PIXELS_PER_MINUTE}px` }}>
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

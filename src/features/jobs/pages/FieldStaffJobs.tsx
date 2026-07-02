import React from 'react';
import { useJobs } from '../hooks/useJobs';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// A mobile-friendly touch UI for Field Staff
export const FieldStaffJobs = () => {
  const { data: jobs, isLoading } = useJobs(); // Hook internally filters by assigned_user_id on backend if field staff
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-6 text-center">Loading jobs...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-primary text-primary-foreground px-4 py-6 shadow-md">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">Today's Schedule</p>
      </div>

      <div className="p-4 space-y-4">
        {jobs?.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-slate-100 shadow-sm">
            <CalendarIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No jobs assigned today.</p>
          </div>
        ) : (
          jobs?.map((job) => (
            <div 
              key={job.id} 
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Badge variant="outline" className="mb-2 bg-slate-50">{job.priority}</Badge>
                  <h3 className="font-bold text-lg text-slate-800">{job.booking?.service?.name || 'Service'}</h3>
                </div>
                <Badge className="capitalize text-xs">{job.status}</Badge>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{format(new Date(job.scheduled_start), 'h:mm a')}</span>
                  <span className="text-slate-400 mx-1">•</span>
                  <span>{job.estimated_duration_minutes} min</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="line-clamp-2">{job.booking?.address_line_1}, {job.booking?.area}</span>
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

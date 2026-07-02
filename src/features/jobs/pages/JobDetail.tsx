import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob, useUpdateJobStatus } from '../hooks/useJobs';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft, Clock, MapPin, User, FileText, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJob(id!);
  const updateStatus = useUpdateJobStatus();
  
  const userRole = localStorage.getItem('userRole') || 'Super Admin';
  const isFieldStaff = userRole === 'Field Staff';

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  // Simple sticky bottom bar logic for field staff progression
  const renderFieldStaffActions = () => {
    if (!isFieldStaff) return null;

    const btnClass = "w-full py-6 text-lg font-bold rounded-xl shadow-lg";

    if (job.status === 'Assigned') {
      return <Button className={btnClass} onClick={() => updateStatus.mutate({ id: job.id, data: { status: 'Accepted' } })}>Accept Job</Button>;
    }
    if (job.status === 'Accepted') {
      return <Button className={btnClass} onClick={() => updateStatus.mutate({ id: job.id, data: { status: 'Travelling' } })}>Start Travel</Button>;
    }
    if (job.status === 'Travelling') {
      return <Button className={btnClass} onClick={() => updateStatus.mutate({ id: job.id, data: { status: 'Arrived' } })}>I Have Arrived</Button>;
    }
    if (job.status === 'Arrived') {
      return <Button className={btnClass} onClick={() => updateStatus.mutate({ id: job.id, data: { status: 'Started' } })}>Start Work</Button>;
    }
    if (job.status === 'Started') {
      return (
        <div className="space-y-3">
          <Button variant="outline" className="w-full py-6 border-2 font-bold"><Camera className="mr-2 h-5 w-5"/> Upload Final Photos</Button>
          <Button className={btnClass} onClick={() => updateStatus.mutate({ id: job.id, data: { status: 'Completed', completionNotes: 'Work finished' } })}>Complete Job</Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={isFieldStaff ? "min-h-screen bg-slate-50 pb-32" : "p-6 max-w-5xl mx-auto"}>
      
      {/* Header */}
      <div className={isFieldStaff ? "bg-white px-4 py-4 border-b flex items-center gap-4 sticky top-0 z-10" : "flex items-center gap-4 mb-6"}>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className={isFieldStaff ? "h-10 w-10 bg-slate-100 rounded-full" : ""}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{job.job_id}</h1>
          <p className="text-sm text-muted-foreground">{job.booking?.service_name}</p>
        </div>
        <div className="ml-auto">
          <Badge className="text-sm px-3 py-1">{job.status}</Badge>
        </div>
      </div>

      <div className={isFieldStaff ? "p-4 space-y-4" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
        
        {/* Main Info */}
        <div className={`space-y-6 ${isFieldStaff ? '' : 'md:col-span-2'}`}>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><MapPin className="text-primary h-5 w-5"/> Location</h3>
            <p className="font-medium">{job.booking?.customer_name}</p>
            <p className="text-slate-600 mt-1">{job.booking?.address_line_1}, {job.booking?.area}</p>
            <p className="text-slate-600">{job.booking?.city_name}, {job.booking?.postal_code}</p>
            <div className="mt-4 pt-4 border-t">
               <a href={`tel:${job.booking?.customer_phone}`} className="text-primary font-medium hover:underline flex items-center gap-2">
                 📞 {job.booking?.customer_phone}
               </a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Clock className="text-primary h-5 w-5"/> Timeline</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Scheduled</p>
                <p className="font-medium">{format(new Date(job.scheduled_start), 'MMM dd, h:mm a')}</p>
              </div>
              <div>
                <p className="text-slate-500">Duration</p>
                <p className="font-medium">{job.estimated_duration_minutes} min</p>
              </div>
              {job.actual_start && (
                <div>
                  <p className="text-slate-500">Started</p>
                  <p className="font-medium">{format(new Date(job.actual_start), 'h:mm a')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Secondary Info */}
        <div className="space-y-6">
          {!isFieldStaff && (
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><User className="text-primary h-5 w-5"/> Assignment</h3>
              {job.assignedUser ? (
                <div>
                  <p className="font-medium">{job.assignedUser.name}</p>
                  <p className="text-sm text-slate-500">{job.assignedUser.phone}</p>
                </div>
              ) : (
                <p className="text-slate-500 italic">Unassigned</p>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl p-5 shadow-sm border">
             <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="text-primary h-5 w-5"/> Notes</h3>
             {job.internal_notes ? <p className="text-sm">{job.internal_notes}</p> : <p className="text-sm text-slate-500 italic">No notes provided</p>}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Actions for Field Staff */}
      {isFieldStaff && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          {renderFieldStaffActions()}
        </div>
      )}
    </div>
  );
};

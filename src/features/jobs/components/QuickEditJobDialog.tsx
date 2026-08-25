import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Job } from '../types/job.types';
import { useAssignJob } from '../hooks/useJobs';
import { useRescheduleBooking } from '../../bookings/hooks/useBookings';
import { useUsers } from '@/features/users/hooks/useUsers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface QuickEditJobDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickEditJobDialog = ({ job, isOpen, onClose }: QuickEditJobDialogProps) => {
  const navigate = useNavigate();
  const assignJob = useAssignJob();
  const rescheduleBooking = useRescheduleBooking();
  const { data: usersResponse } = useUsers();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [techId, setTechId] = useState('');

  useEffect(() => {
    if (job && isOpen) {
      const scheduled = new Date(job.scheduled_start);
      setDate(format(scheduled, 'yyyy-MM-dd'));
      setTime(format(scheduled, 'HH:mm'));
      setTechId(job.assigned_user_id || '');
    }
  }, [job, isOpen]);

  if (!job) return null;

  const handleSave = async () => {
    try {
      const originalScheduled = new Date(job.scheduled_start);
      const originalDate = format(originalScheduled, 'yyyy-MM-dd');
      const originalTime = format(originalScheduled, 'HH:mm');
      const originalTechId = job.assigned_user_id || '';

      let hasChanges = false;
      let errorOccurred = false;

      // Unassigning is not supported by the frontend yet, but if they change to a new tech:
      if (techId !== originalTechId && techId !== '') {
        try {
          await assignJob.mutateAsync({ id: job.id, data: { assigned_user_id: techId } });
          hasChanges = true;
        } catch (error: any) {
          errorOccurred = true;
          // The hook already shows a toast on error
        }
      }

      if (!errorOccurred && (date !== originalDate || time !== originalTime)) {
        try {
          const newDateTime = new Date(`${date}T${time}:00`).toISOString();
          await rescheduleBooking.mutateAsync({ 
            id: job.booking_id, 
            data: { scheduled_date: newDateTime, slot: time } 
          });
          hasChanges = true;
        } catch (error: any) {
          errorOccurred = true;
        }
      }

      if (hasChanges && !errorOccurred) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Edit: {job.job_id}</DialogTitle>
          <DialogDescription>
            Update assignment and schedule for this job.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Technician / Field Staff</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              value={techId} 
              onChange={e => setTechId(e.target.value)}
            >
              <option value="">Unassigned</option>
              {usersResponse?.data?.filter((u: any) => u.role?.name === 'Field Staff' || u.role?.name === 'Technician').map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center w-full sm:justify-between">
          <Button variant="ghost" onClick={() => navigate(`/jobs/${job.id}`)}>
            View Full Details
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={assignJob.isPending || rescheduleBooking.isPending}>
              {assignJob.isPending || rescheduleBooking.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

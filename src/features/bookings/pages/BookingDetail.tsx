import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { BookingCancelDialog } from '../components/BookingCancelDialog';
import { useCreateJob } from '@/features/jobs/hooks/useJobs';

export const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError } = useBooking(id!);
  const createJob = useCreateJob();
  
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') ?? '';

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center">Loading booking details...</div>;
  }

  if (isError || !booking) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">Booking not found or failed to load.</p>
        <Button variant="outline" onClick={() => navigate('/bookings')}>Back to Bookings</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/bookings')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{booking.booking_id}</h1>
              <Badge variant="outline">{booking.status}</Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">{booking.service_name} in {booking.city_name}</p>
          </div>
        </div>
        
        <div className="sm:ml-auto flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
            <>
              {booking.status !== 'Assigned' && booking.status !== 'InProgress' && (
                <Button 
                  variant="default" 
                  onClick={() => createJob.mutate({ bookingId: booking.id, priority: 'Normal' })}
                  disabled={createJob.isPending}
                  className="flex-1 sm:flex-none"
                >
                  {createJob.isPending ? 'Generating...' : 'Generate Job'}
                </Button>
              )}
              {/* Hide Cancel for Field Staff — backend enforces 403 but UI should not mislead */}
              {userRole !== 'Field Staff' && (
                <Button variant="destructive" onClick={() => setIsCancelOpen(true)} className="flex-1 sm:flex-none">
                  Cancel Booking
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 border-b">
              <h3 className="font-semibold leading-none tracking-tight">Schedule & Service</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                  {booking.slot && <p className="text-sm text-muted-foreground">{booking.slot}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Service Details</p>
                  <p className="text-sm text-muted-foreground">{booking.service_name}</p>
                  <p className="text-sm font-medium mt-1">₹{booking.final_amount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 border-b">
              <h3 className="font-semibold leading-none tracking-tight">Instructions & Notes</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium">Special Instructions</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {booking.special_instructions || 'None provided.'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Internal Notes</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {booking.notes || 'No notes.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 border-b">
              <h3 className="font-semibold leading-none tracking-tight">Customer Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{booking.customer_name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{booking.customer_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Service Address</p>
                  <p className="text-sm text-muted-foreground">{booking.address_line_1}</p>
                  {booking.address_line_2 && <p className="text-sm text-muted-foreground">{booking.address_line_2}</p>}
                  <p className="text-sm text-muted-foreground">{booking.city_name}, {booking.state} - {booking.postal_code}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 border-b">
              <h3 className="font-semibold leading-none tracking-tight">Timeline</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {booking.history?.map((event: any) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Status changed to {event.to_status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.changed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingCancelDialog 
        booking={booking} 
        isOpen={isCancelOpen} 
        onClose={() => setIsCancelOpen(false)} 
      />
    </div>
  );
};

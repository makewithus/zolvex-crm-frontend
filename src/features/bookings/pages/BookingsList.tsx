import { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, MoreHorizontal, Search, UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const BookingsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Minimal pagination for now
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading, isError } = useBookings({ page, limit, booking_id: searchTerm || undefined });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Scheduled': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'Assigned': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'InProgress': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Completed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Cancelled': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'NoShow': return 'bg-rose-100 text-rose-800 hover:bg-rose-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage and track service appointments.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Booking ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on search
            }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service & City</th>
                <th className="px-6 py-4 font-medium">Scheduled For</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Loading bookings...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-destructive">
                    Failed to load bookings. Please try again.
                  </td>
                </tr>
              ) : !data?.bookings?.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No bookings found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/bookings/${booking.id}`} className="font-medium text-primary hover:underline">
                        {booking.booking_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{booking.customer_name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{booking.customer_phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{booking.service_name}</p>
                          <p className="text-xs text-muted-foreground">{booking.city_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {new Date(booking.scheduled_date).toLocaleDateString()}
                          </p>
                          {booking.slot && (
                            <p className="text-xs text-muted-foreground">{booking.slot}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/bookings/${booking.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                            <DropdownMenuItem className="text-destructive">
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {(data?.total || 0) > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, data?.total || 0)}</span> of{' '}
              <span className="font-medium">{data?.total || 0}</span> bookings
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= (data?.total || 0)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

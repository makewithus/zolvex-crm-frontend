import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/axios';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Star, Plus, BarChart3 } from 'lucide-react';

const STAR_COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-blue-400', 'text-emerald-400'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} className={`h-3.5 w-3.5 ${n <= rating ? STAR_COLORS[rating] + ' fill-current' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  );
}

// ── Reusable inline searchable combobox ─────────────────────────────────────
interface ComboboxOption { id: string; label: string; sub?: string; }
interface InlineComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  disabled?: boolean;
}
function InlineCombobox({ options, value, onChange, placeholder, disabled }: InlineComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = options.find(o => o.id === value);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    (o.sub || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        disabled={disabled}
        placeholder={selected ? selected.label : placeholder}
        value={search}
        onFocus={() => setOpen(true)}
        onChange={e => {
          setSearch(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange('');
        }}
        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
      />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400">No results found</div>
            ) : (
              filtered.map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { onChange(o.id); setSearch(o.label); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-slate-50 flex flex-col ${o.id === value ? 'bg-slate-50 font-medium' : ''}`}
                >
                  <span className="text-slate-900 font-semibold">{o.label}</span>
                  {o.sub && <span className="text-slate-400 text-[10px]">{o.sub}</span>}
                </button>
              ))
            )}
          </div>
        </>
      )}
      {value && selected && (
        <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ {selected.label}</p>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function FeedbackList() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const [form, setForm] = useState({
    customer_id: '', booking_id: '', job_id: '',
    rating: 5, comment: ''
  });

  // ── Feedbacks list ────────────────────────────────────────────────────────
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const res = await api.get('/feedback');
      return res.data.data as any[];
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['feedback-stats'],
    queryFn: async () => {
      const res = await api.get('/feedback/stats');
      return res.data.data;
    },
    enabled: showStats,
  });

  // ── Dropdown data (only fetched when modal is open) ───────────────────────
  const { data: customersRaw } = useQuery({
    queryKey: ['customers-feedback-form'],
    queryFn: async () => {
      const res = await api.get('/customers');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
    enabled: isCreateOpen,
  });

  const { data: bookingsRaw } = useQuery({
    queryKey: ['bookings-feedback-form'],
    queryFn: async () => {
      // Booking service requires page + limit params; without them skip=NaN and returns 0 rows
      const res = await api.get('/bookings', { params: { page: 1, limit: 200 } });
      const payload = res.data?.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.bookings)) return payload.bookings;
      return [];
    },
    enabled: isCreateOpen,
  });

  const { data: jobsRaw } = useQuery({
    queryKey: ['jobs-feedback-form'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
    enabled: isCreateOpen,
  });

  const customerOptions: ComboboxOption[] = (customersRaw || []).map((c: any) => ({
    id: c.id,
    label: c.name || 'Unknown',
    sub: c.phone,
  }));

  const bookingOptions: ComboboxOption[] = (bookingsRaw || []).map((b: any) => ({
    id: b.id,
    label: b.booking_id || b.id,
    sub: b.service_name || b.customer_name || '',
  }));

  const jobOptions: ComboboxOption[] = (jobsRaw || []).map((j: any) => ({
    id: j.id,
    label: j.job_id || j.id,
    sub: `${j.booking?.service_name || ''} · ${j.status || ''}`.trim().replace(/^·\s*/, ''),
  }));

  // ── Mutation — payload shape IDENTICAL to before ─────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/feedback', data),
    onSuccess: () => {
      toast.success('Feedback recorded');
      setIsCreateOpen(false);
      setForm({ customer_id: '', booking_id: '', job_id: '', rating: 5, comment: '' });
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['feedback-stats'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to save feedback')
  });

  const handleSubmit = () => {
    if (!form.customer_id) { toast.error('Please select a customer.'); return; }
    const payload: any = { customer_id: form.customer_id, rating: form.rating };
    if (form.booking_id)     payload.booking_id = form.booking_id;
    if (form.job_id)         payload.job_id     = form.job_id;
    if (form.comment.trim()) payload.comment    = form.comment.trim();
    createMutation.mutate(payload);
  };

  // ── Table ─────────────────────────────────────────────────────────────────
  const list = feedbacks || [];
  const totalPages = Math.max(1, Math.ceil(list.length / limit));
  const paged = list.slice((page - 1) * limit, page * limit);

  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      cell: (row: any) => (
        <div>
          <p className="font-medium text-sm">{row.customer?.name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">{row.customer?.phone}</p>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      cell: (row: any) => (
        <div className="flex flex-col gap-0.5">
          <StarRating rating={row.rating} />
          <span className="text-xs text-muted-foreground">{row.rating} / 5</span>
        </div>
      )
    },
    {
      key: 'comment',
      header: 'Comment',
      cell: (row: any) => <span className="text-sm text-muted-foreground">{row.comment || '—'}</span>
    },
    {
      key: 'reference',
      header: 'Reference',
      cell: (row: any) => (
        <div className="text-xs text-muted-foreground space-y-0.5">
          {row.booking && <p>Booking: {row.booking.booking_id}</p>}
          {row.job && <p>Job: {row.job.job_id}</p>}
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Date',
      cell: (row: any) => <span className="text-xs text-muted-foreground">{format(new Date(row.created_at), 'dd MMM yyyy')}</span>
    }
  ];

  return (
    <PageContainer>
      <PageHeader title="Customer Feedback" description="Satisfaction ratings and comments collected after service.">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStats(s => !s)}>
            <BarChart3 className="h-4 w-4 mr-1" />{showStats ? 'Hide Stats' : 'View Stats'}
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Record Feedback</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Customer Feedback</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">

                {/* Customer */}
                <FormGroup label="Customer *">
                  <InlineCombobox
                    options={customerOptions}
                    value={form.customer_id}
                    onChange={id => setForm(p => ({ ...p, customer_id: id }))}
                    placeholder="Search by name or phone…"
                  />
                </FormGroup>

                {/* Booking & Job */}
                <div className="grid grid-cols-2 gap-3">
                  <FormGroup label="Booking (optional)">
                    <InlineCombobox
                      options={bookingOptions}
                      value={form.booking_id}
                      onChange={id => setForm(p => ({ ...p, booking_id: id }))}
                      placeholder="Search bookings…"
                    />
                  </FormGroup>
                  <FormGroup label="Job (optional)">
                    <InlineCombobox
                      options={jobOptions}
                      value={form.job_id}
                      onChange={id => setForm(p => ({ ...p, job_id: id }))}
                      placeholder="Search jobs…"
                    />
                  </FormGroup>
                </div>

                {/* Rating */}
                <FormGroup label="Rating (1–5)">
                  <div className="flex gap-2 items-center">
                    {[1,2,3,4,5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, rating: n }))}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`h-7 w-7 transition-colors ${n <= form.rating ? STAR_COLORS[form.rating] + ' fill-current' : 'text-muted-foreground/30'}`} />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">{form.rating} / 5</span>
                  </div>
                </FormGroup>

                {/* Comment */}
                <FormGroup label="Comment (optional)">
                  <textarea
                    value={form.comment}
                    onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                    placeholder="What did the customer say?"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </FormGroup>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!form.customer_id || createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Saving...' : 'Save Feedback'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Stats Panel */}
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50 border-emerald-100">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.average_rating ?? '—'}</p>
            </CardContent>
          </Card>
          {stats.distribution?.map((d: any) => (
            <Card key={d.rating} className="border">
              <CardContent className="p-4 text-center">
                <StarRating rating={d.rating} />
                <p className="text-lg font-bold mt-1">{d.count}</p>
                <p className="text-xs text-muted-foreground">{d.rating}-star</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && list.length === 0 ? (
        <EmptyState title="No Feedback Yet" description="Record your first customer feedback after a completed service." />
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          <DataTable
            data={paged}
            columns={columns}
            keyExtractor={(row: any) => row.id}
            isLoading={isLoading}
            searchPlaceholder="Search by customer, comment..."
            pagination={{ page, totalPages, onPageChange: setPage }}
          />
        </div>
      )}
    </PageContainer>
  );
}

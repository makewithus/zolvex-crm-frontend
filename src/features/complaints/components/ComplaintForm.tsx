/**
 * ComplaintForm — Reusable complaint creation modal.
 *
 * Accepts optional prefilledCustomerId / prefilledJobId so the same
 * component can be launched from:
 *   - Complaint List  (no prefill)
 *   - Customer Detail (prefilledCustomerId set)
 *   - Job Detail      (both prefilledCustomerId + prefilledJobId set)
 *
 * Always POSTs to POST /v1/complaints.
 * Backend always sets status = Open.
 */
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '@/lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { toast } from 'sonner';

const PRIORITIES = ['Low', 'Normal', 'High', 'Critical'] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  prefilledCustomerId?: string;
  prefilledJobId?: string;
}

export function ComplaintForm({ open, onClose, prefilledCustomerId, prefilledJobId }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [customerId, setCustomerId] = useState(prefilledCustomerId || '');
  const [jobId, setJobId] = useState(prefilledJobId || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('Normal');
  const [isOpen, setIsOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync if caller changes prefill props when modal re-opens
  useEffect(() => {
    setCustomerId(prefilledCustomerId || '');
    setJobId(prefilledJobId || '');
  }, [prefilledCustomerId, prefilledJobId, open]);

  // ── Customers ──────────────────────────────────────────────────────────────
  const { data: customersData } = useQuery({
    queryKey: ['customers-list-form'],
    queryFn: async () => {
      const res = await api.get('/customers');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
    enabled: open && !prefilledCustomerId,
  });
  const customers: any[] = customersData || [];
  const filteredCustomers = customers.filter((c: any) => {
    const term = customerSearch.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term)
    );
  });

  // ── Jobs ───────────────────────────────────────────────────────────────────
  const { data: jobsData } = useQuery({
    queryKey: ['jobs-list-form'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
    enabled: open && !prefilledJobId,
  });
  const jobs: any[] = jobsData || [];
  const filteredJobs = jobs.filter((j: any) => {
    const term = jobSearch.toLowerCase();
    return (
      j.job_id?.toLowerCase().includes(term) ||
      j.booking?.customer_name?.toLowerCase().includes(term) ||
      j.booking?.service_name?.toLowerCase().includes(term)
    );
  });
  const selectedJob = jobs.find((j: any) => j.id === jobId);

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const selectedCustomerName = prefilledCustomerId
    ? (customers.find((c) => c.id === prefilledCustomerId)?.name || prefilledCustomerId)
    : (selectedCustomer?.name || '');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerId) errs.customerId = 'Customer is required.';
    if (!subject.trim()) errs.subject = 'Subject is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        customer_id: customerId,
        subject: subject.trim(),
        description: description.trim(),
        priority,
      };
      if (jobId) payload.job_id = jobId;
      const res = await api.post('/complaints', payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Complaint created successfully.');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      handleClose();
      navigate(`/complaints/${data.id}`);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || 'Failed to create complaint.';
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) mutation.mutate();
  };

  const handleClose = () => {
    setSubject('');
    setDescription('');
    setPriority('Normal');
    setCustomerSearch('');
    setJobSearch('');
    setIsOpen(false);
    setIsJobOpen(false);
    setErrors({});
    if (!prefilledCustomerId) setCustomerId('');
    if (!prefilledJobId) setJobId('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Raise a Complaint</DialogTitle>
          <DialogDescription>
            Status will be set to <strong>Open</strong> automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          {/* ── Customer ─────────────────────────────────────────────────── */}
          <FormGroup label="Customer *" error={errors.customerId}>
            {prefilledCustomerId ? (
              <div className="h-9 flex items-center px-3 rounded-md border border-input bg-muted/40 text-sm text-muted-foreground">
                {selectedCustomerName || prefilledCustomerId}
              </div>
            ) : (
              <div className="relative">
                {/* Search input acting as combobox trigger */}
                <input
                  type="text"
                  placeholder={selectedCustomerName ? `${selectedCustomerName} (${selectedCustomer?.phone})` : "Search by name or phone…"}
                  value={customerSearch}
                  onFocus={() => setIsOpen(true)}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setIsOpen(true);
                    if (!e.target.value) {
                      setCustomerId('');
                    }
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                
                {isOpen && (
                  <>
                    {/* Backdrop to close dropdown on click outside */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Floating list */}
                    <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                      {filteredCustomers.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-slate-400">
                          No customers found
                        </div>
                      ) : (
                        filteredCustomers.map((c: any) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCustomerId(c.id);
                              setCustomerSearch(c.name || c.phone);
                              setIsOpen(false);
                              setErrors((prev) => ({ ...prev, customerId: '' }));
                            }}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-slate-50 flex flex-col ${
                              c.id === customerId ? 'bg-slate-50 font-medium' : ''
                            }`}
                          >
                            <span className="text-slate-900 font-semibold">{c.name || '—'}</span>
                            <span className="text-slate-400 text-[10px]">{c.phone}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
                
                {customerId && !isOpen && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Selected: {selectedCustomerName} ({selectedCustomer?.phone})
                  </p>
                )}
              </div>
            )}
          </FormGroup>

          {/* ── Job (optional, only when not pre-filled) ─────────────────── */}
          {!prefilledJobId && (
            <FormGroup label="Linked Job (optional)">
              <div className="relative">
                <input
                  type="text"
                  placeholder={selectedJob ? `${selectedJob.job_id} – ${selectedJob.booking?.service_name || ''}` : 'Search by Job ID or service…'}
                  value={jobSearch}
                  onFocus={() => setIsJobOpen(true)}
                  onChange={(e) => {
                    setJobSearch(e.target.value);
                    setIsJobOpen(true);
                    if (!e.target.value) setJobId('');
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />

                {isJobOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsJobOpen(false)} />
                    <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                      {filteredJobs.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-slate-400">No jobs found</div>
                      ) : (
                        filteredJobs.map((j: any) => (
                          <button
                            key={j.id}
                            type="button"
                            onClick={() => {
                              setJobId(j.id);
                              setJobSearch(j.job_id);
                              setIsJobOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-slate-50 flex flex-col ${j.id === jobId ? 'bg-slate-50 font-medium' : ''}`}
                          >
                            <span className="text-slate-900 font-semibold">{j.job_id}</span>
                            <span className="text-slate-400 text-[10px]">{j.booking?.service_name || ''} · {j.status}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}

                {jobId && !isJobOpen && selectedJob && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Linked: {selectedJob.job_id} ({selectedJob.status})
                  </p>
                )}
              </div>
            </FormGroup>
          )}

          {/* ── Priority ─────────────────────────────────────────────────── */}
          <FormGroup label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormGroup>

          {/* ── Subject ──────────────────────────────────────────────────── */}
          <FormGroup label="Subject *" error={errors.subject}>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors((prev) => ({ ...prev, subject: '' }));
              }}
              placeholder="Brief description of the issue…"
              maxLength={255}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </FormGroup>

          {/* ── Description ──────────────────────────────────────────────── */}
          <FormGroup label="Description *" error={errors.description}>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Detailed description of the complaint…"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </FormGroup>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Submitting…' : 'Raise Complaint'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

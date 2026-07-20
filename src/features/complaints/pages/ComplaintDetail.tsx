import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/axios';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DetailCard } from '@/components/ui-custom/DetailCard';
import { Section } from '@/components/ui-custom/Section';
import { SectionHeader } from '@/components/ui-custom/SectionHeader';
import { LoadingState } from '@/components/ui-custom/LoadingState';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ClipboardList, ArrowRight, UserCheck, Play, AlertTriangle,
  CheckCircle, XCircle, MessageSquarePlus, StickyNote,
  ExternalLink,
} from 'lucide-react';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

// ── Style maps (unchanged) ──────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  Open:       'bg-blue-100 text-blue-800',
  Assigned:   'bg-violet-100 text-violet-800',
  InProgress: 'bg-amber-100 text-amber-800',
  Resolved:   'bg-emerald-100 text-emerald-800',
  Escalated:  'bg-red-100 text-red-800',
  Closed:     'bg-gray-100 text-gray-600',
};

const STATUS_HEADER_STYLES: Record<string, string> = {
  Open:       'bg-blue-50 text-blue-700 border border-blue-200',
  Assigned:   'bg-violet-50 text-violet-700 border border-violet-200',
  InProgress: 'bg-amber-50 text-amber-700 border border-amber-200',
  Resolved:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Escalated:  'bg-red-50 text-red-700 border border-red-200',
  Closed:     'bg-gray-50 text-gray-500 border border-gray-200',
};

// Timeline entry icon per event type
const TIMELINE_ICONS: Record<string, React.ReactNode> = {
  Open:       <ClipboardList  className="h-3.5 w-3.5 text-blue-600" />,
  Assigned:   <UserCheck      className="h-3.5 w-3.5 text-violet-600" />,
  InProgress: <Play           className="h-3.5 w-3.5 text-amber-600" />,
  Escalated:  <AlertTriangle  className="h-3.5 w-3.5 text-red-600" />,
  Resolved:   <CheckCircle    className="h-3.5 w-3.5 text-emerald-600" />,
  Closed:     <XCircle        className="h-3.5 w-3.5 text-gray-400" />,
  note:       <StickyNote     className="h-3.5 w-3.5 text-slate-500" />,
};

// ── Existing state machine (UNCHANGED) ─────────────────────────────────────
const TRANSITIONS: Record<string, { label: string; action: string; variant?: 'destructive' | 'default' | 'outline' }[]> = {
  Open:       [{ label: 'Assign', action: 'assign' }, { label: 'Close', action: 'close', variant: 'outline' }],
  Assigned:   [{ label: 'Start Work', action: 'start' }, { label: 'Escalate', action: 'escalate', variant: 'destructive' }],
  InProgress: [
    { label: 'Add Note', action: 'addnote', variant: 'outline' },
    { label: 'Resolve', action: 'resolve' },
    { label: 'Escalate', action: 'escalate', variant: 'destructive' },
  ],
  Escalated:  [{ label: 'Assign', action: 'assign' }, { label: 'Start Work', action: 'start' }],
  Resolved:   [{ label: 'Close', action: 'close' }],
  Closed:     [],
};

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [assignTo, setAssignTo] = useState('');

  // ── Main complaint query (unchanged) ─────────────────────────────────────
  const { data: complaint, isLoading, isError } = useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const res = await api.get(`/complaints/${id}`);
      return res.data;
    }
  });

  // ── Assignable users — lazy, only when assign dialog opens ───────────────
  const { data: usersData } = useQuery({
    queryKey: ['assignable-users'],
    queryFn: async () => {
      const res = await api.get('/users');
      const all: any[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      return all.filter((u: any) => u.is_active);
    },
    enabled: activeAction === 'assign',
  });
  const assignableUsers: any[] = usersData || [];

  // ── Existing workflow action mutation (UNCHANGED logic) ──────────────────
  const actionMutation = useMutation({
    mutationFn: async ({ action, body }: { action: string; body?: any }) => {
      const res = await api.post(`/complaints/${id}/${action}`, body || {});
      return res.data;
    },
    onSuccess: () => {
      toast.success('Complaint updated');
      setActiveAction(null);
      setNote('');
      setAssignTo('');
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Action failed')
  });

  // ── [ADDITIVE] Progress note mutation ────────────────────────────────────
  const noteMutation = useMutation({
    mutationFn: async (noteText: string) => {
      const res = await api.post(`/complaints/${id}/notes`, { note: noteText });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Progress note added');
      setActiveAction(null);
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to add note')
  });

  // ── Existing action handler (UNCHANGED) + addnote branch added ───────────
  const handleAction = (action: string) => {
    if (action === 'addnote') {
      if (!note.trim()) { toast.error('Note cannot be empty.'); return; }
      noteMutation.mutate(note.trim());
    } else if (action === 'assign') {
      if (!assignTo) { toast.error('Please select a user to assign.'); return; }
      actionMutation.mutate({ action: 'assign', body: { assigned_to: assignTo, note } });
    } else if (action === 'resolve') {
      if (!note.trim()) { toast.error('Resolution note is required.'); return; }
      actionMutation.mutate({ action: 'resolve', body: { resolution_note: note } });
    } else if (action === 'escalate') {
      if (!note.trim()) { toast.error('Escalation reason is required.'); return; }
      actionMutation.mutate({ action: 'escalate', body: { reason: note } });
    } else if (action === 'close') {
      actionMutation.mutate({ action: 'close', body: { note } });
    } else {
      actionMutation.mutate({ action });
    }
  };

  if (isLoading) return <PageContainer><LoadingState text="Loading complaint..." /></PageContainer>;
  if (isError || !complaint) return <PageContainer><EmptyState title="Complaint Not Found" description="This complaint does not exist." /></PageContainer>;

  // ── RBAC Visibility Logic ────────────────────────────────────────────────
  const userRole = currentUser?.role?.name || '';
  const isAssignedToMe = complaint?.assigned_to === currentUser?.id;

  const getVisibleActions = () => {
    if (!complaint) return [];
    const baseActions = TRANSITIONS[complaint.status] || [];
    return baseActions.filter(a => {
      switch (a.action) {
        case 'assign':
          return ['Super Admin', 'City Manager'].includes(userRole);
        case 'escalate':
          return ['Super Admin', 'City Manager', 'Support Agent'].includes(userRole);
        case 'close':
          return ['Super Admin'].includes(userRole);
        case 'start':
        case 'resolve':
        case 'addnote':
          if (['Super Admin', 'City Manager', 'Support Agent'].includes(userRole)) return true;
          if (userRole === 'Technician' && isAssignedToMe) return true;
          return false;
        default:
          return false;
      }
    });
  };

  const visibleActions = getVisibleActions();
  const isPending = actionMutation.isPending || noteMutation.isPending;

  const status = complaint.status;
  const showResolutionNote = ['Resolved', 'Closed'].includes(status) && complaint.resolution_note;

  // Merge timeline + progress notes into a single sorted feed
  const timelineFeed = [
    ...(complaint.timeline || []).map((e: any) => ({ ...e, _type: 'transition' })),
    ...(complaint.notes    || []).map((n: any) => ({ ...n, _type: 'note', changed_at: n.created_at })),
  ].sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());

  return (
    <PageContainer>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <PageHeader
        title={complaint.complaint_id}
        description={complaint.subject}
      >
        <div className="flex gap-2 flex-wrap items-center">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_HEADER_STYLES[status] || 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
            {status}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigate('/complaints')}>← Back</Button>
          {visibleActions.map(a => (
            <Button
              key={a.action}
              variant={a.variant || 'default'}
              size="sm"
              onClick={() => setActiveAction(a.action)}
              disabled={isPending}
            >
              {a.action === 'addnote' && <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />}
              {a.label}
            </Button>
          ))}
        </div>
      </PageHeader>

      {/* ── Action / Note Dialog ─────────────────────────────────────────── */}
      {activeAction && (
        <Dialog open={!!activeAction} onOpenChange={() => { setActiveAction(null); setNote(''); setAssignTo(''); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {activeAction === 'addnote'   ? 'Add Progress Note' :
                 activeAction === 'assign'     ? 'Assign Complaint' :
                 activeAction === 'resolve'    ? 'Resolve Complaint' :
                 activeAction === 'escalate'   ? 'Escalate Complaint' :
                 activeAction === 'close'      ? 'Close Complaint' :
                 'Start Work'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Assign — user dropdown */}
              {activeAction === 'assign' && (
                <FormGroup label="Assign To *">
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select a staff member…</option>
                    {assignableUsers.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name}  ({u.role?.name || 'Staff'})
                      </option>
                    ))}
                  </select>
                </FormGroup>
              )}

              {/* Note / reason textarea */}
              {activeAction !== 'start' && (
                <FormGroup label={
                  activeAction === 'addnote'  ? 'Progress Note *' :
                  activeAction === 'resolve'  ? 'Resolution Note *' :
                  activeAction === 'escalate' ? 'Escalation Reason *' :
                  'Note (optional)'
                }>
                  {activeAction === 'addnote' || activeAction === 'resolve' || activeAction === 'escalate' ? (
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder={
                        activeAction === 'addnote'  ? 'Describe progress made so far…' :
                        activeAction === 'resolve'  ? 'Describe how this was resolved…' :
                        'Why is this being escalated?'
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                  ) : (
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note…"
                    />
                  )}
                </FormGroup>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => { setActiveAction(null); setNote(''); setAssignTo(''); }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleAction(activeAction)}
                  disabled={isPending}
                  variant={activeAction === 'escalate' ? 'destructive' : 'default'}
                >
                  {isPending ? 'Submitting…' : (
                    activeAction === 'addnote'  ? 'Add Note' :
                    activeAction === 'assign'   ? 'Assign' :
                    activeAction === 'resolve'  ? 'Mark Resolved' :
                    activeAction === 'escalate' ? 'Escalate' :
                    activeAction === 'close'    ? 'Close' :
                    'Confirm'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Left column ────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Complaint Details card — customer & job now have navigation links */}
          <Section>
            <DetailCard
              title="Complaint Details"
              data={[
                {
                  label: 'Status',
                  value: <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[status]}`}>{status}</span>
                },
                { label: 'Priority', value: complaint.priority },
                {
                  label: 'Customer',
                  value: complaint.customer ? (
                    <Link
                      to={`/customers/${complaint.customer.id}`}
                      className="text-primary hover:underline font-medium text-sm inline-flex items-center gap-1"
                    >
                      {complaint.customer.name || 'Unknown'}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Link>
                  ) : '—'
                },
                { label: 'Phone', value: complaint.customer?.phone || '—' },
                {
                  label: 'Assigned To',
                  value: complaint.assignedTo?.name || <span className="text-muted-foreground italic text-xs">Unassigned</span>
                },
                { label: 'Raised On', value: format(new Date(complaint.created_at), 'dd MMM yyyy, HH:mm') },
              ]}
            />
          </Section>

          {/* [ADDITIVE] Linked Job card — read-only, only shown when job exists */}
          {complaint.job && (
            <Section>
              <SectionHeader title="Linked Job" />
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{complaint.job.job_id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Status: <span className="font-medium">{complaint.job.status}</span>
                        {complaint.job.scheduled_start && (
                          <> · Scheduled: {format(new Date(complaint.job.scheduled_start), 'dd MMM yyyy')}</>
                        )}
                      </p>
                      {complaint.job.assignedUser && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Technician: <span className="font-medium">{complaint.job.assignedUser.name}</span>
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/jobs/${complaint.job.id}`}
                      className="text-primary hover:underline text-xs font-medium inline-flex items-center gap-1"
                    >
                      View Job <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Section>
          )}

          {/* Description */}
          <Section>
            <SectionHeader title="Description" />
            <Card>
              <CardContent className="p-4 text-sm leading-relaxed text-muted-foreground">
                {complaint.description}
              </CardContent>
            </Card>
          </Section>

          {/* Resolution note — only shown after Resolved/Closed */}
          {showResolutionNote && (
            <Section>
              <SectionHeader title="Resolution Note" />
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-4 text-sm text-emerald-800">{complaint.resolution_note}</CardContent>
              </Card>
            </Section>
          )}
        </div>

        {/* ── Right column — Merged Timeline ───────────────────────────────── */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title={`Activity Timeline (${timelineFeed.length})`} />
            <Card>
              <CardContent className="p-4">
                {timelineFeed.length === 0 ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <ClipboardList className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No activity yet</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-5 pl-9">
                      {timelineFeed.map((entry: any, idx: number) => {
                        const isNote = entry._type === 'note';
                        const icon = isNote
                          ? TIMELINE_ICONS['note']
                          : (TIMELINE_ICONS[entry.to_status] || <ArrowRight className="h-3.5 w-3.5 text-primary" />);
                        const actorName = isNote
                          ? (entry.createdByUser?.name || 'Staff')
                          : (entry.changedByUser?.name || 'System');

                        return (
                          <div key={entry.id || idx} className="relative">
                            <div className={`absolute -left-9 flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-background ${isNote ? 'bg-slate-100' : 'bg-primary/10'}`}>
                              {icon}
                            </div>

                            <div className="pt-0.5">
                              {isNote ? (
                                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                  <p className="text-xs font-semibold text-slate-600 mb-0.5">Progress Note · <span className="font-normal text-slate-500">{actorName}</span></p>
                                  <p className="text-xs text-slate-700 leading-relaxed">{entry.note}</p>
                                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                                    {format(new Date(entry.changed_at), 'dd MMM, HH:mm')}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {entry.from_status && (
                                      <>
                                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${STATUS_STYLES[entry.from_status] || 'bg-gray-100'}`}>
                                          {entry.from_status}
                                        </span>
                                        <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                                      </>
                                    )}
                                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${STATUS_STYLES[entry.to_status] || 'bg-gray-100'}`}>
                                      {entry.to_status}
                                    </span>
                                  </div>
                                  {entry.note && (
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{entry.note}</p>
                                  )}
                                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                                    {actorName} · {format(new Date(entry.changed_at), 'dd MMM, HH:mm')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
}

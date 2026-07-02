import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DetailCard } from '@/components/ui-custom/DetailCard';
import { Timeline, TimelineItem } from '@/components/ui-custom/Timeline';
import { Section } from '@/components/ui-custom/Section';
import { SectionHeader } from '@/components/ui-custom/SectionHeader';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui-custom/LoadingState';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useLeads, useAddLeadNote } from '../hooks/useLeads';

export const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: leads, isLoading } = useLeads();
  const addNoteMutation = useAddLeadNote();
  const [noteText, setNoteText] = useState('');

  const lead = leads?.find((l: any) => l.id === id);

  if (isLoading) return <PageContainer><LoadingState text="Loading Lead..." /></PageContainer>;
  if (!lead) return <PageContainer><EmptyState title="Not Found" description="This lead could not be found." /></PageContainer>;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNoteMutation.mutate({ id: lead.id, note_text: noteText }, {
      onSuccess: () => setNoteText('')
    });
  };

  return (
    <PageContainer>
      <PageHeader title={lead.name || 'Unknown Lead'} description={`Phone: ${lead.phone}`}>
        <Button variant="outline" onClick={() => navigate(`/leads/${lead.id}/edit`)}>Edit Lead</Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <DetailCard 
              title="Lead Information" 
              data={[
                { label: 'Status', value: <StatusBadge status={lead.status === 'Lost' ? 'error' : lead.status === 'Booked' ? 'success' : 'info'} label={lead.status} /> },
                { label: 'Source', value: <StatusBadge status="default" label={lead.source} /> },
                { label: 'City', value: lead.city?.name || 'Unassigned' },
                { label: 'Service', value: lead.service?.name || 'Unassigned' },
                { label: 'Assigned To', value: lead.assignedTo?.name || 'Unassigned' },
              ]} 
            />
          </Section>

          <Section>
            <SectionHeader title="Notes" />
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                {(!lead.notes || lead.notes.length === 0) ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notes yet.</p>
                ) : (
                  lead.notes?.map((note: any) => (
                    <div key={note.id} className="text-sm border-b pb-2 last:border-0">
                      <p className="text-foreground">{note.note_text}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {note.createdBy?.name || 'Unknown'} <span className="font-normal opacity-75 ml-2">{new Date(note.created_at).toLocaleString()}</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t mt-2">
                <Input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Type a note..." className="flex-1" />
                <Button type="submit" disabled={addNoteMutation.isPending || !noteText.trim()}>
                  {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                </Button>
              </form>
              </CardContent>
            </Card>
          </Section>
        </div>

        <div className="space-y-6">
          <Section>
            <SectionHeader title="Stage History" />
            <Card>
              <CardContent className="p-4">
                {(!lead.history || lead.history.length === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-4">No history yet.</p>
              ) : (
                <Timeline>
                  {lead.history?.map((h: any) => (
                    <TimelineItem 
                      key={h.id} 
                      title={`${h.from_stage || 'Created'} ➔ ${h.to_stage}`} 
                      time={new Date(h.changed_at).toLocaleString()} 
                      description={`By ${h.changedBy?.name || 'System'}`}
                    />
                  ))}
                </Timeline>
              )}
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
};

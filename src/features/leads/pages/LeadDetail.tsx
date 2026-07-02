import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DetailCard } from '@/components/ui-custom/DetailCard';
import { Section } from '@/components/ui-custom/Section';
import { SectionHeader } from '@/components/ui-custom/SectionHeader';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui-custom/LoadingState';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLead, useAddLeadNote, useUpdateLead } from '../hooks/useLeads';
import { LeadStatus } from '../types/lead.types';
import { ConvertLeadDialog } from '@/features/bookings/components/ConvertLeadDialog';

export const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: leadResponse, isLoading } = useLead(id || '');
  const lead = leadResponse?.data;
  
  const addNoteMutation = useAddLeadNote();
  const updateMutation = useUpdateLead();
  const [noteText, setNoteText] = useState('');
  
  const [isStageOpen, setIsStageOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  
  const [newStage, setNewStage] = useState<LeadStatus | ''>('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  if (isLoading) return <PageContainer><LoadingState text="Loading Lead..." /></PageContainer>;
  if (!lead) return <PageContainer><EmptyState title="Not Found" description="This lead could not be found." /></PageContainer>;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNoteMutation.mutate({ id: lead.id, note_text: noteText }, {
      onSuccess: () => {
        setNoteText('');
        setIsNoteOpen(false);
      }
    });
  };

  const handleUpdateStage = () => {
    if (!newStage) return;
    updateMutation.mutate({ id: lead.id, data: { status: newStage } }, {
      onSuccess: () => {
        setIsStageOpen(false);
        setNewStage('');
      }
    });
  };

  const handleAssign = () => {
    if (!assignedTo) return;
    updateMutation.mutate({ id: lead.id, data: { assigned_to: assignedTo } }, {
      onSuccess: () => {
        setIsAssignOpen(false);
        setAssignedTo('');
      }
    });
  };

  return (
    <PageContainer>
      <PageHeader title={lead.name || 'Unknown Lead'} description={`Phone: ${lead.phone}`}>
        <div className="flex flex-wrap items-center gap-2">
          
          {lead.status !== 'Booked' && lead.status !== 'Lost' && (
            <Button onClick={() => setIsConvertOpen(true)} className="bg-primary hover:bg-primary/90">Convert to Booking</Button>
          )}

          <Dialog open={isStageOpen} onOpenChange={setIsStageOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm">Change Stage</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Change Stage</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <select className="w-full h-9 rounded-md border px-3 text-sm bg-background" value={newStage} onChange={e => setNewStage(e.target.value as LeadStatus)}>
                  <option value="">Select Stage...</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="FollowUp">FollowUp</option>
                  <option value="Qualified">Qualified</option>
                  <option value="QuotationSent">QuotationSent</option>
                  <option value="Booked">Booked</option>
                  <option value="Lost">Lost</option>
                </select>
                <Button onClick={handleUpdateStage} disabled={!newStage || updateMutation.isPending} className="w-full">Confirm Transition</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm">Assign Lead</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Assign Lead</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Enter Staff UUID..." value={assignedTo} onChange={e => setAssignedTo(e.target.value)} />
                <Button onClick={handleAssign} disabled={!assignedTo || updateMutation.isPending} className="w-full">Assign Lead</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="default" size="sm" onClick={() => navigate(`/leads/${lead.id}/edit`)}>Edit</Button>
        </div>
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
            <SectionHeader title="Notes">
              <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                <DialogTrigger asChild><Button variant="outline" size="sm">Add Note</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Type a note..." value={noteText} onChange={e => setNoteText(e.target.value)} />
                    <Button onClick={handleAddNote} disabled={!noteText.trim() || addNoteMutation.isPending} className="w-full">Submit Note</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </SectionHeader>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                {(!lead.notes || lead.notes.length === 0) ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notes yet.</p>
                ) : (
                  lead.notes?.map((note) => (
                    <div key={note.id} className="text-sm border-b pb-2 last:border-0">
                      <p className="text-foreground">{note.note_text}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {note.created_by?.name || 'Unknown'} <span className="font-normal opacity-75 ml-2">{new Date(note.created_at).toLocaleString()}</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
              </CardContent>
            </Card>
          </Section>
        </div>

        <div className="space-y-6">
          <Section>
            <SectionHeader title="Stage History" />
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center py-4">History component placeholder.</p>
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>

      <ConvertLeadDialog
        lead={lead}
        isOpen={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
      />
    </PageContainer>
  );
};

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { FormSection } from '@/components/ui-custom/FormSection';
import { FormGrid } from '@/components/ui-custom/FormGrid';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { leadFormSchema, leadUpdateSchema, LeadFormInput, LeadUpdateInput } from '../schemas/lead.schema';
import { useCreateLead, useUpdateLead, useLead } from '../hooks/useLeads';

export const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const { data: leadResponse } = useLead(id || '');
  const lead = leadResponse?.data;

  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();

  const form = useForm<LeadFormInput & LeadUpdateInput>({
    resolver: zodResolver(isEdit ? leadUpdateSchema : leadFormSchema) as unknown as Resolver<LeadFormInput & LeadUpdateInput>,
    defaultValues: isEdit 
      ? { status: lead?.status, assigned_to: lead?.assigned_to || '' }
      : { phone: '', name: '', source: 'Phone', city_id: '', service_id: '' }
  });

  useEffect(() => {
    if (isEdit && lead) {
      form.reset({ status: lead.status, assigned_to: lead.assigned_to || '' });
    }
  }, [isEdit, lead, form]);

  const onSubmit = (data: LeadFormInput & LeadUpdateInput) => {
    if (isEdit) {
      updateMutation.mutate({ id: id as string, data: data as LeadUpdateInput }, {
        onSuccess: () => navigate(`/leads/${id}`)
      });
    } else {
      createMutation.mutate(data as LeadFormInput, {
        onSuccess: () => navigate('/leads')
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <PageContainer>
      <PageHeader title={isEdit ? "Edit Lead" : "Create Lead"} description={isEdit ? "Update lead assignment or status" : "Enter new lead information"} />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSection title={isEdit ? "Assignment & Status" : "Lead Details"}>
            <FormGrid columns={2}>
              {!isEdit && (
                <>
                  <FormGroup label="Phone" error={form.formState.errors.phone?.message as string} required>
                    <Input {...form.register('phone')} placeholder="e.g. 9876543210" />
                  </FormGroup>
                  <FormGroup label="Name" error={form.formState.errors.name?.message as string}>
                    <Input {...form.register('name')} placeholder="e.g. John Doe" />
                  </FormGroup>
                  <FormGroup label="Source" error={form.formState.errors.source?.message as string} required>
                    <select {...form.register('source')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm">
                      <option value="Phone">Phone</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="WebsiteForm">Website Form</option>
                      <option value="MetaAds">Meta Ads</option>
                      <option value="ManualEntry">Manual Entry</option>
                      <option value="Justdial">Justdial</option>
                      <option value="Referrals">Referrals</option>
                    </select>
                  </FormGroup>
                </>
              )}
              {isEdit && (
                <>
                  <FormGroup label="Stage" error={form.formState.errors.status?.message as string}>
                    <select {...form.register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm">
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="FollowUp">FollowUp</option>
                      <option value="Qualified">Qualified</option>
                      <option value="QuotationSent">QuotationSent</option>
                      <option value="Booked">Booked</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </FormGroup>
                  <FormGroup label="Assigned To (User ID)" error={form.formState.errors.assigned_to?.message as string}>
                    <Input {...form.register('assigned_to')} placeholder="UUID of user" />
                  </FormGroup>
                </>
              )}
            </FormGrid>
          </FormSection>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Lead'}</Button>
          </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

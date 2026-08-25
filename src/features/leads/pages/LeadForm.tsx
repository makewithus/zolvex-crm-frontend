import { useEffect } from 'react';
import { formatEnumLabel } from '@/lib/utils';
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
import { useCities } from '@/features/cities/hooks/useCities';
import { useServices } from '@/features/services/hooks/useServices';
import { useUsers } from '@/features/users/hooks/useUsers';
import { toast } from 'sonner';

export const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const { data: leadResponse } = useLead(id || '');
  const lead = leadResponse?.data;

  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const { data: citiesResponse } = useCities();
  const { data: servicesResponse } = useServices();
  const { data: usersResponse } = useUsers();
  const users = usersResponse?.data || [];

  const form = useForm<LeadFormInput & LeadUpdateInput>({
    resolver: zodResolver(isEdit ? leadUpdateSchema : leadFormSchema) as unknown as Resolver<LeadFormInput & LeadUpdateInput>,
    defaultValues: isEdit 
      ? { status: lead?.status, assigned_to: lead?.assigned_to || '' }
      : { phone: '', name: '', source: 'Phone', city_id: '', service_id: '', service_location: '', follow_up_date: '' }
  });

  useEffect(() => {
    if (isEdit && lead) {
      form.reset({
        status: lead.status,
        assigned_to: lead.assigned_to || '',
        name: lead.name || '',
        city_id: lead.city_id || '',
        service_id: lead.service_id || '',
        service_location: lead.service_location || '',
        follow_up_date: lead.follow_up_date ? new Date(lead.follow_up_date).toISOString().slice(0, 16) : ''
      });
    }
  }, [isEdit, lead, form]);

  const onSubmit = (data: LeadFormInput & LeadUpdateInput) => {
    if (isEdit) {
      updateMutation.mutate({ id: id as string, data: data as LeadUpdateInput }, {
        onSuccess: () => {
          toast.success('Lead updated successfully');
          navigate(`/leads/${id}`);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to update lead');
        }
      });
    } else {
      createMutation.mutate(data as LeadFormInput, {
        onSuccess: () => {
          toast.success('Lead created successfully');
          navigate('/leads');
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to create lead');
        }
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
                  <FormGroup label="Phone" error={form.formState.errors.phone?.message as string} required>
                    <Input {...form.register('phone')} placeholder="e.g. 9876543210" disabled={isEdit} />
                  </FormGroup>
                  <FormGroup label="Name" error={form.formState.errors.name?.message as string}>
                    <Input {...form.register('name')} placeholder="e.g. John Doe" />
                  </FormGroup>
                  <FormGroup label="Source" error={form.formState.errors.source?.message as string} required>
                    <select {...form.register('source')} disabled={isEdit} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm">
                      <option value="Phone">{formatEnumLabel("Phone")}</option>
                      <option value="WhatsApp">{formatEnumLabel("WhatsApp")}</option>
                      <option value="WebsiteForm">{formatEnumLabel("WebsiteForm")}</option>
                      <option value="MetaAds">{formatEnumLabel("MetaAds")}</option>
                      <option value="ManualEntry">{formatEnumLabel("ManualEntry")}</option>
                      <option value="Justdial">{formatEnumLabel("Justdial")}</option>
                      <option value="Referrals">{formatEnumLabel("Referrals")}</option>
                    </select>
                  </FormGroup>
                  <FormGroup label="City" error={form.formState.errors.city_id?.message as string}>
                    <select {...form.register('city_id')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm">
                      <option value="">Select a city...</option>
                      {citiesResponse?.data?.map((city: any) => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup label="Service Location / District" error={form.formState.errors.service_location?.message as string}>
                    <Input {...form.register('service_location')} placeholder="e.g. South Delhi, Dwarka" />
                  </FormGroup>
                  <FormGroup label="Service" error={form.formState.errors.service_id?.message as string}>
                    <select {...form.register('service_id')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm">
                      <option value="">Select a service...</option>
                      {servicesResponse?.data?.map((service: any) => (
                        <option key={service.id} value={service.id}>{formatEnumLabel(service.name)}</option>
                      ))}
                    </select>
                  </FormGroup>
              {isEdit && (
                <>
                  <FormGroup label="Stage" error={form.formState.errors.status?.message as string}>
                    <select {...form.register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm">
                      <option value="New">{formatEnumLabel("New")}</option>
                      <option value="Contacted">{formatEnumLabel("Contacted")}</option>
                      <option value="FollowUp">{formatEnumLabel("FollowUp")}</option>
                      <option value="Qualified">{formatEnumLabel("Qualified")}</option>
                      <option value="QuotationSent">{formatEnumLabel("QuotationSent")}</option>
                      <option value="Booked">{formatEnumLabel("Booked")}</option>
                      <option value="Lost">{formatEnumLabel("Lost")}</option>
                    </select>
                  </FormGroup>
                  <FormGroup label="Assigned To" error={form.formState.errors.assigned_to?.message as string}>
                    <select {...form.register('assigned_to')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm">
                      <option value="">Unassigned</option>
                      {users.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role?.name || 'User'})</option>
                      ))}
                    </select>
                  </FormGroup>
                  {form.watch('status') === 'FollowUp' && (
                    <FormGroup label="Follow-up Date & Time" error={form.formState.errors.follow_up_date?.message as string} required>
                      <Input type="datetime-local" {...form.register('follow_up_date')} />
                    </FormGroup>
                  )}
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

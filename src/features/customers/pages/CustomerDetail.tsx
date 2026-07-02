import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { DetailCard } from '@/components/ui-custom/DetailCard';
import { LoadingState } from '@/components/ui-custom/LoadingState';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Section } from '@/components/ui-custom/Section';
import { SectionHeader } from '@/components/ui-custom/SectionHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FormGroup } from '@/components/ui-custom/FormGroup';
import { customerFormSchema, CustomerFormInput } from '../schemas/customer.schema';
import { CustomerLead } from '../types/customer.types';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, isError } = useCustomer(id as string);
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<CustomerFormInput>({
    resolver: zodResolver(customerFormSchema) as unknown as Resolver<CustomerFormInput>,
    defaultValues: { name: '', is_repeat_customer: false, tags: '' }
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name || '',
        is_repeat_customer: customer.is_repeat_customer,
        tags: customer.tags?.join(', ') || ''
      });
    }
  }, [customer, form]);

  const handleEditSubmit = (data: CustomerFormInput) => {
    if (!customer) return;
    
    // Convert CustomerFormInput back to UpdateCustomerInput for API
    updateCustomer({
      id: customer.id,
      data: {
        name: data.name,
        is_repeat_customer: data.is_repeat_customer,
        tags: data.tags ? (data.tags as unknown as string).split(',').map(t => t.trim()).filter(Boolean) : [],
      }
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      }
    });
  };

  if (isLoading) return <PageContainer><LoadingState text="Loading customer details..." /></PageContainer>;
  if (isError || !customer) return <PageContainer><EmptyState title="Customer Not Found" description="This customer does not exist." /></PageContainer>;

  return (
    <PageContainer>
      <PageHeader 
        title={customer.name || 'Unknown Customer'}
        description={`Phone: ${customer.phone}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/customers')}>Back to Customers</Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Customer Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4 py-4">
                <FormGroup label="Name" error={form.formState.errors.name?.message as string}>
                  <Input {...form.register('name')} placeholder="Customer Name" />
                </FormGroup>

                <div className="flex items-center space-x-2 pt-2">
                  <input type="checkbox" id="repeat-cust" {...form.register('is_repeat_customer')} className="w-4 h-4" />
                  <label htmlFor="repeat-cust" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Repeat Customer</label>
                </div>

                <FormGroup label="Tags (comma separated)" error={form.formState.errors.tags?.message as string}>
                  <Input {...form.register('tags')} placeholder="VIP, Urgent, etc." />
                </FormGroup>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Section>
            <DetailCard 
              title="Customer Identity" 
              data={[
                { label: 'Phone', value: customer.phone },
                { label: 'Status', value: customer.is_repeat_customer ? <StatusBadge status="info" label="Repeat Customer" /> : <StatusBadge status="default" label="New Customer" /> },
                { label: 'Tags', value: (
                  <div className="flex gap-2 flex-wrap mt-1">
                    {customer.tags && customer.tags.length > 0 ? customer.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                        {tag}
                      </span>
                    )) : <span className="text-sm text-muted-foreground italic">No tags assigned</span>}
                  </div>
                ) }
              ]} 
            />
          </Section>

          <Section>
            <SectionHeader title={`Related Leads (${customer.leads?.length || 0})`} />
            <Card>
              <CardContent className="p-4 space-y-3">
                {customer.leads && customer.leads.length > 0 ? customer.leads.map((lead: CustomerLead) => (
                  <div key={lead.id} className="p-3 bg-secondary/50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-secondary" onClick={() => navigate(`/leads/${lead.id}`)}>
                    <div>
                      <p className="font-medium text-sm">Lead: {lead.id.substring(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{lead.source}</p>
                    </div>
                    <StatusBadge status={lead.status === 'Lost' ? 'error' : lead.status === 'Booked' ? 'success' : 'info'} label={lead.status} />
                  </div>
                )) : <p className="text-sm text-muted-foreground">No leads associated.</p>}
              </CardContent>
            </Card>
          </Section>
        </div>

        <div className="space-y-6">
          <Section>
            <SectionHeader title="Service History (Future)" />
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center bg-secondary/30 border border-dashed border-border rounded-md h-24">
                  <p className="text-sm text-muted-foreground text-center">Service History Placeholder<br/>(To be populated via relationships)</p>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section>
            <SectionHeader title="Previous Bookings (Future)" />
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center bg-secondary/30 border border-dashed border-border rounded-md h-24">
                  <p className="text-sm text-muted-foreground text-center">Previous Bookings Placeholder<br/>(To be populated via relationships)</p>
                </div>
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
}

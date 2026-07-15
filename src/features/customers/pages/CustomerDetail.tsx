import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { useCustomerInvoices } from '../../invoices/hooks/useInvoices';
import { usePayments } from '../../payments/hooks/usePayments';
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
import { CalendarIcon, FileText, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, isError } = useCustomer(id as string);
  const { data: invoices, isLoading: isLoadingInvoices } = useCustomerInvoices(id as string);
  const { data: payments, isLoading: isLoadingPayments } = usePayments({ customer_id: id });
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditSubmit = (data: any) => {
    if (!customer) return;
    
    updateCustomer({
      id: customer.id,
      data: {
        name: data.name,
        is_repeat_customer: data.is_repeat_customer,
        tags: Array.isArray(data.tags) ? data.tags : [],
      }
    }, {
      onSuccess: () => {
        toast.success('Customer profile updated');
        setIsEditDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update customer');
      }
    });
  };

  if (isLoading) return <PageContainer><LoadingState text="Loading customer details..." /></PageContainer>;
  if (isError || !customer) return <PageContainer><EmptyState title="Customer Not Found" description="This customer does not exist." /></PageContainer>;

  const totalInvoiced = invoices?.reduce((sum, inv: any) => sum + Number(inv.final_amount), 0) || 0;
  const totalPaid = invoices?.reduce((sum, inv: any) => sum + Number(inv.amount_paid || 0), 0) || 0;
  const outstanding = invoices?.reduce((sum, inv: any) => sum + Number(inv.balance_due || 0), 0) || 0;

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
                      <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[11px] font-medium rounded border">
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
                      <p className="font-medium text-sm">Lead: {lead.service?.name || 'General Inquiry'}</p>
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
            <SectionHeader title="Financial Ledger" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-50/50 border-blue-100">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total Invoiced</span>
                  <span className="text-xl font-bold text-blue-900">₹{totalInvoiced.toLocaleString('en-IN')}</span>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50/50 border-emerald-100">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Total Paid</span>
                  <span className="text-xl font-bold text-emerald-900">₹{totalPaid.toLocaleString('en-IN')}</span>
                </CardContent>
              </Card>
              <Card className="bg-red-50/50 border-red-100">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Outstanding</span>
                  <span className="text-xl font-bold text-red-900">₹{outstanding.toLocaleString('en-IN')}</span>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-semibold">Payment History</h3>
              </div>
              <CardContent className="p-4">
                {isLoadingPayments ? (
                  <div className="flex justify-center p-4 text-sm text-muted-foreground">Loading payments...</div>
                ) : !payments || payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <CreditCard className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs font-medium text-muted-foreground">No payments recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium text-sm text-primary">
                            {payment.payment_number}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm text-emerald-600">
                            ₹{Number(payment.amount).toLocaleString('en-IN')}
                          </div>
                          <Badge variant="outline" className={payment.payment_status === 'Completed' ? 'bg-emerald-50 text-emerald-700 text-[10px]' : 'bg-amber-50 text-amber-700 text-[10px]'}>
                            {payment.payment_status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <SectionHeader title="Financial Invoices" />
            <Card>
              <CardContent className="p-6">
                {isLoadingInvoices ? (
                  <div className="flex justify-center p-4">Loading invoices...</div>
                ) : !invoices || invoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg">
                    <FileText className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium">No invoices found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices.map((inv: any) => (
                      <div key={inv.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <Link to={`/invoices/${inv.id}`} className="font-medium text-sm text-primary hover:underline block">
                            {inv.invoice_number}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {new Date(inv.issue_date).toLocaleDateString()} • ₹{Number(inv.final_amount).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <Badge variant="outline" className={inv.status === 'Draft' ? 'bg-gray-50' : 'bg-blue-50 text-blue-700'}>
                          {inv.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Section>

          <Section>
            <SectionHeader title="Previous Bookings" />
            <Card>
              <CardContent className="p-6">
                {!customer.bookings || customer.bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customer.bookings.map((booking: any) => (
                      <div key={booking.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <Link to={`/bookings/${booking.id}`} className="font-medium text-sm text-primary hover:underline block">
                            {booking.booking_id}
                          </Link>
                          <p className="text-xs text-muted-foreground">{new Date(booking.scheduled_date).toLocaleDateString()} - {booking.service_name}</p>
                        </div>
                        <Badge variant="outline">{booking.status}</Badge>
                      </div>
                    ))}
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

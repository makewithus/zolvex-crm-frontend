import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInvoice, useUpdateInvoiceStatus, useDownloadPdf } from '../hooks/useInvoices';
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { useCurrentUser } from '@/features/auth';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Send, CheckCircle2, FileText, Activity, CreditCard } from 'lucide-react';
import { RecordPaymentDialog } from '../../payments/components/RecordPaymentDialog';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading } = useInvoice(id!);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateInvoiceStatus();
  const { mutate: downloadPdf, isPending: isDownloading } = useDownloadPdf();
  const { data: user } = useCurrentUser();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900">Invoice Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">The invoice you're looking for doesn't exist or you don't have access.</p>
        <Link to="/invoices" className="text-blue-600 hover:underline">Return to Invoices</Link>
      </div>
    );
  }

  const canIssue = ['Super Admin', 'Finance', 'City Manager'].includes(user?.role.name || '') && invoice.status === 'Draft';
  const canRecordPayment = ['Super Admin', 'Finance', 'City Manager'].includes(user?.role.name || '') && invoice.status === 'Issued' && Number(invoice.balance_due) > 0;

  const handleIssue = () => {
    if (window.confirm('Are you sure you want to issue this invoice? It will become immutable.')) {
      updateStatus({ id: invoice.id, status: 'Issued' });
    }
  };

  const handleDownload = () => {
    downloadPdf({ id: invoice.id, invoiceNumber: invoice.invoice_number });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/invoices" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h1>
            <InvoiceStatusBadge status={invoice.status} />
            <PaymentStatusBadge status={invoice.payment_status} />
          </div>
          <p className="text-sm text-gray-500">
            Issued on {format(new Date(invoice.issue_date), 'MMMM d, yyyy')} • Due on {format(new Date(invoice.due_date), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </Button>
          
          {canIssue && (
            <Button 
              onClick={handleIssue} 
              disabled={isUpdating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
              Issue Invoice
            </Button>
          )}

          {invoice.status !== 'Draft' && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              Immutable Snapshot
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Billed To</h3>
                  <div className="text-gray-900 font-medium">{invoice.customer_name}</div>
                  <div className="text-sm text-gray-600 mt-1">{invoice.customer_phone}</div>
                  <div className="text-sm text-gray-600 mt-1 max-w-[200px] leading-relaxed">
                    {invoice.billing_address}
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Summary</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="inline-block w-24 text-gray-500">Subtotal:</span>
                    <span className="font-medium text-gray-900">₹{Number(invoice.base_amount).toLocaleString('en-IN')}</span>
                  </div>
                  {Number(invoice.discount_amount) > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="inline-block w-24 text-gray-500">Discount:</span>
                      <span className="font-medium text-red-600">-₹{Number(invoice.discount_amount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="inline-block w-24 text-gray-500">Total Tax:</span>
                    <span className="font-medium text-gray-900">₹{Number(invoice.total_tax_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mt-3 pt-3 border-t border-gray-100">
                    <span className="inline-block w-24 text-gray-500 text-sm font-medium">Total:</span>
                    ₹{Number(invoice.final_amount).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Line Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">Service</th>
                        <th className="px-4 py-3 font-medium text-center">Qty</th>
                        <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                        <th className="px-4 py-3 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invoice.items?.map((item: any) => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-4 text-gray-900 font-medium">{item.service_name}</td>
                          <td className="px-4 py-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-4 text-right text-gray-600">₹{Number(item.unit_price).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-4 text-right text-gray-900 font-medium">₹{Number(item.line_total).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-sm">GST Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {Number(invoice.igst_amount) > 0 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IGST ({Number(invoice.igst_percent)}%)</span>
                  <span className="font-medium text-gray-900">₹{Number(invoice.igst_amount).toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">CGST ({Number(invoice.cgst_percent)}%)</span>
                    <span className="font-medium text-gray-900">₹{Number(invoice.cgst_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">SGST ({Number(invoice.sgst_percent)}%)</span>
                    <span className="font-medium text-gray-900">₹{Number(invoice.sgst_amount).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                <span className="font-medium text-gray-700">Total GST</span>
                <span className="font-bold text-gray-900">₹{Number(invoice.total_tax_amount).toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-sm">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-medium text-emerald-600">₹{Number(invoice.amount_paid).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Balance Due</span>
                <span className="font-bold text-red-600">₹{Number(invoice.balance_due).toLocaleString('en-IN')}</span>
              </div>
              {canRecordPayment && (
                <div className="pt-3 border-t border-gray-100 mt-1">
                  <Button 
                    className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setIsPaymentDialogOpen(true)}
                  >
                    <CreditCard className="w-4 h-4" />
                    Record Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <CardTitle className="text-sm m-0">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {invoice.history?.map((hist: any, idx: number) => (
                  <div key={hist.id} className="relative pl-6">
                    {/* Timeline line */}
                    {idx !== invoice.history!.length - 1 && (
                      <div className="absolute left-2.5 top-3 w-[1px] h-full bg-gray-200" />
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-[7px] top-2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white" />
                    
                    <div className="text-sm font-medium text-gray-900">
                      {hist.action} <span className="text-gray-500 font-normal">to</span> {hist.to_status}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(hist.changed_at), 'MMM d, h:mm a')} • {hist.changed_by_role || 'System'}
                    </div>
                    {hist.reason && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1.5 border border-gray-100">
                        "{hist.reason}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isPaymentDialogOpen && (
        <RecordPaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          invoice={invoice}
        />
      )}
    </div>
  );
};

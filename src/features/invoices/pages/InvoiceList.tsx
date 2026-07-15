import React, { useState, useMemo } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { FileText, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const InvoiceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: invoices, isLoading } = useInvoices(
    statusFilter ? { status: statusFilter } : undefined
  );

  const filteredInvoices = useMemo(() => {
    let invs = invoices || [];
    invs = [...invs].sort((a: any, b: any) => new Date(b.created_at || b.issue_date || 0).getTime() - new Date(a.created_at || a.issue_date || 0).getTime());
    return invs.filter((inv: any) =>
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_phone.includes(searchTerm)
    );
  }, [invoices, searchTerm]);

  const totalPages = Math.max(1, Math.ceil((filteredInvoices?.length || 0) / limit));
  const paginatedInvoices = filteredInvoices?.slice((page - 1) * limit, page * limit) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500">Manage financial records and billing.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
             <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice number, customer or phone..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded focus:outline-none focus:border-slate-400 focus:ring-0 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded focus:outline-none focus:border-slate-400 focus:ring-0 text-sm appearance-none bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Issued">Issued</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredInvoices?.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices found</h3>
              <p className="text-gray-500">Adjust your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{invoice.invoice_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{invoice.customer_name}</span>
                          <span className="text-xs text-gray-500">{invoice.customer_phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(invoice.issue_date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">₹{Number(invoice.final_amount).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <InvoiceStatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PaymentStatusBadge status={invoice.payment_status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="text-slate-700 hover:text-slate-900 font-medium text-sm transition-colors"
                        >
                          View Details &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filteredInvoices && filteredInvoices.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, filteredInvoices.length)}</span> of{' '}
                <span className="font-medium">{filteredInvoices.length}</span> invoices
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import React from 'react';
import { usePayments, useDownloadReceipt } from '../hooks/usePayments';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Search, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const PaymentsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const limit = 10;
  
  const { data: payments, isLoading } = usePayments();
  const { mutate: downloadReceipt } = useDownloadReceipt();
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const handleDownload = (id: string, paymentNumber: string) => {
    setDownloadingId(id);
    downloadReceipt({ id, paymentNumber }, {
      onSettled: () => setDownloadingId(null)
    });
  };

  const filteredPayments = React.useMemo(() => {
    let pays = payments || [];
    pays = [...pays].sort((a: any, b: any) => new Date(b.payment_date || b.created_at || 0).getTime() - new Date(a.payment_date || a.created_at || 0).getTime());
    return pays.filter(p => 
      p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.invoice?.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payments, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / limit));
  const paginatedPayments = filteredPayments.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">View and manage all payment receipts</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by Receipt No, Customer Name..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-slate-800">{payment.payment_number}</TableCell>
                      <TableCell className="text-xs text-gray-500">{payment.invoice?.invoice_number ?? '—'}</TableCell>
                      <TableCell>{format(new Date(payment.payment_date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{payment.customer?.name}</div>
                        <div className="text-xs text-gray-500">{payment.customer?.phone}</div>
                      </TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        ₹{Number(payment.amount).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          payment.payment_status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          payment.payment_status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {payment.payment_status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={downloadingId === payment.id}
                          onClick={() => handleDownload(payment.id, payment.payment_number)}
                          title="Download Receipt"
                        >
                          {downloadingId === payment.id ? (
                            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredPayments && filteredPayments.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, filteredPayments.length)}</span> of{' '}
                <span className="font-medium">{filteredPayments.length}</span> payments
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

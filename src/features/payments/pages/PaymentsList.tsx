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
  const { data: payments, isLoading } = usePayments();
  const { mutate: downloadReceipt, isPending: isDownloading } = useDownloadReceipt();
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const handleDownload = (id: string, paymentNumber: string) => {
    setDownloadingId(id);
    downloadReceipt({ id, paymentNumber }, {
      onSettled: () => setDownloadingId(null)
    });
  };

  const filteredPayments = React.useMemo(() => {
    if (!payments) return [];
    return payments.filter(p => 
      p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payments, searchTerm]);

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-blue-600">{payment.payment_number}</TableCell>
                      <TableCell>{format(new Date(payment.payment_date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{payment.customer?.name}</div>
                        <div className="text-xs text-gray-500">{payment.customer?.phone}</div>
                      </TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        ₹{Number(payment.amount).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          payment.payment_status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          payment.payment_status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
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
        </CardContent>
      </Card>
    </div>
  );
};

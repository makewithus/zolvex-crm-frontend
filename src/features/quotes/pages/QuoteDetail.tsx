import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Send, Check, X, Download, Loader2 } from 'lucide-react';
import { useQuote, useSendQuote, useAcceptQuote, useRejectQuote, useDownloadQuotePdf } from '../hooks/useQuotes';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { QuoteStatus } from '../types/quote.types';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DetailCard } from '@/components/ui-custom/DetailCard';

const mapQuoteStatus = (status: QuoteStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'Draft': return 'default';
    case 'Sent': return 'info';
    case 'Viewed': return 'info';
    case 'Accepted': return 'success';
    case 'Rejected': return 'error';
    case 'Expired': return 'warning';
    default: return 'default';
  }
};

export const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quote, isLoading } = useQuote(id!);
  const { mutate: doSend, isPending: sending }   = useSendQuote();
  const { mutate: doAccept } = useAcceptQuote();
  const { mutate: doReject } = useRejectQuote();
  const { mutate: downloadPdf, isPending: downloadingPdf } = useDownloadQuotePdf();

  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject]     = useState(false);
  const [acceptNote, setAcceptNote]     = useState('');
  const [showAccept, setShowAccept]     = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64 text-slate-400 text-[13px] animate-pulse">
          Loading…
        </div>
      </PageContainer>
    );
  }

  if (!quote) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-64 text-red-500 text-[13px]">
          Quote not found
        </div>
      </PageContainer>
    );
  }

  const fmt = (v: string) => parseFloat(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link to="/quotations" className="p-2 hover:bg-gray-100 rounded transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{quote.quote_id}</h1>
              <StatusBadge status={mapQuoteStatus(quote.status)} label={quote.status} />
            </div>
            <p className="text-sm text-gray-500">
              {quote.subject} • Quote for {quote.customer?.name || 'Customer'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            id="btn-download-quote-pdf"
            onClick={() => downloadPdf({ id: quote.id, quoteNumber: quote.quote_id })}
            disabled={downloadingPdf}
            className="flex items-center gap-2 shadow-none"
          >
            {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloadingPdf ? 'Downloading...' : 'Download PDF'}
          </Button>

          {quote.status === 'Draft' && (
            <Button
              id="btn-send-quote-detail"
              onClick={() => setShowSendConfirm(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded shadow-none"
            >
              <Send className="w-4 h-4" /> Send Quote
            </Button>
          )}

          {quote.status === 'Sent' && (
            <>
              <Button
                id="btn-accept-quote-detail"
                onClick={() => setShowAccept(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-none"
              >
                <Check className="w-4 h-4" /> Mark Accepted
              </Button>
              <Button
                id="btn-reject-quote-detail"
                onClick={() => setShowReject(true)}
                variant="outline"
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 rounded shadow-none"
              >
                <X className="w-4 h-4" /> Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Details & Line Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Details Card */}
          <DetailCard
            title="Quotation Information"
            data={[
              { label: 'Customer Name', value: quote.customer?.name || '—' },
              { label: 'Customer Phone', value: quote.customer?.phone || '—' },
              { label: 'Subject', value: quote.subject },
              { label: 'Status', value: <StatusBadge status={mapQuoteStatus(quote.status)} label={quote.status} /> }
            ]}
          />

          {/* Line Items Card */}
          <Card>
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold">
                  <tr>
                    {['Description','Qty','Unit Price','Tax %','Total'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(quote.line_items ?? []).map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-slate-800">{item.description}</td>
                      <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-slate-700">₹{fmt(item.unit_price)}</td>
                      <td className="px-4 py-3 text-slate-500">{item.tax_percent}%</td>
                      <td className="px-4 py-3 text-slate-900 font-medium">₹{fmt(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Notes & Terms Conditions */}
          {(quote.notes || quote.terms || quote.description) && (
            <Card>
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Terms & Additional Info</CardTitle>
              </CardHeader>
              <CardContent className="py-4 space-y-4 text-sm">
                {quote.description && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-slate-700 whitespace-pre-wrap">{quote.description}</p>
                  </div>
                )}
                {quote.notes && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-slate-700 whitespace-pre-wrap">{quote.notes}</p>
                  </div>
                )}
                {quote.terms && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Terms & Conditions</p>
                    <p className="text-slate-700 whitespace-pre-wrap">{quote.terms}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Timeline & Summary Totals */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-3">
              {[
                { label: 'Subtotal',     value: `₹${fmt(quote.subtotal)}` },
                ...(Number(quote.discount_amount) > 0 ? [
                  { label: 'Discount',   value: `-₹${fmt(quote.discount_amount)}` },
                  { label: 'Taxable',    value: `₹${fmt(String(Number(quote.subtotal) - Number(quote.discount_amount)))}` }
                ] : []),
                { label: 'Tax',          value: `₹${fmt(quote.tax_amount)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Grand Total</span>
                <span className="text-lg font-bold text-gray-900">₹{fmt(quote.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-4 text-sm">
              {[
                { label: 'Created',  value: quote.created_at },
                { label: 'Sent',     value: quote.sent_at },
                { label: 'Viewed',   value: quote.viewed_at },
                { label: 'Valid Until', value: quote.valid_until },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
                  <span className="text-gray-900 font-medium">{value ? format(parseISO(value), 'dd MMM yyyy HH:mm') : '—'}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Accept Dialog */}
      {showAccept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-[15px] font-semibold text-slate-900 mb-1">Mark Quote Accepted</h2>
            <p className="text-[12px] text-slate-500 mb-4">The quote will be marked as Accepted. Staff can then manually create a Booking from the Lead.</p>
            <label className="block text-[12px] font-medium text-slate-700 mb-1">Note (optional)</label>
            <textarea value={acceptNote} onChange={e => setAcceptNote(e.target.value)} rows={2}
              className="w-full border border-slate-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAccept(false)} className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded transition-colors">Cancel</button>
              <button onClick={() => { doAccept({ id: quote.id, note: acceptNote }, { onSuccess: () => setShowAccept(false) }); }}
                className="px-4 py-2 text-[12px] bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">Accept</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Reject Quotation</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Provide a reason for rejection..."
              rows={3}
              className="w-full border border-slate-200 rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowReject(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors">
                Cancel
              </button>
              <button
                onClick={() => doReject({ id: quote.id, reason: rejectReason }, { onSuccess: () => setShowReject(false) })}
                disabled={!rejectReason}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-40"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showSendConfirm}
        onClose={() => setShowSendConfirm(false)}
        onConfirm={() => {
          doSend({ id: quote.id }, { onSuccess: () => { setShowSendConfirm(false); navigate('/quotations'); } });
        }}
        title="Send Quote"
        description="Are you sure you want to send this quote? The linked Lead will be updated to QuotationSent."
        confirmText="Send Quote"
        isPending={sending}
      />
    </PageContainer>
  );
};

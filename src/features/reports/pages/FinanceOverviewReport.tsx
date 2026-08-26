import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFinanceSummary } from '../hooks/useReports';
import { ReportFilters } from '../api/reports.api';
import {
  DollarSign, TrendingUp, AlertCircle, Receipt,
  ChevronRight, Wallet, TrendingDown, FileText,
  CheckCircle2, XCircle, Send, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportMenu } from '../components/ExportMenu';
import { subDays } from 'date-fns';

const fmt = (val: number) =>
  `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const PRESETS = [
  { label: 'All Time',     start: '',                                    end: '' },
  { label: 'Last 7 Days',  start: subDays(new Date(), 7).toISOString(),  end: new Date().toISOString() },
  { label: 'Last 30 Days', start: subDays(new Date(), 30).toISOString(), end: new Date().toISOString() },
  { label: 'Last 90 Days', start: subDays(new Date(), 90).toISOString(), end: new Date().toISOString() },
];

const KCard = ({
  title, value, sub, icon: Icon, loading,
  valueClass = 'text-gray-900',
}: {
  title: string; value: string; sub?: string; icon: any;
  loading?: boolean; valueClass?: string;
}) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading
            ? <div className="h-7 w-36 bg-gray-100 rounded animate-pulse mt-1" />
            : <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</p>
          }
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </CardContent>
  </Card>
);

const StatRow = ({
  label, value, sub, valueClass = 'text-gray-900', loading,
}: {
  label: string; value: string; sub?: string; valueClass?: string; loading?: boolean;
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="text-right">
      {loading
        ? <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        : <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
      }
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
);

const PipelineBar = ({
  label, count, total, icon: Icon, iconClass,
}: {
  label: string; count: number; total: number; icon: any; iconClass: string;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const bgClass = iconClass.replace('text-', 'bg-');
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-gray-500">
          <Icon className={`w-3.5 h-3.5 ${iconClass}`} />{label}
        </span>
        <span className="font-semibold text-gray-700">
          {count} <span className="text-gray-400 font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded overflow-hidden">
        <div className={`h-full rounded ${bgClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const FinanceOverviewReport: React.FC = () => {
  const [preset, setPreset] = useState(0);
  const filters: ReportFilters = {
    start_date: PRESETS[preset].start || undefined,
    end_date:   PRESETS[preset].end   || undefined,
  };

  const { data, isLoading } = useFinanceSummary(filters);

  const revenue     = data?.revenue;
  const collections = data?.collections;
  const outstanding = data?.outstanding;
  const gst         = data?.gst;
  const expenses    = data?.expenses;
  const quotations  = data?.quotations;
  const net_profit  = data?.net_profit ?? 0;
  const isProfit    = net_profit >= 0;
  const totalQuotes = quotations?.quotes_created ?? 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/reports" className="hover:text-gray-600 transition-colors">Reports</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Finance Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Revenue, Expenses, Net Profit and Quotation Pipeline. Existing invoice/payment calculations are unchanged.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPreset(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  preset === i
                    ? 'bg-white border border-slate-200 text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <ExportMenu domain="finance-summary" filters={filters} />
        </div>
      </div>

      {/* Top KPIs */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Revenue &amp; Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KCard
            title="Invoice Revenue"
            value={fmt(revenue?.total_revenue ?? 0)}
            sub={`${revenue?.invoice_count ?? 0} issued invoices`}
            icon={DollarSign}
            loading={isLoading}
          />
          <KCard
            title="Total Collections"
            value={fmt(collections?.total_collected ?? 0)}
            sub={`${collections?.payment_count ?? 0} completed payments`}
            icon={TrendingUp}
            loading={isLoading}
          />
          <KCard
            title="Outstanding"
            value={fmt(outstanding?.total_outstanding ?? 0)}
            sub={`${outstanding?.outstanding_invoices_count ?? 0} invoices unpaid`}
            icon={AlertCircle}
            valueClass="text-amber-600"
            loading={isLoading}
          />
          <KCard
            title="Net Profit"
            value={(isProfit ? '+' : '-') + fmt(Math.abs(net_profit))}
            sub="Invoice Revenue − Approved Expenses"
            icon={isProfit ? TrendingUp : TrendingDown}
            valueClass={isProfit ? 'text-emerald-600' : 'text-rose-600'}
            loading={isLoading}
          />
        </div>
      </section>

      {/* Revenue Breakdown + Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-500" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatRow label="Invoice Revenue"      value={fmt(revenue?.total_revenue ?? 0)}  loading={isLoading} />
            <StatRow label="Subtotal (excl. tax)" value={fmt(revenue?.total_subtotal ?? 0)} loading={isLoading} />
            <StatRow label="Total Tax (GST)"      value={fmt(revenue?.total_tax ?? 0)}       loading={isLoading} />
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">GST Breakdown</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'CGST', val: gst?.cgst ?? 0 },
                  { label: 'SGST', val: gst?.sgst ?? 0 },
                  { label: 'IGST', val: gst?.igst ?? 0 },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 border border-slate-100 rounded p-2">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    {isLoading
                      ? <div className="h-4 bg-gray-200 rounded animate-pulse mt-1 mx-auto w-16" />
                      : <p className="text-sm font-bold text-gray-700 mt-0.5">{fmt(item.val)}</p>
                    }
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 text-right">
              <Link to="/reports/financial" className="text-xs text-slate-600 hover:underline flex items-center gap-0.5 justify-end">
                Full Financial Report <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Expense Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-rose-500" />
              Expense Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatRow
              label="Approved Expenses"
              value={fmt(expenses?.approved_expenses ?? 0)}
              sub={`${expenses?.expense_count ?? 0} approved records`}
              valueClass="text-rose-600"
              loading={isLoading}
            />
            <StatRow
              label="Draft / Submitted / Rejected"
              value="₹0"
              sub="Excluded from reporting"
              valueClass="text-gray-400"
            />
            <div className="mt-4 p-3 rounded bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500">Net Profit</span>
                <span className={`text-sm font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isProfit ? '+' : '-'}{fmt(Math.abs(net_profit))}
                </span>
              </div>
              <p className="text-xs text-gray-400">Invoice Revenue − Approved Expenses</p>
            </div>
            <div className="mt-3 p-3 rounded bg-amber-50 border border-amber-100 text-xs text-amber-800">
              <strong>Note:</strong> Only Approved expenses are included. GST is not applied to expenses
              as the Expense model does not carry tax fields.
            </div>
            <div className="mt-3 text-right">
              <Link to="/expenses" className="text-xs text-slate-600 hover:underline flex items-center gap-0.5 justify-end">
                View All Expenses <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotation Pipeline */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              Quotation Pipeline
            </CardTitle>
            <Link to="/quotations" className="text-xs text-slate-600 hover:underline flex items-center gap-0.5">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Counts */}
            <div className="space-y-3">
              <PipelineBar
                label="Total Created"
                count={quotations?.quotes_created ?? 0}
                total={quotations?.quotes_created ?? 0}
                icon={FileText}
                iconClass="text-slate-500"
              />
              <PipelineBar
                label="Sent"
                count={quotations?.quotes_sent ?? 0}
                total={totalQuotes}
                icon={Send}
                iconClass="text-blue-500"
              />
              <PipelineBar
                label="Accepted"
                count={quotations?.quotes_accepted ?? 0}
                total={totalQuotes}
                icon={CheckCircle2}
                iconClass="text-emerald-500"
              />
              <PipelineBar
                label="Rejected"
                count={quotations?.quotes_rejected ?? 0}
                total={totalQuotes}
                icon={XCircle}
                iconClass="text-rose-500"
              />
            </div>

            {/* Pipeline value */}
            <div className="flex flex-col gap-3">
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded p-6 text-center">
                <p className="text-xs font-medium text-gray-400 mb-1">Pipeline Value</p>
                <p className="text-xs text-gray-400 mb-3">Sent + Viewed quotes only</p>
                {isLoading
                  ? <div className="h-9 w-36 bg-gray-200 rounded animate-pulse" />
                  : <p className="text-3xl font-bold text-gray-800">{fmt(quotations?.pipeline_value ?? 0)}</p>
                }
              </div>
              <div className="p-3 rounded bg-blue-50 border border-blue-100 text-xs text-blue-800">
                <strong>Revenue integrity:</strong> Accepted quotes are excluded from pipeline value
                to prevent double-counting with Invoice Revenue.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drill-down links */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Link to="/reports/financial" className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors">
          Financial Report <ChevronRight className="w-4 h-4" />
        </Link>
        <Link to="/reports/gst" className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors">
          GST Report <ChevronRight className="w-4 h-4" />
        </Link>
        <Link to="/expenses" className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors">
          Expenses <ChevronRight className="w-4 h-4" />
        </Link>
        <Link to="/quotations" className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors">
          Quotations <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

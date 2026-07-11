import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFinancialReport, useGSTReport } from '../hooks/useReports';
import { ReportFilters } from '../api/reports.api';
import { DollarSign, TrendingUp, AlertCircle, Receipt, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportMenu } from '../components/ExportMenu';
import { subDays } from 'date-fns';

const formatCurrency = (val: number) =>
  `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const PRESETS = [
  { label: 'All Time', start: '', end: '' },
  { label: 'Last 7 Days', start: subDays(new Date(), 7).toISOString(), end: new Date().toISOString() },
  { label: 'Last 30 Days', start: subDays(new Date(), 30).toISOString(), end: new Date().toISOString() },
  { label: 'Last 90 Days', start: subDays(new Date(), 90).toISOString(), end: new Date().toISOString() },
];

const SummaryCard = ({
  title, value, sub, icon: Icon, color, bg, loading
}: { title: string; value: string; sub: string; icon: any; color: string; bg: string; loading?: boolean }) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading
            ? <div className="h-8 w-32 bg-gray-100 rounded animate-pulse mt-1" />
            : <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          }
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const FinancialReport: React.FC = () => {
  const [preset, setPreset] = useState(0);
  const filters: ReportFilters = {
    start_date: PRESETS[preset].start || undefined,
    end_date: PRESETS[preset].end || undefined,
  };

  const { data, isLoading } = useFinancialReport(filters);
  const { data: gstData, isLoading: gstLoading } = useGSTReport(filters);

  const revenue = data?.revenue;
  const outstanding = data?.outstanding;
  const collections = data?.collections;
  const gst = gstData?.gst;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/reports" className="hover:text-gray-600">Reports</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Financial</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
          <p className="text-sm text-gray-500">Revenue, Collections, Outstanding & GST from the frozen invoice/payment engine.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Date Presets */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPreset(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  preset === i ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <ExportMenu domain="financial" filters={filters} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(revenue?.total_revenue ?? 0)}
          sub={`${revenue?.invoice_count ?? 0} issued invoices`}
          icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50"
          loading={isLoading}
        />
        <SummaryCard
          title="Total Collections"
          value={formatCurrency(collections?.total_collected ?? 0)}
          sub={`${collections?.payment_count ?? 0} completed payments`}
          icon={TrendingUp} color="text-blue-600" bg="bg-blue-50"
          loading={isLoading}
        />
        <SummaryCard
          title="Outstanding"
          value={formatCurrency(outstanding?.total_outstanding ?? 0)}
          sub={`${outstanding?.outstanding_invoices_count ?? 0} invoices unpaid`}
          icon={AlertCircle} color="text-amber-600" bg="bg-amber-50"
          loading={isLoading}
        />
      </div>

      {/* GST Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-orange-500" />
            GST Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gstLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { label: 'CGST', value: gst?.cgst ?? 0, color: 'text-blue-700', bg: 'bg-blue-50' },
                { label: 'SGST', value: gst?.sgst ?? 0, color: 'text-violet-700', bg: 'bg-violet-50' },
                { label: 'IGST', value: gst?.igst ?? 0, color: 'text-orange-700', bg: 'bg-orange-50' },
                { label: 'Total Tax', value: gst?.total_tax ?? 0, color: 'text-gray-900', bg: 'bg-gray-100' },
              ].map(item => (
                <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center`}>
                  <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{formatCurrency(item.value)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drill-down Links */}
      <div className="flex gap-4 text-sm">
        <Link to="/invoices" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
          View All Invoices <ChevronRight className="w-4 h-4" />
        </Link>
        <Link to="/payments" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
          View All Payments <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

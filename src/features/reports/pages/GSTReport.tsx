import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSTReport } from '../hooks/useReports';
import { ReportFilters } from '../api/reports.api';
import { Receipt, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ExportMenu } from '../components/ExportMenu';
import { subDays } from 'date-fns';

const PRESETS = [
  { label: 'All Time', start: '', end: '' },
  { label: 'Last 7 Days', start: subDays(new Date(), 7).toISOString(), end: new Date().toISOString() },
  { label: 'Last 30 Days', start: subDays(new Date(), 30).toISOString(), end: new Date().toISOString() },
  { label: 'Last 90 Days', start: subDays(new Date(), 90).toISOString(), end: new Date().toISOString() },
];

const formatCurrency = (val: number) =>
  `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export const GSTReport: React.FC = () => {
  const [preset, setPreset] = useState(0);
  const filters: ReportFilters = {
    start_date: PRESETS[preset].start || undefined,
    end_date: PRESETS[preset].end || undefined,
  };

  const { data, isLoading } = useGSTReport(filters);
  const gst = data?.gst;

  const gstItems = [
    { label: 'CGST', key: 'cgst' as const, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Central Goods & Services Tax' },
    { label: 'SGST', key: 'sgst' as const, color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100', desc: 'State Goods & Services Tax' },
    { label: 'IGST', key: 'igst' as const, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100', desc: 'Integrated Goods & Services Tax' },
    { label: 'Total Tax', key: 'total_tax' as const, color: 'text-gray-900', bg: 'bg-gray-50', border: 'border-gray-200', desc: 'Total tax collected across all types' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/reports" className="hover:text-gray-600 transition-colors">Reports</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">GST Report</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">GST Report</h1>
          <p className="text-sm text-gray-500 mt-1">
            CGST, SGST and IGST breakdown from issued invoices. Read-only — sourced from the frozen invoice engine.
          </p>
        </div>
        <div className="flex items-center gap-4">
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
          <ExportMenu domain="gst" filters={filters} />
        </div>
      </div>

      {/* GST Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gstItems.map(item => (
          <Card key={item.key} className={`border ${item.border}`}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Receipt className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
              <p className="text-xs text-gray-400 mb-2">{item.desc}</p>
              {isLoading ? (
                <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
              ) : (
                <p className={`text-xl font-bold ${item.color}`}>
                  {formatCurrency(gst?.[item.key] ?? 0)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for zero tax */}
      {!isLoading && gst && gst.total_tax === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">No GST data for this period</h3>
            <p className="text-sm text-gray-400">No issued invoices with tax were found for the selected date range.</p>
          </CardContent>
        </Card>
      )}

      {/* Breakdown note */}
      {!isLoading && gst && gst.total_tax > 0 && (
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 text-sm text-amber-800">
            <strong>Note:</strong> All figures are sourced from immutable invoice snapshots at the time of issuance.
            Tax rates are locked at invoice creation and cannot be retroactively changed.
          </CardContent>
        </Card>
      )}

      {/* Drill-down */}
      <div className="flex gap-4 text-sm">
        <Link to="/invoices" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors">
          View All Invoices <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

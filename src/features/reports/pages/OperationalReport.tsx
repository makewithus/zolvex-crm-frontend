import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOperationalReport } from '../hooks/useReports';
import { ReportFilters } from '../api/reports.api';
import { Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportMenu } from '../components/ExportMenu';
import { subDays } from 'date-fns';

const PRESETS = [
  { label: 'All Time', start: '', end: '' },
  { label: 'Last 7 Days', start: subDays(new Date(), 7).toISOString(), end: new Date().toISOString() },
  { label: 'Last 30 Days', start: subDays(new Date(), 30).toISOString(), end: new Date().toISOString() },
];

const STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-700',
  InProgress: 'bg-blue-100 text-blue-800',
  Pending: 'bg-amber-100 text-amber-800',
  Assigned: 'bg-indigo-100 text-indigo-800',
  Started: 'bg-cyan-100 text-cyan-800',
  Travelling: 'bg-sky-100 text-sky-800',
};

const StatusTable = ({ title, icon: Icon, data, loading, drillLink }: {
  title: string; icon: any; data: Record<string, number>;
  loading: boolean; drillLink: string;
}) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Icon className="w-4 h-4 text-blue-500" />
            {title}
          </CardTitle>
          <Link to={drillLink} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : total === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No records found for this period</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-gray-500 font-medium pb-2">Status</th>
                  <th className="text-right text-gray-500 font-medium pb-2">Count</th>
                  <th className="text-right text-gray-500 font-medium pb-2">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Object.entries(data).sort(([, a], [, b]) => b - a).map(([status, count]) => (
                  <tr key={status} className="hover:bg-gray-50">
                    <td className="py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}>
                        {status}
                      </span>
                    </td>
                    <td className="text-right font-semibold text-gray-900 py-2.5">{count}</td>
                    <td className="text-right text-gray-500 py-2.5">{total > 0 ? Math.round(count / total * 100) : 0}%</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200">
                  <td className="pt-2.5 text-gray-700 font-medium">Total</td>
                  <td className="text-right pt-2.5 font-bold text-gray-900">{total}</td>
                  <td className="text-right pt-2.5 text-gray-400">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const OperationalReport: React.FC = () => {
  const [preset, setPreset] = useState(0);
  const filters: ReportFilters = {
    start_date: PRESETS[preset].start || undefined,
    end_date: PRESETS[preset].end || undefined,
  };

  const { data, isLoading } = useOperationalReport(filters);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/reports" className="hover:text-gray-600">Reports</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Operational</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Operational Report</h1>
          <p className="text-sm text-gray-500">Booking and job status breakdown from the transaction engine.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => setPreset(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${preset === i ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <ExportMenu domain="operational" filters={filters} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StatusTable
          title="Bookings by Status"
          icon={Calendar}
          data={data?.bookings || {}}
          loading={isLoading}
          drillLink="/bookings"
        />
        <StatusTable
          title="Jobs by Status"
          icon={Briefcase}
          data={data?.jobs || {}}
          loading={isLoading}
          drillLink="/jobs"
        />
      </div>
    </div>
  );
};

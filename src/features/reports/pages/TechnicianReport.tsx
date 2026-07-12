import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTechnicianReport } from '../hooks/useReports';

import { ReportFilters } from '../api/reports.api';
import { Clock, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportMenu } from '../components/ExportMenu';
import { subDays } from 'date-fns';

const PRESETS = [
  { label: 'All Time', start: '', end: '' },
  { label: 'Last 7 Days', start: subDays(new Date(), 7).toISOString(), end: new Date().toISOString() },
  { label: 'Last 30 Days', start: subDays(new Date(), 30).toISOString(), end: new Date().toISOString() },
];

const fmtMins = (mins: number) => {
  if (mins === 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const UtilBar = ({ scheduled, actual }: { scheduled: number; actual: number }) => {
  const hasData = actual > 0;
  const pct = hasData && scheduled > 0 ? Math.min(100, Math.round((actual / scheduled) * 100)) : 0;
  const color = pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-blue-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';

  if (!hasData) {
    return <span className="text-xs text-gray-400 italic">No timing data</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
    </div>
  );
};

export const TechnicianReport: React.FC = () => {
  const [preset, setPreset] = useState(0);
  const filters: ReportFilters = {
    start_date: PRESETS[preset].start || undefined,
    end_date: PRESETS[preset].end || undefined,
  };

  const { data, isLoading } = useTechnicianReport(filters);
  const productivity = data?.productivity || {};

  const entries = Object.entries(productivity);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/reports" className="hover:text-gray-600">Reports</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Technician</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Technician Report</h1>
          <p className="text-sm text-gray-500">Job completion, scheduled vs actual time per field staff.</p>
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
          <ExportMenu domain="technician" filters={filters} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            Productivity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No completed jobs found for this period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-gray-500 font-medium pb-3">Technician</th>
                    <th className="text-center text-gray-500 font-medium pb-3">Jobs</th>
                    <th className="text-center text-gray-500 font-medium pb-3">Scheduled</th>
                    <th className="text-center text-gray-500 font-medium pb-3">Actual</th>
                    <th className="text-left text-gray-500 font-medium pb-3 pl-4">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {entries.sort(([, a], [, b]) => b.jobs_completed - a.jobs_completed).map(([id, stats]) => (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="font-medium text-gray-900">{stats.name || 'Unknown'}</div>
                      </td>
                      <td className="text-center py-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          {stats.jobs_completed}
                        </span>
                      </td>
                      <td className="text-center py-3 text-gray-600">
                        <span className="flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {fmtMins(stats.total_scheduled_mins)}
                        </span>
                      </td>
                      <td className="text-center py-3 text-gray-600">
                        {fmtMins(stats.total_actual_mins)
                          ? <span>{fmtMins(stats.total_actual_mins)}</span>
                          : <span className="text-gray-400 italic text-xs">Not recorded</span>
                        }
                      </td>
                      <td className="pl-4 py-3 min-w-[160px]">
                        <UtilBar scheduled={stats.total_scheduled_mins} actual={stats.total_actual_mins} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

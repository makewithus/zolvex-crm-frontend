export const CalendarKPIs = ({ kpis }: { kpis: any }) => {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Today's Jobs</p>
        <p className="text-2xl font-bold text-slate-900">{kpis.total_today}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Unassigned</p>
        <p className="text-2xl font-bold text-blue-600">{kpis.unassigned}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Running</p>
        <p className="text-2xl font-bold text-yellow-600">{kpis.running}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Completed</p>
        <p className="text-2xl font-bold text-green-600">{kpis.completed}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Delayed</p>
        <p className="text-2xl font-bold text-orange-600">{kpis.delayed}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Cancelled</p>
        <p className="text-2xl font-bold text-red-600">{kpis.cancelled}</p>
      </div>
    </div>
  );
};

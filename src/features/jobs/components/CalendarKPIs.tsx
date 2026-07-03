interface KPIData {
  total_today: number;
  unassigned: number;
  assigned: number;
  running: number;
  completed: number;
  delayed: number;
  cancelled: number;
}

export const CalendarKPIs = ({ kpis }: { kpis?: KPIData }) => {
  if (!kpis) return null;

  const cards = [
    { label: "Active Today", value: kpis.total_today, valueClass: "text-slate-900" },
    { label: "Unassigned",   value: kpis.unassigned,  valueClass: "text-blue-600" },
    { label: "Assigned",     value: kpis.assigned,    valueClass: "text-indigo-600" },
    { label: "Running",      value: kpis.running,     valueClass: "text-yellow-600" },
    { label: "Completed",    value: kpis.completed,   valueClass: "text-green-600" },
    { label: "Delayed",      value: kpis.delayed,     valueClass: "text-orange-600" },
    { label: "Cancelled",    value: kpis.cancelled,   valueClass: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-5 flex-shrink-0">
      {cards.map(({ label, value, valueClass }) => (
        <div key={label} className="bg-white px-4 py-3 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
          <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
      ))}
    </div>
  );
};

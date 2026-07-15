export const JOB_STATUS_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  Pending: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  Assigned: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Accepted: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  Travelling: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  Arrived: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Started: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Failed: { bg: 'bg-red-50', text: 'text-red-750', border: 'border-red-200' },
  NoAccess: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  CustomerNotAvailable: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Rescheduled: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

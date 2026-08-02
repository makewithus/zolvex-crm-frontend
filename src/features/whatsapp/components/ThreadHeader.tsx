import React from 'react';
import { Phone, UserCheck, CheckSquare, Circle } from 'lucide-react';
import type { WhatsAppThread } from '../api/whatsappApi';

interface Props {
  thread: WhatsAppThread;
  onAssign: () => void;
  onResolve: () => void;
  resolving: boolean;
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-slate-100 text-slate-500',
};

export const ThreadHeader: React.FC<Props> = ({ thread, onAssign, onResolve, resolving }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm uppercase">
          {thread.customer_phone.slice(-2)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-slate-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-800 truncate">
              {thread.customer_phone}
            </span>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium mt-0.5 ${statusColors[thread.status]}`}>
            <Circle size={5} fill="currentColor" />
            {thread.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onAssign}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          title="Assign conversation"
        >
          <UserCheck size={13} />
          <span className="hidden sm:inline">Assign</span>
        </button>

        {thread.status !== 'RESOLVED' && (
          <button
            onClick={onResolve}
            disabled={resolving}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            title="Mark as resolved"
          >
            <CheckSquare size={13} />
            <span className="hidden sm:inline">Resolve</span>
          </button>
        )}
      </div>
    </div>
  );
};

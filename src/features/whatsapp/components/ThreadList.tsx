import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { WhatsAppThread } from '../api/whatsappApi';
import { MessageCircle, Circle } from 'lucide-react';

interface Props {
  threads: WhatsAppThread[];
  selectedId: string | null;
  onSelect: (thread: WhatsAppThread) => void;
  loading: boolean;
}

const statusColors: Record<string, string> = {
  OPEN: 'text-green-600',
  ASSIGNED: 'text-blue-600',
  RESOLVED: 'text-slate-400',
};

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  ASSIGNED: 'Assigned',
  RESOLVED: 'Resolved',
};

export const ThreadList: React.FC<Props> = ({ threads, selectedId, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse flex gap-3 p-3 rounded-md bg-slate-100 h-16" />
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 p-8">
        <MessageCircle size={36} strokeWidth={1.5} />
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {threads.map(thread => (
        <button
          key={thread.id}
          onClick={() => onSelect(thread)}
          className={`flex items-start gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left w-full ${
            selectedId === thread.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
          }`}
        >
          {/* Avatar */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm uppercase">
            {thread.customer_phone.slice(-2)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-medium text-slate-800 truncate">
                {thread.customer_phone}
              </span>
              {thread.last_message_at && (
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true })}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className={`text-xs flex items-center gap-1 ${statusColors[thread.status]}`}>
                <Circle size={6} fill="currentColor" />
                {statusLabels[thread.status]}
              </span>
              {thread.unread_count > 0 && (
                <span className="flex-shrink-0 inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold text-white bg-blue-600 rounded-full">
                  {thread.unread_count}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

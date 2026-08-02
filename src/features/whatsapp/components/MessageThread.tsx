import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import type { WhatsAppMessage } from '../api/whatsappApi';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface Props {
  messages: WhatsAppMessage[];
  loading: boolean;
}

const StatusIcon: React.FC<{ status: WhatsAppMessage['status'] }> = ({ status }) => {
  if (status === 'READ') return <CheckCheck size={12} className="text-blue-500" />;
  if (status === 'DELIVERED') return <CheckCheck size={12} className="text-slate-400" />;
  if (status === 'SENT') return <Check size={12} className="text-slate-400" />;
  if (status === 'FAILED') return <span className="text-red-500 text-[10px]">!</span>;
  return <Clock size={12} className="text-slate-300" />;
};

export const MessageThread: React.FC<Props> = ({ messages, loading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">
        {[1, 2, 3].map(i => (
          <div key={i} className={`animate-pulse h-10 max-w-[60%] rounded-2xl bg-slate-100 ${i % 2 === 0 ? 'self-end' : 'self-start'}`} />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        No messages yet. Start the conversation.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
      {messages.map((msg, idx) => {
        const isOutbound = msg.direction === 'OUTBOUND';
        const showDate =
          idx === 0 ||
          new Date(msg.created_at).toDateString() !==
            new Date(messages[idx - 1].created_at).toDateString();

        return (
          <React.Fragment key={msg.id}>
            {showDate && (
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {format(new Date(msg.created_at), 'MMMM d, yyyy')}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            )}
            <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-3.5 py-2 shadow-sm ${
                  isOutbound
                    ? 'bg-blue-600 rounded-br-sm'
                    : 'bg-white border border-slate-200 rounded-bl-sm'
                }`}
              >
                <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isOutbound ? 'text-white' : 'text-slate-800'}`}>
                  {msg.body}
                </p>
                <div className={`flex items-center gap-1 mt-1 justify-end ${isOutbound ? 'text-blue-200' : 'text-slate-400'}`}>
                  <span className="text-[10px]">
                    {format(new Date(msg.created_at), 'h:mm a')}
                  </span>
                  {isOutbound && <StatusIcon status={msg.status} />}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

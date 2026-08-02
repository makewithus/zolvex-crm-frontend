import React, { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import type { WhatsAppThread } from '../api/whatsappApi';

interface Props {
  thread: WhatsAppThread;
  onSend: (body: string) => Promise<void>;
  sending: boolean;
}

// Meta allows free-form text only within 24h of the last customer message.
// Outside that window, only approved templates can be sent.
const isOutside24hWindow = (thread: WhatsAppThread): boolean => {
  if (!thread.last_message_at) return true;
  const lastMsg = new Date(thread.last_message_at);
  const now = new Date();
  const diffHours = (now.getTime() - lastMsg.getTime()) / (1000 * 60 * 60);
  return diffHours > 24;
};

export const MessageInput: React.FC<Props> = ({ thread, onSend, sending }) => {
  const [text, setText] = useState('');
  const outside24h = isOutside24hWindow(thread);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    await onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      {/* 24h window warning */}
      {outside24h && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-700 text-xs">
          <AlertTriangle size={13} className="flex-shrink-0" />
          <span>
            <strong>24-hour window may have closed.</strong> Meta only allows free-text replies within 24h
            of the customer's last message. Outside this window, only approved templates can be sent.
          </span>
        </div>
      )}

      <div className="flex items-end gap-2 px-3 py-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          rows={1}
          className="flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition max-h-32 overflow-y-auto"
          style={{ minHeight: '38px' }}
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Send message"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

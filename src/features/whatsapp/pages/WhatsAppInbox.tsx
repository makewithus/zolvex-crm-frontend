import React, { useState, useEffect, useCallback } from 'react';
import { whatsappApi, WhatsAppThread, WhatsAppMessage } from '../api/whatsappApi';
import { ThreadList } from '../components/ThreadList';
import { MessageThread } from '../components/MessageThread';
import { MessageInput } from '../components/MessageInput';
import { ThreadHeader } from '../components/ThreadHeader';
import { AssignThreadModal } from '../components/AssignThreadModal';
import { MessageCircle, RefreshCw } from 'lucide-react';

type StatusFilter = 'ALL' | 'OPEN' | 'ASSIGNED' | 'RESOLVED';

const WhatsAppInbox: React.FC = () => {
  const [threads, setThreads] = useState<WhatsAppThread[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [selectedThread, setSelectedThread] = useState<WhatsAppThread | null>(null);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('OPEN');
  const [totalThreads, setTotalThreads] = useState(0);

  const loadThreads = useCallback(async () => {
    setThreadsLoading(true);
    try {
      const params = statusFilter === 'ALL' ? {} : { status: statusFilter };
      const res = await whatsappApi.getThreads(params);
      setThreads(res.threads);
      setTotalThreads(res.total);
    } catch (err) {
      console.error('Failed to load threads', err);
    } finally {
      setThreadsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const loadMessages = useCallback(async (threadId: string) => {
    setMessagesLoading(true);
    try {
      const res = await whatsappApi.getMessages(threadId);
      setMessages(res.messages);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const handleSelectThread = (thread: WhatsAppThread) => {
    setSelectedThread(thread);
    loadMessages(thread.id);
  };

  const handleSend = async (body: string) => {
    if (!selectedThread) return;
    setSending(true);
    try {
      const res = await whatsappApi.sendMessage(selectedThread.id, body);
      setMessages(prev => [...prev, res.message]);
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedThread) return;
    setResolving(true);
    try {
      const res = await whatsappApi.resolveThread(selectedThread.id);
      setSelectedThread(res.thread);
      setThreads(prev => prev.map(t => t.id === res.thread.id ? res.thread : t));
    } catch (err) {
      console.error('Failed to resolve', err);
    } finally {
      setResolving(false);
    }
  };

  const handleAssigned = () => {
    setShowAssign(false);
    loadThreads();
    if (selectedThread) loadMessages(selectedThread.id);
  };

  return (
    <div className="flex h-[calc(100vh-48px)] overflow-hidden bg-white">
      {/* ── LEFT PANEL: Thread List ── */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-blue-600" />
            <h1 className="text-sm font-semibold text-slate-800">WhatsApp Inbox</h1>
            {totalThreads > 0 && (
              <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                {totalThreads}
              </span>
            )}
          </div>
          <button
            onClick={loadThreads}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={threadsLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-slate-200 bg-white">
          {(['OPEN', 'ASSIGNED', 'RESOLVED', 'ALL'] as StatusFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${
                statusFilter === f
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          <ThreadList
            threads={threads}
            selectedId={selectedThread?.id ?? null}
            onSelect={handleSelectThread}
            loading={threadsLoading}
          />
        </div>
      </div>

      {/* ── RIGHT PANEL: Conversation ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {selectedThread ? (
          <>
            <ThreadHeader
              thread={selectedThread}
              onAssign={() => setShowAssign(true)}
              onResolve={handleResolve}
              resolving={resolving}
            />

            <MessageThread messages={messages} loading={messagesLoading} />

            <MessageInput
              thread={selectedThread}
              onSend={handleSend}
              sending={sending}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <MessageCircle size={48} strokeWidth={1} />
            <div className="text-center">
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs mt-1">Choose a thread from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssign && selectedThread && (
        <AssignThreadModal
          threadId={selectedThread.id}
          onClose={() => setShowAssign(false)}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  );
};

export default WhatsAppInbox;

import { apiClient } from '@/lib/axios';

export interface WhatsAppThread {
  id: string;
  customer_phone: string;
  customer_id: string | null;
  assigned_to: string | null;
  status: 'OPEN' | 'ASSIGNED' | 'RESOLVED';
  unread_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  thread_id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  body: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  meta_message_id: string | null;
  sent_by: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface ThreadsResponse {
  success: boolean;
  threads: WhatsAppThread[];
  total: number;
  page: number;
  limit: number;
}

export interface MessagesResponse {
  success: boolean;
  messages: WhatsAppMessage[];
  total: number;
  page: number;
  limit: number;
}

export const whatsappApi = {
  getThreads: async (params?: {
    status?: string;
    assigned_to?: string;
    page?: number;
    limit?: number;
  }): Promise<ThreadsResponse> => {
    const res = await apiClient.get('/whatsapp/threads', { params });
    return res.data;
  },

  getMessages: async (threadId: string, page = 1): Promise<MessagesResponse> => {
    const res = await apiClient.get(`/whatsapp/threads/${threadId}/messages`, {
      params: { page }
    });
    return res.data;
  },

  sendMessage: async (threadId: string, body: string) => {
    const res = await apiClient.post(`/whatsapp/threads/${threadId}/send`, { body });
    return res.data;
  },

  assignThread: async (threadId: string, user_id: string) => {
    const res = await apiClient.patch(`/whatsapp/threads/${threadId}/assign`, { user_id });
    return res.data;
  },

  resolveThread: async (threadId: string) => {
    const res = await apiClient.patch(`/whatsapp/threads/${threadId}/resolve`);
    return res.data;
  },
};

import React, { useEffect, useState } from 'react';
import { whatsappApi } from '../api/whatsappApi';
import { apiClient } from '@/lib/axios';
import { Search, UserCheck, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role?: { name: string };
}

interface Props {
  threadId: string;
  onClose: () => void;
  onAssigned: () => void;
}

const ELIGIBLE_ROLES = ['Super Admin', 'City Manager', 'Support Agent'];

export const AssignThreadModal: React.FC<Props> = ({ threadId, onClose, onAssigned }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
    // Fetch users from the existing users API
    apiClient.get('/users').then(res => {
      const allUsers: User[] = res.data?.users || res.data?.data || [];
      // Filter to inbox-eligible roles
      const filtered = allUsers.filter(u =>
        !u.role || ELIGIBLE_ROLES.includes(u.role.name)
      );
      setUsers(filtered);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = async (userId: string) => {
    setAssigning(userId);
    try {
      await whatsappApi.assignThread(threadId, userId);
      onAssigned();
    } catch {
      setAssigning(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <UserCheck size={15} />
            Assign Conversation
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5">
            <Search size={13} className="text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search agent..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-400">Loading agents...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">No agents found</div>
          ) : (
            filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => handleAssign(user.id)}
                disabled={!!assigning}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center uppercase flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                  {user.role && <p className="text-xs text-slate-400">{user.role.name}</p>}
                </div>
                {assigning === user.id && (
                  <span className="text-xs text-blue-600">Assigning...</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

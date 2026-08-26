import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertCircle, FileText, UserPlus, Clock, Receipt, XCircle } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from '../ui/dropdown-menu';

export const NotificationBell = () => {
  const { data: alerts } = useAlerts();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const total = alerts?.total || 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button aria-label="Notifications" className="relative h-8 w-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors shrink-0">
          <Bell className="h-4 w-4" />
          {total > 0 && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 border border-white"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">
          Action Items
        </DropdownMenuLabel>
        
        {total === 0 ? (
          <div className="py-6 text-center text-sm text-slate-400">
            You're all caught up!
          </div>
        ) : (
          <div className="space-y-1">
            {alerts?.openComplaints ? (
              <DropdownMenuItem className="cursor-pointer py-2 px-3 focus:bg-red-50 focus:text-red-700" onClick={() => navigate('/complaints')}>
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                <div className="flex-1 font-medium">{alerts.openComplaints} Open Complaints</div>
              </DropdownMenuItem>
            ) : null}
            
            {alerts?.newLeads ? (
              <DropdownMenuItem className="cursor-pointer py-2 px-3 focus:bg-blue-50 focus:text-blue-700" onClick={() => navigate('/leads')}>
                <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                <div className="flex-1 font-medium">{alerts.newLeads} New Leads</div>
              </DropdownMenuItem>
            ) : null}
            
            {alerts?.dueFollowUps ? (
              <DropdownMenuItem className="cursor-pointer py-2 px-3 focus:bg-purple-50 focus:text-purple-700" onClick={() => navigate('/leads?status=FollowUp')}>
                <Clock className="h-4 w-4 mr-2 text-purple-500" />
                <div className="flex-1 font-medium">{alerts.dueFollowUps} Follow-ups Due</div>
              </DropdownMenuItem>
            ) : null}
            
            {alerts?.unpaidInvoices ? (
              <DropdownMenuItem className="cursor-pointer py-2 px-3 focus:bg-amber-50 focus:text-amber-700" onClick={() => navigate('/invoices')}>
                <FileText className="h-4 w-4 mr-2 text-amber-500" />
                <div className="flex-1 font-medium">{alerts.unpaidInvoices} Unpaid Invoices</div>
              </DropdownMenuItem>
            ) : null}

            {alerts?.pendingExpenses ? (
              <DropdownMenuItem className="cursor-pointer py-2 px-3 focus:bg-emerald-50 focus:text-emerald-700" onClick={() => navigate('/expenses?status=Submitted')}>
                <Receipt className="h-4 w-4 mr-2 text-emerald-500" />
                <div className="flex-1 font-medium">{alerts.pendingExpenses} Expenses Pending Approval</div>
              </DropdownMenuItem>
            ) : null}

            {alerts?.rejectedExpenses ? (
              <DropdownMenuItem className="cursor-pointer py-2 px-3 focus:bg-red-50 focus:text-red-700" onClick={() => navigate('/expenses?status=Rejected')}>
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                <div className="flex-1 font-medium">{alerts.rejectedExpenses} Rejected Expenses</div>
              </DropdownMenuItem>
            ) : null}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

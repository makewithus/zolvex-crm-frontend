import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { ChevronRight, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { NotificationBell } from './NotificationBell';
import { logout } from '@/features/auth';
import { FEATURE_REGISTRY } from '@/config/features';
import { useSidebar } from './MainLayout';

import { useCurrentUser } from '@/features/auth/hooks/useAuth';

export const Header = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const userName = currentUser?.name || localStorage.getItem('userName') || 'User';
  const userRole = currentUser?.role?.name || localStorage.getItem('userRole') || 'Staff';
  
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const { toggleSidebar } = useSidebar();

  // Generate meaningful breadcrumbs
  const breadcrumbs = pathnames.map((segment, index) => {
    // Reconstruct the path up to this segment to match against FEATURE_REGISTRY
    const partialPath = '/' + pathnames.slice(0, index + 1).join('/');
    
    // Check if there is an exact feature match
    const feature = FEATURE_REGISTRY.find(f => f.route === partialPath);
    if (feature) return feature.name;

    // Handle common keywords
    if (segment.toLowerCase() === 'new') return 'New';
    if (segment.toLowerCase() === 'edit') return 'Edit';

    // Handle UUIDs or long IDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(segment) || segment.length > 20) {
      return 'Details';
    }

    // Fallback: capitalize the segment
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="px-4 flex h-[48px] items-center justify-between">
        
        {/* Hamburger and Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button aria-label="Toggle Sidebar" onClick={toggleSidebar} className="text-slate-500 hover:text-slate-900 transition-colors">
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 text-[13px] text-slate-500 hidden md:flex font-medium">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
          {breadcrumbs.length > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb} className="flex items-center gap-1.5">
              <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 font-semibold' : 'hover:text-slate-900 cursor-pointer transition-colors'}>
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-slate-400" />}
            </div>
          ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-3">

            {/* Global Search */}
            <GlobalSearch />

            {/* Notifications */}
            <NotificationBell />

            {/* User Profile */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-1">
              <div className="hidden md:block text-right">
                <p className="text-[12px] font-semibold text-slate-950 leading-none">{userName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{userRole}</p>
              </div>
              <div className="h-8 w-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-medium shrink-0">
                <UserIcon className="h-4 w-4" />
              </div>
              <button aria-label="Log out" onClick={() => setIsLogoutModalOpen(true)} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors shrink-0" title="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={logout}>Log Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

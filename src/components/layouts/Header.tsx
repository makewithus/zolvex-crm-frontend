import { useLocation } from 'react-router-dom';

import { Input } from '../ui/input';
import { Search, Bell, ChevronRight, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { logout } from '@/features/auth';
import { FEATURE_REGISTRY } from '@/config/features';
import { useSidebar } from './MainLayout';

import { useCurrentUser } from '@/features/auth/hooks/useAuth';

export const Header = () => {
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
          {/* Global Search */}
          <div className="relative w-full max-w-[280px] hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="search"
              aria-label="Global Search"
              placeholder="Search leads, customers, jobs..."
              className="w-full bg-white border-slate-300 pl-8 h-8 rounded text-[13px] focus-visible:ring-1 focus-visible:ring-slate-700 transition-colors shadow-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-600 border-[1px] border-white"></span>
            </button>
            
            <div className="h-4 w-px bg-slate-200 mx-1"></div>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-[12px] font-semibold text-slate-950 leading-none">{userName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{userRole}</p>
              </div>
              <div className="h-7 w-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-medium">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <button aria-label="Log out" onClick={logout} className="text-slate-400 hover:text-red-600 transition-colors ml-0.5" title="Log out">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

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
      <div className="px-6 lg:px-8 flex h-[72px] items-center justify-between">
        
        {/* Hamburger and Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button aria-label="Toggle Sidebar" onClick={toggleSidebar} className="text-slate-500 hover:text-slate-900 transition-colors">
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-[14px] text-slate-500 hidden md:flex font-medium">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
          {breadcrumbs.length > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb} className="flex items-center gap-2">
              <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 font-semibold' : 'hover:text-slate-900 cursor-pointer transition-colors'}>
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
          </div>
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end">
          {/* Global Search */}
          <div className="relative w-full max-w-[320px] hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              aria-label="Global Search"
              placeholder="Search leads, customers, jobs..."
              className="w-full bg-slate-50 border-slate-200 pl-10 h-10 rounded-md text-[14px] focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-colors shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600 border-[1.5px] border-white"></span>
            </button>
            
            <div className="h-5 w-px bg-slate-200 mx-2"></div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-[14px] font-semibold text-slate-900 leading-none">{userName}</p>
                <p className="text-[12px] text-slate-500 mt-1">{userRole}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-medium">
                <UserIcon className="h-4 w-4" />
              </div>
              <button aria-label="Log out" onClick={logout} className="text-slate-400 hover:text-red-600 transition-colors ml-1" title="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

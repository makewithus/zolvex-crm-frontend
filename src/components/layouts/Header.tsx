import { useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="px-6 flex h-[var(--header-height)] items-center justify-between">
        
        {/* Hamburger and Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex text-muted-foreground hover:text-foreground mr-1">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground hidden md:flex">
            <span className="hover:text-foreground cursor-pointer transition-colors">Home</span>
          {breadcrumbs.length > 0 && <ChevronRight className="h-4 w-4" />}
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb} className="flex items-center gap-2">
              <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-foreground' : 'hover:text-foreground cursor-pointer transition-colors'}>
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
            </div>
          ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Global Search */}
          <div className="relative w-full max-w-[300px] hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads, customers, jobs..."
              className="w-full bg-muted/50 border-none pl-9 focus-visible:ring-1"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
          </Button>

          <div className="h-6 w-px bg-border mx-1"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-1">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs text-muted-foreground mt-1">{userRole}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon className="h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors ml-2" title="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

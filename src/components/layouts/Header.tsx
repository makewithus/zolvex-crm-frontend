import { useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Bell, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { logout } from '@/features/auth';

export const Header = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Generate simple breadcrumbs (excluding UUIDs if they look like ones)
  const breadcrumbs = pathnames.filter(p => !p.includes('-')).map(p => p.charAt(0).toUpperCase() + p.slice(1));

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="px-6 flex h-[var(--header-height)] items-center justify-between">
        
        {/* Breadcrumbs */}
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
              <p className="text-sm font-medium leading-none">{localStorage.getItem('userName') || 'User'}</p>
              <p className="text-xs text-muted-foreground mt-1">{localStorage.getItem('userRole') || 'Staff'}</p>
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

import { Link } from 'react-router-dom';
import { NAVIGATION_LINKS } from '@/config/navigation';

export const Sidebar = () => {
  // Simulating user role for Phase 1A Role-Based Visibility (RBAC)
  const userRole = localStorage.getItem('userRole') || 'Super Admin'; 

  return (
    <aside className="w-64 border-r bg-background hidden md:block">
      <div className="flex h-full flex-col py-4">
        <nav className="flex-1 space-y-1 px-4">
          {NAVIGATION_LINKS
            .filter((link) => link.roles.includes(userRole))
            .map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground"
              >
                {link.name}
              </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

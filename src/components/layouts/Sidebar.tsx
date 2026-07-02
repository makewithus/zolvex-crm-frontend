import { Link, useLocation } from 'react-router-dom';
import { FEATURE_REGISTRY } from '@/config/features';

export const Sidebar = () => {
  const userRole = localStorage.getItem('userRole') || 'Super Admin';
  const location = useLocation();

  const visibleFeatures = FEATURE_REGISTRY
    .filter((f) => f.sidebarVisibility && f.requiredRoles.includes(userRole))
    .sort((a, b) => a.order - b.order);

  return (
    <aside className="w-[var(--sidebar-width)] border-r bg-card hidden md:block">
      <div className="flex h-full flex-col py-4">
        <nav className="flex-1 space-y-1 px-4">
          {visibleFeatures.map((feature) => {
            const isActive = location.pathname === feature.route;
            return (
              <Link
                key={feature.id}
                to={feature.route}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {feature.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

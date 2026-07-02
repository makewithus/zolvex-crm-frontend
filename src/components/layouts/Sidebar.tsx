import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, CalendarDays, Briefcase, 
  Settings2, ShieldCheck, Map, Grid, DollarSign, FileText, 
  CreditCard, PieChart, UsersIcon
} from 'lucide-react';
import { FEATURE_REGISTRY } from '@/config/features';
import { useSidebar } from './MainLayout';

export const Sidebar = () => {
  const userRole = localStorage.getItem('userRole') || 'Super Admin';
  const location = useLocation();
  const { isCollapsed } = useSidebar();

  const isAllowed = (route: string) => {
    const feat = FEATURE_REGISTRY.find(f => f.route === route);
    return feat ? feat.requiredRoles.includes(userRole) : false;
  };

  const SECTIONS = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", route: "/", icon: LayoutDashboard },
        { name: "Leads", route: "/leads", icon: Users },
        { name: "Customers", route: "/customers", icon: UserSquare2 },
        { name: "Bookings", route: "/bookings", icon: CalendarDays },
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { name: "Jobs", route: "/jobs", icon: Briefcase },
        { name: "Calendar", route: "/calendar", icon: CalendarDays },
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Users", route: "/users", icon: UsersIcon },
        { name: "Roles", route: "/roles", icon: ShieldCheck },
        { name: "Cities", route: "/cities", icon: Map },
        { name: "Services", route: "/services", icon: Grid },
        { name: "Pricing Rules", route: "/pricing-rules", icon: DollarSign },
      ]
    },
    {
      title: "FINANCE",
      items: [
        { name: "Invoices", route: "/invoices", icon: FileText },
        { name: "Payments", route: "/payments", icon: CreditCard },
        { name: "Reports", route: "/reports", icon: PieChart },
      ]
    },
    {
      title: "SETTINGS",
      items: [
        { name: "System Settings", route: "/settings", icon: Settings2 },
      ]
    }
  ];

  return (
      <aside className={`border-r bg-sidebar flex-shrink-0 hidden lg:block overflow-y-auto transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[70px]' : 'w-[var(--sidebar-width)]'}`}>
        <div className="flex h-full flex-col py-6">
          <div className={`px-4 mb-8 flex items-center gap-2 text-sidebar-foreground ${isCollapsed ? 'justify-center' : 'px-6'}`}>
            <div className="h-8 w-8 bg-primary rounded-md flex-shrink-0 flex items-center justify-center font-bold text-primary-foreground shadow-sm">Z</div>
            {!isCollapsed && <span className="font-bold text-xl tracking-tight transition-opacity duration-300">ZOLVEX</span>}
          </div>

          <nav className="flex-1 space-y-8 px-3 pb-12">
          {SECTIONS.map((section) => {
            const allowedItems = section.items.filter(item => isAllowed(item.route));
            if (allowedItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-2">
                {!isCollapsed && (
                  <h4 className="px-3 text-xs font-semibold text-sidebar-foreground/50 tracking-wider uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                    {section.title}
                  </h4>
                )}
                {isCollapsed && <div className="h-4" />}
                <div className="space-y-1">
                  {allowedItems.map((item) => {
                    const isActive = location.pathname === item.route || (item.route !== '/' && location.pathname.startsWith(item.route));
                    const navItem = (
                      <Link
                        key={item.name}
                        to={item.route}
                        title={isCollapsed ? item.name : undefined}
                        className={`group flex items-center gap-3 rounded-md py-2 font-medium transition-all ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <item.icon className={`flex-shrink-0 h-5 w-5 ${isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground'}`} />
                        {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.name}</span>}
                      </Link>
                    );

                    return navItem;
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

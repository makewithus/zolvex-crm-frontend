import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, CalendarDays, Briefcase, 
  Settings2, ShieldCheck, Map, Grid, DollarSign, FileText, 
  CreditCard, PieChart, UsersIcon, Calendar
} from 'lucide-react';
import { FEATURE_REGISTRY } from '@/config/features';
import { useSidebar } from './MainLayout';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

export const Sidebar = () => {
  const { data: currentUser } = useCurrentUser();
  const userRole = currentUser?.role?.name || 'Super Admin';
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const isAllowed = (route: string) => {
    const feat = FEATURE_REGISTRY.find(f => f.route === route);
    return feat ? feat.requiredRoles.includes(userRole) : false;
  };

  const SECTIONS = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", route: "/", icon: LayoutDashboard },
        { name: "Leads", route: "/leads", icon: Users },
        { name: "Customers", route: "/customers", icon: UserSquare2 },
        { name: "Bookings", route: "/bookings", icon: CalendarDays },
      ]
    },
    {
      title: "Operations",
      items: [
        { name: "Jobs", route: "/jobs", icon: Briefcase },
        { name: "Calendar", route: "/calendar", icon: Calendar },
      ]
    },
    {
      title: "Management",
      items: [
        { name: "Users", route: "/users", icon: UsersIcon },
        { name: "Roles", route: "/roles", icon: ShieldCheck },
        { name: "Cities", route: "/cities", icon: Map },
        { name: "Services", route: "/services", icon: Grid },
        { name: "Pricing Rules", route: "/pricing-rules", icon: DollarSign },
      ]
    },
    {
      title: "Finance",
      items: [
        { name: "Invoices", route: "/invoices", icon: FileText },
        { name: "Payments", route: "/payments", icon: CreditCard },
        { name: "Reports", route: "/reports", icon: PieChart },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Settings", route: "/settings", icon: Settings2 },
      ]
    }
  ];

  return (
    <aside
      className={`flex-shrink-0 h-full overflow-y-auto transition-all duration-300 ease-in-out z-40 bg-slate-50 border-r border-slate-200 flex flex-col ${
        isCollapsed
          ? 'hidden lg:flex lg:w-[64px]'
          : 'fixed inset-y-0 left-0 lg:static w-[220px] lg:shadow-none'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 h-[48px] flex-shrink-0 border-b border-slate-200 ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
        <div className="h-6 w-6 bg-slate-800 rounded flex-shrink-0 flex items-center justify-center font-bold text-white text-[12px] shadow-sm">Z</div>
        {!isCollapsed && (
          <div>
            <span className="font-bold text-slate-800 text-[14px] tracking-tight leading-none">ZOLVEX CRM</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-3">
        {SECTIONS.map((section) => {
          const allowedItems = section.items.filter(item => isAllowed(item.route));
          if (allowedItems.length === 0) return null;

          return (
            <div key={section.title} className={isCollapsed ? 'px-2' : 'px-3'}>
              {!isCollapsed && (
                <p className="mb-1 px-2.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  {section.title}
                </p>
              )}
              {isCollapsed && <div className="h-px bg-slate-200 my-2" />}
              <div className="space-y-0.5">
                {allowedItems.map((item) => {
                  const isActive = location.pathname === item.route || (item.route !== '/' && location.pathname.startsWith(item.route));
                  return (
                    <Link
                      key={item.name}
                      to={item.route}
                      title={isCollapsed ? item.name : undefined}
                      onClick={() => {
                        if (window.innerWidth < 1024 && !isCollapsed) {
                          toggleSidebar();
                        }
                      }}
                      className={`group flex items-center gap-2.5 rounded h-8 text-[13px] transition-colors ${
                        isCollapsed ? 'justify-center px-0' : 'px-2.5'
                      } ${
                        isActive
                          ? 'bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-slate-700 rounded-l-none'
                          : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <item.icon className={`flex-shrink-0 h-4 w-4 ${isActive ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-500'}`} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer user hint */}
      {!isCollapsed && (
        <div className="flex-shrink-0 border-t border-slate-200 px-4 py-2 mt-auto bg-slate-100/50">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 text-xs font-semibold">
              {(currentUser?.name || 'U').charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[12px] font-semibold text-slate-800 truncate leading-tight">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{userRole}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

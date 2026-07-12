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
      style={{ backgroundColor: '#0f172a' }}
      className={`flex-shrink-0 h-full overflow-y-auto transition-all duration-300 ease-in-out z-40 border-r border-white/5 ${
        isCollapsed
          ? 'hidden lg:flex lg:w-[64px] flex-col'
          : 'fixed inset-y-0 left-0 lg:static flex flex-col w-[var(--sidebar-width)] shadow-2xl lg:shadow-none'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 h-[var(--header-height)] flex-shrink-0 border-b border-white/5 ${isCollapsed ? 'justify-center px-4' : 'px-5'}`}>
        <div className="h-8 w-8 bg-blue-600 rounded-md flex-shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-sm">Z</div>
        {!isCollapsed && (
          <div>
            <span className="font-bold text-white text-[15px] tracking-tight leading-none">ZOLVEX</span>
            <p className="text-[10px] text-slate-400 mt-0.5 tracking-wide">CRM</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {SECTIONS.map((section) => {
          const allowedItems = section.items.filter(item => isAllowed(item.route));
          if (allowedItems.length === 0) return null;

          return (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="px-2 mb-1.5 text-[10px] font-semibold text-slate-500 tracking-widest uppercase">
                  {section.title}
                </p>
              )}
              {isCollapsed && <div className="h-3 border-t border-white/5 my-2" />}
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
                      className={`group flex items-center gap-2.5 rounded-md py-2 text-[13.5px] font-medium transition-all ${
                        isCollapsed ? 'justify-center px-2' : 'px-2.5'
                      } ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                      }`}
                    >
                      <item.icon className={`flex-shrink-0 h-[15px] w-[15px] ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
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
        <div className="flex-shrink-0 border-t border-white/5 px-4 py-3">
          <p className="text-[11px] text-slate-600 truncate">{currentUser?.name || 'User'}</p>
          <p className="text-[10px] text-slate-700 truncate mt-0.5">{userRole}</p>
        </div>
      )}
    </aside>
  );
};

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
      className={`flex-shrink-0 h-full overflow-y-auto transition-all duration-300 ease-in-out z-40 bg-white border-r border-slate-200 flex flex-col ${
        isCollapsed
          ? 'hidden lg:flex lg:w-[80px]'
          : 'fixed inset-y-0 left-0 lg:static w-[260px] shadow-2xl lg:shadow-none'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 h-[72px] flex-shrink-0 ${isCollapsed ? 'justify-center px-4' : 'px-6 mt-2'}`}>
        <div className="h-8 w-8 bg-blue-600 rounded-md flex-shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-sm">Z</div>
        {!isCollapsed && (
          <div>
            <span className="font-bold text-slate-900 text-[16px] tracking-tight leading-none">ZOLVEX</span>
            <p className="text-[10px] text-slate-500 mt-0.5 tracking-wide">CRM</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-4">
        {SECTIONS.map((section) => {
          const allowedItems = section.items.filter(item => isAllowed(item.route));
          if (allowedItems.length === 0) return null;

          return (
            <div key={section.title} className={isCollapsed ? 'px-4' : 'px-6'}>
              {!isCollapsed && (
                <p className="mb-2 text-[12px] font-semibold text-slate-400 tracking-wider uppercase">
                  {section.title}
                </p>
              )}
              {isCollapsed && <div className="h-px bg-slate-200 my-4" />}
              <div className="space-y-1">
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
                      className={`group relative flex items-center gap-3 rounded-md h-11 text-[14px] transition-colors ${
                        isCollapsed ? 'justify-center px-0' : 'px-3'
                      } ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {isActive && !isCollapsed && (
                        <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 h-full w-[3px] bg-blue-600 rounded-r-md" />
                      )}
                      {isActive && isCollapsed && (
                        <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-full w-[3px] bg-blue-600 rounded-r-md" />
                      )}
                      <item.icon className={`flex-shrink-0 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
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
        <div className="flex-shrink-0 border-t border-slate-200 px-6 py-4 mt-auto">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-medium">
              {(currentUser?.name || 'U').charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[14px] font-semibold text-slate-900 truncate">{currentUser?.name || 'User'}</p>
              <p className="text-[12px] text-slate-500 truncate">{userRole}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

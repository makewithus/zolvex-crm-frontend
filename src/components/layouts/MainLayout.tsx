import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SessionTimeoutGuard } from './SessionTimeoutGuard';

export const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (window.innerWidth < 1024) return true; // Default collapsed on mobile
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <SessionTimeoutGuard>
        <div className="flex h-full flex-col bg-background overflow-hidden crm-app-container">
        <Header />
        <div className="flex flex-1 overflow-hidden min-h-0 relative">
          <Sidebar />
          {!isCollapsed && (
            <div 
              className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 transition-all duration-300"
              onClick={toggleSidebar}
            />
          )}
          <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 relative bg-[#F8FAFC]" id="main-content">
            <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
        </div>
      </SessionTimeoutGuard>
    </SidebarContext.Provider>
  );
};

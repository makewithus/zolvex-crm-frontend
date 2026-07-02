import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
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
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

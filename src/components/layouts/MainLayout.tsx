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
      <div className="flex h-full flex-col bg-background overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden min-h-0">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative bg-[#F8FAFC]" id="main-content">
            <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

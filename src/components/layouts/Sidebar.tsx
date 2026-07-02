export const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-background hidden md:block">
      <div className="flex h-full flex-col py-4">
        <nav className="flex-1 space-y-1 px-4">
          <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">Dashboard</div>
          <div className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">Customers</div>
          <div className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">Settings</div>
        </nav>
      </div>
    </aside>
  );
};

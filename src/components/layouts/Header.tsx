import { Button } from '../ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="font-bold text-xl tracking-tight text-primary">ZOLVEX CRM</div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">Log out</Button>
        </div>
      </div>
    </header>
  );
};

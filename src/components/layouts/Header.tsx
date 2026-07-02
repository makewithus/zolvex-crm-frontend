import { useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { FEATURE_REGISTRY } from '@/config/features';

export const Header = () => {
  const location = useLocation();
  const currentFeature = FEATURE_REGISTRY.find(f => f.route === location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[var(--header-height)] items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg tracking-tight text-primary">ZOLVEX</div>
          {currentFeature && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium text-muted-foreground">{currentFeature.name}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">Log out</Button>
        </div>
      </div>
    </header>
  );
};

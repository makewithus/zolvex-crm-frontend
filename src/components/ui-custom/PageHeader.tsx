import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const PageHeader = ({ 
  title, 
  description, 
  children,
  backUrl,
}: { 
  title: string; 
  description?: string; 
  children?: React.ReactNode;
  backUrl?: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        {backUrl && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mt-0.5 h-8 w-8 text-muted-foreground shrink-0" 
            onClick={() => navigate(backUrl)}
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
};

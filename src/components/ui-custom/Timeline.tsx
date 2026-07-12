import React from 'react';

export const Timeline = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative border-l border-border/60 ml-2.5 space-y-6 pt-1 pb-2">
      {children}
    </div>
  );
};

export const TimelineItem = ({ 
  title, 
  description, 
  time,
  isActive = false,
}: { 
  title: string; 
  description?: string; 
  time?: string;
  isActive?: boolean;
}) => {
  return (
    <div className="relative pl-6">
      <div 
        className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-background ${
          isActive ? 'border-primary ring-4 ring-primary/10' : 'border-muted-foreground/30'
        }`} 
      />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-0.5">
        <h4 className={`text-sm font-medium leading-none ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
          {title}
        </h4>
        {time && <span className="text-xs text-muted-foreground mt-1 sm:mt-0 font-medium">{time}</span>}
      </div>
      {description && <p className="text-sm text-muted-foreground mt-1.5 leading-snug">{description}</p>}
    </div>
  );
};

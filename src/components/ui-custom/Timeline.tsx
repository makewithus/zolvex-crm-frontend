import React from 'react';

export const Timeline = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative border-l border-muted ml-3 space-y-6">
      {children}
    </div>
  );
};

export const TimelineItem = ({ title, description, time }: { title: string; description?: string; time: string }) => {
  return (
    <div className="relative pl-6">
      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
        <h4 className="text-sm font-medium leading-none text-foreground">{title}</h4>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
};

import React from 'react';

export const SectionHeader = ({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <div>
        <h2 className="text-lg font-medium tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
};

import React from 'react';

export const FormSection = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

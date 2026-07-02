import React from 'react';

export const EmptyState = ({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/20 border-dashed">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
};

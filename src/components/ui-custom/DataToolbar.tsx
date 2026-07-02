import React from 'react';

export const DataToolbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
      {children}
    </div>
  );
};

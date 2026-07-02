import React from 'react';

export const FormGrid = ({ children, columns = 2 }: { children: React.ReactNode; columns?: 1 | 2 | 3 | 4 }) => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4',
  };
  return <div className={`grid gap-4 ${cols[columns]}`}>{children}</div>;
};

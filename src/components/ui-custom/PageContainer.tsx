import React from 'react';

export const PageContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`flex flex-col space-y-6 px-0 py-2 sm:px-6 sm:py-6 ${className}`}>{children}</div>;
};

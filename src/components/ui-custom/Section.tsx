import React from 'react';

export const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <section className={`space-y-4 ${className}`}>{children}</section>;
};

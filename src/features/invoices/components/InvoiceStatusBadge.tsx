import React from 'react';
import { InvoiceStatus } from '../types/invoice.types';

interface Props {
  status: InvoiceStatus;
}

export const InvoiceStatusBadge: React.FC<Props> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Issued': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle()}`}>
      {status}
    </span>
  );
};

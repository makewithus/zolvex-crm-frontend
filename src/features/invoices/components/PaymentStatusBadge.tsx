import React from 'react';
import { formatEnumLabel } from '@/lib/utils';
import { PaymentStatus } from '../types/invoice.types';

interface Props {
  status: PaymentStatus;
}

export const PaymentStatusBadge: React.FC<Props> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Unpaid': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Partial': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStyle()}`}>
      {formatEnumLabel(status)}
    </span>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DetailCard = ({ title, data }: { title: string; data: { label: string; value: React.ReactNode }[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3 border-b mb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col space-y-1">
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

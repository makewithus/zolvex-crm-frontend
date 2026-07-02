import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const PricingRules = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    apiClient.get('/pricing-rules').then((res) => setRules(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Pricing Rules</h2>
      <Card>
        <CardHeader><CardTitle>Configured Rules</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>City</TableHead>
                <TableHead>BHK Type</TableHead>
                <TableHead>Tank Size</TableHead>
                <TableHead>Base Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule: any) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.service?.name}</TableCell>
                  <TableCell>{rule.city?.name || 'Global'}</TableCell>
                  <TableCell>{rule.bhk_type || '-'}</TableCell>
                  <TableCell>{rule.tank_size || '-'}</TableCell>
                  <TableCell>${rule.base_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

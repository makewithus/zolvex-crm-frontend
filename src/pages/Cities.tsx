import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const Cities = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    apiClient.get('/cities').then((res) => setCities(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Cities & Service Areas</h2>
      <Card>
        <CardHeader><CardTitle>Active Cities</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Service Areas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city: any) => (
                <TableRow key={city.id}>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>{city.serviceAreas?.length || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

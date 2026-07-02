import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  onSearch?: (val: string) => void;
  isLoading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
}

export function DataTable<T>({ data, columns, keyExtractor, searchPlaceholder, onSearch, isLoading, pagination, emptyMessage = "No results found." }: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="flex items-center justify-between">
          <Input 
            placeholder={searchPlaceholder || "Search..."} 
            onChange={(e) => onSearch(e.target.value)} 
            className="max-w-sm h-9" 
          />
        </div>
      )}
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className={`h-10 whitespace-nowrap text-${col.align || 'left'}`}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground animate-pulse">
                   Loading data...
                 </TableCell>
               </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={keyExtractor(row)} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={`py-3 px-4 align-middle text-${col.align || 'left'}`}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground font-medium px-2">Page {pagination.page} of {pagination.totalPages}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

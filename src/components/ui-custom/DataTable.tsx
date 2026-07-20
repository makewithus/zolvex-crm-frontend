import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { EmptyState } from '@/components/ui-custom/EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  isLoading, 
  onSearch, 
  searchPlaceholder = "Search...", 
  pagination,
  emptyStateTitle = "No records found",
  emptyStateDescription = "Get started by creating a new record.",
  onRowClick
}: DataTableProps<T>) {
  
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {onSearch && (
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={searchPlaceholder} 
              value={query} 
              onChange={handleSearch} 
              className="pl-9 bg-background shadow-sm"
            />
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full sm:w-auto shadow-sm gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-card shadow-sm overflow-x-auto relative min-h-[400px]">
        <div className="min-w-[600px]">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className={`h-11 font-semibold text-muted-foreground ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${colIndex}`} className="py-4">
                      <div className={`h-4 bg-muted/60 rounded animate-pulse ${colIndex === 0 ? 'w-3/4' : 'w-1/2'}`}></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  <EmptyState title={emptyStateTitle} description={emptyStateDescription} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow 
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={`py-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                      {col.key === 'actions' ? (
                        <div className="flex justify-end" onClick={e => e.stopPropagation()}>
                          {col.cell(row)}
                        </div>
                      ) : (
                        col.cell(row)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-2">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{pagination.page}</span> of <span className="font-medium text-foreground">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-8 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="h-8 shadow-sm"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlidersHorizontal, X } from 'lucide-react';
import { useCities } from '@/features/cities/hooks/useCities';
import { useServices } from '@/features/services/hooks/useServices';
import { formatEnumLabel } from '@/lib/utils';
import { FormGroup } from './FormGroup';

export interface FilterState {
  city_id?: string;
  service_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

interface FilterPopoverProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  statusOptions?: string[];
  hideDate?: boolean;
}

export function FilterPopover({ filters, onFilterChange, statusOptions, hideDate }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const { data: citiesRes } = useCities();
  const { data: servicesRes } = useServices();

  const cities = citiesRes?.data || [];
  const services = servicesRes?.data || [];

  // Sync when prop changes externally (like clear all)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFilterChange(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = {};
    setLocalFilters(cleared);
    onFilterChange(cleared);
    setOpen(false);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto shadow-sm gap-2 relative">
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-sm">Filter Records</h4>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <FormGroup label="City">
            <select
              value={localFilters.city_id || ''}
              onChange={e => setLocalFilters(prev => ({ ...prev, city_id: e.target.value }))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Cities</option>
              {cities.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Service">
            <select
              value={localFilters.service_id || ''}
              onChange={e => setLocalFilters(prev => ({ ...prev, service_id: e.target.value }))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Services</option>
              {services.map((s: any) => (
                <option key={s.id} value={s.id}>{formatEnumLabel(s.name)}</option>
              ))}
            </select>
          </FormGroup>

          {statusOptions && statusOptions.length > 0 && (
            <FormGroup label="Status">
              <select
                value={localFilters.status || ''}
                onChange={e => setLocalFilters(prev => ({ ...prev, status: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All Statuses</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{formatEnumLabel(s)}</option>
                ))}
              </select>
            </FormGroup>
          )}

          {!hideDate && (
            <div className="grid grid-cols-2 gap-2">
              <FormGroup label="From Date">
                <input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={e => setLocalFilters(prev => ({ ...prev, date_from: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background pl-2 pr-1 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:m-0"
                />
              </FormGroup>
              <FormGroup label="To Date">
                <input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={e => setLocalFilters(prev => ({ ...prev, date_to: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background pl-2 pr-1 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:m-0"
                />
              </FormGroup>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground">
            Clear
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

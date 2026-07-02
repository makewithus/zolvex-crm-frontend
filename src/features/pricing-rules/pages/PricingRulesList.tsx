import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { usePricingRules } from '../hooks/usePricingRules';
import { PricingRule } from '../types/pricingRule.types';
import { PricingRuleFormDialog } from '../components/PricingRuleFormDialog';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, ListTree, DollarSign, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { PricingRuleEditDialog } from '../components/PricingRuleEditDialog';
import { PricingRuleDeleteDialog } from '../components/PricingRuleDeleteDialog';

export const PricingRulesList = () => {
  const { data: pricingRulesResponse, isLoading, isError, error } = usePricingRules();
  const pricingRules = pricingRulesResponse?.data || [];
  
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [deletingRule, setDeletingRule] = useState<PricingRule | null>(null);

  const columns: Column<PricingRule>[] = [
    { 
      key: 'service', 
      header: 'Service Context', 
      cell: (row) => (
        <div className="flex items-center gap-2 font-medium text-foreground py-1 text-sm">
          <Briefcase className="h-4 w-4 text-blue-500" />
          {row.service?.name || 'Unknown Service'}
        </div>
      ) 
    },
    { 
      key: 'city', 
      header: 'Target City', 
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {row.city?.name || <span className="italic">All Cities (Base)</span>}
        </div>
      ) 
    },
    { 
      key: 'variant', 
      header: 'Variant Parameters', 
      cell: (row) => {
        const hasVariant = row.bhk_type || row.tank_size;
        return hasVariant ? (
          <div className="flex gap-1.5">
            {row.bhk_type && <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[11px] font-medium rounded-full border">BHK: {row.bhk_type}</span>}
            {row.tank_size && <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[11px] font-medium rounded-full border">Size: {row.tank_size}</span>}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground italic flex items-center gap-1.5"><ListTree className="h-3.5 w-3.5" /> None</span>
        );
      }
    },
    { 
      key: 'price', 
      header: 'Override Price', 
      cell: (row) => (
        <div className="flex items-center font-bold text-foreground">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
          {row.base_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      ) 
    },
    { 
      key: 'status', 
      header: 'Status', 
      cell: () => <StatusBadge status="success" label="Active" />
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={() => setEditingRule(row)}>
              <Edit className="h-4 w-4 mr-2" /> Adjust Pricing
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setDeletingRule(row)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Rule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Pricing Engine" description="Manage regional variants and price overrides." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          Failed to load pricing rules. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Pricing Engine" 
        description="Manage regional variants and dynamic price overrides."
      >
        <PricingRuleFormDialog />
      </PageHeader>
      <DataTable
        columns={columns}
        data={pricingRules}
        keyExtractor={(rule) => rule.id}
        isLoading={isLoading}
        searchPlaceholder="Search pricing configurations..."
        emptyStateTitle="No pricing rules configured"
        emptyStateDescription="Set up rules to override base pricing for specific regions or variants."
      />
      <PricingRuleEditDialog 
        rule={editingRule} 
        open={!!editingRule} 
        onOpenChange={(open) => !open && setEditingRule(null)} 
      />
      <PricingRuleDeleteDialog 
        rule={deletingRule} 
        open={!!deletingRule} 
        onOpenChange={(open) => !open && setDeletingRule(null)} 
      />
    </PageContainer>
  );
};

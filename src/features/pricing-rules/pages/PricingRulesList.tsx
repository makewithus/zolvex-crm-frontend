import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataTable, Column } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { usePricingRules } from '../hooks/usePricingRules';
import { PricingRule } from '../types/pricingRule.types';
import { PricingRuleFormDialog } from '../components/PricingRuleFormDialog';

export const PricingRulesList = () => {
  const { data: pricingRulesResponse, isLoading, isError, error } = usePricingRules();
  const rules = pricingRulesResponse?.data || [];

  const columns: Column<PricingRule>[] = [
    { key: 'service', header: 'Service', cell: (row) => <span className="font-medium">{row.service?.name}</span> },
    { key: 'city', header: 'Scope', cell: (row) => (
      row.city ? <StatusBadge status="info" label={row.city.name} /> : <StatusBadge status="default" label="Global" />
    ) },
    { key: 'bhk_type', header: 'BHK', cell: (row) => <span className="text-muted-foreground">{row.bhk_type || '-'}</span> },
    { key: 'tank_size', header: 'Tank Size', cell: (row) => <span className="text-muted-foreground">{row.tank_size || '-'}</span> },
    { key: 'base_price', header: 'Price', cell: (row) => `$${row.base_price.toFixed(2)}` },
  ];

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Pricing Rules Engine" description="Manage regional pricing configurations." />
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          Failed to load pricing rules. {error?.message}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Pricing Rules Engine" 
        description="Manage regional pricing configurations."
      >
        {localStorage.getItem('userRole') === 'Super Admin' && <PricingRuleFormDialog />}
      </PageHeader>
      <DataTable
        columns={columns}
        data={rules}
        keyExtractor={(rule) => rule.id}
        isLoading={isLoading}
        searchPlaceholder="Search pricing rules..."
        emptyStateTitle="No pricing rules configured"
        emptyStateDescription="Add a global or city-specific rule to initiate the engine."
      />
    </PageContainer>
  );
};

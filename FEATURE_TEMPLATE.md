# Zolvex CRM Feature Template
The CRM frontend is strictly modular. Every major domain entity (e.g., Leads, Customers, Invoices) MUST be enclosed within a single feature directory to prevent architectural bloat.

## Directory Structure
```text
src/features/[feature-name]/
│
├── api/          # Axios wrappers & endpoints specific to this feature
├── components/   # UI components specific to this feature (e.g., LeadKanban, LeadFilters)
├── hooks/        # React Query hooks (e.g., useLeads, useCreateLead)
├── pages/        # Route-level components (e.g., LeadList.tsx, LeadDetail.tsx)
├── schemas/      # Zod validation schemas shared by forms
├── services/     # Formatting or complex client-side business logic
├── types/        # TypeScript interfaces and enum models
├── utils/        # Feature-specific helpers (e.g., color-coding logic)
└── index.ts      # Public API exports for the router and global app
```

## Rules
1. **Never Import Across Features:** A feature component (`features/leads/components/List.tsx`) should never import directly from another feature (`features/finance/components/Invoice.tsx`).
2. **Global Components:** If a UI element is used by two features, it MUST be extracted to `src/components/ui-custom/` or `src/components/ui/`.
3. **Route Mounting:** The main `src/routes/index.tsx` should simply import the top-level Page from the feature's `pages/` directory.

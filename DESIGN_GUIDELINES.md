# ZOLVEX CRM - Global SaaS Design System

## 1. Design Tokens & Core Layout
All global sizing and styling rules are strictly enforced via `tailwind.config.js` and CSS variables.
- **Max Page Width:** `1400px` (Centrally aligned content area).
- **Sidebar Width:** `260px` (Fixed).
- **Header Height:** `64px` (Sticky top).
- **Border Radius:** `0.375rem` (6px) - Sharp, modern SaaS feel.

## 2. Typography Scale
We use a compact, enterprise-focused typography scale designed for high information density.
- **Page Title:** `text-2xl font-semibold tracking-tight` (Never larger than 24px)
- **Section Title:** `text-lg font-medium tracking-tight text-foreground`
- **Card Title:** `text-sm font-medium text-foreground`
- **Body:** `text-sm text-foreground leading-relaxed`
- **Caption:** `text-xs text-muted-foreground`
- **Badge:** `text-xs font-medium px-2 py-0.5 uppercase tracking-wider`

## 3. Spacing Scale
Global spacing is strictly enforced to maintain a "Linear/Stripe" feel.
- **Page Padding:** `px-6 py-6` (Standardized via `<PageContainer>`)
- **Section Spacing:** `space-y-6` (Between major blocks)
- **Card Spacing:** `gap-4` or default shadcn card padding
- **Table Spacing:** `py-3 px-4` (Standardized via `DataTable`)
- **Form Spacing:** `space-y-4` (Standardized via `<FormSection>`)
- **Button Spacing:** Default shadcn heights (`h-9` for standard, `h-8` for dense UI).

## 4. Reusable Layout Components
Every page **must** be composed of these exact building blocks:
- `<PageContainer>`: Wraps the entire view.
- `<PageHeader>`: Standard title and actions.
- `<DataTable>`: The universal data grid (includes search, pagination, loading states).
- `<StatCard>`: Metric displays.
- `<FormGrid>`: CSS grid for multi-column inputs.
- `<FormSection>`: Grouped form fields.
- `<FormGroup>`: Standardized input wrapper with labels, required flags, and error states.
- `<StatusBadge>`: Centralized logic for 'success', 'error', 'warning', 'info' badges.
- `<FeedbackAlert>`: Inline contextual system feedback.
- `<SkeletonCard>`: Fast skeleton loading placeholders.

## 5. Table Standards
- Automatically managed responsive overflow (`overflow-x-auto`).
- Background hover states strictly limited to `hover:bg-muted/50`.
- All tables must implement an empty state via the `emptyMessage` prop.
- Columns are aligned logically (numbers to the right, strings to the left, actions centered).

## 6. Form Standards
- **Labels:** Required fields must have an asterisk via `<FormGroup required>`.
- **Validation:** Always handled via Zod and React Hook Form. Error states appear as `text-destructive` below the input using `<FormGroup error="message">`.
- **Submit Buttons:** Must disable and show a spinner during asynchronous mutations.

## 7. Responsive Rules
- **Mobile (`< md`):** Grids collapse to 1 column. Sidebars become off-canvas (future implementation).
- **Tablet (`md to lg`):** Grids use 2 columns. Page padding remains `px-6`.
- **Desktop (`> lg`):** Grids scale up to 3 or 4 columns safely. Max-width constraints apply.

## 8. Accessibility (A11y)
- **Keyboard Navigation:** All interactive elements (`Dialog`, `Button`, `Input`) must support natural tab-indexing.
- **Focus States:** Relies on shadcn's default `ring` classes. NEVER remove `focus-visible:ring`.
- **ARIA:** Roles are injected dynamically via headless UI elements. `role="alert"` is manually attached to `<FeedbackAlert>` and form errors.
- **Color Contrast:** All badges have custom `foreground` overrides in CSS to pass WCAG AA.

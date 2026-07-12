# Zolvex CRM Global Design System

This document outlines the strict global design tokens and styling rules for the entire Zolvex CRM application. Every page, component, and module must strictly adhere to these rules to ensure a cohesive, enterprise-grade SaaS aesthetic.

## 1. Container & Layout
- **Max Width**: `1280px` (`max-w-7xl` in Tailwind)
- **Horizontal Padding**: 
  - Mobile (`base`): `16px` (`px-4`)
  - Tablet (`md`): `24px` (`px-6`)
  - Desktop (`lg`+): `32px` (`px-8`)

## 2. 8px Spacing System
Never use arbitrary values (e.g. 13px, 27px). Use strict multiples of 8:
- `8px` (`gap-2`, `p-2`)
- `16px` (`gap-4`, `p-4`)
- `24px` (`gap-6`, `p-6`)
- `32px` (`gap-8`, `p-8`)
- `40px` (`gap-10`, `p-10`)
- `48px` (`gap-12`, `p-12`)
- `64px` (`gap-16`, `p-16`)
- `80px` (`gap-20`, `p-20`)
- `96px` (`gap-24`, `p-24`)
- `120px` (`gap-30` or custom `120px`)

**Vertical Rhythm (Section Spacing):**
- Hero Top Padding: `80-100px` (`pt-20` to `pt-24`)
- Normal Sections: `96-120px` (`py-24` to `py-32`)
- Small Sections: `64px` (`py-16`)
- Footer Top: `80px` (`pt-20`)

## 3. Typography Scale
Use consistent font-weight and line-height. Font Family: Inter (sans-serif).

| Type | Size | Weight | Line Height | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | 60-64px | Black / Extrabold | 1.15 | `text-[60px] lg:text-[64px] font-black leading-[1.15]` |
| **Section Heading** | 40-44px | Bold | 1.2 | `text-[40px] font-bold leading-tight` |
| **Card Heading** | 20px | Semibold | 1.4 | `text-xl font-semibold` |
| **Normal Heading** | 18px | Semibold | 1.5 | `text-lg font-semibold` |
| **Body** | 16px | Normal | 1.6 | `text-base` |
| **Small Text** | 14px | Medium | 1.5 | `text-sm font-medium` |
| **Caption** | 12px | Medium | 1.5 | `text-xs font-medium` |

## 4. Colors
Strict adherence to semantic tokens. No arbitrary hex codes outside of config.

- **Primary**: Blue `#2563EB` (`blue-600`), Hover: `#1D4ED8` (`blue-700`)
- **Secondary**: Slate `#0F172A` (`slate-900`)
- **Success**: Green `#16A34A` (`green-600`)
- **Warning**: Amber `#D97706` (`amber-600`)
- **Danger**: Red `#DC2626` (`red-600`)
- **Info**: Sky Blue `#0284C7` (`sky-600`)
- **Text (Primary)**: `#0F172A` (`text-slate-900`)
- **Text (Muted)**: `#64748B` (`text-slate-500`)
- **Border**: `#E2E8F0` (`border-slate-200`)
- **Background (App)**: `#F8FAFC` (`bg-slate-50`)
- **Background (Card)**: `#FFFFFF` (`bg-white`)
- **Hover State**: `#F1F5F9` (`hover:bg-slate-100`)

## 5. Border Radius
Inconsistent corners are prohibited.

- **Buttons & Inputs**: `8px` (`rounded-md` or `rounded-lg` depending on config, specifically use `rounded-md` for inputs/buttons)
- **Cards**: `12px` (`rounded-xl`)
- **Dialogs/Modals**: `16px` (`rounded-2xl`)

## 6. Shadows
Minimalist shadows only. Remove all heavy glows and neon effects.

- **shadow-xs**: For inputs, subtle buttons. `shadow-sm` in Tailwind.
- **shadow-sm**: For standard cards. `shadow` in Tailwind.
- **shadow-md**: For dropdowns, modals. `shadow-lg` in Tailwind.

## 7. Component Specifications

### Buttons
- **Primary**: `bg-blue-600 text-white rounded-md h-12 px-6`
- **Secondary**: `bg-transparent border border-slate-300 text-slate-700 rounded-md h-12 px-6`
- **Heights**: 
  - Small: `40px` (`h-10`)
  - Normal: `48px` (`h-12`)
  - Large: `52px` (`h-[52px]`)

### Cards
- **Padding**: `24px` (`p-6`)
- **Radius**: `12px` (`rounded-xl`)
- **Border**: `1px solid border-slate-200`
- **Shadow**: `shadow-sm`

### Form Components (Inputs, Selects)
- **Height**: `48px` (`h-12`)
- **Radius**: `8px` (`rounded-md`)
- **Border**: `border-slate-300`
- **Focus**: `focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600`
- **Spacing**: `24px` between form groups

### Icons (Lucide React)
- **Navigation**: `20px` (`h-5 w-5`)
- **Cards**: `20px` (`h-5 w-5`)
- **Buttons**: `16px` (`h-4 w-4`)
- **Badges**: `14px` (`h-3.5 w-3.5`)

## 8. Animations
- **Duration**: `150-200ms`
- **Easing**: Standard `transition-all` or `transition-colors`
- **Effect**: Subtle background color change or border change. **NO TRANSLATE Y JUMPS** on standard buttons. No flashy animations.

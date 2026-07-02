export interface FeatureDefinition {
  id: string;
  name: string;
  route: string;
  icon?: string;
  sidebarVisibility: boolean;
  requiredRoles: string[];
  pageTitle: string;
  category: string;
  order: number;
}

export const FEATURE_REGISTRY: FeatureDefinition[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    route: '/',
    sidebarVisibility: true,
    requiredRoles: ['Super Admin', 'City Manager', 'Support Agent'],
    pageTitle: 'Overview',
    category: 'Core',
    order: 10,
  },
  {
    id: 'leads',
    name: 'Leads',
    route: '/leads',
    sidebarVisibility: true,
    requiredRoles: ['Super Admin', 'City Manager', 'Support Agent'],
    pageTitle: 'Lead Management',
    category: 'Sales',
    order: 20,
  },
  {
    id: 'users',
    name: 'Users (Staff)',
    route: '/users',
    sidebarVisibility: true,
    requiredRoles: ['Super Admin', 'City Manager'],
    pageTitle: 'Staff Management',
    category: 'Administration',
    order: 100,
  },
  {
    id: 'cities',
    name: 'Cities',
    route: '/cities',
    sidebarVisibility: true,
    requiredRoles: ['Super Admin'],
    pageTitle: 'City Operations',
    category: 'Administration',
    order: 110,
  },
  {
    id: 'roles',
    name: 'Roles',
    route: '/roles',
    sidebarVisibility: true,
    requiredRoles: ['Super Admin'],
    pageTitle: 'Role Configuration',
    category: 'Administration',
    order: 120,
  },
  {
    id: 'services',
    name: 'Services',
    route: '/services',
    sidebarVisibility: true,
    requiredRoles: ['Super Admin'],
    pageTitle: 'Service Catalogue',
    category: 'Master Data',
    order: 200,
  },
  {
    id: 'pricing-rules',
    name: 'Pricing Rules',
    route: '/pricing-rules',
    sidebarVisibility: true,
    requiredRoles: ['Super Admin'],
    pageTitle: 'Pricing Configuration',
    category: 'Master Data',
    order: 210,
  }
];

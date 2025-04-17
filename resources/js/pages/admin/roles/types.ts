import { Role, Permission, BreadcrumbItem } from '@/types';

/**
 * Role form data interface
 */
export interface RoleFormData {
  name: string;
  permissions: string[];
}

/**
 * Props for the RoleForm component
 */
export interface RoleFormProps {
  role?: Role;
  permissions: Permission[];
  mode: 'create' | 'edit';
  onSubmit: (formData: RoleFormData) => void;
}

/**
 * Props for the index page
 */
export interface IndexProps {
  roles: {
    data: Role[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
    current_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
  };
  filters: TableFilters;
}

/**
 * Props for the create page
 */
export interface CreateProps {
  permissions: Permission[];
}

/**
 * Props for the edit page
 */
export interface EditProps {
  role: Role;
  permissions: Permission[];
}

/**
 * Props for the show page
 */
export interface ShowProps {
  role: Role;
}

/**
 * Props for the permissions page
 */
export interface PermissionsProps {
  permissions: Record<string, Permission[]>;
}

/**
 * Table filters for roles
 */
export interface TableFilters {
  search: string;
  sort_field: string;
  sort_direction: "asc" | "desc";
  per_page: number;
  page: number;
  [key: string]: string | number | boolean | null | undefined; // Allow for additional filter properties
}

/**
 * Common breadcrumbs for role management
 */
export const dashboardBreadcrumb: BreadcrumbItem = {
  title: 'Dashboard',
  href: route('dashboard'),
};

export const rolesBreadcrumb: BreadcrumbItem = {
  title: 'Roles',
  href: route('admin.roles.index'),
};

export const permissionsBreadcrumb: BreadcrumbItem = {
  title: 'Permissions',
  href: route('admin.permissions.index'),
};

export const createBreadcrumb: BreadcrumbItem = {
  title: 'Create',
  href: route('admin.roles.create'),
};

export const editBreadcrumb: BreadcrumbItem = {
  title: 'Edit',
  href: '#',
};

export const showBreadcrumb: BreadcrumbItem = {
  title: 'View',
  href: '#',
};

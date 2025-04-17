import { User, Role, BreadcrumbItem } from '@/types';

/**
 * User form data interface
 */
export interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  bio?: string;
  avatar?: string;
  roles: string[];
}

/**
 * Props for the UserForm component
 */
export interface UserFormProps {
  user?: User;
  roles: Role[];
  mode: 'create' | 'edit';
  onSubmit: (formData: UserFormData) => void;
}

/**
 * Props for the index page
 */
export interface IndexProps {
  users: {
    data: User[];
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
  };
  auth: {
    user: User;
  };
  filters: {
    search: string | null;
    per_page: number;
    sort_field: string;
    sort_direction: 'asc' | 'desc';
  };
}

/**
 * Props for the create page
 */
export interface CreateProps {
  roles: Role[];
}

/**
 * Props for the edit page
 */
export interface EditProps {
  user: User;
  roles: Role[];
}

/**
 * Props for the show page
 */
export interface ShowProps {
  user: User;
}

/**
 * Common breadcrumbs for user management
 */
export const dashboardBreadcrumb: BreadcrumbItem = {
  title: 'Dashboard',
  href: route('dashboard'),
};

export const usersBreadcrumb: BreadcrumbItem = {
  title: 'Users',
  href: route('admin.users.index'),
};

export const createBreadcrumb: BreadcrumbItem = {
  title: 'Create',
  href: route('admin.users.create'),
};

export const editBreadcrumb: BreadcrumbItem = {
  title: 'Edit',
  href: '#',
};

export const showBreadcrumb: BreadcrumbItem = {
  title: 'View',
  href: '#',
};


/**
 * Props for the UserRolesFilter component
 */
export interface RolesFilterProps {
  roles: Role[];
  selectedRoleIds: (number | string)[] | null;
  baseUrl: string;
}

/**
 * Extended filters for the users table
 */
export interface TableFilters {
  search: string;
  sort_field: string;
  sort_direction: "asc" | "desc";
  per_page: number;
  page: number;
  role_ids?: (number | string)[] | null;
}

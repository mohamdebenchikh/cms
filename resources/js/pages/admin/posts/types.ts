import { PageProps } from '@inertiajs/core';
import { Post, Category, Tag, Pagination } from '@/types';
import { PostFormData } from './components/form';

// Breadcrumbs
export const dashboardBreadcrumb = {
  title: 'Dashboard',
  href: route('dashboard'),
};

export const postsBreadcrumb = {
  title: 'Posts',
  href: route('admin.posts.index'),
};

export const createBreadcrumb = {
  title: 'Create',
  href: route('admin.posts.create'),
};

export const editBreadcrumb = {
  title: 'Edit',
  href: '#',
};

export const showBreadcrumb = {
  title: 'View',
  href: '#',
};

// Props interfaces
export interface IndexProps extends PageProps {
  posts: {
    data: Post[];
    links?: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    per_page?: number;
    total?: number;
    from?: number;
    to?: number;
    current_page?: number;
    meta?: {
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      per_page: number;
      total: number;
      from: number;
      to: number;
      current_page: number;
    };
  };
  filters: TableFilters;
  categories: Category[];
}

export interface CreateProps extends PageProps {
  categories: Category[];
  tags: Tag[];
}

export interface EditProps extends PageProps {
  post: Post;
  categories: Category[];
  tags: Tag[];
}

export interface ShowProps extends PageProps {
  post: Post & {
    category: Category | null;
    tags: Tag[];
  };
}

// Table filters
export interface TableFilters {
  search?: string;
  sort_field?: string;
  sort_direction?: string;
  per_page?: number;
  category_id?: string | null;
  status?: string | null;
  [key: string]: string | number | boolean | null | undefined; // Allow for additional filter properties
}

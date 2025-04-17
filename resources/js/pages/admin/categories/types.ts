import { Category, Post } from "@/types";
import { PageProps } from "@inertiajs/core";

// Breadcrumbs
export const dashboardBreadcrumb = {
  title: "Dashboard",
  href: route("dashboard"),
};

export const categoriesBreadcrumb = {
  title: "Categories",
  href: route("admin.categories.index"),
};

export const createBreadcrumb = {
  title: "Create",
  href: route("admin.categories.create"),
};

export const editBreadcrumb = (id: number) => ({
  title: "Edit",
  href: route("admin.categories.edit", id),
});

export const showBreadcrumb = (id: number) => ({
  title: "View",
  href: route("admin.categories.show", id),
});

// Props interfaces
export interface IndexProps extends PageProps {
  categories: {
    data: Category[];
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  filters: {
    search: string;
    sort_field: string;
    sort_direction: string;
    per_page: number;
  };
}

export type CreateProps = PageProps;

export interface EditProps extends PageProps {
  category: Category;
}

export interface ShowProps extends PageProps {
  category: Category & {
    posts: Post[];
  };
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string | null;
  image_cover: string | null;
  is_main: boolean;
  [key: string]: string | number | boolean | null | undefined;
}

export interface CategoryFormProps {
  category?: Category;
  mode: "create" | "edit";
  onSubmit: (data: CategoryFormData) => void;
  errors?: Record<string, string>;
}

// Table filters
export interface TableFilters {
  search?: string;
  sort_field?: string;
  sort_direction?: string;
  per_page?: number;
  [key: string]: string | number | boolean | null | undefined; // Allow for additional filter properties
}


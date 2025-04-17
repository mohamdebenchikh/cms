import { Tag } from "@/types";
import { PageProps } from "@inertiajs/core";

// Breadcrumbs
export const dashboardBreadcrumb = {
  title: "Dashboard",
  href: route("dashboard"),
};

export const tagsBreadcrumb = {
  title: "Tags",
  href: route("admin.tags.index"),
};

export const createBreadcrumb = {
  title: "Create",
  href: route("admin.tags.create"),
};

export const editBreadcrumb = (id: number) => ({
  title: "Edit",
  href: route("admin.tags.edit", id),
});

export const showBreadcrumb = (id: number) => ({
  title: "View",
  href: route("admin.tags.show", id),
});

// Props interfaces
export interface IndexProps extends PageProps {
  tags: {
    data: Tag[];
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
  tag: Tag;
}

export interface ShowProps extends PageProps {
  tag: Tag & {
    posts: any[];
  };
}

export interface TagFormData {
  name: string;
  slug: string;
  [key: string]: string | null | undefined;
}

export interface TagFormProps {
  tag?: Tag;
  mode: "create" | "edit";
  onSubmit: (data: TagFormData) => void;
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

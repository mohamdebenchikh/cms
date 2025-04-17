import { Page } from "@/types";
import { PageProps } from "@inertiajs/core";

// Breadcrumbs
export const dashboardBreadcrumb = {
  title: "Dashboard",
  href: route("dashboard"),
};

export const pagesBreadcrumb = {
  title: "Pages",
  href: route("admin.pages.index"),
};

export const createBreadcrumb = {
  title: "Create",
  href: route("admin.pages.create"),
};

export const editBreadcrumb = {
  title: "Edit",
  href: "#",
};

export const showBreadcrumb = {
  title: "View",
  href: "#",
};

// Props interfaces
export interface IndexProps extends PageProps {
  pages: {
    data: Page[];
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
}

export interface CreateProps extends PageProps {}

export interface EditProps extends PageProps {
  page: Page;
}

export interface ShowProps extends PageProps {
  page: Page & {
    user: {
      id: number;
      name: string;
    };
  };
}

export interface PageFormData {
  title: string;
  slug: string;
  content: string;
  status?: string;
  published_at?: string | null;
  [key: string]: string | null | undefined;
}

export interface TableFilters {
  search?: string;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
  status?: string;
  [key: string]: string | number | boolean | null | undefined; // Allow for additional filter properties
}

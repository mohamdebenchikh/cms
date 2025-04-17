import { PageProps } from "@inertiajs/core";

// Breadcrumbs
export const dashboardBreadcrumb = {
  title: "Dashboard",
  href: route("dashboard"),
};

export const imagesBreadcrumb = {
  title: "Images",
  href: route("admin.images.index"),
};

// Image interface
export interface Image {
  id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  url: string;
  alt_text: string | null;
  title: string | null;
  description: string | null;
  collection: string | null;
  created_at: string;
  updated_at: string;
  // Database fields
  path?: string;
  disk?: string;
  filename?: string;
  original_filename?: string;
  mime_type?: string;
  size?: number;
  user?: {
    id: number;
    name: string;
  };
}

// Props interfaces
export interface IndexProps extends PageProps {
  images: {
    data: Image[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  filters: {
    search?: string;
    sort_field?: string;
    sort_direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
    file_type?: string;
    [key: string]: string | number | undefined;
  };
}

// Form data interfaces
export interface ImageUploadFormData {
  file: File;
  title?: string;
  file_name?: string;
  alt_text?: string;
  description?: string;
  collection?: string;
}

export interface ImageUpdateFormData {
  title?: string;
  file_name?: string;
  alt_text?: string;
  description?: string;
  collection?: string | null;
}

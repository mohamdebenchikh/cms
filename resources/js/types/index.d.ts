import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string;
    permissions?: string[];
    role?: string;
    roles?: string[];
    matchAny?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    settings?: {
        site_name?: string;
        site_description?: string;
        site_logo?: string;
        favicon?: string;
        meta_title?: string;
        meta_description?: string;
        meta_keywords?: string;
        maintenance_mode?: boolean;
        maintenance_message?: string;
        [key: string]: any;
    };
    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    role?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    permissions?: Permission[];
    posts?: Post[];
    pages?: Page[];
    images?: Image[];
    [key: string]: unknown;
}

export interface Category {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    image_cover: string | null;
    is_main: boolean;
    order: number;
    created_at: string;
    updated_at: string;
    posts?: Post[];
    posts_count?: number;
    children?: Category[];
    parent?: Category;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    posts?: Post[];
    posts_count?: number;
}

export interface Seo {
    id: number;
    title: string | null;
    keywords: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: number;
    user_id: number;
    category_id: number | null;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    is_featured: boolean;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    updated_at: string;
    reading_time?: number;
    views?: number;
    user?: User;
    category?: Category;
    tags?: Tag[];
    related_posts?: Post[];
    seo?: Seo;
}

export interface Page {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    featured_image?: string | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    seo?: Seo;
}

export interface Image {
    id: number;
    user_id: number;
    filename: string;
    original_filename: string;
    mime_type: string;
    path: string;
    disk: string;
    collection: string | null;
    size: number;
    alt_text: string | null;
    title: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    url?: string; // Virtual attribute from getUrlAttribute
}

export interface Setting {
    id: number;
    key: string;
    value: string | null;
    display_name: string;
    type: 'text' | 'textarea' | 'boolean' | 'select' | 'number' | 'file';
    options: Record<string, string> | null;
    group: string;
    description: string | null;
    is_public: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
    users?: User[];
    users_count?: number;
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    users?: User[];
}

export interface Pagination<T> {
    data: T[];
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
}

// Type for form errors
export interface Errors {
    [key: string]: string[];
}

// Type for flash messages
export interface FlashMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

// Type for select options
export interface SelectOption {
    label: string;
    value: string | number;
}

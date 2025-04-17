import { ColumnDef, Table, Column, TableMeta } from "@tanstack/react-table";
import { ReactNode } from "react";

/**
 * Extend the TableMeta interface from @tanstack/react-table
 */
declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    filterComponent?: ReactNode;
    searchPlaceholder?: string;
  }
}

/**
 * Filters for the data table
 */
export interface DataTableFilters {
  search: string;
  sort_field: string;
  sort_direction: "asc" | "desc";
  per_page: number;
  page: number;
  role_id?: string | null;
  category_id?: string | null;
  status?: string | null;
  [key: string]: string | number | boolean | null | undefined; // Allow for additional filter properties
}

/**
 * Link for pagination
 */
export interface DataTableLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Context type for the data table
 */
export interface DataTableContextType<TData> {
  // States
  table: Table<TData>;
  filters: DataTableFilters;
  links?: DataTableLink[];
  per_page: number;
  baseUrl?: string;
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  total?: number;
  from?: number;
  to?: number;
  current_page?: number;
  isMobile: boolean;

  // Functions
  handleSort: (field: string, direction: 'asc' | 'desc') => void;
  handleSearch: (value: string) => void;
  handlePageChange: (url: string | null) => void;
  handlePerPageChange: (value: number) => void;
}

/**
 * Props for the data table provider
 */
export interface DataTableProviderProps<TData, TValue> {
  children: ReactNode;
  columns: ColumnDef<TData, TValue>[];
  mobileColumns?: ColumnDef<TData, TValue>[];
  data: TData[];
  filters: DataTableFilters;
  links?: DataTableLink[];
  per_page: number;
  baseUrl?: string; // Optional base URL for all data table operations
  total?: number;
  from?: number;
  to?: number;
  current_page?: number;
  meta?: {
    filterComponent?: ReactNode;
    searchPlaceholder?: string;
    [key: string]: any; // Allow for additional meta properties
  };
}

/**
 * Props for the data table component
 */
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  mobileColumns?: ColumnDef<TData, TValue>[];
  data: TData[];
  filters: DataTableFilters;
  links?: DataTableLink[];
  per_page: number;
  baseUrl?: string; // Optional base URL for all data table operations
  total?: number;
  from?: number;
  to?: number;
  current_page?: number;
}

/**
 * Props for the data table column header
 */
export interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  sortable?: boolean;
}

/**
 * Props for the data table search component
 */
export interface DataTableSearchProps {
  placeholder?: string;
}

/**
 * Option for custom filters
 */
export interface FilterOption {
  id: string | number;
  name: string;
  [key: string]: unknown; // Allow for additional properties
}

/**
 * Props for the data table custom filter component
 */
export interface DataTableCustomFilterProps {
  options: FilterOption[];
  filterKey: string; // The key to use in the URL query (e.g., 'role_id', 'status', etc.)
  currentValue?: string | null;
  baseUrl?: string;
  placeholder?: string;
  label?: string;
  emptyMessage?: string;
}
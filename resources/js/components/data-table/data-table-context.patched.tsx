import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-media-query";
// Router is now used directly in the components that need it
import {
  DataTableContextType,
  DataTableProviderProps
} from './types';
import {
  handleSort as handleSortUtil,
  createDebouncedSearch,
  handlePageChange as handlePageChangeUtil,
  handlePerPageChange as handlePerPageChangeUtil
} from './utils';

// Create the context with a generic type
const DataTableContext = createContext<DataTableContextType<unknown> | undefined>(undefined);

// Create the provider component
export function DataTableProvider<TData, TValue>({
  children,
  columns,
  mobileColumns,
  data,
  filters = { search: '', sort_field: 'name', sort_direction: 'asc', per_page: 10, page: 1 },
  links,
  per_page,
  baseUrl,
  total,
  from,
  to,
  current_page,
  meta,
}: DataTableProviderProps<TData, TValue>) {
  // Ensure filters has all required properties
  const safeFilters = {
    search: filters?.search || '',
    sort_field: filters?.sort_field || 'name',
    sort_direction: filters?.sort_direction || 'asc',
    per_page: filters?.per_page || 10,
    page: filters?.page || 1,
    ...filters
  };

  // States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Check if we're on mobile
  const isMobile = useIsMobile();

  // Use mobile columns if provided and we're on mobile
  const activeColumns = (isMobile && mobileColumns) ? mobileColumns : columns;

  // Set initial sorting state based on filters
  useEffect(() => {
    if (safeFilters.sort_field && safeFilters.sort_direction) {
      setSorting([
        {
          id: safeFilters.sort_field,
          desc: safeFilters.sort_direction === 'desc'
        }
      ]);
    }
  }, [safeFilters.sort_field, safeFilters.sort_direction]);

  // Create the table instance
  const table = useReactTable({
    data,
    columns: activeColumns,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta,
  });

  // Create utility functions
  const handleSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    return handleSortUtil(column, direction, baseUrl, safeFilters);
  }, [baseUrl, safeFilters]);

  const handlePageChange = useCallback((page: number) => {
    return handlePageChangeUtil(page, baseUrl, safeFilters);
  }, [baseUrl, safeFilters]);

  const handlePerPageChange = useCallback((perPage: number) => {
    return handlePerPageChangeUtil(perPage, baseUrl, safeFilters);
  }, [baseUrl, safeFilters]);

  const handleSearchChange = createDebouncedSearch(baseUrl, safeFilters);

  // Create the context value
  const contextValue = {
    table,
    filters: safeFilters,
    links,
    per_page,
    baseUrl,
    rowSelection,
    setRowSelection,
    total,
    from,
    to,
    current_page,
    // Utility functions
    handleSort,
    handlePageChange,
    handlePerPageChange,
    handleSearchChange,
  };

  return (
    <DataTableContext.Provider value={contextValue as unknown as DataTableContextType<unknown>}>
      {children}
    </DataTableContext.Provider>
  );
}

// Create a hook to use the context
export function useDataTable<TData>() {
  const context = useContext(DataTableContext);
  if (context === undefined) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context as DataTableContextType<TData>;
}

// Re-export types from the types file
export type { DataTableLink, DataTableFilters } from './types';

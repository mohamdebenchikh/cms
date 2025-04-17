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
  filters,
  links,
  per_page,
  baseUrl,
  total,
  from,
  to,
  current_page,
  meta,
}: DataTableProviderProps<TData, TValue>) {
  // States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(meta?.initialVisibility || {});
  const [rowSelection, setRowSelection] = useState({});

  // Check if we're on mobile
  const isMobile = useIsMobile();

  // Use mobile columns if provided and we're on mobile
  const activeColumns = isMobile && mobileColumns ? mobileColumns : columns;

  // Initialize sorting state based on filters
  useEffect(() => {
    if (filters.sort_field) {
      setSorting([
        {
          id: filters.sort_field,
          desc: filters.sort_direction === 'desc'
        }
      ]);
    }
  }, [filters.sort_field, filters.sort_direction]);

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
    meta: meta, // Pass the meta to the table
  });

  // Handler functions
  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    handleSortUtil(field, direction, filters, baseUrl);
  };

  // Create a debounced search function that only triggers after 500ms of inactivity
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    createDebouncedSearch(filters, baseUrl),
    [filters, baseUrl] // Re-create the debounced function when filters or baseUrl change
  );

  // This is the function that will be called when the user types in the search field
  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handlePageChange = (url: string | null) => {
    handlePageChangeUtil(url);
  };

  const handlePerPageChange = (value: number) => {
    handlePerPageChangeUtil(value, baseUrl);
  };

  // Role filtering is now handled directly in the DataTableRoleFilter component

  // Create the context value
  const contextValue: DataTableContextType<TData> = {
    table,
    filters,
    links,
    per_page,
    baseUrl,
    rowSelection,
    setRowSelection,
    total,
    from,
    to,
    current_page,
    isMobile,
    handleSort,
    handleSearch,
    handlePageChange,
    handlePerPageChange,
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

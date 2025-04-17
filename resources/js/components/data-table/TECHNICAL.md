# Data Table Technical Documentation

This document provides detailed technical information about the Data Table component implementation, including code structure, internal functions, and implementation details.

## Architecture Overview

The Data Table component follows a context-based architecture with the following key principles:

1. **Component-Based Structure**: Each functional part of the data table is implemented as a separate component
2. **Context-Based State Management**: A central context manages state and provides functions to all components
3. **Responsive Design**: The component adapts to different screen sizes with specific layouts
4. **Server-Side Operations**: Pagination, sorting, and filtering are handled server-side

## Component Breakdown

### `index.tsx`

The main entry point that exports the `DataTable` component and related hooks.

```typescript
export function DataTable<TData, TValue>({
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
    filterComponent,
    searchPlaceholder = "Search..."
}: DataTableExtendedProps<TData, TValue>) {
    return (
        <DataTableProvider
            columns={columns}
            mobileColumns={mobileColumns}
            data={data}
            filters={filters}
            links={links}
            per_page={per_page}
            baseUrl={baseUrl}
            total={total}
            from={from}
            to={to}
            current_page={current_page}
            meta={{
                filterComponent,
                searchPlaceholder
            }}
        >
            <DataTableContent />
        </DataTableProvider>
    );
}
```

The `DataTableContent` component renders the actual table structure:

```typescript
function DataTableContent() {
    const { table } = useDataTable();
    const { filterComponent, searchPlaceholder } = table.options.meta || {};

    return (
        <div className="space-y-4">
            <DataTableFilters searchPlaceholder={searchPlaceholder as string}>
                {filterComponent}
            </DataTableFilters>
            <div className="overflow-hidden rounded-md border shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {/* Header rendering */}
                        </TableHeader>
                        <TableBody>
                            {/* Body rendering */}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DataTablePagination />
        </div>
    )
}
```

### `data-table-context.tsx`

Implements the context provider that manages the data table state and behavior.

Key functions:

#### `handleSort`

```typescript
const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
  if (!baseUrl) return;

  const url = new URL(baseUrl, window.location.origin);
  const params = new URLSearchParams(url.search);
  
  // Set sort parameters
  params.set('sort_field', field);
  params.set('sort_direction', direction);
  
  // Reset to page 1 when sorting changes
  params.set('page', '1');
  
  // Preserve other filters
  if (filters.search) params.set('search', filters.search);
  
  // Handle additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== 'sort_field' && key !== 'sort_direction' && key !== 'search' && key !== 'page') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(`${key}[]`, v));
      } else if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
  });
  
  url.search = params.toString();
  window.location.href = url.toString();
}, [baseUrl, filters]);
```

#### `handleSearch`

```typescript
const handleSearch = useCallback((value: string) => {
  if (!baseUrl) return;

  const url = new URL(baseUrl, window.location.origin);
  const params = new URLSearchParams(url.search);
  
  if (value) {
    params.set('search', value);
  } else {
    params.delete('search');
  }
  
  // Reset to page 1 when search changes
  params.set('page', '1');
  
  // Preserve sort parameters
  if (filters.sort_field) params.set('sort_field', filters.sort_field);
  if (filters.sort_direction) params.set('sort_direction', filters.sort_direction);
  
  // Handle additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== 'sort_field' && key !== 'sort_direction' && key !== 'search' && key !== 'page') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(`${key}[]`, v));
      } else if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
  });
  
  url.search = params.toString();
  window.location.href = url.toString();
}, [baseUrl, filters]);
```

#### `handlePageChange`

```typescript
const handlePageChange = useCallback((url: string | null) => {
  if (url) {
    window.location.href = url;
  }
}, []);
```

#### `handlePerPageChange`

```typescript
const handlePerPageChange = useCallback((value: number) => {
  if (!baseUrl) return;

  const url = new URL(baseUrl, window.location.origin);
  const params = new URLSearchParams(url.search);
  
  params.set('per_page', value.toString());
  
  // Reset to page 1 when per_page changes
  params.set('page', '1');
  
  // Preserve other parameters
  if (filters.search) params.set('search', filters.search);
  if (filters.sort_field) params.set('sort_field', filters.sort_field);
  if (filters.sort_direction) params.set('sort_direction', filters.sort_direction);
  
  // Handle additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== 'sort_field' && key !== 'sort_direction' && key !== 'search' && key !== 'page' && key !== 'per_page') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(`${key}[]`, v));
      } else if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
  });
  
  url.search = params.toString();
  window.location.href = url.toString();
}, [baseUrl, filters]);
```

### `datatable-column-header.tsx`

Implements the column header with sorting functionality.

```typescript
export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const { filters, handleSort } = useDataTable();
    const sortField = filters.sort_field;
    const sortDirection = filters.sort_direction;
    
    if (!column.getCanSort()) {
        return <div className={cn("whitespace-nowrap py-2 text-sm font-medium", className)}>{title}</div>
    }

    // Check if this column is currently being sorted
    const isCurrentSort = sortField === column.id

    return (
        <div className={cn("flex items-center space-x-1", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 whitespace-nowrap text-sm font-medium data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {isCurrentSort ? (
                            sortDirection === "desc" ? (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )
                        ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => handleSort(column.id, 'asc')}
                        className={cn("cursor-pointer", {
                            'bg-accent/50': isCurrentSort && sortDirection === 'asc'
                        })}
                    >
                        <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleSort(column.id, 'desc')}
                        className={cn("cursor-pointer", {
                            'bg-accent/50': isCurrentSort && sortDirection === 'desc'
                        })}
                    >
                        <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
```

### `datatable-filters.tsx`

Implements the filters container component.

```typescript
export function DataTableFilters({
  children,
  searchPlaceholder = "Search...",
  showViewOptions = true
}: DataTableFiltersProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <DataTableSearch placeholder={searchPlaceholder} />
          <div className="flex flex-wrap items-center gap-2">
            {children}
          </div>
        </div>

        <div className="flex items-center justify-end">
          {showViewOptions && <DataTableViewOptions />}
        </div>
      </div>
    </div>
  );
}
```

### `datatable-pagination.tsx`

Implements the pagination component with responsive design.

Key features:
- Displays total records count
- Shows current page range (e.g., "Showing 1-10 of 100")
- Implements a sliding window pagination system
- Provides per-page selection

```typescript
export function DataTablePagination() {
  const { table, links, per_page, total, from, to, handlePageChange, handlePerPageChange } = useDataTable();

  return (
    <div className="flex flex-col gap-4 px-2 py-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:gap-4">
        <div className="flex items-center space-x-1">
          <p className="whitespace-nowrap text-sm font-medium">Rows per page:</p>
          <Select
            value={`${per_page}`}
            onValueChange={(value) => {
              handlePerPageChange(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {total !== undefined && from !== undefined && to !== undefined && (
          <div className="text-sm whitespace-nowrap">
            Showing <span className="font-medium">{from}</span> to{" "}
            <span className="font-medium">{to}</span> of{" "}
            <span className="font-medium">{total}</span> records
          </div>
        )}
      </div>
      
      <div className="flex justify-center md:justify-end">
        {links && links.length > 0 ? (
          <Pagination className="w-full md:w-auto">
            <PaginationContent className="flex flex-wrap justify-center gap-1">
              {/* Pagination links rendering */}
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  )
}
```

### `datatable-search.tsx`

Implements the search input with debounced search functionality.

```typescript
export function DataTableSearch({
    placeholder = "Search for...",
}: DataTableSearchProps) {
    const { filters, handleSearch } = useDataTable();
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);

    // Update local state when filters change (e.g., when navigating or initial load)
    useEffect(() => {
        setSearchValue(filters.search ?? '');
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        handleSearchChangeUtil(value, setSearchValue, setIsSearching, handleSearch);
    };

    return (
        <div className="relative w-full max-w-sm flex-1">
            {isSearching ? (
                <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            )}
            <Input
                placeholder={placeholder}
                value={searchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="h-9 w-full pl-8 text-sm md:h-10"
            />
        </div>
    )
}
```

### `datatable-view-option.tsx`

Implements the column visibility controls.

```typescript
export function DataTableViewOptions() {
  const { table } = useDataTable();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto flex h-9 items-center gap-1 md:h-10"
        >
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline-block">View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### `utils.ts`

Contains utility functions used by the data table components.

```typescript
import { debounce } from 'lodash';

/**
 * Debounced search handler for the data table
 */
export const handleSearchChange = debounce((
  value: string,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
  handleSearch: (value: string) => void
) => {
  setSearchValue(value);
  setIsSearching(true);
  
  // Call the actual search handler
  handleSearch(value);
  
  // Reset searching state after a short delay
  setTimeout(() => {
    setIsSearching(false);
  }, 300);
}, 500);
```

## Responsive Implementation

### Media Query Hook

The data table uses a custom hook to detect mobile devices:

```typescript
import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting if a media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handler);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * Custom hook for detecting if the screen is mobile size
 */
export function useIsMobile(breakpoint = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint}px)`);
}
```

### Mobile Columns Implementation

The data table context switches between desktop and mobile columns based on screen size:

```typescript
// Check if we're on mobile
const isMobile = useIsMobile();

// Use mobile columns if provided and we're on mobile
const activeColumns = isMobile && mobileColumns ? mobileColumns : columns;

// Create the table instance with the active columns
const table = useReactTable({
  data,
  columns: activeColumns,
  // Other options...
});
```

## Advanced Features

### Row Selection

Row selection is implemented using TanStack Table's built-in selection features:

```typescript
const [rowSelection, setRowSelection] = useState({});

const table = useReactTable({
  // Other options...
  state: {
    // Other state...
    rowSelection,
  },
  enableRowSelection: true,
  onRowSelectionChange: setRowSelection,
});
```

### Bulk Actions

Bulk actions can be implemented by accessing the selected rows from the table:

```typescript
function BulkActions() {
  const { table } = useDataTable<User>();
  
  // Get selected row IDs
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map(row => Number(row.original.id));
  const hasSelected = selectedIds.length > 0;
  
  // Render bulk action buttons if rows are selected
  return (
    <div>
      {hasSelected && (
        <Button onClick={() => handleBulkAction(selectedIds)}>
          Process {selectedIds.length} items
        </Button>
      )}
    </div>
  );
}
```

## Performance Considerations

### Debounced Search

Search input is debounced to prevent excessive API calls:

```typescript
export const handleSearchChange = debounce((
  value: string,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
  handleSearch: (value: string) => void
) => {
  // Implementation...
}, 500);
```

### Server-Side Operations

All data operations (sorting, filtering, pagination) are handled server-side to minimize client-side processing and improve performance with large datasets.

### Memoization

The data table uses React's `useCallback` and `useMemo` hooks to optimize performance:

```typescript
const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
  // Implementation...
}, [baseUrl, filters]);

const handleSearch = useCallback((value: string) => {
  // Implementation...
}, [baseUrl, filters]);
```

## Integration with Backend

The data table is designed to work with Laravel's pagination system. It expects the following data structure from the backend:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  per_page: number;
  total: number;
  from: number;
  to: number;
  current_page: number;
}
```

The backend should handle the following query parameters:

- `search`: Search term for filtering
- `sort_field`: Field to sort by
- `sort_direction`: Sort direction ('asc' or 'desc')
- `per_page`: Number of items per page
- `page`: Current page number
- Additional custom filter parameters

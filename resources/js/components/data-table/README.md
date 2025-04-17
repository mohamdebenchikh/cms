# Data Table Component Documentation

This document provides a comprehensive guide to the Data Table component, its architecture, features, and usage.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Core Components](#core-components)
4. [Data Types](#data-types)
5. [Context System](#context-system)
6. [Features](#features)
7. [Responsive Design](#responsive-design)
8. [Usage Examples](#usage-examples)
9. [Customization](#customization)

## Overview

The Data Table component is a flexible, feature-rich table implementation built on top of TanStack Table (React Table) and shadcn UI components. It provides a complete solution for displaying, sorting, filtering, and paginating tabular data with a responsive design that works across all device sizes.

Key features include:
- Server-side pagination, sorting, and filtering
- Responsive design with mobile-specific layouts
- Column visibility control
- Row selection with bulk actions
- Customizable filters and search
- Accessible UI components

## File Structure

```
data-table/
├── index.tsx                  # Main entry point and DataTable component
├── data-table-context.tsx     # Context provider for state management
├── datatable-column-header.tsx # Column header with sorting controls
├── datatable-filters.tsx      # Filters container component
├── datatable-pagination.tsx   # Pagination controls
├── datatable-search.tsx       # Search input component
├── datatable-view-option.tsx  # Column visibility controls
├── types.ts                   # TypeScript interfaces and types
├── utils.ts                   # Utility functions
└── README.md                  # Documentation (this file)
```

## Core Components

### `DataTable`

The main component that orchestrates all the data table functionality. It serves as the entry point and wraps all other components.

**Location**: `index.tsx`

**Responsibilities**:
- Initializes the data table provider
- Renders the table structure
- Handles the overall layout

### `DataTableProvider`

A context provider that manages the state and behavior of the data table.

**Location**: `data-table-context.tsx`

**Responsibilities**:
- Manages table state (sorting, filtering, pagination)
- Provides methods for interacting with the table
- Handles responsive behavior switching between desktop and mobile columns

### `DataTableColumnHeader`

A component for rendering table column headers with sorting functionality.

**Location**: `datatable-column-header.tsx`

**Responsibilities**:
- Renders column titles
- Provides sorting controls
- Handles column visibility options

### `DataTableFilters`

A container component for search and custom filters.

**Location**: `datatable-filters.tsx`

**Responsibilities**:
- Renders the search input
- Displays custom filter components
- Organizes the filter layout

### `DataTablePagination`

A component for rendering pagination controls.

**Location**: `datatable-pagination.tsx`

**Responsibilities**:
- Renders pagination links
- Displays records count information
- Provides per-page selection

### `DataTableSearch`

A component for searching table data.

**Location**: `datatable-search.tsx`

**Responsibilities**:
- Renders the search input
- Handles debounced search
- Shows loading state during search

### `DataTableViewOptions`

A component for controlling column visibility.

**Location**: `datatable-view-option.tsx`

**Responsibilities**:
- Provides a dropdown for toggling column visibility
- Renders column options
- Handles column visibility state

## Data Types

The data table uses several TypeScript interfaces and types to ensure type safety and provide proper autocompletion.

### Key Types

#### `DataTableFilters`

```typescript
export interface DataTableFilters {
  search?: string;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
  [key: string]: any; // Allow for additional filter properties
}
```

#### `DataTableLink`

```typescript
export interface DataTableLink {
  url: string | null;
  label: string;
  active: boolean;
}
```

#### `DataTableContextType`

```typescript
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
```

#### `DataTableProviderProps`

```typescript
export interface DataTableProviderProps<TData, TValue> {
  children: ReactNode;
  columns: ColumnDef<TData, TValue>[];
  mobileColumns?: ColumnDef<TData, TValue>[];
  data: TData[];
  filters: DataTableFilters;
  links?: DataTableLink[];
  per_page: number;
  baseUrl?: string;
  total?: number;
  from?: number;
  to?: number;
  current_page?: number;
  meta?: {
    filterComponent?: ReactNode;
    searchPlaceholder?: string;
    [key: string]: any;
  };
}
```

#### `DataTableProps`

```typescript
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  mobileColumns?: ColumnDef<TData, TValue>[];
  data: TData[];
  filters: DataTableFilters;
  links?: DataTableLink[];
  per_page: number;
  baseUrl?: string;
  total?: number;
  from?: number;
  to?: number;
  current_page?: number;
}
```

## Context System

The data table uses React's Context API to manage state and provide functionality to all child components. This approach eliminates prop drilling and centralizes the table's logic.

### Context Provider

The `DataTableProvider` component creates and provides the context:

```typescript
const DataTableContext = createContext<DataTableContextType<unknown> | undefined>(undefined);

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
  // Implementation...
}
```

### Context Consumer

Components can access the context using the `useDataTable` hook:

```typescript
export function useDataTable<TData = unknown>() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context as DataTableContextType<TData>;
}
```

## Features

### Server-side Pagination

The data table supports server-side pagination, allowing efficient handling of large datasets. It renders pagination links based on the provided `links` array and handles page navigation through the `handlePageChange` function.

### Sorting

Column sorting is handled server-side. The table sends the sort field and direction to the server and updates the UI accordingly. Sorting is triggered through the column headers.

### Filtering and Search

The data table supports both global search and custom filters:

1. **Global Search**: A search input that filters data across all searchable fields.
2. **Custom Filters**: Additional filter components can be provided through the `filterComponent` prop.

### Row Selection

Users can select rows individually or select all rows on the current page. Selected rows are tracked in the `rowSelection` state, which can be used for bulk actions.

### Column Visibility

Users can toggle the visibility of columns through the view options dropdown. This allows customization of the table view based on user preferences.

### Responsive Design

The data table is fully responsive and adapts to different screen sizes:

1. **Desktop View**: Shows the full table with all columns.
2. **Mobile View**: Uses a simplified column layout optimized for small screens.

The switch between desktop and mobile views is automatic based on the screen width.

## Responsive Design

### Mobile Detection

The data table uses the `useIsMobile` hook to detect mobile devices:

```typescript
// Check if we're on mobile
const isMobile = useIsMobile();

// Use mobile columns if provided and we're on mobile
const activeColumns = isMobile && mobileColumns ? mobileColumns : columns;
```

### Mobile Columns

For mobile devices, you can provide alternative column definitions that are better suited for small screens. These typically combine multiple columns into a single column with a more compact layout.

Example:

```typescript
// Desktop columns
export const columns: ColumnDef<User>[] = [
  // Multiple separate columns
];

// Mobile columns - simplified for smaller screens
export const mobileColumns: ColumnDef<User>[] = [
  // Fewer columns with combined information
];
```

### Responsive UI Components

All UI components in the data table are designed to be responsive:

- Tables have horizontal scrolling on small screens
- Filters stack vertically on mobile
- Pagination adapts to available space
- Buttons and inputs are properly sized for touch interaction

## Usage Examples

### Basic Usage

```tsx
import { DataTable } from "@/components/data-table";
import { columns, mobileColumns } from "./columns";

export default function UsersTable({ users, filters }) {
  return (
    <DataTable
      columns={columns}
      mobileColumns={mobileColumns}
      data={users.data}
      filters={filters}
      links={users.links}
      per_page={users.per_page}
      total={users.total}
      from={users.from}
      to={users.to}
      current_page={users.current_page}
      baseUrl={route('users.index')}
      searchPlaceholder="Search users..."
    />
  );
}
```

### With Custom Filters

```tsx
import { DataTable } from "@/components/data-table";
import { columns, mobileColumns } from "./columns";
import { RolesFilter } from "./components/roles-filter";

export default function UsersTable({ users, filters, roles }) {
  return (
    <DataTable
      columns={columns}
      mobileColumns={mobileColumns}
      data={users.data}
      filters={filters}
      links={users.links}
      per_page={users.per_page}
      total={users.total}
      from={users.from}
      to={users.to}
      current_page={users.current_page}
      baseUrl={route('users.index')}
      searchPlaceholder="Search users..."
      filterComponent={
        <RolesFilter
          roles={roles}
          selectedRoleIds={filters.role_ids || []}
          baseUrl={route('users.index')}
        />
      }
    />
  );
}
```

### With Bulk Actions

```tsx
function BulkActions() {
  const { table } = useDataTable<User>();
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Get selected row IDs
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map(row => Number(row.original.id));
  const hasSelected = selectedIds.length > 0;

  return (
    <div className="flex items-center gap-2">
      {hasSelected && (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBulkDeleteDialogOpen(true)}
            className="h-8"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}
          </Button>

          <BulkDeleteDialog
            isOpen={bulkDeleteDialogOpen}
            onClose={() => setBulkDeleteDialogOpen(false)}
            selectedIds={selectedIds}
          />
        </>
      )}
    </div>
  );
}
```

## Customization

### Custom Column Definitions

Column definitions follow the TanStack Table format with additional properties for the data table:

```typescript
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  // More columns...
];
```

### Custom Cell Renderers

You can customize how cells are rendered by providing a custom cell renderer:

```typescript
{
  accessorKey: 'status',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  cell: ({ row }) => {
    const status = row.getValue('status');
    return (
      <Badge variant={status === 'active' ? 'success' : 'destructive'}>
        {status}
      </Badge>
    );
  },
}
```

### Custom Filters

You can add custom filter components by passing them to the `filterComponent` prop:

```tsx
<DataTable
  // Other props...
  filterComponent={
    <div className="flex items-center gap-2">
      <StatusFilter
        statuses={statuses}
        selectedStatus={filters.status}
        baseUrl={route('items.index')}
      />
      <CategoryFilter
        categories={categories}
        selectedCategoryId={filters.category_id}
        baseUrl={route('items.index')}
      />
    </div>
  }
/>
```

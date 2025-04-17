import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { DataTableFilters } from './types';

/**
 * Handle sorting in the data table
 * @param field The field to sort by
 * @param direction The sort direction ('asc' or 'desc')
 * @param filters The current filters
 * @param baseUrl Optional base URL for the request
 */
export const handleSort = (
  field: string,
  direction: 'asc' | 'desc',
  filters: DataTableFilters,
  baseUrl?: string
) => {
  router.get(
    baseUrl || route(route().current()!),
    {
      ...filters,
      sort_field: field,
      sort_direction: direction,
      page: 1 // Reset to first page when sorting
    },
    {
      preserveState: true,
      preserveScroll: true,
    }
  );
};

/**
 * Create a debounced search function
 * @param filters The current filters
 * @param baseUrl Optional base URL for the request
 * @returns A debounced function that handles search
 */
export const createDebouncedSearch = (filters: DataTableFilters, baseUrl?: string) => {
  return debounce((value: string) => {
    router.get(
      baseUrl || route(route().current()!),
      {
        ...filters,
        search: value,
        page: 1 // Reset to first page when searching
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  }, 500);
};

/**
 * Handle page change in the data table
 * @param url The URL to navigate to
 */
export const handlePageChange = (url: string | null) => {
  if (url) {
    router.get(url, {}, {
      preserveState: true,
      preserveScroll: true
    });
  }
};

/**
 * Handle per page change in the data table
 * @param value The new per page value
 * @param baseUrl Optional base URL for the request
 */
export const handlePerPageChange = (value: number, baseUrl?: string) => {
  router.get(
    baseUrl || route(route().current()!),
    {
      per_page: value,
      page: 1 // Reset to first page when changing page size
    },
    {
      preserveState: true,
      preserveScroll: true,
    }
  );
};

/**
 * Handle search input change with loading indicator
 * @param value The search value
 * @param setSearchValue Function to update the search value state
 * @param setIsSearching Function to update the searching state
 * @param handleSearch Function to handle the search
 */
export const handleSearchChange = (
  value: string,
  setSearchValue: (value: string) => void,
  setIsSearching: (value: boolean) => void,
  handleSearch: (value: string) => void
) => {
  setSearchValue(value);
  setIsSearching(true);
  handleSearch(value);

  // Set a timeout to hide the loading indicator after the debounce period (500ms) plus a small buffer
  setTimeout(() => {
    setIsSearching(false);
  }, 600);
};
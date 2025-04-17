import { ReactNode } from "react";
import { DataTableSearch } from "./datatable-search";
import { DataTableViewOptions } from "./datatable-view-option";

interface DataTableFiltersProps {
  children?: ReactNode;
  searchPlaceholder?: string;
  showViewOptions?: boolean;
}

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

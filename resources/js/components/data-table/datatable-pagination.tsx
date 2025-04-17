import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDataTable } from "./data-table-context"
import type { DataTableLink } from "./types"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
            <SelectTrigger className="h-8 w-[70px] sm:h-10 sm:w-[70px]">
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
              {/* Process links to show only first 2, last 2, and ellipses */}
              {(() => {
                // Find the previous and next buttons
                const prevButton: DataTableLink | undefined = links.find(link => link.label === "&laquo; Previous");
                const nextButton: DataTableLink | undefined = links.find(link => link.label === "Next &raquo;");

                // Filter out the prev/next buttons to get only numbered links
                const numberedLinks: DataTableLink[] = links.filter(
                  link => link.label !== "&laquo; Previous" && link.label !== "Next &raquo;"
                );

                // Find the active page index (0-based)
                const activeIndex = numberedLinks.findIndex(link => link.active);
                const totalPages = numberedLinks.length;

                // Create a sliding window of 5 links centered around the active page
                let startIndex = Math.max(0, activeIndex - 2); // Try to show 2 pages before active page
                const endIndex = Math.min(totalPages - 1, startIndex + 4); // Show 5 pages total

                // Adjust start index if we're near the end to always show 5 pages if possible
                if (totalPages >= 5 && endIndex - startIndex < 4) {
                  startIndex = Math.max(0, endIndex - 4);
                }

                // Get the visible links within our sliding window
                const visibleLinks: DataTableLink[] = numberedLinks.slice(startIndex, endIndex + 1);

                // Render the pagination items
                const items = [];

                // Add previous button
                if (prevButton) {
                  items.push(
                    <PaginationItem key="prev">
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (prevButton.url) handlePageChange(prevButton.url);
                        }}
                        aria-disabled={!prevButton.url}
                        className={`${!prevButton.url ? "pointer-events-none opacity-50" : ""} h-9 px-2 sm:h-10 sm:px-3`}
                      />
                    </PaginationItem>
                  );
                }

                // Add numbered links
                visibleLinks.forEach((link) => {
                  items.push(
                    <PaginationItem key={`page-${link.label}`}>
                      <PaginationLink
                        href="#"
                        isActive={link.active}
                        onClick={(e) => {
                          e.preventDefault();
                          if (link.url) handlePageChange(link.url);
                        }}
                        className="h-9 w-9 sm:h-10 sm:w-10"
                      >
                        {link.label}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });

                // Add next button
                if (nextButton) {
                  items.push(
                    <PaginationItem key="next">
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (nextButton.url) handlePageChange(nextButton.url);
                        }}
                        aria-disabled={!nextButton.url}
                        className={`${!nextButton.url ? "pointer-events-none opacity-50" : ""} h-9 px-2 sm:h-10 sm:px-3`}
                      />
                    </PaginationItem>
                  );
                }

                return items;
              })()}
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  )
}

import React from 'react';
import { router } from '@inertiajs/react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationMeta {
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
}

interface ImagePaginationProps {
  meta: PaginationMeta;
  routeName: string;
  filters?: Record<string, any>;
  className?: string;
}

export function ImagePagination({
  meta,
  routeName,
  filters = {},
  className = '',
}: ImagePaginationProps) {
  // Even if there's only one page, we'll still show the pagination info
  if (meta.last_page <= 1) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="text-sm text-muted-foreground">
          Showing {meta.from} to {meta.to} of {meta.total} images
        </div>
      </div>
    );
  }

  // Calculate which page links to show
  const getVisiblePageNumbers = () => {
    const totalPages = meta.last_page;
    const currentPage = meta.current_page;
    const maxVisiblePages = 5; // Show at most 5 page links

    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than the max, show all of them
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first, last, current, and pages around current
    const pages = new Set<number>();
    pages.add(1); // First page
    pages.add(totalPages); // Last page
    pages.add(currentPage); // Current page

    // Add one or two pages before current
    if (currentPage - 1 > 1) pages.add(currentPage - 1);
    if (currentPage - 2 > 1) pages.add(currentPage - 2);

    // Add one or two pages after current
    if (currentPage + 1 < totalPages) pages.add(currentPage + 1);
    if (currentPage + 2 < totalPages) pages.add(currentPage + 2);

    // Convert to array and sort
    return Array.from(pages).sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePageNumbers();

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > meta.last_page || page === meta.current_page) {
      return;
    }

    router.get(
      route(routeName),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-full">
        <Pagination className="w-full">
          <PaginationContent>
            {/* Previous Page Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(meta.current_page - 1);
                }}
                className={meta.current_page <= 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {visiblePages.map((pageNum, index) => {
              // Check if we need to show ellipsis
              const showEllipsisBefore =
                index > 0 && pageNum > visiblePages[index - 1] + 1;

              return (
                <React.Fragment key={pageNum}>
                  {showEllipsisBefore && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={pageNum === meta.current_page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              );
            })}

            {/* Next Page Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(meta.current_page + 1);
                }}
                className={meta.current_page >= meta.last_page ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Pagination Info */}
      <div className="text-sm text-muted-foreground">
        Showing {meta.from} to {meta.to} of {meta.total} images
      </div>
    </div>
  );
}

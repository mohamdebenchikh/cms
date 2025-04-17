import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IndexProps, TableFilters, dashboardBreadcrumb, categoriesBreadcrumb } from './types';
import { DataTable, useDataTable } from '@/components/data-table/data-table';
import { columns, mobileColumns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash } from 'lucide-react';
import { BulkDeleteDialog } from './components/bulk-delete-dialog';
import Heading from '@/components/heading';
import { Category } from "@/types";

const breadcrumbs = [dashboardBreadcrumb, categoriesBreadcrumb];

// Component to handle bulk actions
function BulkActions() {
  const { table } = useDataTable<Category>();
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Get selected row IDs
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map(row => Number(row.original.id || 0));
  const hasSelected = selectedIds.length > 0;

  // Handle dialog close
  const handleDialogClose = () => {
    setBulkDeleteDialogOpen(false);
  };

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
            Delete {selectedIds.length} {selectedIds.length === 1 ? 'category' : 'categories'}
          </Button>

          <BulkDeleteDialog
            isOpen={bulkDeleteDialogOpen}
            onClose={handleDialogClose}
            selectedIds={selectedIds}
          />
        </>
      )}
    </div>
  );
}

export default function Index({ categories, filters }: IndexProps) {
  const [tableFilters, setTableFilters] = useState<TableFilters>(filters);

  const handleFiltersChange = (newFilters: TableFilters) => {
    setTableFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title="Categories"
            description="Manage categories for organizing posts"
          />

          <div className="flex gap-2">
            <Button onClick={() => router.visit(route('admin.categories.create'))}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </div>
        </div>

        <DataTable
          data={categories.data}
          columns={columns}
          mobileColumns={mobileColumns}
          filters={tableFilters}
          onFiltersChange={handleFiltersChange}
          searchPlaceholder="Search categories..."
          searchColumn="name"
          total={categories.total}
          from={categories.from}
          to={categories.to}
          current_page={categories.current_page}
          per_page={categories.per_page}
          links={categories.links}
          filterComponent={<BulkActions />}
        />
      </div>
    </AppLayout>
  );
}

import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IndexProps, TableFilters, dashboardBreadcrumb, tagsBreadcrumb } from './types';
import { DataTable, useDataTable } from '@/components/data-table/data-table';
import { columns, mobileColumns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash } from 'lucide-react';
import { BulkDeleteDialog } from './components/bulk-delete-dialog';
import { TagFormDialog } from './components/tag-form-dialog';
import Heading from '@/components/heading';
import { Tag } from "@/types";

const breadcrumbs = [dashboardBreadcrumb, tagsBreadcrumb];

// Component to handle bulk actions
function BulkActions() {
  const { table } = useDataTable<Tag>();
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
            Delete {selectedIds.length} {selectedIds.length === 1 ? 'tag' : 'tags'}
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

export default function Index({ tags, filters }: IndexProps) {
  const [tableFilters, setTableFilters] = useState<TableFilters>(filters);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleFiltersChange = (newFilters: TableFilters) => {
    setTableFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tags" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title="Tags"
            description="Manage tags for organizing posts"
          />

          <div className="flex gap-2">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Tag
            </Button>
          </div>
        </div>

        <DataTable
          data={tags.data}
          columns={columns}
          mobileColumns={mobileColumns}
          filters={tableFilters}
          onFiltersChange={handleFiltersChange}
          searchPlaceholder="Search tags..."
          searchColumn="name"
          total={tags.total}
          from={tags.from}
          to={tags.to}
          current_page={tags.current_page}
          per_page={tags.per_page}
          links={tags.links}
          filterComponent={<BulkActions />}
        />
      </div>

      <TagFormDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        mode="create"
      />
    </AppLayout>
  );
}

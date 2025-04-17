import { useState } from "react";
import { Trash } from "lucide-react";
import { useDataTable } from "@/components/data-table/data-table";
import { Page } from "@/types";
import { Button } from "@/components/ui/button";
import { BulkDeleteDialog } from "./bulk-delete-dialog";

export function BulkActions() {
  const { table } = useDataTable<Page, unknown>();
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
            Delete {selectedIds.length} {selectedIds.length === 1 ? 'page' : 'pages'}
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

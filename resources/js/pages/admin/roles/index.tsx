import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Role } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { DataTable, useDataTable } from "@/components/data-table/data-table";
import { IndexProps } from "./types";
import { columns, mobileColumns } from "./columns";
import { BulkDeleteDialog } from "./components/bulk-delete-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash, Shield } from "lucide-react";
import Heading from "@/components/heading";
import { dashboardBreadcrumb, rolesBreadcrumb} from "./types";

const breadcrumbs = [dashboardBreadcrumb, rolesBreadcrumb];

// Component to handle bulk actions
function BulkActions() {
  const { table } = useDataTable<Role>();
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
            Delete {selectedIds.length} {selectedIds.length === 1 ? 'role' : 'roles'}
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

export default function Index({ roles, filters }:IndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles Management" />

      <div className="container py-6">
        <div className="flex items-center justify-between mb-4">
          <Heading
            title="Roles Management"
            description="Create and manage roles and their permissions"
          />

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.permissions.index')}>
                <Shield className="mr-2 h-4 w-4" />
                View Permissions
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('admin.roles.create')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Role
              </Link>
            </Button>
          </div>
        </div>

        <DataTable
          filters={filters}
          data={roles.data}
          columns={columns}
          mobileColumns={mobileColumns}
          links={roles.meta?.links as unknown as { url: string | null; label: string; active: boolean; }[]}
          per_page={roles.per_page}
          total={roles.total}
          from={roles.from}
          to={roles.to}
          current_page={roles.current_page}
          baseUrl={route('admin.roles.index')}
          searchPlaceholder="Search roles..."
          filterComponent={<BulkActions />}
        />
      </div>
    </AppLayout>
  );
}

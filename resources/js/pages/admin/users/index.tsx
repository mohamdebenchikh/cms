import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Role, User } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { DataTable, useDataTable } from "@/components/data-table/data-table";
import { TableFilters, dashboardBreadcrumb, usersBreadcrumb } from "./types";
import { createColumns, createMobileColumns } from "./columns";
import { RolesFilter } from "./components/roles-filter";
import { BulkDeleteDialog } from "./components/bulk-delete-dialog";
import { Button } from "@/components/ui/button";
import { Trash, PlusCircle } from "lucide-react";

// Define breadcrumbs for the index page
const breadcrumbs = [dashboardBreadcrumb, usersBreadcrumb];


// No need for global window variable anymore

// Component to handle bulk actions
function BulkActions() {
  const { table } = useDataTable<User>();
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Get selected row IDs
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map(row => Number(row.original.id));
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
            Delete {selectedIds.length} {selectedIds.length === 1 ? 'user' : 'users'}
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

export default function Users({
  users,
  filters,
  roles
}: {
  users: {
    data: User[],
    links: {
      url: string | null,
      label: string,
      active: boolean
    }[],
    per_page: number,
    total: number,
    from: number,
    to: number,
    current_page: number
  },
  filters: TableFilters,
  roles: Role[]
}) {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage your users, view their details, and control their access to the system.
            </p>
          </div>
          <Link href={route('admin.users.create')} className="self-start">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Create User</span>
            </Button>
          </Link>
        </div>

        <DataTable
          filters={filters}
          data={users.data}
          columns={createColumns(roles)}
          mobileColumns={createMobileColumns(roles)}
          links={users.links}
          per_page={users.per_page}
          total={users.total}
          from={users.from}
          to={users.to}
          current_page={users.current_page}
          baseUrl={route('admin.users.index')}
          searchPlaceholder="Search users..."
          filterComponent={
            <div className="flex items-center gap-2">
              <RolesFilter
                roles={roles}
                selectedRoleIds={filters.role_ids || []}
                baseUrl={route('admin.users.index')}
              />
              <BulkActions />
            </div>
          }
        />
      </div>
    </AppLayout>
  )
}


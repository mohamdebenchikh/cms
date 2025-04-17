import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableCustomFilter } from "@/components/data-table/datatable-custom-filter";
import { columns, mobileColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { BulkActions } from "./components/bulk-actions";
import Heading from "@/components/heading";
import { IndexProps, dashboardBreadcrumb, pagesBreadcrumb } from "./types";

const breadcrumbs = [dashboardBreadcrumb, pagesBreadcrumb];

export default function Pages({ pages, filters }: IndexProps) {
  // Extract pagination data from pages object
  // This handles both structures: pages with meta property and pages with direct pagination properties
  const links = pages.meta?.links || pages.links || [];
  const per_page = pages.meta?.per_page || pages.per_page || 10;
  const total = pages.meta?.total || pages.total || 0;
  const from = pages.meta?.from || pages.from || 0;
  const to = pages.meta?.to || pages.to || 0;
  const current_page = pages.meta?.current_page || pages.current_page || 1;
  
  // Define status options
  const statusOptions = [
    { id: 'published', name: 'Published' },
    { id: 'draft', name: 'Draft' },
    { id: 'archived', name: 'Archived' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pages" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title="Pages"
            description="Manage your website pages"
          />

          <div className="flex gap-2">
            <Button asChild>
              <Link href={route('admin.pages.create')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Page
              </Link>
            </Button>
          </div>
        </div>

        <DataTable
          filters={{
            ...filters,
            page: Number(filters.page || 1),
            sort_direction: (filters.sort_direction || 'desc') as 'asc' | 'desc',
            search: filters.search || '',
            sort_field: filters.sort_field || 'created_at',
            per_page: Number(filters.per_page || 10)
          }}
          data={pages.data}
          columns={columns}
          mobileColumns={mobileColumns}
          links={links}
          per_page={per_page}
          total={total}
          from={from}
          to={to}
          current_page={current_page}
          baseUrl={route('admin.pages.index')}
          searchPlaceholder="Search pages..."
          meta={{
            initialVisibility: {
              created_at: false
            }
          }}
          filterComponent={
            <>
              <BulkActions />
              <DataTableCustomFilter
                column="status"
                title="Status"
                options={statusOptions}
              />
            </>
          }
        />
      </div>
    </AppLayout>
  );
}

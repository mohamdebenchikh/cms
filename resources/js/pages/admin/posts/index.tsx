import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableCustomFilter } from "@/components/data-table/datatable-custom-filter";
import { columns, mobileColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { BulkActions } from "./components/bulk-actions";
import Heading from "@/components/heading";
import { IndexProps } from "./types";
import { PermissionButton } from "@/components/permission-button";
import { Can } from "@/components/can";


export default function Posts({ posts, filters, categories }: IndexProps) {
  // Extract pagination data from posts object
  // This handles both structures: posts with meta property and posts with direct pagination properties
  const links = posts.meta?.links || posts.links || [];
  const per_page = posts.meta?.per_page || posts.per_page || 10;
  const total = posts.meta?.total || posts.total || 0;
  const from = posts.meta?.from || posts.from || 0;
  const to = posts.meta?.to || posts.to || 0;
  const current_page = posts.meta?.current_page || posts.current_page || 1;
  // Define status options
  const statusOptions = [
    { id: 'published', name: 'Published' },
    { id: 'draft', name: 'Draft' },
    { id: 'archived', name: 'Archived' }
  ];

  return (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Posts', href: route('admin.posts.index') }
    ]}>
      <Head title="Posts" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading
            title="Posts"
            description="Manage your blog posts, create new content, and control their visibility."
          />

          <div className="flex gap-2">
            <PermissionButton
              permission="create posts"
              asChild
              size="sm"
              className="h-8"
              tooltipText="You need permission to create posts"
            >
              <Link href={route('admin.posts.create')}>
                <PlusCircle className="h-4 w-4 mr-1" />
                New Post
              </Link>
            </PermissionButton>
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
          data={posts.data}
          columns={columns}
          mobileColumns={mobileColumns}
          links={links}
          per_page={per_page}
          total={total}
          from={from}
          to={to}
          current_page={current_page}
          baseUrl={route('admin.posts.index')}
          searchPlaceholder="Search posts..."
          meta={{
            initialVisibility: {
              created_at: false
            }
          }}
          filterComponent={
            <div className="flex flex-wrap gap-2">
              {/* Bulk Actions */}
              <Can permission="delete posts">
                <BulkActions />
              </Can>

              {/* Status Filter */}
              <DataTableCustomFilter
                options={statusOptions}
                filterKey="status"
                currentValue={filters.status}
                baseUrl={route('admin.posts.index')}
                placeholder="Select status"
                label="Status"
              />

              {/* Category Filter */}
              <DataTableCustomFilter
                options={categories.map(category => ({ id: category.id, name: category.name }))}
                filterKey="category_id"
                currentValue={filters.category_id}
                baseUrl={route('admin.posts.index')}
                placeholder="Select category"
                label="Category"
              />
            </div>
          }
        />
      </div>
    </AppLayout>
  )
}




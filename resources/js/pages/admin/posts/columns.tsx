import React from "react";
import { Post } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Image } from "lucide-react";
import { ImageWithFallback } from "@/components/image-with-fallback";

import { DataTableColumnHeader } from "@/components/data-table/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./components/data-table-row-actions";
import { ImagePreviewDialog } from "./components/image-preview-dialog";
import { StatusDropdown } from "./components/status-dropdown";
import { getStatusVariant } from "./utils";

export const columns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "featured_image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const featuredImage = row.original.featured_image;
      const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

      return (
        <div className="flex items-center justify-center">
          <div
            className="relative h-10 w-10 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => featuredImage && setIsPreviewOpen(true)}
          >
            <ImageWithFallback
              src={featuredImage}
              alt={`Featured image for ${row.original.title}`}
              className="h-full w-full object-cover"
              fallbackClassName="h-10 w-10"
              iconClassName="h-5 w-5"
            />
          </div>
          {isPreviewOpen && featuredImage && (
            <ImagePreviewDialog
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              imageUrl={featuredImage}
              title={`Featured Image: ${row.original.title}`}
            />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium max-w-[250px] truncate">
          {row.getValue("title")}
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="whitespace-nowrap text-sm">
          {user?.name || 'Unknown'}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div className="whitespace-nowrap">
          {category ? (
            <span className="text-xs">{category.name}</span>
          ) : (
            <span className="text-muted-foreground text-xs">Uncategorized</span>
          )}
        </div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const [post, setPost] = React.useState(row.original);

      // Handle status update
      const handleStatusChange = (updatedPost: Post) => {
        setPost(updatedPost);
      };

      return (
        <StatusDropdown post={post} onStatusChange={handleStatusChange} />
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
        </div>
      );
    },
    enableHiding: true,
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

// Mobile columns - simplified for smaller screens
export const mobileColumns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Post" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      const category = row.original.category;
      const featuredImage = row.original.featured_image;
      const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
      const [post, setPost] = React.useState(row.original);

      // Handle status update
      const handleStatusChange = (updatedPost: Post) => {
        setPost(updatedPost);
      };

      return (
        <div className="flex gap-3">
          {/* Featured image */}
          <div
            className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => featuredImage && setIsPreviewOpen(true)}
          >
            <ImageWithFallback
              src={featuredImage}
              alt={`Featured image for ${post.title}`}
              className="h-full w-full object-cover"
              fallbackClassName="h-12 w-12"
              iconClassName="h-6 w-6"
            />
          </div>
          {isPreviewOpen && featuredImage && (
            <ImagePreviewDialog
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              imageUrl={featuredImage}
              title={`Featured Image: ${post.title}`}
            />
          )}

          {/* Post details */}
          <div className="flex flex-col space-y-1">
            <span className="font-medium truncate max-w-[200px]">
              {post.title}
            </span>
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <StatusDropdown post={post} onStatusChange={handleStatusChange} />
              {category && (
                <span className="text-muted-foreground">
                  in {category.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>By {user?.name || 'Unknown'}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

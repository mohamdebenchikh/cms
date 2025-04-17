import { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import { DataTableColumnHeader } from "@/components/data-table/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./components/data-table-row-actions";
import { FileText, FolderTree, Check, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "@/components/image-with-fallback";

export const columns: ColumnDef<Category>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>
    }
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.original.slug}</div>
    }
  },
  {
    accessorKey: 'image_cover',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cover" sortable={false} />,
    cell: ({ row }) => {
      const imageCover = row.original.image_cover;
      return (
        <div className="flex items-center gap-1">
          <div className="h-10 w-16 rounded-md overflow-hidden">
            <ImageWithFallback
              src={imageCover}
              alt={row.original.name}
              className="h-full w-full object-cover"
              fallbackClassName="h-10 w-16"
              iconClassName="h-4 w-4"
            />
          </div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'is_main',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Main" sortable={false} />,
    cell: ({ row }) => {
      const isMain = row.original.is_main;
      return (
        <div className="flex items-center gap-1">
          {isMain ? (
            <Badge variant="default" className="flex items-center gap-1 bg-primary/20 text-primary hover:bg-primary/30">
              <FolderTree className="h-3 w-3" />
              Main
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
              No
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'posts',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Posts" />,
    cell: ({ row }) => {
      const postsCount = row.original.posts?.length || 0;
      return (
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {postsCount}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
      </div>
    }
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    }
  }
];

// Mobile columns - simplified for smaller screens
export const mobileColumns: ColumnDef<Category>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const postsCount = row.original.posts?.length || 0;
      return (
        <div className="space-y-1">
          <div className="font-medium">{row.original.name}</div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <span className="text-muted-foreground">{row.original.slug}</span>
            <span className="flex items-center gap-1">
              {row.original.image_cover ? (
                <ImageIcon className="h-3 w-3 text-primary" />
              ) : (
                <ImageIcon className="h-3 w-3 text-muted-foreground" />
              )}
            </span>
            {row.original.is_main && (
              <Badge variant="default" className="flex items-center gap-1 bg-primary/20 text-primary hover:bg-primary/30">
                <FolderTree className="h-3 w-3" />
                Main
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {postsCount} posts
            </Badge>
            <span>{formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    }
  }
];

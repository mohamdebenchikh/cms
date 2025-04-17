import { Role } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import { DataTableColumnHeader } from "@/components/data-table/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./components/actions";
import { Users } from "lucide-react";

export const columns: ColumnDef<Role>[] = [
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
        accessorKey: 'permissions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
        cell: ({ row }) => {
            const permissions = row.original.permissions || [];
            return (
                <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">{permissions.length}</Badge>
                </div>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: 'users_count',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Users" />,
        cell: ({ row }) => {
            const usersCount = row.original.users_count || 0;
            return (
                <div className="flex items-center gap-1">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {usersCount}
                    </Badge>
                </div>
            )
        },
        enableSorting: true,
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
            const role = row.original;
            return <ActionsCell role={role} />;
        }
    }
];

// Mobile columns - simplified for smaller screens
export const mobileColumns: ColumnDef<Role>[] = [
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
            const permissions = row.original.permissions || [];
            return (
                <div className="space-y-1">
                    <div className="font-medium">{row.original.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            {permissions.length} permissions
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {row.original.users_count || 0} users
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
            const role = row.original;
            return <ActionsCell role={role} />;
        }
    }
];

import { User, Role } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import { DataTableColumnHeader } from "@/components/data-table/datatable-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeRole } from "./components/badge-role";
import { ActionsCell } from "./components/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper function to get user initials for avatar
const getUserInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
};

// Desktop columns
export const createColumns = (roles: Role[]): ColumnDef<User>[] => [
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
            const name = row.getValue('name') as string;
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={name} />
                        ) : (
                            <AvatarFallback>{getUserInitials(name)}</AvatarFallback>
                        )}
                    </Avatar>
                    <span className="font-medium">{name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <DataTableColumnHeader
                    column={column}
                    title="Email"
                />
            )
        },
    },
    {
        accessorKey: 'roles',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const roles = row.getValue('roles') as { id: number, name: string }[];
            return (
                <div className="flex flex-wrap gap-1">
                    {roles && roles.length > 0
                        ? roles.map(role => (
                            <BadgeRole key={role.id} role={role} />
                        ))
                        : <span className="text-muted-foreground text-xs">No role</span>
                    }
                </div>
            );
        },
        // We can enable sorting by role name
        enableSorting: true,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created at" />
        ),
        cell: ({ row }) => {
            return formatDistanceToNow(new Date(row.getValue('created_at')))
        }
    },
    {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => {
            const user = row.original;
            return <ActionsCell user={user} roles={roles} />;
        }
    }
];

// Mobile columns - simplified for smaller screens
export const createMobileColumns = (roles: Role[]): ColumnDef<User>[] => [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
        cell: ({ row }) => {
            const name = row.getValue('name') as string;
            const email = row.getValue('email') as string;
            const roles = row.getValue('roles') as { id: number, name: string }[];

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        {row.original.avatar ? (
                            <AvatarImage src={row.original.avatar} alt={name} />
                        ) : (
                            <AvatarFallback>{getUserInitials(name)}</AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {roles && roles.length > 0
                                ? roles.map(role => (
                                    <BadgeRole key={role.id} role={role} />
                                ))
                                : <span className="text-muted-foreground text-xs">No role</span>
                            }
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => {
            const user = row.original;
            return <ActionsCell user={user} roles={roles} />;
        }
    }
];

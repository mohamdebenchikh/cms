import { useState } from "react";
import { router } from "@inertiajs/react";
import { Pencil, Trash, MoreHorizontal, Eye, ShieldCheck } from "lucide-react";
import { Role } from "@/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface ActionsCellProps {
    role: Role;
}

export function ActionsCell({ role }: ActionsCellProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Prevent actions on the admin role
    const isAdminRole = role.name.toLowerCase() === 'admin';

    return (
        <div className="flex items-center justify-end">
            {/* Actions Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => router.visit(route('admin.roles.show', role.id))}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.visit(route('admin.roles.edit', role.id))}
                        disabled={isAdminRole}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={isAdminRole}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete role
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                role={role}
            />
        </div>
    );
}

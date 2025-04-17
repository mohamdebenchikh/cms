import { useState } from "react";
import { router } from "@inertiajs/react";
import { Pencil, Trash, UserCog, MoreHorizontal, Eye } from "lucide-react";
import { User, Role } from "@/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { RoleManager } from "./role-manager";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface ActionsCellProps {
    user: User;
    roles: Role[];
}

export function ActionsCell({ user, roles }: ActionsCellProps) {
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteUser = () => {
        return router.delete(route('admin.users.destroy', user.id));
    };

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
                        onClick={() => router.visit(route('admin.users.show', user.id))}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.visit(route('admin.users.edit', user.id))}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit user
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setRoleDialogOpen(true)}
                    >
                        <UserCog className="mr-2 h-4 w-4" />
                        Manage roles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-destructive"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete user
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Role Manager Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <RoleManager
                    user={user}
                    availableRoles={roles}
                    onClose={() => setRoleDialogOpen(false)}
                />
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteUser}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                entityName={user.name}
            />
        </div>
    );
}